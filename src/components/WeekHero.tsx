import Link from "next/link";
import Tag from "./Tag";

export default function WeekHero({
  num,
  date,
  title,
  desc,
  python,
  bonus,
}: {
  num: string;
  date: string;
  title: string;
  desc: string;
  python: string[];
  bonus: string;
}) {
  return (
    <header className="pt-10 pb-12 sm:pt-16 sm:pb-16">
      <Link
        href="/#curriculum"
        className="font-mono text-[0.75rem] text-(--ink-3) transition-colors hover:text-(--ink)"
      >
        ← 커리큘럼
      </Link>

      <div className="mt-6 flex items-center gap-3 font-mono text-[0.8rem] text-(--ink-3) tabular-nums">
        <span className="grid h-8 min-w-14 place-items-center rounded-full border border-(--border) px-3">
          {num}
        </span>
        <span>{date}</span>
      </div>

      <h1 className="mt-5 text-[clamp(2rem,6vw,3.6rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-(--ink)">
        {title}
      </h1>

      <p className="mt-5 max-w-[62ch] text-[1.02rem] leading-[1.75] text-(--ink-2)">
        {desc}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-2.5 font-mono text-[0.7rem] tracking-[0.09em] text-(--ink-3) uppercase">
            함께 배우는 파이썬
          </div>
          <div className="flex flex-wrap gap-1.5">
            {python.map((p) => (
              <Tag key={p}>{p}</Tag>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2.5 font-mono text-[0.7rem] tracking-[0.09em] text-(--ink-3) uppercase">
            덤으로 알아두면 좋은 것
          </div>
          <p className="text-[0.92rem] text-(--ink-2)">{bonus}</p>
        </div>
      </div>
    </header>
  );
}
