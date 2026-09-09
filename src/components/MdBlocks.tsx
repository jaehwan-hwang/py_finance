"use client";

import CodeBlock from "./CodeBlock";
import Quiz from "./Quiz";
import type { Block } from "@/constants/mdBlock";
import { tex, withMath } from "@/lib/tex";

/** md 원문의 문단·목록·인용구·코드·출력·표·문제를 순서대로 그린다. */
export default function MdBlocks({
  blocks,
  headingLevel = 3,
}: {
  blocks: Block[];
  /** 이 블록들이 놓이는 자리의 제목 단계. 슬라이드 제목이 h2이므로 기본 3. */
  headingLevel?: 3 | 4;
}) {
  const H = (headingLevel === 4 ? "h4" : "h3") as "h3" | "h4";
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "p")
          return (
            <p
              key={i}
              className="md mt-3 text-[1rem] leading-[1.8] text-(--ink-2)"
              dangerouslySetInnerHTML={{ __html: withMath(b.text) }}
            />
          );

        if (b.t === "h")
          return (
            <H key={i} className="mt-7 text-[1.02rem] font-semibold text-(--ink)">
              {b.text}
            </H>
          );

        if (b.t === "note")
          return (
            <div
              key={i}
              className="md mt-4 border-l-[3px] border-(--border) pl-4 text-[0.96rem] leading-[1.8] text-(--ink-3)"
              dangerouslySetInnerHTML={{ __html: withMath(b.text) }}
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
                    <span dangerouslySetInnerHTML={{ __html: withMath(it.text) }} />
                    {it.sub?.map((s, m) => (
                      <span
                        key={m}
                        className="mt-1.5 block text-[0.95rem] text-(--ink-3)"
                        dangerouslySetInnerHTML={{ __html: withMath(s) }}
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
                  <span dangerouslySetInnerHTML={{ __html: withMath(it) }} />
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

        if (b.t === "table")
          return (
            <div
              key={i}
              className="scroll-x mt-5 rounded-[16px] border border-(--border)"
            >
              <table className="w-full border-collapse text-left text-[0.95rem]">
                <thead>
                  <tr className="border-b border-(--border) bg-(--surface-2)">
                    {b.head.map((h, n) => (
                      <th
                        key={n}
                        className="px-5 py-3 text-[0.85rem] font-semibold text-(--ink-3)"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, n) => (
                    <tr key={n} className="border-b border-(--border-2) last:border-0">
                      {row.map((cell, m) => (
                        <td
                          key={m}
                          className={`md px-5 py-3 ${
                            m === 0
                              ? "font-medium whitespace-nowrap text-(--ink)"
                              : "text-(--ink-2)"
                          }`}
                          dangerouslySetInnerHTML={{ __html: withMath(cell) }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        if (b.t === "math")
          return (
            <div
              key={i}
              className="scroll-x mt-5 py-1 text-center text-(--ink)"
              dangerouslySetInnerHTML={{ __html: tex(b.tex, true) }}
            />
          );

        if (b.t === "quiz") return <Quiz key={i} data={b} />;

        return <CodeBlock key={i} code={b.code} lang={b.lang ?? "bash"} />;
      })}
    </>
  );
}
