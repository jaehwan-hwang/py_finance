export default function SectionTitle({
  en,
  ko,
  id,
}: {
  en: string;
  ko?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="mb-8 flex flex-wrap items-end gap-x-8 gap-y-3 sm:mb-12"
    >
      <h2 className="font-display text-[clamp(1.9rem,5vw,3.2rem)] font-medium tracking-[-0.03em] text-(--ink)">
        {en}
      </h2>
      {ko && <p className="pb-2 text-sm text-(--ink-3)">{ko}</p>}
    </div>
  );
}
