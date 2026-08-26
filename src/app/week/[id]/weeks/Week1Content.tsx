"use client";

import { useState } from "react";
import { SlideDeck, Slide, CodeBlock, Callout, Tabs } from "@/components";
import { weeks, formatDate } from "@/constants/weeks";
import {
  ENV_OS_TABS,
  ENV_COMMANDS,
  ENV_OS_NOTES,
  ENV_STEPS,
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
  const [os, setOs] = useState(0);

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
        <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-[1.75] text-(--ink-2)">
          오늘은 진도를 나가지 않습니다. <b className="font-semibold">전원이 같은 환경을 갖추는 것</b>이
          유일한 목표입니다. 여기만 넘으면 나머지 7주는 코드에만 집중할 수 있습니다.
        </p>
        <div className="mt-8 rounded-[18px] border border-(--border) bg-(--surface) p-6">
          <p className="text-[0.9rem] font-medium text-(--ink-3)">오늘의 결승선</p>
          <p className="mt-1.5 text-[1.15rem] font-semibold text-(--ink)">
            삼성전자 10년 주가 그래프를 내 화면에 띄운다.
          </p>
        </div>
      </Slide>

      {/* 2 ── 왜 오늘이 중요한가 */}
      <Slide title="1주차에서 절반이 그만둡니다">
        <p className="text-[1.05rem] leading-[1.85] text-(--ink-2)">
          파이썬으로 금융을 배우겠다고 결심한 사람의 절반은 1주차에서 그만둡니다.
          내용이 어려워서가 아니라{" "}
          <b className="font-semibold text-(--ink)">pip install 이 안 돼서</b>입니다.
        </p>
        <Callout kind="tip" title="막히면 바로 손을 드세요">
          오늘 못 끝내도 괜찮습니다. 다만 혼자 끙끙대지 마세요. 이번 주에 해결 안 된 문제는
          다음 주에 두 배로 커집니다.
        </Callout>
      </Slide>

      {/* 3 ── OS별 설치 */}
      <Slide title="내 OS에 맞는 명령">
        <Tabs tabs={ENV_OS_TABS} activeTab={os} onTabChange={setOs} />
        <CodeBlock code={ENV_COMMANDS[os]} lang="bash" />
        <p
          className="mt-2 text-[0.92rem] leading-[1.7] text-(--ink-3)"
          dangerouslySetInnerHTML={{ __html: ENV_OS_NOTES[os] }}
        />
      </Slide>

      {/* 4 ── 설치 순서 */}
      <Slide title="설치 순서">
        <ol className="grid gap-3 sm:grid-cols-2">
          {ENV_STEPS.map((s) => (
            <li
              key={s.num}
              className="flex gap-4 rounded-[16px] border border-(--border) bg-(--surface) p-5"
            >
              <span className="font-display grid h-8 w-8 flex-none place-items-center rounded-full border border-(--border) text-[0.85rem] font-medium text-(--ink-2)">
                {s.num}
              </span>
              <div className="min-w-0">
                <h4 className="text-[1rem] font-semibold text-(--ink)">{s.title}</h4>
                <p
                  className="mt-1 text-[0.9rem] leading-[1.65] text-(--ink-3)"
                  dangerouslySetInnerHTML={{ __html: s.body }}
                />
              </div>
            </li>
          ))}
        </ol>
      </Slide>

      {/* 5 ── 확인 3가지 */}
      <Slide title="오늘 반드시 확인할 세 가지">
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
        <Callout kind="warn" title="세 번째가 가장 많이 틀립니다">
          터미널에서는 되는데 노트북에서만 ModuleNotFoundError 가 나면 100% 이 문제입니다.
          VS Code 인터프리터를 .venv 로 바꾸고 커널을 재시작하세요.
        </Callout>
      </Slide>

      {/* 6 ── 8주 지도 */}
      <Slide title="8주 동안 두 개의 사다리를 오릅니다">
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

      {/* 7 ── 스터디의 약속 */}
      <Slide title="이 스터디의 약속 두 가지">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-[18px] border border-(--border) bg-(--surface) p-6">
            <p className="text-[1.1rem] font-semibold text-(--ink)">
              안 쓸 문법은 가르치지 않습니다
            </p>
            <p className="mt-3 text-[0.95rem] leading-[1.75] text-(--ink-3)">
              배운 문법은 그날 안에 금융 코드에 써먹습니다. 외울 게 적습니다.
            </p>
          </div>
          <div className="rounded-[18px] border border-(--border) bg-(--surface) p-6">
            <p className="text-[1.1rem] font-semibold text-(--ink)">
              직접 만들고, 라이브러리로 검증합니다
            </p>
            <p className="mt-3 text-[0.95rem] leading-[1.75] text-(--ink-3)">
              한 줄이면 나오는 숫자라도, 그게 무엇인지 모르면 쓸 수 없기 때문입니다.
            </p>
          </div>
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
        <Callout kind="tip" title="오늘은 이해가 아니라 실행이 목적입니다">
          환경이 살아있는지 확인하는 용도이며, 무슨 뜻인지는 3주차에서 배웁니다.
          지금은 import 와 함수 호출만 눈에 들어오면 됩니다.
        </Callout>
        <CodeBlock code={FIN_PRACTICE} />
        <p className="text-[1.02rem] font-semibold text-(--ink)">
          이 그래프가 뜨면 오늘 목표 달성입니다.
        </p>
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
        <Callout kind="tip" title="막히면">
          에러 메시지의 마지막 줄을 읽으세요. 거기에 답이 있습니다. 그래도 모르면 캡처해서
          스터디 채널에 올리세요. 혼자 30분 이상 붙잡지 마세요.
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
