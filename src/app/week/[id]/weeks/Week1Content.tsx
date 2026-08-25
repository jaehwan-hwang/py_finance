"use client";

import { useState } from "react";
import {
  WeekHero,
  SectionTitle,
  CodeBlock,
  Callout,
  Card,
  StepItem,
  Tabs,
  Tag,
} from "@/components";
import { weeks, formatDate } from "@/constants/weeks";
import {
  WEEK1_TOC,
  WEEK1_GOAL,
  WEEK1_TIMETABLE,
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
    <article className="pb-20">
      <WeekHero
        num={W.num}
        date={formatDate(W.date)}
        title={W.title}
        desc={W.desc}
        python={W.python}
        bonus={W.bonus}
      />

      {/* 목차 + 오늘의 목표 */}
      <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
        <Card>
          <h3 className="mb-3 font-mono text-[0.7rem] tracking-[0.09em] text-(--ink-3) uppercase">
            목차
          </h3>
          <ul className="flex flex-col gap-1.5">
            {WEEK1_TOC.map((t) => (
              <li key={t.num}>
                <a
                  href={t.href}
                  className="flex items-center gap-3 text-[0.92rem] text-(--ink-2) transition-colors hover:text-(--ink)"
                >
                  <span className="font-mono text-[0.72rem] text-(--ink-3) tabular-nums">
                    {t.num}
                  </span>
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </Card>
        <Card soft>
          <h3 className="mb-3 font-mono text-[0.7rem] tracking-[0.09em] text-(--ink-3) uppercase">
            오늘의 결승선
          </h3>
          <p className="text-[1.05rem] leading-[1.6] font-semibold text-(--ink)">
            {WEEK1_GOAL}
          </p>
          <div className="mt-4 flex flex-col gap-1 border-t border-(--border) pt-4">
            {WEEK1_TIMETABLE.map((t) => (
              <div key={t.time} className="flex gap-3 text-[0.82rem]">
                <span className="w-20 flex-none font-mono text-(--ink-3) tabular-nums">
                  {t.time}
                </span>
                <span className="text-(--ink-2)">{t.what}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 01. 환경 구축 ── */}
      <Section id="setup" en="Setup" ko="한 명도 빠짐없이 같은 환경을 만듭니다" />

      <p className="prose-ko text-[0.98rem] leading-[1.8] text-(--ink-2)">
        파이썬으로 금융을 배우겠다고 결심한 사람의 절반은 <b>1주차에서 그만둡니다.</b> 내용이
        어려워서가 아니라 <b>pip install</b> 이 안 돼서입니다. 그래서 오늘은 진도를 나가지 않습니다.
      </p>

      <Callout kind="tip" title="막히면 바로 손을 드세요">
        오늘 못 끝내도 괜찮습니다. 다만 혼자 끙끙대지 마세요. 이번 주에 해결 안 된 문제는
        다음 주에 두 배로 커집니다.
      </Callout>

      <h3 className="mt-10 mb-4 text-[1.15rem] font-semibold text-(--ink)">
        내 OS에 맞는 명령
      </h3>
      <Tabs tabs={ENV_OS_TABS} activeTab={os} onTabChange={setOs} />
      <CodeBlock code={ENV_COMMANDS[os]} lang="bash" />
      <p
        className="prose-ko mt-1 text-[0.88rem] text-(--ink-3)"
        dangerouslySetInnerHTML={{ __html: ENV_OS_NOTES[os] }}
      />

      <h3 className="mt-10 mb-5 text-[1.15rem] font-semibold text-(--ink)">
        설치 순서
      </h3>
      <ol className="list-none">
        {ENV_STEPS.map((s, i) => (
          <StepItem
            key={s.num}
            num={s.num}
            title={s.title}
            last={i === ENV_STEPS.length - 1}
          >
            <span dangerouslySetInnerHTML={{ __html: s.body }} />
          </StepItem>
        ))}
      </ol>

      <h3 className="mt-6 mb-4 text-[1.15rem] font-semibold text-(--ink)">
        오늘 반드시 확인할 세 가지
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {ENV_CHECK3.map((c) => (
          <Card key={c.q}>
            <div className="text-[0.9rem] font-semibold text-(--ink)">{c.q}</div>
            <div className="mt-1.5 font-mono text-[0.78rem] text-(--ink-3)">
              {c.a}
            </div>
          </Card>
        ))}
      </div>
      <Callout kind="warn" title="세 번째가 가장 많이 틀립니다">
        터미널에서는 되는데 노트북에서만 <b>ModuleNotFoundError</b> 가 나면 100% 이 문제입니다.
        VS Code 인터프리터를 <b>.venv</b> 로 바꾸고 커널을 재시작하세요.
      </Callout>

      {/* ── 02. 8주 지도 ── */}
      <Section id="map" en="8주 지도" ko="두 개의 사다리를 같이 오릅니다" />

      <div className="scroll-x rounded-[14px] border border-(--border)">
        <table className="w-full border-collapse text-left text-[0.9rem]">
          <thead>
            <tr className="border-b border-(--border) bg-(--surface-2)">
              <th className="px-4 py-3 font-mono text-[0.7rem] tracking-[0.08em] text-(--ink-3) uppercase">
                주차
              </th>
              <th className="px-4 py-3 font-mono text-[0.7rem] tracking-[0.08em] text-(--ink-3) uppercase">
                파이썬
              </th>
              <th className="px-4 py-3 font-mono text-[0.7rem] tracking-[0.08em] text-(--ink-3) uppercase">
                금융
              </th>
            </tr>
          </thead>
          <tbody>
            {LADDER.map((l) => (
              <tr key={l.week} className="border-b border-(--border-2) last:border-0">
                <td className="px-4 py-3 font-mono whitespace-nowrap text-(--ink-3) tabular-nums">
                  {l.week}
                </td>
                <td className="px-4 py-3 text-(--ink-2)">{l.py}</td>
                <td className="px-4 py-3 text-(--ink)">{l.fin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout kind="note" title="이 스터디의 약속 두 가지">
        <b>① 안 쓸 문법은 가르치지 않습니다.</b> 배운 문법은 그날 안에 금융 코드에 써먹습니다.
        <br />
        <b>② 정의대로 먼저 직접 만들고, 그다음 라이브러리로 검증합니다.</b> 라이브러리 한 줄이면
        나오는 숫자라도, 그게 무엇인지 모르면 쓸 수 없기 때문입니다.
      </Callout>

      {/* ── 03. 파이썬 첫걸음 ── */}
      <Section id="python" en="파이썬 첫걸음" ko="오늘 배우는 건 여섯 가지뿐입니다" />

      <h3 className="mb-3 text-[1.1rem] font-semibold text-(--ink)">
        1) print() 와 주석
      </h3>
      <CodeBlock code={PY_PRINT} />
      <p className="text-[0.92rem] leading-[1.75] text-(--ink-2)">
        <code className="font-mono text-[0.88em]">print()</code> 는 <b>함수</b>입니다. 괄호 안에
        값을 넣으면 화면에 보여줍니다.
      </p>

      <h3 className="mt-9 mb-3 text-[1.1rem] font-semibold text-(--ink)">
        2) 변수 — 값에 이름을 붙이는 것
      </h3>
      <p className="mb-3 text-[0.92rem] text-(--ink-2)">
        <code className="font-mono text-[0.88em]">=</code> 는 &ldquo;같다&rdquo;가 아니라{" "}
        <b>&ldquo;담는다&rdquo;</b> 입니다.
      </p>
      <div className="scroll-x mb-4 rounded-[14px] border border-(--border)">
        <table className="w-full border-collapse text-left text-[0.9rem]">
          <tbody>
            {PY_TYPES.map((t) => (
              <tr key={t.t} className="border-b border-(--border-2) last:border-0">
                <td className="px-4 py-2.5 whitespace-nowrap text-(--ink)">{t.t}</td>
                <td className="px-4 py-2.5 font-mono text-(--ink-3)">{t.ex}</td>
                <td className="px-4 py-2.5 text-(--ink-3)">{t.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CodeBlock code={PY_VAR} />
      <Callout kind="warn" title="종목코드는 항상 문자열입니다">
        <b>005930</b> 을 숫자로 쓰면 파이썬이 <b>5930</b> 으로 바꿉니다. 국내 종목코드는 앞자리 0이
        의미를 가지므로 반드시 따옴표를 씌웁니다.
      </Callout>

      <h3 className="mt-9 mb-3 text-[1.1rem] font-semibold text-(--ink)">
        3) 계산하기 — 특히 <span className="font-mono">**</span>
      </h3>
      <CodeBlock code={PY_MATH} />
      <p className="text-[0.92rem] leading-[1.75] text-(--ink-2)">
        <b>
          <code className="font-mono text-[0.88em]">**</code> 를 꼭 기억하세요.
        </b>{" "}
        다음 주에 배울 복리 공식이 바로 이것입니다.
      </p>
      <CodeBlock code={PY_COMPOUND} />

      <h3 className="mt-9 mb-3 text-[1.1rem] font-semibold text-(--ink)">
        4) f-문자열 — 결과를 보기 좋게
      </h3>
      <p className="mb-3 text-[0.92rem] text-(--ink-2)">
        문자열 앞에 <b>f</b>, 값은 <b>{"{}"}</b> 안에.
      </p>
      <CodeBlock code={PY_FSTRING} />
      <div className="scroll-x rounded-[14px] border border-(--border)">
        <table className="w-full border-collapse text-left text-[0.88rem]">
          <thead>
            <tr className="border-b border-(--border) bg-(--surface-2)">
              {["서식", "뜻", "예제", "출력"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.08em] text-(--ink-3) uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PY_FORMATS.map((f) => (
              <tr key={f.f} className="border-b border-(--border-2) last:border-0">
                <td className="px-4 py-2.5 font-mono whitespace-nowrap text-(--ink)">
                  {f.f}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-(--ink-3)">
                  {f.mean}
                </td>
                <td className="px-4 py-2.5 font-mono whitespace-nowrap text-(--ink-3)">
                  {f.ex}
                </td>
                <td className="px-4 py-2.5 font-mono whitespace-nowrap text-(--ink-2)">
                  {f.out}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-9 mb-3 text-[1.1rem] font-semibold text-(--ink)">
        5) 함수 호출하기
      </h3>
      <p className="mb-3 text-[0.92rem] text-(--ink-2)">
        파이썬이 미리 만들어 둔 함수들이 있습니다. 오늘은 <b>쓰기만</b> 합니다. 직접 만드는 건
        다음 주입니다.
      </p>
      <CodeBlock code={PY_CALL} />

      <h3 className="mt-9 mb-3 text-[1.1rem] font-semibold text-(--ink)">
        6) import — 남이 만든 도구 가져오기
      </h3>
      <CodeBlock code={PY_IMPORT} />
      <p className="text-[0.92rem] leading-[1.75] text-(--ink-2)">
        파이썬이 강한 이유가 이것입니다. <b>주가를 가져오는 코드를 우리가 짤 필요가 없습니다.</b>
      </p>

      {/* ── 04. 금융 첫걸음 ── */}
      <Section id="finance" en="금융 첫걸음" ko="가격이 아니라 수익률로 말합니다" />

      <p className="prose-ko text-[0.98rem] leading-[1.8] text-(--ink-2)">
        삼성전자 7만원과 LG화학 40만원 중 어느 쪽이 더 좋은 투자였을까요?{" "}
        <b>가격만으로는 비교할 수 없습니다.</b> 그래서 모든 것을 수익률로 바꿔서 봅니다.
      </p>
      <CodeBlock code={FIN_RETURN} />

      <h3 className="mt-9 mb-3 text-[1.1rem] font-semibold text-(--ink)">
        수익률은 더하는 게 아니라 곱한다
      </h3>
      <p className="text-[0.92rem] leading-[1.75] text-(--ink-2)">
        100원이 <b>−50% 후 +50%</b> 면 원금일까요? 100원 → 50원 → 75원, 즉 <b>−25%</b> 입니다.
        수익률을 그냥 더하면 0%지만 실제로는 손실입니다. 그래서 누적수익률은 <b>곱셈</b>입니다.
      </p>
      <Callout kind="note" title="여기서 사슬이 시작됩니다">
        이 사실이 2주차 <b>복리</b>, 4주차 <b>MDD(최대낙폭)</b> 로 이어집니다. 한 번 크게 잃으면
        회복이 훨씬 어렵다 — 금융에서 낙폭에 집착하는 이유입니다.
      </Callout>

      <h3 className="mt-9 mb-3 text-[1.1rem] font-semibold text-(--ink)">
        실습 — 삼성전자 10년
      </h3>
      <Callout kind="tip" title="오늘은 이해가 아니라 실행이 목적입니다">
        환경이 살아있는지 확인하는 용도이며, 무슨 뜻인지는 3주차(pandas)에서 배웁니다. 지금은{" "}
        <b>import</b> 와 함수 호출만 눈에 들어오면 됩니다.
      </Callout>
      <CodeBlock code={FIN_PRACTICE} />
      <p className="text-[0.92rem] text-(--ink-2)">
        <b>이 그래프가 뜨면 오늘 목표 달성입니다.</b>
      </p>
      <CodeBlock code={FIN_TENYEAR} caption="표에서 첫 값과 마지막 값만 꺼내면, 위에서 손으로 한 계산과 똑같습니다." />

      {/* ── 05. 치트시트 ── */}
      <Section id="cheatsheet" en="자주 나는 에러" ko="문법은 외우는 게 아니라 찾아보는 겁니다" />

      <div className="scroll-x rounded-[14px] border border-(--border)">
        <table className="w-full border-collapse text-left text-[0.88rem]">
          <thead>
            <tr className="border-b border-(--border) bg-(--surface-2)">
              {["에러 메시지", "원인", "해결"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.08em] text-(--ink-3) uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ERRORS.map((e) => (
              <tr key={e.msg} className="border-b border-(--border-2) last:border-0">
                <td className="px-4 py-3 font-mono text-(--ink)">{e.msg}</td>
                <td className="px-4 py-3 whitespace-nowrap text-(--ink-3)">{e.why}</td>
                <td className="px-4 py-3 text-(--ink-2)">{e.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout kind="tip" title="막히면">
        <b>에러 메시지의 마지막 줄</b>을 읽으세요. 거기에 답이 있습니다. 그래도 모르면 캡처해서
        스터디 채널에 올리세요. 혼자 30분 이상 붙잡지 마세요.
      </Callout>

      <h3 className="mt-10 mb-4 text-[1.15rem] font-semibold text-(--ink)">
        3줄 요약
      </h3>
      <ol className="flex flex-col gap-2.5">
        {WEEK1_SUMMARY.map((s, i) => (
          <li key={s} className="flex gap-3 text-[0.95rem] text-(--ink-2)">
            <span className="font-mono text-(--ink-3) tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            {s}
          </li>
        ))}
      </ol>

      {/* ── 06. 미션 ── */}
      <Section id="mission" en="미션" ko="다음 주 복리의 재료입니다" />

      <Card soft className="!p-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <Tag variant="solid">미션 1</Tag>
          <Tag>마감 {MISSION.due}</Tag>
          <Tag>{MISSION.time}</Tag>
        </div>
        <h3 className="mt-4 text-[1.3rem] font-semibold tracking-[-0.02em] text-(--ink)">
          {MISSION.title}
        </h3>
        <p className="mt-3 text-[0.94rem] leading-[1.75] text-(--ink-2)">
          {MISSION.why}
        </p>

        <h4 className="mt-6 mb-3 font-mono text-[0.7rem] tracking-[0.09em] text-(--ink-3) uppercase">
          할 일
        </h4>
        <ol className="flex flex-col gap-2">
          {MISSION.steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-[0.92rem] text-(--ink-2)">
              <span className="font-mono text-(--ink-3) tabular-nums">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ol>
      </Card>

      <CodeBlock code={MISSION.code} caption="TODO 세 줄만 여러분이 채웁니다." />

      <h4 className="mt-6 mb-3 font-mono text-[0.7rem] tracking-[0.09em] text-(--ink-3) uppercase">
        완료 판정 기준
      </h4>
      <ul className="flex flex-col gap-2">
        {MISSION.done.map((d) => (
          <li key={d} className="flex gap-3 text-[0.92rem] text-(--ink-2)">
            <span className="text-(--ink-3)">□</span>
            {d}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Section({ id, en, ko }: { id: string; en: string; ko: string }) {
  return (
    <div className="mt-16 border-t border-(--border) pt-14">
      <SectionTitle id={id} en={en} ko={ko} />
    </div>
  );
}
