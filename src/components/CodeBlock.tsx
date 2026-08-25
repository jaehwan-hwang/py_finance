"use client";

import { useState } from "react";

export default function CodeBlock({
  code,
  lang = "python",
  caption,
}: {
  code: string;
  lang?: string;
  caption?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* 클립보드가 막힌 환경에서는 조용히 넘어간다 */
    }
  }

  return (
    <figure className="my-5">
      <div className="relative rounded-[14px] border border-(--border-2) bg-(--surface-2)">
        <div className="flex items-center justify-between border-b border-(--border-2) px-4 py-2">
          <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-(--ink-3)">
            {lang}
          </span>
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-(--border) px-2.5 py-1 font-mono text-[0.68rem] text-(--ink-3) transition-colors hover:text-(--ink)"
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
        <div className="scroll-x">
          <pre className="m-0 px-4 py-4 font-mono text-[0.8rem] leading-[1.85] whitespace-pre text-(--ink-2)">
            {code}
          </pre>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[0.82rem] text-(--ink-3)">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
