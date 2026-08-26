"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Tag } from "@/components";
import { SITE_META, REFERENCES } from "@/constants/site";
import { weeks, formatDate, findNextWeek, daysUntil } from "@/constants/weeks";

const WRAP = "mx-auto max-w-[1200px] px-5 sm:px-10";

export default function Home() {
  return (
    <main>
      <Hero />
      <Curriculum />
      <Reference />
    </main>
  );
}

/* ── 히어로 — 레퍼런스 표지 구조: 메타 행 + 헤어라인 + 거대 타이틀 ── */
function Hero() {
  return (
    <section className={`${WRAP} pt-10 pb-14 sm:pt-16 sm:pb-24`}>
      <div className="grid gap-5 pb-5 sm:grid-cols-2 lg:grid-cols-4">
        {SITE_META.map((m) => (
          <div key={m.key}>
            <div className="font-mono text-[0.72rem] font-semibold tracking-[0.09em] text-(--ink) uppercase">
              {m.key}
            </div>
            <div className="mt-1 text-[0.95rem] text-(--ink-3)">{m.value}</div>
          </div>
        ))}
      </div>

      <hr className="border-0 border-t border-(--border)" />

      <h1 className="mt-[clamp(40px,9vw,110px)] text-[clamp(1.75rem,7.6vw,6rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-(--ink)">
        <span className="font-display">PYTHON</span>으로
        <br />
        알아보는 기초 금융공학
      </h1>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="#curriculum"
          className="inline-flex items-center rounded-full bg-(--chip-bg) px-6 py-3 text-[0.9rem] font-medium text-(--chip-ink) transition-transform hover:-translate-y-0.5"
        >
          커리큘럼 보기
        </Link>
      </div>
    </section>
  );
}

/* ── 커리큘럼 ── */
function Curriculum() {
  return (
    <section
      id="curriculum"
      className={`${WRAP} border-t border-(--border) py-14 sm:py-24`}
    >
      <h2 className="font-display mb-8 text-[clamp(1.9rem,5vw,3.2rem)] font-medium tracking-[-0.03em] text-(--ink) uppercase sm:mb-12">
        Curriculum
      </h2>
      <NextSession />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {weeks.map((w) => (
          <WeekCard key={w.num} week={w} />
        ))}
      </div>
    </section>
  );
}

/* ── 참고자료 — site.ts 의 REFERENCES 배열을 채우면 카드가 늘어난다 ── */
function Reference() {
  return (
    <section
      id="reference"
      className={`${WRAP} border-t border-(--border) py-14 sm:py-24`}
    >
      <h2 className="font-display mb-8 text-[clamp(1.9rem,5vw,3.2rem)] font-medium tracking-[-0.03em] text-(--ink) uppercase sm:mb-12">
        Reference
      </h2>

      {REFERENCES.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-(--border) px-6 py-12 text-center">
          <p className="text-[1.02rem] font-medium text-(--ink-2)">
            아직 올라온 자료가 없습니다.
          </p>
          <p className="mt-2 text-[0.92rem] text-(--ink-3)">
            수업이 진행되면서 링크·책 추천·추가로 알아두면 좋은 문법을 이곳에 올립니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {REFERENCES.map((r) => {
            const inner = (
              <>
                <span className="text-[0.82rem] font-medium text-(--ink-3)">
                  {r.kind}
                </span>
                <span className="text-[1.05rem] font-semibold text-(--ink)">
                  {r.title}
                </span>
                <span className="text-[0.9rem] leading-[1.6] text-(--ink-3)">
                  {r.desc}
                </span>
              </>
            );
            const cls =
              "flex flex-col gap-2 rounded-[18px] border border-(--border) bg-(--surface) p-6 transition-all";
            return r.href ? (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cls} hover:-translate-y-0.5 hover:border-(--ink-3)`}
              >
                {inner}
              </a>
            ) : (
              <div key={r.title} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function NextSession() {
  /* 날짜 계산은 클라이언트에서 — 서버/클라이언트 시각 차이로 인한 hydration 불일치를 피한다 */
  const [info, setInfo] = useState<{
    title: string;
    meta: string;
    dday: string;
  } | null>(null);

  useEffect(() => {
    const next = findNextWeek();
    if (!next) return;
    const d = daysUntil(next.date);
    setInfo({
      title: `${Number(next.num)}주차 · ${next.title}`,
      meta: `${formatDate(next.date)} · ITBT관 207호`,
      dday: d === 0 ? "D-DAY" : `D-${d}`,
    });
  }, []);

  if (!info) return null;

  return (
    <div
      className="mb-10 grid items-center gap-7 rounded-[24px] border border-(--border) p-6 sm:mb-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-8"
      style={{
        background: "linear-gradient(180deg, var(--surface), var(--accent-wash))",
        boxShadow: "var(--shadow)",
      }}
    >
      <div>
        <div className="font-mono text-[0.72rem] tracking-[0.09em] text-(--ink-3) uppercase">
          Next session
        </div>
        <div className="mt-2 text-[clamp(1.3rem,3vw,1.85rem)] font-semibold tracking-[-0.02em] text-(--ink)">
          {info.title}
        </div>
        <div className="mt-1.5 text-[0.95rem] text-(--ink-3)">{info.meta}</div>
      </div>
      <div className="font-display text-left text-[clamp(2rem,5vw,3rem)] leading-none font-medium tracking-[-0.04em] text-(--ink) tabular-nums sm:text-center">
        {info.dday}
      </div>
    </div>
  );
}

function WeekCard({ week }: { week: (typeof weeks)[number] }) {
  const open = week.available;

  const inner = (
    <>
      <span className="font-display absolute -top-4 left-6 grid h-8 min-w-14 place-items-center rounded-full border border-(--border) bg-(--ground) px-3.5 text-[0.9rem] font-medium text-(--ink-2) tabular-nums group-hover:border-(--ink-3) group-hover:text-(--ink)">
        {week.num}
      </span>

      <span className="text-[0.88rem] font-medium text-(--ink-3)">
        {formatDate(week.date)}
      </span>

      <span className="text-[1.18rem] leading-[1.3] font-semibold tracking-[-0.02em] text-(--ink)">
        {week.title}
      </span>

      <span className="flex-1 text-[0.9rem] leading-[1.6] text-(--ink-3)">
        {week.desc}
      </span>

      <span className="flex flex-wrap gap-1.5">
        {week.python.map((p) => (
          <Tag key={p}>{p}</Tag>
        ))}
      </span>

      <span className="flex items-center justify-between gap-2.5 border-t border-(--border-2) pt-3.5">
        <Tag variant={open ? "solid" : "outline"}>
          {open ? "자료 열림" : "준비 중"}
        </Tag>
        <span
          aria-hidden="true"
          className="grid h-7.5 w-7.5 flex-none place-items-center rounded-full text-(--ink-2) transition-transform group-hover:translate-x-0.5"
          style={{
            background:
              "linear-gradient(160deg, var(--accent-wash), color-mix(in srgb, var(--accent-soft) 45%, transparent))",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>
    </>
  );

  const cls =
    "group relative mt-4 flex flex-col gap-3 rounded-[18px] border border-(--border) bg-(--surface) px-6 pt-8 pb-5 text-left transition-all";

  if (!open) {
    return (
      <div className={`${cls} opacity-70`} style={{ boxShadow: "var(--shadow)" }}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/week/${Number(week.num)}`}
      className={`${cls} hover:-translate-y-1 hover:border-(--ink-3)`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      {inner}
    </Link>
  );
}
