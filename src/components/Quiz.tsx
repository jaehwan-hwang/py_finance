"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";
import type { QuizBlock } from "@/constants/mdBlock";
import { withMath } from "@/lib/tex";

/** 표기 차이를 흡수해서 비교한다. 공백·대소문자·끝의 마침표를 무시. */
function norm(s: string, multiline = false): string {
  const one = (x: string) =>
    x
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[.\s]+$/, "")
      .toLowerCase();

  if (!multiline) return one(s);
  return s
    .split("\n")
    .map(one)
    .filter(Boolean)
    .join("\n");
}

const matches = (given: string, accept: string[], multiline = false) =>
  accept.some((a) => norm(a, multiline) === norm(given, multiline));

export default function Quiz({ data }: { data: QuizBlock }) {
  const isMulti = (data.correct?.length ?? 0) > 1;

  const [picked, setPicked] = useState<number[]>([]);
  const [blankVals, setBlankVals] = useState<string[]>(
    data.blanks ? data.blanks.map(() => "") : [],
  );
  const [inputVal, setInputVal] = useState("");
  const [graded, setGraded] = useState(false);

  /* ── 채점 ── */
  const optionOk =
    data.correct != null &&
    picked.length === data.correct.length &&
    picked.every((n) => data.correct!.includes(n));

  const blankOk =
    data.blanks?.every((b, i) => matches(blankVals[i] ?? "", b.accept)) ?? true;

  const inputOk = data.input
    ? matches(inputVal, data.input.accept, data.input.multiline)
    : true;

  const allOk =
    (data.options ? optionOk : true) && blankOk && (data.input ? inputOk : true);

  const canSubmit =
    (data.options ? picked.length > 0 : true) &&
    (data.blanks ? blankVals.some((v) => v.trim()) : true) &&
    (data.input ? inputVal.trim().length > 0 : true);

  function reset() {
    setPicked([]);
    setBlankVals(data.blanks ? data.blanks.map(() => "") : []);
    setInputVal("");
    setGraded(false);
  }

  function pick(n: number) {
    if (graded) return;
    if (isMulti) {
      setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
    } else {
      setPicked([n]);
      setGraded(true); // 단일 선택은 고르는 즉시 채점
    }
  }

  /* 선택지 한 줄의 상태 */
  function optionState(n: number): "idle" | "picked" | "right" | "wrong" | "missed" {
    if (!graded) return picked.includes(n) ? "picked" : "idle";
    const isCorrect = data.correct?.includes(n) ?? false;
    if (picked.includes(n)) return isCorrect ? "right" : "wrong";
    return isCorrect ? "missed" : "idle";
  }

  const OPT_STYLE: Record<string, string> = {
    idle: "border-(--border) text-(--ink-2)",
    picked: "border-(--ink) text-(--ink)",
    right: "border-(--ok) bg-(--ok-wash) text-(--ink)",
    wrong: "border-(--bad) bg-(--bad-wash) text-(--ink)",
    missed: "border-(--ok) text-(--ink-2)",
  };

  return (
    <div className="mt-5 rounded-[16px] border border-(--border) bg-(--surface) p-5">
      <p className="md text-[1rem] leading-[1.7] font-semibold text-(--ink)">
        <span className="font-display mr-1.5 text-(--ink-3)">{data.no}.</span>
        <span dangerouslySetInnerHTML={{ __html: withMath(data.q) }} />
      </p>

      {data.code && <CodeBlock code={data.code} lang="python" />}

      {/* ── 객관식 ── */}
      {data.options && (
        <>
          {isMulti && (
            <p className="mt-3 text-[0.85rem] text-(--ink-3)">
              해당하는 번호를 모두 고른 뒤 확인을 누르세요.
            </p>
          )}
          <ul className="mt-3 flex flex-col gap-2">
            {data.options.map((o, i) => {
              const n = i + 1;
              const st = optionState(n);
              return (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => pick(n)}
                    disabled={graded}
                    aria-pressed={picked.includes(n)}
                    className={`flex w-full items-start gap-3 rounded-[12px] border px-4 py-2.5 text-left text-[0.96rem] transition-colors disabled:cursor-default ${OPT_STYLE[st]}`}
                  >
                    <span className="font-display flex-none tabular-nums">{n}.</span>
                    <span
                      className="md min-w-0 flex-1"
                      dangerouslySetInnerHTML={{ __html: withMath(o) }}
                    />
                    {graded && st === "right" && <Mark ok />}
                    {graded && st === "wrong" && <Mark />}
                    {graded && st === "missed" && (
                      <span className="flex-none text-[0.82rem] text-(--ok)">정답</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* ── 빈칸 채우기 ── */}
      {data.blanks && (
        <div className="mt-4 flex flex-col gap-2.5">
          {data.blanks.map((b, i) => {
            const ok = matches(blankVals[i] ?? "", b.accept);
            return (
              <label key={i} className="flex flex-wrap items-center gap-3">
                <span className="w-32 flex-none text-[0.92rem] text-(--ink-3)">
                  {b.label}
                </span>
                <input
                  value={blankVals[i] ?? ""}
                  onChange={(e) =>
                    setBlankVals((v) =>
                      v.map((x, n) => (n === i ? e.target.value : x)),
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canSubmit) setGraded(true);
                  }}
                  disabled={graded}
                  spellCheck={false}
                  className={`min-w-0 flex-1 rounded-[10px] border bg-(--surface-2) px-3 py-2 font-mono text-[0.9rem] text-(--ink) outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) ${
                    graded
                      ? ok
                        ? "border-(--ok) bg-(--ok-wash)"
                        : "border-(--bad) bg-(--bad-wash)"
                      : "border-(--border) focus:border-(--ink-3)"
                  }`}
                />
                {graded && (ok ? <Mark ok /> : <Mark />)}
                {graded && !ok && (
                  <span className="w-full pl-32 text-[0.88rem] text-(--ink-3)">
                    정답{" "}
                    <b className="font-mono font-medium text-(--ok)">
                      {b.accept.slice(0, 2).join(" 또는 ")}
                    </b>
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {/* ── 단답 · 출력 결과 ── */}
      {data.input && (
        <div className="mt-4">
          {data.input.label && (
            <p className="mb-2 text-[0.92rem] text-(--ink-3)">{data.input.label}</p>
          )}
          {data.input.multiline ? (
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={graded}
              rows={4}
              spellCheck={false}
              placeholder={data.input.placeholder}
              className={`w-full rounded-[12px] border bg-(--surface-2) px-4 py-3 font-mono text-[0.88rem] leading-[1.8] text-(--ink) outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) ${
                graded
                  ? inputOk
                    ? "border-(--ok) bg-(--ok-wash)"
                    : "border-(--bad) bg-(--bad-wash)"
                  : "border-(--border) focus:border-(--ink-3)"
              }`}
            />
          ) : (
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) setGraded(true);
              }}
              disabled={graded}
              spellCheck={false}
              placeholder={data.input.placeholder}
              className={`w-full rounded-[12px] border bg-(--surface-2) px-4 py-2.5 font-mono text-[0.92rem] text-(--ink) outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) ${
                graded
                  ? inputOk
                    ? "border-(--ok) bg-(--ok-wash)"
                    : "border-(--bad) bg-(--bad-wash)"
                  : "border-(--border) focus:border-(--ink-3)"
              }`}
            />
          )}

          {/* 틀렸으면 정답을 보여준다 */}
          {graded && !inputOk && (
            <div className="mt-3">
              <p className="mb-1.5 text-[0.85rem] font-medium text-(--ink-3)">정답</p>
              <pre className="scroll-x rounded-[10px] border border-(--ok) bg-(--ok-wash) px-4 py-3 font-mono text-[0.88rem] leading-[1.8] whitespace-pre text-(--ink)">
                {data.input.accept[0]}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ── 버튼 ── */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!graded ? (
          <button
            type="button"
            onClick={() => setGraded(true)}
            disabled={!canSubmit}
            className="rounded-full bg-(--chip-bg) px-5 py-2 text-[0.88rem] font-medium text-(--chip-ink) transition-opacity disabled:opacity-30"
          >
            확인
          </button>
        ) : (
          <>
            <span
              className="text-[0.95rem] font-semibold"
              style={{ color: allOk ? "var(--ok)" : "var(--bad)" }}
            >
              {allOk ? "정답입니다" : "다시 확인해 보세요"}
            </span>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-(--border) px-4 py-1.5 text-[0.85rem] font-medium text-(--ink-2) transition-colors hover:border-(--ink-3) hover:text-(--ink)"
            >
              다시 풀기
            </button>
          </>
        )}
      </div>

      {/* ── 해설 ── */}
      {graded && (
        <div className="mt-4 border-l-[3px] border-(--accent) pl-4">
          <p className="mb-1 text-[0.82rem] font-semibold text-(--accent)">해설</p>
          <p
            className="md text-[0.96rem] leading-[1.8] text-(--ink-2)"
            dangerouslySetInnerHTML={{ __html: withMath(data.explain) }}
          />
          {data.explainCode && <CodeBlock code={data.explainCode} lang="python" />}
        </div>
      )}
    </div>
  );
}

function Mark({ ok = false }: { ok?: boolean }) {
  return (
    <span
      aria-label={ok ? "정답" : "오답"}
      className="flex-none text-[1rem] leading-none font-semibold"
      style={{ color: ok ? "var(--ok)" : "var(--bad)" }}
    >
      {ok ? "○" : "×"}
    </span>
  );
}
