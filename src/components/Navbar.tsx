import Link from "next/link";
import ThemeToggle from "./ThemeProvider";
import { SITE_SHORT, SEMESTER } from "@/constants/site";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-(--border) backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--ground) 82%, transparent)" }}
    >
      <div className="mx-auto flex h-15 max-w-[1200px] items-center gap-6 px-5 sm:px-10">
        <Link
          href="/"
          className="font-mono text-[0.75rem] tracking-[0.08em] whitespace-nowrap text-(--ink-3) uppercase transition-colors hover:text-(--ink)"
        >
          {SITE_SHORT} · {SEMESTER}
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
