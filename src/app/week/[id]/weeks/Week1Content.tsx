"use client";

import { SlideDeck, Slide, CodeBlock, Callout } from "@/components";
import { weeks, formatDate } from "@/constants/weeks";
import {
  OS_GUIDES,
  type Block,
  ENV_CHECK3,
  LADDER,
  PY_TYPES,
  PY_PRINT,
  PY_VAR,
  PY_MATH,
  PY_COMPOUND,
  PY_FSTRING,
  PY_FORMATS,
  PY_CALL,
  PY_IMPORT,
  FIN_RETURN,
  FIN_PRACTICE,
  FIN_TENYEAR,
  ERRORS,
  WEEK1_SUMMARY,
  MISSION,
} from "@/constants/week1";

const W = weeks[0];

export default function Week1Content() {
  return (
    <SlideDeck
      weekNum={String(Number(W.num))}
      weekTitle={W.title}
      outro={<Outro />}
    >
      {/* 1 ── 표지 */}
      <Slide>
        <p className="text-[1rem] font-medium text-(--ink-3)">
          {formatDate(W.date)}
        </p>
        <h1 className="mt-3 text-[clamp(2rem,7vw,3.8rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-(--ink)">
          환경 구축
        </h1>
        <ul className="mt-8 flex flex-col gap-2.5">
          {[
            "환경 설치 — Windows / macOS / Linux",
            "설치 확인 세 가지",
            "8주 커리큘럼",
            "파이썬 첫걸음 — 변수 · 연산 · f-문자열 · 함수 호출 · import",
            "수익률과 첫 실습",
            "자주 나는 에러 / 미션 1",
          ].map((s) => (
            <li key={s} className="flex gap-3 text-[1.02rem] text-(--ink-2)">
              <span
                aria-hidden="true"
                className="mt-[0.62em] h-1.5 w-1.5 flex-none rounded-full bg-(--ink-3)"
              />
              {s}
            </li>
          ))}
        </ul>
      </Slide>

      {/* 2~4 ── OS별 설치 (setup_*.md 원문) */}
      {OS_GUIDES.map((g) => (
        <Slide key={g.os} title={`환경 설치 가이드 — ${g.os}`}>
          <MdBlocks blocks={g.intro} />

          <div className="mt-8 flex flex-col gap-9">
            {g.sections.map((s) => (
              <section key={s.num}>
                <h3 className="text-[1.15rem] font-semibold text-(--ink)">
                  {s.num}. {s.title}
                </h3>
                <MdBlocks blocks={s.blocks} />
              </section>
            ))}
          </div>

          <h3 className="mt-12 mb-1 border-t border-(--border) pt-8 text-[1.3rem] font-semibold text-(--ink)">
            자주 막히는 곳
          </h3>
          <div className="flex flex-col gap-8">
            {g.troubles.map((tr) => (
              <section key={tr.symptom}>
                <h4 className="mt-6 font-mono text-[0.95rem] font-medium text-(--ink)">
                  {tr.symptom}
                </h4>
                <MdBlocks blocks={tr.blocks} />
              </section>
            ))}
          </div>
        </Slide>
      ))}

      {/* 5 ── 확인 3가지 */}
      <Slide title="설치 확인 세 가지">
        <div className="grid gap-4 sm:grid-cols-3">
          {ENV_CHECK3.map((c) => (
            <div
              key={c.q}
              className="rounded-[16px] border border-(--border) bg-(--surface) p-5"
            >
              <div className="text-[0.98rem] font-semibold text-(--ink)">{c.q}</div>
              <div className="mt-2 text-[0.9rem] text-(--ink-3)">{c.a}</div>
            </div>
          ))}
        </div>
        <Callout kind="warn" title="세 번째에서 가장 많이 막힙니다">
          터미널에서는 되는데 노트북에서만 ModuleNotFoundError 가 나면 100% 이 문제입니다.
          VS Code 인터프리터를 .venv 로 바꾸고 커널을 재시작하세요.
        </Callout>
      </Slide>

      {/* 6 ── 8주 지도 */}
      <Slide title="8주 커리큘럼">
        <div className="scroll-x rounded-[16px] border border-(--border)">
          <table className="w-full border-collapse text-left text-[0.95rem]">
            <thead>
              <tr className="border-b border-(--border) bg-(--surface-2)">
                <th className="px-5 py-3 text-[0.85rem] font-semibold text-(--ink-3)">주차</th>
                <th className="px-5 py-3 text-[0.85rem] font-semibold text-(--ink-3)">파이썬</th>
                <th className="px-5 py-3 text-[0.85rem] font-semibold text-(--ink-3)">금융</th>
              </tr>
            </thead>
            <tbody>
              {LADDER.map((l) => (
                <tr key={l.week} className="border-b border-(--border-2) last:border-0">
                  <td className="px-5 py-3 font-medium whitespace-nowrap text-(--ink-3)">
                    {l.week}
                  </td>
                  <td className="px-5 py-3 text-(--ink-2)">{l.py}</td>
                  <td className="px-5 py-3 font-medium text-(--ink)">{l.fin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Slide>

      {/* 8 ── print */}
      <Slide title="print() 와 주석">
        <CodeBlock code={PY_PRINT} />
        <p className="text-[1rem] leading-[1.8] text-(--ink-2)">
          <span className="font-mono text-[0.92em]">print()</span> 는{" "}
          <b className="font-semibold text-(--ink)">함수</b>입니다. 괄호 안에 값을 넣으면
          화면에 보여줍니다.
        </p>
      </Slide>

      {/* 9 ── 변수 */}
      <Slide title="변수 — 값에 이름을 붙이는 것">
        <p className="mb-5 text-[1rem] text-(--ink-2)">
          <span className="font-mono text-[0.92em]">=</span> 는 &ldquo;같다&rdquo;가 아니라{" "}
          <b className="font-semibold text-(--ink)">&ldquo;담는다&rdquo;</b> 입니다.
        </p>
        <div className="scroll-x mb-5 rounded-[16px] border border-(--border)">
          <table className="w-full border-collapse text-left text-[0.95rem]">
            <tbody>
              {PY_TYPES.map((t) => (
                <tr key={t.t} className="border-b border-(--border-2) last:border-0">
                  <td className="px-5 py-3 font-medium whitespace-nowrap text-(--ink)">
                    {t.t}
                  </td>
                  <td className="px-5 py-3 font-mono text-(--ink-3)">{t.ex}</td>
                  <td className="px-5 py-3 text-(--ink-3)">{t.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock code={PY_VAR} />
        <Callout kind="warn" title="종목코드는 항상 문자열입니다">
          005930 을 숫자로 쓰면 파이썬이 5930 으로 바꿉니다. 국내 종목코드는 앞자리 0이
          의미를 가지므로 반드시 따옴표를 씌웁니다.
        </Callout>
      </Slide>

      {/* 10 ── 계산 */}
      <Slide title="계산하기 — 특히 거듭제곱">
        <CodeBlock code={PY_MATH} />
        <p className="text-[1rem] leading-[1.8] text-(--ink-2)">
          <b className="font-semibold text-(--ink)">
            <span className="font-mono text-[0.92em]">**</span> 를 꼭 기억하세요.
          </b>{" "}
          다음 주에 배울 복리 공식이 바로 이것입니다.
        </p>
        <CodeBlock code={PY_COMPOUND} />
      </Slide>

      {/* 11 ── f-문자열 */}
      <Slide title="f-문자열 — 결과를 보기 좋게">
        <CodeBlock code={PY_FSTRING} />
        <div className="scroll-x rounded-[16px] border border-(--border)">
          <table className="w-full border-collapse text-left text-[0.92rem]">
            <thead>
              <tr className="border-b border-(--border) bg-(--surface-2)">
                {["서식", "뜻", "출력"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[0.85rem] font-semibold text-(--ink-3)">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PY_FORMATS.map((f) => (
                <tr key={f.f} className="border-b border-(--border-2) last:border-0">
                  <td className="px-5 py-3 font-mono whitespace-nowrap text-(--ink)">{f.f}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-(--ink-3)">{f.mean}</td>
                  <td className="px-5 py-3 font-mono whitespace-nowrap text-(--ink-2)">
                    {f.out}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Slide>

      {/* 12 ── 함수 호출 + import */}
      <Slide title="함수 호출하기, 그리고 import">
        <p className="mb-4 text-[1rem] text-(--ink-2)">
          파이썬이 미리 만들어 둔 함수들이 있습니다. 오늘은{" "}
          <b className="font-semibold text-(--ink)">쓰기만</b> 합니다. 직접 만드는 건 다음 주입니다.
        </p>
        <CodeBlock code={PY_CALL} />
        <CodeBlock code={PY_IMPORT} />
        <p className="text-[1rem] leading-[1.8] text-(--ink-2)">
          파이썬이 강한 이유가 이것입니다.{" "}
          <b className="font-semibold text-(--ink)">
            주가를 가져오는 코드를 우리가 짤 필요가 없습니다.
          </b>
        </p>
      </Slide>

      {/* 13 ── 수익률 */}
      <Slide title="금융은 가격이 아니라 수익률로 말합니다">
        <p className="mb-5 text-[1.02rem] leading-[1.8] text-(--ink-2)">
          삼성전자 7만원과 LG화학 40만원 중 어느 쪽이 더 좋은 투자였을까요?{" "}
          <b className="font-semibold text-(--ink)">가격만으로는 비교할 수 없습니다.</b>
        </p>
        <CodeBlock code={FIN_RETURN} />
        <Callout kind="note" title="수익률은 더하는 게 아니라 곱합니다">
          100원이 −50% 후 +50% 면 원금일까요? 100원 → 50원 → 75원, 즉 −25% 입니다.
          이 사실이 2주차 복리, 4주차 MDD(최대낙폭)로 이어집니다.
        </Callout>
      </Slide>

      {/* 14 ── 실습 */}
      <Slide title="실습 — 삼성전자 10년">
        <Callout kind="note" title="지금은 실행만 합니다">
          pandas 문법은 3주차에서 배웁니다. 여기서는 import 와 함수 호출만 보면 됩니다.
        </Callout>
        <CodeBlock code={FIN_PRACTICE} />
        <CodeBlock
          code={FIN_TENYEAR}
          caption="표에서 첫 값과 마지막 값만 꺼내면, 앞에서 손으로 한 계산과 똑같습니다."
        />
      </Slide>

      {/* 15 ── 자주 나는 에러 */}
      <Slide title="자주 나는 에러">
        <div className="scroll-x rounded-[16px] border border-(--border)">
          <table className="w-full border-collapse text-left text-[0.92rem]">
            <thead>
              <tr className="border-b border-(--border) bg-(--surface-2)">
                {["에러 메시지", "원인", "해결"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[0.85rem] font-semibold text-(--ink-3)">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ERRORS.map((e) => (
                <tr key={e.msg} className="border-b border-(--border-2) last:border-0">
                  <td className="px-5 py-3 font-mono text-(--ink)">{e.msg}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-(--ink-3)">{e.why}</td>
                  <td className="px-5 py-3 text-(--ink-2)">{e.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout kind="note" title="에러를 읽는 순서">
          <b>마지막 줄</b>에 에러 종류와 이유가 나옵니다. 그 위는 어디서 났는지를 알려주는
          호출 경로입니다.
        </Callout>
      </Slide>

      {/* 16 ── 미션 */}
      <Slide title={MISSION.title}>
        <p className="text-[1rem] leading-[1.8] text-(--ink-2)">{MISSION.why}</p>

        <ol className="my-6 flex flex-col gap-2.5">
          {MISSION.steps.map((s, n) => (
            <li key={s} className="flex gap-3 text-[0.98rem] text-(--ink-2)">
              <span className="font-display font-medium text-(--ink-3) tabular-nums">
                {n + 1}.
              </span>
              {s}
            </li>
          ))}
        </ol>

        <CodeBlock code={MISSION.code} caption="TODO 세 줄만 여러분이 채웁니다." />

        <div className="rounded-[16px] border border-(--border) bg-(--surface) p-5">
          <p className="mb-3 text-[0.95rem] font-semibold text-(--ink)">완료 판정 기준</p>
          <ul className="flex flex-col gap-2">
            {MISSION.done.map((d) => (
              <li key={d} className="flex gap-3 text-[0.95rem] text-(--ink-2)">
                <span className="text-(--ink-3)">□</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Slide>

    </SlideDeck>
  );
}

/** 16장에서 "완료"를 누르면 나오는 마무리 화면 */
function Outro() {
  return (
    <>
      <p className="text-[1rem] font-medium text-(--ink-3)">1주차 끝</p>
      <h2 className="mt-3 text-[clamp(1.8rem,5.5vw,3rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-(--ink)">
        오늘 배운 것
      </h2>

      <ol className="mt-8 flex flex-col gap-3.5">
        {WEEK1_SUMMARY.map((s, n) => (
          <li
            key={s}
            className="flex gap-4 rounded-[16px] border border-(--border) bg-(--surface) p-5"
          >
            <span className="font-display text-[1.1rem] font-medium text-(--ink-3) tabular-nums">
              {String(n + 1).padStart(2, "0")}
            </span>
            <span className="text-[1.02rem] leading-[1.7] text-(--ink-2)">{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-[16px] border border-(--border) bg-(--surface-2) p-5">
        <p className="text-[0.95rem] font-semibold text-(--ink)">다음 주 예고</p>
        <p className="mt-2 text-[0.96rem] leading-[1.75] text-(--ink-2)">
          오늘은 값 <b className="font-semibold">하나</b>를 다뤘습니다. 다음 주에는 값{" "}
          <b className="font-semibold">여러 개</b>를 한꺼번에 다룹니다. 리스트와 반복문을
          배우고, 오늘 배운 거듭제곱이 <b className="font-semibold">복리</b>가 됩니다.
        </p>
      </div>
    </>
  );
}

/** setup_*.md 의 문단·목록·인용구·코드를 원문 순서대로 그린다. */
function MdBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "p")
          return (
            <p
              key={i}
              className="md mt-3 text-[1rem] leading-[1.8] text-(--ink-2)"
              dangerouslySetInnerHTML={{ __html: b.text }}
            />
          );

        if (b.t === "h")
          return (
            <h4 key={i} className="mt-6 text-[1rem] font-semibold text-(--ink)">
              {b.text}
            </h4>
          );

        if (b.t === "note")
          return (
            <div
              key={i}
              className="md mt-4 border-l-[3px] border-(--border) pl-4 text-[0.96rem] leading-[1.8] text-(--ink-3)"
              dangerouslySetInnerHTML={{ __html: b.text }}
            />
          );

        if (b.t === "ol")
          return (
            <ol key={i} className="md mt-3 flex flex-col gap-2">
              {b.items.map((it, n) => (
                <li key={n} className="flex gap-3 text-[1rem] leading-[1.8] text-(--ink-2)">
                  <span className="font-display flex-none text-(--ink-3) tabular-nums">
                    {n + 1}.
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: it }} />
                </li>
              ))}
            </ol>
          );

        if (b.t === "ul")
          return (
            <ul key={i} className="md mt-3 flex flex-col gap-2">
              {b.items.map((it, n) => (
                <li key={n} className="flex gap-3 text-[1rem] leading-[1.8] text-(--ink-2)">
                  <span
                    aria-hidden="true"
                    className="mt-[0.7em] h-1.5 w-1.5 flex-none rounded-full bg-(--ink-3)"
                  />
                  <span dangerouslySetInnerHTML={{ __html: it }} />
                </li>
              ))}
            </ul>
          );

        return <CodeBlock key={i} code={b.code} lang="bash" />;
      })}
    </>
  );
}
