"use client";

/** OS 3종 전환처럼 갈래가 나뉘는 내용에 쓴다. */
export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: number;
  onTabChange: (i: number) => void;
}) {
  return (
    <div
      role="tablist"
      className="mb-6 flex gap-1 border-b border-(--border)"
    >
      {tabs.map((t, i) => (
        <button
          key={t}
          role="tab"
          type="button"
          aria-selected={i === activeTab}
          onClick={() => onTabChange(i)}
          className="-mb-px border-b-2 px-4 py-2.5 text-[0.92rem] font-medium transition-colors"
          style={
            i === activeTab
              ? { borderColor: "var(--ink)", color: "var(--ink)" }
              : { borderColor: "transparent", color: "var(--ink-3)" }
          }
        >
          {t}
        </button>
      ))}
    </div>
  );
}
