import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-[900px] flex-col justify-center px-5 pb-20 sm:min-h-[calc(100dvh-88px)] sm:px-10">
      <p className="font-display text-[0.95rem] font-medium tracking-[0.08em] text-(--ink-3)">
        404
      </p>
      <h1 className="mt-4 text-[clamp(1.8rem,5.5vw,3rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-(--ink)">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-5 max-w-[46ch] text-[1.02rem] leading-[1.8] text-(--ink-2)">
        주소가 잘못되었거나, 아직 열리지 않은 주차일 수 있습니다. 수업이 끝난
        주차부터 차례로 열립니다.
      </p>

      <div className="mt-9 flex flex-wrap gap-2.5">
        <Link
          href="/#curriculum"
          className="inline-flex items-center rounded-full bg-(--chip-bg) px-5 py-2.5 text-[0.88rem] font-medium text-(--chip-ink) transition-transform hover:-translate-y-0.5"
        >
          커리큘럼 보기
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-(--border) px-5 py-2.5 text-[0.88rem] font-medium text-(--ink) transition-colors hover:border-(--ink-3)"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
