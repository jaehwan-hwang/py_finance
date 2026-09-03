"use client";

import { SlideDeck, Slide, CodeBlock } from "@/components";
import { weeks, formatDate } from "@/constants/weeks";
import { OS_GUIDES, type Block } from "@/constants/week1";

const W = weeks[0];

export default function Week1Content() {
  return (
    <SlideDeck
      weekNum={String(Number(W.num))}
      weekTitle={W.title}
      outro={
        <h2 className="text-[clamp(1.8rem,5.5vw,3rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-(--ink)">
          1주차 끝
        </h2>
      }
    >
      {/* 1 ── 표지 */}
      <Slide>
        <p className="text-[1rem] font-medium text-(--ink-3)">
          {formatDate(W.date)}
        </p>
        <h1 className="mt-3 text-[clamp(2rem,7vw,3.8rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-(--ink)">
          OT
        </h1>
        <ul className="mt-8 flex flex-col gap-2.5">
          {OS_GUIDES.map((g) => (
            <li key={g.os} className="flex gap-3 text-[1.02rem] text-(--ink-2)">
              <span
                aria-hidden="true"
                className="mt-[0.62em] h-1.5 w-1.5 flex-none rounded-full bg-(--ink-3)"
              />
              환경 세팅 — {g.os}
            </li>
          ))}
        </ul>
      </Slide>

      {/* 2~4 ── OS별 환경 세팅 (1주차_환경세팅.md 원문) */}
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
    </SlideDeck>
  );
}

/** 1주차_환경세팅.md 의 문단·목록·인용구·코드·출력을 원문 순서대로 그린다. */
function MdBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "p")
          return (
            <p
              key={i}
              className="md mt-3 text-[1rem] leading-[1.8] text-(--ink-2)"
              dangerouslySetInnerHTML={{ __html: b.text }}
            />
          );

        if (b.t === "h")
          return (
            <h4 key={i} className="mt-6 text-[1rem] font-semibold text-(--ink)">
              {b.text}
            </h4>
          );

        if (b.t === "note")
          return (
            <div
              key={i}
              className="md mt-4 border-l-[3px] border-(--border) pl-4 text-[0.96rem] leading-[1.8] text-(--ink-3)"
              dangerouslySetInnerHTML={{ __html: b.text }}
            />
          );

        if (b.t === "ol")
          return (
            <ol key={i} className="md mt-3 flex flex-col gap-2">
              {b.items.map((it, n) => (
                <li
                  key={n}
                  className="flex gap-3 text-[1rem] leading-[1.8] text-(--ink-2)"
                >
                  <span className="font-display flex-none text-(--ink-3) tabular-nums">
                    {n + 1}.
                  </span>
                  <span className="min-w-0">
                    <span dangerouslySetInnerHTML={{ __html: it.text }} />
                    {it.sub?.map((s, m) => (
                      <span
                        key={m}
                        className="mt-1.5 block text-[0.95rem] text-(--ink-3)"
                        dangerouslySetInnerHTML={{ __html: s }}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          );

        if (b.t === "ul")
          return (
            <ul key={i} className="md mt-3 flex flex-col gap-2">
              {b.items.map((it, n) => (
                <li
                  key={n}
                  className="flex gap-3 text-[1rem] leading-[1.8] text-(--ink-2)"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.7em] h-1.5 w-1.5 flex-none rounded-full bg-(--ink-3)"
                  />
                  <span dangerouslySetInnerHTML={{ __html: it }} />
                </li>
              ))}
            </ul>
          );

        if (b.t === "out")
          return (
            <pre
              key={i}
              className="scroll-x mt-4 rounded-[12px] border border-(--border-2) bg-(--surface-2) px-4 py-3.5 font-mono text-[0.85rem] leading-[1.8] whitespace-pre text-(--ink-2)"
            >
              {b.text}
            </pre>
          );

        return <CodeBlock key={i} code={b.code} lang={b.lang ?? "bash"} />;
      })}
    </>
  );
}
