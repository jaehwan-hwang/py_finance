"use client";

import SlideDeck, { Slide } from "./SlideDeck";
import CodeBlock from "./CodeBlock";
import Callout from "./Callout";
import { weeks, formatDate } from "@/constants/weeks";
import type { SlideData, WeekContent } from "@/constants/weekContent";

/**
 * 데이터만으로 주차 슬라이드를 만든다.
 * 특별한 화면이 필요한 주차(예: 1주차 OS 탭)는 전용 컴포넌트를 따로 둔다.
 */
export default function WeekSlides({
  weekNum,
  content,
}: {
  weekNum: number;
  content: WeekContent;
}) {
  const week = weeks.find((w) => Number(w.num) === weekNum);
  if (!week) return null;

  return (
    <SlideDeck
      weekNum={String(weekNum)}
      weekTitle={week.title}
      outro={<Outro content={content} />}
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
          className="mt-6 max-w-[46ch] text-[1.05rem] leading-[1.75] text-(--ink-2)"
          dangerouslySetInnerHTML={{ __html: content.cover.lead }}
        />
        <div className="mt-8 rounded-[18px] border border-(--border) bg-(--surface) p-6">
          <p className="text-[0.9rem] font-medium text-(--ink-3)">오늘의 목표</p>
          <p className="mt-1.5 text-[1.15rem] font-semibold text-(--ink)">
            {content.cover.goal}
          </p>
        </div>
      </Slide>

      {content.slides.map((s, n) => (
        <Slide key={n} title={s.title}>
          <SlideBody data={s} />
        </Slide>
      ))}
    </SlideDeck>
  );
}

function SlideBody({ data }: { data: SlideData }) {
  return (
    <>
      {data.lead && (
        <p
          className="text-[1.02rem] leading-[1.85] text-(--ink-2)"
          dangerouslySetInnerHTML={{ __html: data.lead }}
        />
      )}

      {data.bullets && (
        <ul className="mt-5 flex flex-col gap-3">
          {data.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-[1rem] leading-[1.75] text-(--ink-2)">
              <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 flex-none rounded-full bg-(--ink-3)" />
              <span dangerouslySetInnerHTML={{ __html: b }} />
            </li>
          ))}
        </ul>
      )}

      {data.codes?.map((c, i) => (
        <CodeBlock key={i} code={c.code} lang={c.lang ?? "python"} caption={c.caption} />
      ))}

      {data.table && (
        <div className="scroll-x mt-5 rounded-[16px] border border-(--border)">
          <table className="w-full border-collapse text-left text-[0.95rem]">
            <thead>
              <tr className="border-b border-(--border) bg-(--surface-2)">
                {data.table.head.map((h) => (
                  <th key={h} className="px-5 py-3 text-[0.85rem] font-semibold text-(--ink-3)">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.table.rows.map((row, i) => (
                <tr key={i} className="border-b border-(--border-2) last:border-0">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-5 py-3 ${
                        j === 0 ? "font-medium whitespace-nowrap text-(--ink)" : "text-(--ink-2)"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.cards && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.cards.map((c) => (
            <div
              key={c.title}
              className="rounded-[16px] border border-(--border) bg-(--surface) p-5"
            >
              <p className="text-[1.05rem] font-semibold text-(--ink)">{c.title}</p>
              <p
                className="mt-2 text-[0.95rem] leading-[1.75] text-(--ink-3)"
                dangerouslySetInnerHTML={{ __html: c.body }}
              />
            </div>
          ))}
        </div>
      )}

      {data.callout && (
        <Callout kind={data.callout.kind} title={data.callout.title}>
          <span dangerouslySetInnerHTML={{ __html: data.callout.body }} />
        </Callout>
      )}
    </>
  );
}

function Outro({ content }: { content: WeekContent }) {
  return (
    <>
      <h2 className="text-[clamp(1.8rem,5.5vw,3rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-(--ink)">
        오늘 배운 것
      </h2>

      <ol className="mt-8 flex flex-col gap-3.5">
        {content.summary.map((s, n) => (
          <li
            key={s}
            className="flex gap-4 rounded-[16px] border border-(--border) bg-(--surface) p-5"
          >
            <span className="font-display text-[1.1rem] font-medium text-(--ink-3) tabular-nums">
              {String(n + 1).padStart(2, "0")}
            </span>
            <span className="text-[1.02rem] leading-[1.7] text-(--ink-2)">{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-[16px] border border-(--border) bg-(--surface-2) p-5">
        <p className="text-[0.95rem] font-semibold text-(--ink)">다음 주 예고</p>
        <p
          className="mt-2 text-[0.96rem] leading-[1.75] text-(--ink-2)"
          dangerouslySetInnerHTML={{ __html: content.nextPreview }}
        />
      </div>
    </>
  );
}
