type Kind = "tip" | "warn" | "note";

const STYLE: Record<Kind, { label: string; accent: string }> = {
  tip: { label: "이렇게 하세요", accent: "var(--accent)" },
  warn: { label: "여기서 틀리기 쉽습니다", accent: "#d97706" },
  note: { label: "알아두기", accent: "var(--ink-3)" },
};

export default function Callout({
  kind = "note",
  title,
  children,
}: {
  kind?: Kind;
  title?: string;
  children: React.ReactNode;
}) {
  const s = STYLE[kind];
  return (
    <div
      className="my-6 rounded-[14px] border border-(--border) bg-(--surface-2) p-5"
      style={{ borderLeft: `3px solid ${s.accent}` }}
    >
      <div
        className="mb-2 font-mono text-[0.7rem] tracking-[0.09em] uppercase"
        style={{ color: s.accent }}
      >
        {title ?? s.label}
      </div>
      <div className="prose-ko text-[0.94rem] leading-[1.75] text-(--ink-2)">
        {children}
      </div>
    </div>
  );
}
