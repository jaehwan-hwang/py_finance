/** 레퍼런스의 크림·스카이 확산 그라디언트. 화면 전체에 고정된다. */
export default function BlobBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: `
          radial-gradient(60vw 55vw at 82% -8%, var(--blob-a), transparent 62%),
          radial-gradient(52vw 48vw at 104% 34%, var(--blob-b), transparent 60%),
          radial-gradient(58vw 52vw at -12% 74%, var(--blob-c), transparent 62%),
          var(--ground)
        `,
      }}
    />
  );
}
