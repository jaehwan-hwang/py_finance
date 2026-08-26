import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeProvider";
import { FORIF_URL } from "@/constants/site";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-(--border) backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--ground) 82%, transparent)" }}
    >
      <div className="mx-auto flex h-20 max-w-[1200px] items-center gap-6 px-5 sm:h-22 sm:px-10">
        <a
          href={FORIF_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="FORIF 공식 사이트로 이동"
          className="flex items-center gap-3 transition-opacity hover:opacity-70"
        >
          <Image
            src="/foxCircleBlue.svg"
            alt=""
            width={44}
            height={44}
            priority
            className="h-9 w-9 sm:h-11 sm:w-11"
          />
          <Image
            src="/forif_wordmark.png"
            alt="FORIF"
            width={2274}
            height={1056}
            priority
            className="forif-wordmark h-8 w-auto sm:h-[42px]"
          />
        </a>
        <nav className="ml-auto flex flex-wrap items-center gap-1">
          <Link
            href="/#curriculum"
            className="rounded-full px-3.5 py-2 text-[0.95rem] text-(--ink-2) transition-colors hover:bg-(--surface-2) hover:text-(--ink)"
          >
            커리큘럼
          </Link>
          <Link
            href="/#reference"
            className="rounded-full px-3.5 py-2 text-[0.95rem] text-(--ink-2) transition-colors hover:bg-(--surface-2) hover:text-(--ink)"
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
