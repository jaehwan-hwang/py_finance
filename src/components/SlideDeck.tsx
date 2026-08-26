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
import { weeks } from "@/constants/weeks";

/** 슬라이드 한 장. */
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
  outro,
  children,
}: {
  weekNum: string;
  weekTitle: string;
  /** 마지막 장에서 "완료"를 누르면 나오는 마무리 화면 */
  outro?: React.ReactNode;
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children).filter(isValidElement);
  const total = slides.length;
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const toTop = () => window.scrollTo({ top: 0, behavior: "auto" });

  const go = useCallback(
    (next: number) => {
      if (next > total - 1) {
        if (outro) {
          setDone(true);
          toTop();
        }
        return;
      }
      setDone(false);
      setI((cur) => {
        const v = Math.max(0, Math.min(total - 1, next));
        if (v !== cur) toTop();
        return v;
      });
    },
    [total, outro],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        go(i + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (done) {
          setDone(false);
          toTop();
        } else {
          go(i - 1);
        }
      } else if (e.key === "Home") {
        setDone(false);
        setI(0);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, i, done]);

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
    if (dx < 0) {
      go(i + 1);
    } else if (done) {
      setDone(false);
      toTop();
    } else {
      go(i - 1);
    }
  }

  const current = slides[i] as React.ReactElement<{ title?: string }>;
  const slideTitle = current?.props?.title;
  const nextWeek = weeks.find((w) => Number(w.num) === Number(weekNum) + 1);

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
          <ArrowIcon dir="left" />
          {weekNum}주차 · {weekTitle}
        </Link>
        <span className="font-display text-[0.95rem] font-medium text-(--ink-3) tabular-nums">
          {done ? (
            "완료"
          ) : (
            <>
              {String(i + 1).padStart(2, "0")}
              <span className="mx-1 opacity-50">/</span>
              {String(total).padStart(2, "0")}
            </>
          )}
        </span>
      </div>

      {/* 진행 바 */}
      <div
        className="h-[3px] w-full overflow-hidden rounded-full bg-(--border-2)"
        role="progressbar"
        aria-valuenow={done ? total : i + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-(--ink) transition-[width] duration-300"
          style={{ width: done ? "100%" : `${((i + 1) / total) * 100}%` }}
        />
      </div>

      {/* 본문 */}
      <section
        key={done ? "outro" : i}
        className="slide-in flex flex-1 flex-col justify-center py-10 sm:py-14"
        aria-live="polite"
      >
        {done ? (
          outro
        ) : (
          <>
            {slideTitle && (
              <h2 className="mb-7 text-[clamp(1.5rem,4.4vw,2.4rem)] leading-[1.2] font-semibold tracking-[-0.03em] text-(--ink)">
                {slideTitle}
              </h2>
            )}
            <div>{current}</div>
          </>
        )}
      </section>

      {/* 하단 — 마무리 화면에서는 세 갈래 이동으로 바뀐다 */}
      <div className="border-t border-(--border) pt-5">
        {done ? (
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-between">
            <button
              type="button"
              onClick={() => {
                setDone(false);
                setI(0);
                toTop();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-(--border) px-5 py-2.5 text-[0.88rem] font-medium text-(--ink) transition-colors hover:border-(--ink-3)"
            >
              <ArrowIcon dir="left" />
              {weekNum}주차로 돌아가기
            </button>

            <Link
              href="/#curriculum"
              className="inline-flex items-center rounded-full border border-(--border) px-5 py-2.5 text-[0.88rem] font-medium text-(--ink) transition-colors hover:border-(--ink-3)"
            >
              메인으로 돌아가기
            </Link>

            {nextWeek?.available ? (
              <Link
                href={`/week/${Number(nextWeek.num)}`}
                className="inline-flex items-center gap-2 rounded-full bg-(--chip-bg) px-5 py-2.5 text-[0.88rem] font-medium text-(--chip-ink) transition-transform hover:-translate-y-0.5"
              >
                {Number(nextWeek.num)}주차로 넘어가기
                <ArrowIcon dir="right" />
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-(--border) px-5 py-2.5 text-[0.88rem] font-medium text-(--ink-3)">
                {nextWeek
                  ? `${Number(nextWeek.num)}주차는 준비 중`
                  : "마지막 주차입니다"}
                <ArrowIcon dir="right" />
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
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
            <NavButton
              dir="next"
              label={i === total - 1 && outro ? "완료" : "다음"}
              solid={i === total - 1 && !!outro}
              disabled={i === total - 1 && !outro}
              onClick={() => go(i + 1)}
            />
          </div>
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
      {!isNext && <ArrowIcon dir="left" chevron />}
      <span className={isNext ? "" : "hidden sm:inline"}>{text}</span>
      {isNext && <ArrowIcon dir="right" chevron />}
    </button>
  );
}

function ArrowIcon({
  dir,
  chevron = false,
}: {
  dir: "left" | "right";
  chevron?: boolean;
}) {
  const left = chevron ? "M15 18l-6-6 6-6" : "M19 12H5M11 18l-6-6 6-6";
  const right = chevron ? "M9 18l6-6-6-6" : "M5 12h14M13 6l6 6-6 6";
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
      className="flex-none"
    >
      <path d={dir === "left" ? left : right} />
    </svg>
  );
}
