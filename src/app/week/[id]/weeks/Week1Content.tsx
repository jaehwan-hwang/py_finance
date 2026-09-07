"use client";

import { SlideDeck, Slide, MdBlocks, MentorCard } from "@/components";
import { weeks, formatDate } from "@/constants/weeks";
import { OS_GUIDES, STUDY_INFO } from "@/constants/week1";
import {
  BASICS,
  WEEK1_INTRO,
  WEEK1_INTRO_P,
  WEEK1_NEXT,
} from "@/constants/week1Basics";

const W = weeks[0];

export default function Week1Content() {
  return (
    <SlideDeck
      weekNum={String(Number(W.num))}
      weekTitle={W.title}
      outro={
        <>
          <h2 className="text-[clamp(1.8rem,5.5vw,3rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-(--ink)">
            다음 주 예고
          </h2>
          <div className="mt-6">
            <MdBlocks blocks={WEEK1_NEXT} />
          </div>
        </>
      }
    >
      {/* 1 ── OT */}
      <Slide>
        <p className="text-[1rem] font-medium text-(--ink-3)">
          {formatDate(W.date)}
        </p>
        <h1 className="mt-3 text-[clamp(2rem,7vw,3.8rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-(--ink)">
          OT
        </h1>
        <ul className="mt-8 flex flex-col gap-2.5">
          {[
            "멘토 및 스터디 소개",
            "8주 방향",
            "환경 세팅 — Windows / MacOS / Linux",
            "파이썬 기초 — 변수 · 자료형 · print() · input() · f-string · 주석",
            "오늘의 코드 · 오늘의 테스트",
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

      {/* 2 ── 멘토 및 스터디 소개 */}
      <Slide title="멘토 및 스터디 소개">
        <MentorCard />
        <div className="scroll-x mt-6 rounded-[16px] border border-(--border)">
          <table className="w-full border-collapse text-left text-[0.95rem]">
            <tbody>
              {STUDY_INFO.map((r) => (
                <tr key={r.k} className="border-b border-(--border-2) last:border-0">
                  <td className="w-28 px-5 py-3 font-medium whitespace-nowrap text-(--ink-3)">
                    {r.k}
                  </td>
                  <td className="px-5 py-3 text-(--ink)">{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Slide>

      {/* 3 ── 8주 방향 */}
      <Slide title="8주 방향">
        <div className="scroll-x rounded-[16px] border border-(--border)">
          <table className="w-full border-collapse text-left text-[0.93rem]">
            <thead>
              <tr className="border-b border-(--border) bg-(--surface-2)">
                {["주차", "날짜", "주제", "함께 배우는 파이썬"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[0.83rem] font-semibold whitespace-nowrap text-(--ink-3)"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((w) => (
                <tr key={w.num} className="border-b border-(--border-2) last:border-0">
                  <td className="font-display px-4 py-3 whitespace-nowrap text-(--ink-3) tabular-nums">
                    {w.num}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-(--ink-3)">
                    {formatDate(w.date)}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-(--ink)">
                    {w.title}
                  </td>
                  <td className="px-4 py-3 text-(--ink-2)">{w.python.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Slide>

      {/* 4~6 ── OS별 환경 세팅 (1주차_환경세팅.md 원문) */}
      {OS_GUIDES.map((g) => (
        <Slide key={g.os} title={`환경 세팅 — ${g.os}`}>
          <div className="flex flex-col gap-9">
            {g.sections.map((s) => (
              <section key={s.num}>
                <h3 className="text-[1.15rem] font-semibold text-(--ink)">
                  {s.num}. {s.title}
                </h3>
                <MdBlocks blocks={s.blocks} />
              </section>
            ))}
          </div>
        </Slide>
      ))}

      {/* 7 ── 파이썬 기초 표지 */}
      <Slide title="파이썬 기초">
        <p className="text-[1.05rem] font-medium text-(--ink-3)">{WEEK1_INTRO}</p>
        <p className="mt-5 text-[1.02rem] leading-[1.85] text-(--ink-2)">
          {WEEK1_INTRO_P}
        </p>
      </Slide>

      {/* 8~ ── 파이썬 기초 (week1-python-basics.md 원문) */}
      {BASICS.map((s) => (
        <Slide key={s.title} title={s.title}>
          <MdBlocks blocks={s.blocks} />
        </Slide>
      ))}
    </SlideDeck>
  );
}
