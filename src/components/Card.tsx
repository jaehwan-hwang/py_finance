export default function Card({
  children,
  className = "",
  soft = false,
}: {
  children: React.ReactNode;
  className?: string;
  soft?: boolean;
}) {
  return (
    <div
      className={`rounded-[18px] border border-(--border) p-6 ${className}`}
      style={
        soft
          ? {
              background:
                "linear-gradient(180deg, var(--surface), var(--accent-wash))",
              boxShadow: "var(--shadow)",
            }
          : { background: "var(--surface)", boxShadow: "var(--shadow)" }
      }
    >
      {children}
    </div>
  );
}
