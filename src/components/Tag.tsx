export default function Tag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "solid" | "outline";
}) {
  if (variant === "solid") {
    return (
      <span className="inline-flex items-center rounded-full bg-(--chip-bg) px-3 py-1 text-xs font-semibold text-(--chip-ink)">
        {children}
      </span>
    );
  }
  if (variant === "outline") {
    return (
      <span className="inline-flex items-center rounded-full border border-(--border) px-3 py-1 text-xs font-semibold text-(--ink-3)">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-(--border-2) bg-(--surface-2) px-2.5 py-1 font-mono text-[0.7rem] text-(--ink-3)">
      {children}
    </span>
  );
}
