export default function StepItem({
  num,
  title,
  children,
  last = false,
}: {
  num: number | string;
  title: string;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-4 pb-6">
      {!last && (
        <span
          aria-hidden="true"
          className="absolute top-8 left-[15px] w-px"
          style={{ bottom: 0, background: "var(--border)" }}
        />
      )}
      <span className="z-1 grid h-8 w-8 flex-none place-items-center rounded-full border border-(--border) bg-(--ground) font-mono text-[0.78rem] text-(--ink-2)">
        {num}
      </span>
      <div className="min-w-0 pt-0.5">
        <h4 className="text-[1rem] font-semibold text-(--ink)">{title}</h4>
        {children && (
          <div className="prose-ko mt-1.5 text-[0.92rem] leading-[1.75] text-(--ink-3)">
            {children}
          </div>
        )}
      </div>
    </li>
  );
}
