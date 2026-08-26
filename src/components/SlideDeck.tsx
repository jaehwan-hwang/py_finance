"use client";

import Link from "next/link";
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * 슬라이드 한 장.
 * 마지막 장은 "마무리" 화면으로 취급한다 — 넘기기 버튼 대신 자체 버튼을 둔다.
 */
export function Slide({
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

/** 가로 스와이프로 인정할 최소 거리(px) */
const SWIPE_MIN = 55;

export default function SlideDeck({
  weekNum,
  weekTitle,
  children,
}: {
  weekNum: string;
  weekTitle: string;
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children).filter(isValidElement);
  const total = slides.length;
  const [i, setI] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (next: number) => {
      setI((cur) => {
        const v = Math.max(0, Math.min(total - 1, next));
        if (v !== cur) window.scrollTo({ top: 0, behavior: "auto" });
        return v;
      });
    },
    [total],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setI((c) => Math.min(total - 1, c + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setI((c) => Math.max(0, c - 1));
      } else if (e.key === "Home") {
        setI(0);
      } else if (e.key === "End") {
        setI(total - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  /* ── 스와이프 ──
     코드 블록·표처럼 가로로 스크롤되는 영역에서 시작한 손짓은 무시한다.
     안 그러면 코드를 옆으로 밀 때마다 슬라이드가 넘어간다. */
  function onTouchStart(e: React.TouchEvent) {
    if ((e.target as HTMLElement).closest(".scroll-x")) {
      touch.current = null;
      return;
    }
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // 세로로 더 많이 움직였으면 스크롤이지 스와이프가 아니다
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    go(dx < 0 ? i + 1 : i - 1);
  }

  const current = slides[i] as React.ReactElement<{ title?: string }>;
  const slideTitle = current?.props?.title;
  const isLast = i === total - 1;
  const nextIsLast = i === total - 2;

  return (
    <div
      className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-[900px] flex-col px-5 pb-8 sm:min-h-[calc(100dvh-88px)] sm:px-10"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 상단 — 주차 표시와 진행 상황 */}
      <div className="flex items-center justify-between gap-4 py-5 sm:py-7">
        <Link
          href="/#curriculum"
          className="flex items-center gap-2 text-[0.9rem] font-medium text-(--ink-3) transition-colors hover:text-(--ink)"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          {weekNum}주차 · {weekTitle}
        </Link>
        <span className="font-display text-[0.95rem] font-medium text-(--ink-3) tabular-nums">
          {String(i + 1).padStart(2, "0")}
          <span className="mx-1 opacity-50">/</span>
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* 진행 바 */}
      <div
        className="h-[3px] w-full overflow-hidden rounded-full bg-(--border-2)"
        role="progressbar"
        aria-valuenow={i + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-(--ink) transition-[width] duration-300"
          style={{ width: `${((i + 1) / total) * 100}%` }}
        />
      </div>

      {/* 슬라이드 본문 */}
      <section
        key={i}
        className="slide-in flex flex-1 flex-col justify-center py-10 sm:py-14"
        aria-live="polite"
      >
        {slideTitle && (
          <h2 className="mb-7 text-[clamp(1.5rem,4.4vw,2.4rem)] leading-[1.2] font-semibold tracking-[-0.03em] text-(--ink)">
            {slideTitle}
          </h2>
        )}
        <div>{current}</div>
      </section>

      {/* 하단 — 넘기기. 마지막 장에서는 자체 버튼을 쓰므로 다음 버튼을 감춘다. */}
      <div className="flex items-center justify-between gap-4 border-t border-(--border) pt-5">
        <NavButton dir="prev" disabled={i === 0} onClick={() => go(i - 1)} />
        <div className="hidden items-center justify-center gap-1.5 sm:flex">
          {slides.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n + 1}번째 슬라이드`}
              aria-current={n === i}
              onClick={() => go(n)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: n === i ? 22 : 6,
                background: n === i ? "var(--ink)" : "var(--border)",
              }}
            />
          ))}
        </div>
        {isLast ? (
          <span className="w-[92px] flex-none sm:w-[108px]" aria-hidden="true" />
        ) : (
          <NavButton
            dir="next"
            label={nextIsLast ? "완료" : "다음"}
            solid={nextIsLast}
            disabled={false}
            onClick={() => go(i + 1)}
          />
        )}
      </div>
    </div>
  );
}

function NavButton({
  dir,
  label,
  solid = false,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  label?: string;
  solid?: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const isNext = dir === "next";
  const text = label ?? (isNext ? "다음" : "이전");
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isNext ? `${text} 슬라이드` : "이전 슬라이드"}
      className={`flex flex-none items-center gap-2 rounded-full border px-4 py-2.5 text-[0.88rem] font-medium transition-all disabled:pointer-events-none disabled:opacity-30 sm:px-5 ${
        solid
          ? "border-transparent bg-(--chip-bg) text-(--chip-ink) hover:-translate-y-0.5"
          : "border-(--border) text-(--ink) hover:border-(--ink-3)"
      }`}
    >
      {!isNext && <Chevron dir="left" />}
      <span className={isNext ? "" : "hidden sm:inline"}>{text}</span>
      {isNext && <Chevron dir="right" />}
    </button>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}
