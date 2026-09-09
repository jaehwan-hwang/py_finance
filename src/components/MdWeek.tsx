"use client";

import SlideDeck, { Slide } from "./SlideDeck";
import MdBlocks from "./MdBlocks";
import { weeks, formatDate } from "@/constants/weeks";
import { withMath } from "@/lib/tex";
import type { WeekDoc } from "@/constants/weekDoc";

/** md 원문을 옮긴 주차 자료를 슬라이드로 그린다. */
export default function MdWeek({
  weekNum,
  doc,
}: {
  weekNum: number;
  doc: WeekDoc;
}) {
  const week = weeks.find((w) => Number(w.num) === weekNum);
  if (!week) return null;

  return (
    <SlideDeck
      weekNum={String(weekNum)}
      weekTitle={week.title}
      outro={
        <>
          <h2 className="text-[clamp(1.8rem,5.5vw,3rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-(--ink)">
            {doc.outroTitle}
          </h2>
          <div className="mt-6">
            <MdBlocks blocks={doc.outro} />
          </div>
        </>
      }
    >
      {/* 표지 */}
      <Slide>
        <p className="text-[1rem] font-medium text-(--ink-3)">
          {formatDate(week.date)}
        </p>
        <h1 className="mt-3 text-[clamp(2rem,7vw,3.8rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-(--ink)">
          {week.title}
        </h1>
        <p
          className="md mt-6 text-[1.02rem] leading-[1.7] font-medium text-(--ink-3)"
          dangerouslySetInnerHTML={{ __html: withMath(doc.sub) }}
        />
        <p
          className="md mt-6 max-w-[62ch] text-[1.02rem] leading-[1.85] text-(--ink-2)"
          dangerouslySetInnerHTML={{ __html: withMath(doc.lead) }}
        />
      </Slide>

      {doc.slides.map((s, n) => (
        <Slide key={n} title={s.title}>
          <MdBlocks blocks={s.blocks} />
        </Slide>
      ))}
    </SlideDeck>
  );
}
