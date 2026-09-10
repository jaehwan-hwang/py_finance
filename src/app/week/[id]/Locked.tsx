import Link from "next/link";
import { formatDate, openAt, type WeekMeta } from "@/constants/weeks";

/** 아직 수업하지 않은 주차. 언제 열리는지만 알려준다. */
export default function Locked({ week }: { week: WeekMeta }) {
  const opens = openAt(week.date);
  const days = Math.ceil((opens.getTime() - Date.now()) / 86400000);

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-[900px] flex-col justify-center px-5 pb-20 sm:min-h-[calc(100dvh-88px)] sm:px-10">
      <p className="font-display text-[0.95rem] font-medium tracking-[0.08em] text-(--ink-3)">
        {Number(week.num)}주차
      </p>

      <h1 className="mt-4 text-[clamp(1.8rem,5.5vw,3rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-(--ink)">
        {week.title}
      </h1>

      <p className="mt-5 max-w-[48ch] text-[1.02rem] leading-[1.8] text-(--ink-2)">
        아직 열리지 않은 주차입니다. 자료는 수업 시간에 맞춰 공개되고, 한 번
        열린 주차는 계속 볼 수 있습니다.
      </p>

      <div className="mt-8 inline-flex w-fit flex-wrap items-center gap-x-4 gap-y-1 rounded-[16px] border border-(--border) bg-(--surface) px-5 py-4">
        <span className="text-[0.9rem] text-(--ink-3)">공개</span>
        <span className="text-[1.02rem] font-medium text-(--ink)">
          {formatDate(week.date)} 16:00
        </span>
        {days > 0 && (
          <span className="font-display text-[0.95rem] font-medium text-(--ink-3) tabular-nums">
            D-{days}
          </span>
        )}
      </div>

      <div className="mt-9 flex flex-wrap gap-2.5">
        <Link
          href="/#curriculum"
          className="inline-flex items-center rounded-full bg-(--chip-bg) px-5 py-2.5 text-[0.88rem] font-medium text-(--chip-ink) transition-transform hover:-translate-y-0.5"
        >
          열린 주차 보기
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
