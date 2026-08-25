"use client";

import { useEffect, useState } from "react";

/** localStorage 가 막힌 환경(iframe 등)에서도 죽지 않게 감싼다. */
const store = {
  get(k: string) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* 저장만 생략 */
    }
  },
};

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = store.get("pf-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    setMounted(true);
  }, []);

  function toggle() {
    const el = document.documentElement;
    const current = el.getAttribute("data-theme");
    const isDark =
      current === "dark" ||
      (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    el.setAttribute("data-theme", next);
    store.set("pf-theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="밝은 화면과 어두운 화면 전환"
      className="grid h-9 w-9 place-items-center rounded-full border border-(--border) bg-(--surface) text-(--ink-3) transition-colors hover:text-(--ink)"
    >
      {/* 마운트 전에는 아이콘만 비워 깜빡임을 막는다 */}
      {mounted && (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
