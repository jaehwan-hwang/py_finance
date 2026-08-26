"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionTitle, Tag } from "@/components";
import { SITE_META, SITE_DESC, PRINCIPLES } from "@/constants/site";
import { weeks, formatDate, findNextWeek, daysUntil } from "@/constants/weeks";

const WRAP = "mx-auto max-w-[1200px] px-5 sm:px-10";

export default function Home() {
  return (
    <main>
      <Hero />
      <Principles />
      <Curriculum />
      <Setup />
      <References />
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
            <div className="mt-0.5 text-[0.95rem] text-(--ink-3)">{m.value}</div>
          </div>
        ))}
      </div>

      <hr className="border-0 border-t border-(--border)" />

      <h1 className="mt-[clamp(40px,9vw,110px)] text-[clamp(1.75rem,7.6vw,6rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-(--ink)">
        <span className="font-display">PYTHON</span>으로
        <br />
        알아보는 기초 금융공학
      </h1>

      <p className="mt-7 max-w-[56ch] text-[clamp(1rem,1.6vw,1.15rem)] text-(--ink-2)">
        {SITE_DESC}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Link
          href="#curriculum"
          className="inline-flex items-center rounded-full bg-(--chip-bg) px-6 py-3 text-[0.9rem] font-medium text-(--chip-ink) transition-transform hover:-translate-y-0.5"
        >
          커리큘럼 보기
        </Link>
        <Link
          href="#setup"
          className="inline-flex items-center rounded-full border border-(--border) px-6 py-3 text-[0.9rem] font-medium text-(--ink) transition-colors hover:border-(--ink-3)"
        >
          환경 설정하기
        </Link>
      </div>
    </section>
  );
}

/* ── 운영 원칙 3원 ── */
function Principles() {
  return (
    <section className={`${WRAP} border-t border-(--border) py-14 sm:py-24`}>
      <SectionTitle en="How it works" ko="이 스터디가 굴러가는 방식" />
      <div className="grid gap-6 sm:gap-9 md:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <article
            key={p.en}
            className="flex flex-col items-center gap-3.5 rounded-[24px] border border-(--border) p-8 text-center md:aspect-square md:rounded-full md:p-[14%]"
            style={{
              background:
                "radial-gradient(120% 110% at 50% 120%, var(--accent-wash), transparent 62%)",
            }}
          >
            <h3 className="font-display text-[1.3rem] font-medium text-(--ink)">
              {p.en}
            </h3>
            <span className="h-px w-16 bg-(--border)" />
            <p
              className="prose-ko text-[0.9rem] leading-[1.7] text-(--ink-3)"
              dangerouslySetInnerHTML={{ __html: p.desc }}
            />
          </article>
        ))}
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
      <SectionTitle en="Curriculum" ko="8주 · 자료가 열린 주차는 눌러서 들어갑니다" />
      <NextSession />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {weeks.map((w) => (
          <WeekCard key={w.num} week={w} />
        ))}
      </div>
    </section>
  );
}

function NextSession() {
  /* 날짜 계산은 클라이언트에서 — 서버/클라이언트 시각 차이로 인한 hydration 불일치를 피한다 */
  const [info, setInfo] = useState<{ title: string; meta: string; dday: string; lab: string } | null>(null);

  useEffect(() => {
    const next = findNextWeek();
    if (!next) return;
    const d = daysUntil(next.date);
    setInfo({
      title: `${Number(next.num)}주차 · ${next.title}`,
      meta: `${formatDate(next.date)} · ITBT관 207호 · 오늘의 파이썬: ${next.python.join(", ")}`,
      dday: d === 0 ? "D-DAY" : `D-${d}`,
      lab: d === 0 ? "오늘 수업" : "남았습니다",
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
        <div className="mt-2 text-[0.92rem] text-(--ink-3)">{info.meta}</div>
      </div>
      <div className="text-left font-mono tabular-nums sm:text-center">
        <b className="block text-[clamp(2rem,5vw,3rem)] leading-none font-medium tracking-[-0.04em] text-(--ink)">
          {info.dday}
        </b>
        <span className="text-[0.72rem] tracking-[0.09em] text-(--ink-3) uppercase">
          {info.lab}
        </span>
      </div>
    </div>
  );
}

function WeekCard({ week }: { week: (typeof weeks)[number] }) {
  const open = week.available;

  const inner = (
    <>
      <span className="absolute -top-4 left-6 grid h-8 min-w-14 place-items-center rounded-full border border-(--border) bg-(--ground) px-3.5 font-mono text-[0.85rem] text-(--ink-2) tabular-nums group-hover:border-(--ink-3) group-hover:text-(--ink)">
        {week.num}
      </span>

      <span className="font-mono text-[0.78rem] text-(--ink-3) tabular-nums">
        {formatDate(week.date)}
      </span>

      <span className="text-[1.18rem] leading-[1.3] font-semibold tracking-[-0.02em] text-(--ink)">
        {week.title}
      </span>

      <span className="flex-1 text-[0.88rem] leading-[1.6] text-(--ink-3)">
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

/* ── 환경 설정 ── */
const OS_SETUP = [
  {
    name: "Windows",
    code: `py -3.12 -m venv .venv\n.venv\\Scripts\\activate\npip install -r requirements.txt`,
    note: "설치 시 Add python.exe to PATH 체크를 잊지 마세요.",
  },
  {
    name: "macOS",
    code: `brew install python@3.12\npython3.12 -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt`,
    note: "Apple Silicon이라면 터미널이 Rosetta로 실행 중인지 확인하세요.",
  },
  {
    name: "Linux",
    code: `sudo apt install python3.12 python3.12-venv\npython3.12 -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt`,
    note: "그래프 한글이 깨지면 sudo apt install fonts-nanum 후 커널을 재시작하세요.",
  },
];

function Setup() {
  return (
    <section
      id="setup"
      className={`${WRAP} border-t border-(--border) py-14 sm:py-24`}
    >
      <SectionTitle en="Setup" ko="1주차 전까지 각자 준비해 오세요" />
      <div className="grid gap-5 md:grid-cols-3">
        {OS_SETUP.map((os) => (
          <article
            key={os.name}
            className="flex flex-col gap-3.5 rounded-[18px] border border-(--border) bg-(--surface) p-6"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <h3 className="font-display text-[1.1rem] font-medium text-(--ink)">
              {os.name}
            </h3>
            <div className="scroll-x rounded-xl border border-(--border-2) bg-(--surface-2)">
              <pre className="m-0 px-4 py-3.5 font-mono text-[0.78rem] leading-[1.9] whitespace-pre text-(--ink-2)">
                {os.code}
              </pre>
            </div>
            <p className="text-[0.85rem] text-(--ink-3)">{os.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── 참고자료 ── */
const REFS = [
  {
    kind: "주 참고도서",
    title: "파이썬으로 배우는 포트폴리오",
    desc: "길벗 080227. 1~4장이 이 스터디 2~6주차의 뼈대입니다.",
    href: "https://github.com/gilbutITbook/080227",
  },
  {
    kind: "영상 · 파이썬 기초",
    title: "헨리의 금융MBA",
    desc: "1강 데이터 타입, 2강 제어문·함수는 1·2주차 전에 꼭 보고 오세요.",
    href: "https://youtube.com/playlist?list=PLBcT2bWZuRNrSOu4vq8nM5eSWiN65-DvG",
  },
  {
    kind: "영상 · 지표",
    title: "브레인 빌딩",
    desc: "15~19강 수익률·CAGR·MDD·변동성·샤프비율이 4주차와 그대로 맞습니다.",
    href: "https://youtube.com/playlist?list=PLgAffhOqz2QHIf08FNaDDgC20Pevf5NXb",
  },
  {
    kind: "공식 문서",
    title: "파이썬 튜토리얼 (한국어)",
    desc: "문법이 헷갈릴 때 찾아볼 곳. 치트시트로 안 풀리면 여기를 보세요.",
    href: "https://docs.python.org/ko/3/tutorial/",
  },
];

function References() {
  return (
    <section
      id="refs"
      className={`${WRAP} border-t border-(--border) py-14 sm:py-24`}
    >
      <SectionTitle en="References" ko="수업 전에 보고 오면 훨씬 수월합니다" />
      <div className="grid gap-4 sm:grid-cols-2">
        {REFS.map((r) => (
          <a
            key={r.title}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-[18px] border border-(--border) bg-(--surface) p-6 transition-all hover:-translate-y-0.5 hover:border-(--ink-3)"
          >
            <span className="font-mono text-[0.68rem] tracking-[0.08em] text-(--ink-3) uppercase">
              {r.kind}
            </span>
            <span className="text-[1rem] font-semibold text-(--ink)">
              {r.title}
            </span>
            <span className="text-[0.85rem] leading-[1.6] text-(--ink-3)">
              {r.desc}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
