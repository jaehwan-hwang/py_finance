import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeProvider";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-(--border) backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--ground) 82%, transparent)" }}
    >
      <div className="mx-auto flex h-15 max-w-[1200px] items-center gap-6 px-5 sm:px-10">
        <Link
          href="/"
          aria-label="FORIF 홈"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
        >
          <Image
            src="/foxCircleBlue.svg"
            alt=""
            width={28}
            height={28}
            priority
          />
          <Image
            src="/forif_wordmark.png"
            alt="FORIF"
            width={2274}
            height={1056}
            priority
            className="forif-wordmark h-[21px] w-auto"
          />
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-1">
          <Link
            href="/#curriculum"
            className="rounded-full px-3 py-1.5 text-sm text-(--ink-2) transition-colors hover:bg-(--surface-2) hover:text-(--ink)"
          >
            커리큘럼
          </Link>
          <Link
            href="/#setup"
            className="hidden rounded-full px-3 py-1.5 text-sm text-(--ink-2) transition-colors hover:bg-(--surface-2) hover:text-(--ink) sm:block"
          >
            환경 설정
          </Link>
          <Link
            href="/#refs"
            className="hidden rounded-full px-3 py-1.5 text-sm text-(--ink-2) transition-colors hover:bg-(--surface-2) hover:text-(--ink) sm:block"
          >
            참고자료
          </Link>
          <span className="ml-1">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
