import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeProvider";
import Wordmark from "./Wordmark";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-(--border) backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--ground) 82%, transparent)" }}
    >
      {/* 한 줄을 넘기지 않는다. 좁은 화면에서 테마 버튼이 아래로 떨어지면
          상단 바가 두 줄이 되면서 본문이 밀린다. */}
      <div className="mx-auto flex h-20 max-w-[1200px] flex-nowrap items-center gap-3 px-5 sm:h-22 sm:gap-6 sm:px-10">
        <Link
          href="/"
          aria-label="PYTHON으로 알아보는 기초 금융공학 홈"
          className="flex flex-none items-center gap-2.5 transition-opacity hover:opacity-70 sm:gap-3"
        >
          <Image
            src="/foxCircleBlue.svg"
            alt=""
            width={44}
            height={44}
            priority
            className="h-8 w-8 sm:h-11 sm:w-11"
          />
          <Wordmark className="h-[22px] w-auto text-(--ink) sm:h-[34px]" />
        </Link>

        <nav className="ml-auto flex flex-none items-center sm:gap-1">
          <Link
            href="/#curriculum"
            className="rounded-full px-2 py-2 text-[0.86rem] whitespace-nowrap text-(--ink-2) transition-colors hover:bg-(--surface-2) hover:text-(--ink) sm:px-3.5 sm:text-[0.95rem]"
          >
            커리큘럼
          </Link>
          <Link
            href="/#reference"
            className="rounded-full px-2 py-2 text-[0.86rem] whitespace-nowrap text-(--ink-2) transition-colors hover:bg-(--surface-2) hover:text-(--ink) sm:px-3.5 sm:text-[0.95rem]"
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
