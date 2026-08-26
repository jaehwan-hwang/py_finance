import type { Metadata } from "next";
import { Outfit, Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import { BlobBackground, Navbar } from "@/components";
import { SITE_NAME, SITE_DESC, TEAM_NAME } from "@/constants/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    siteName: `${SITE_NAME} · ${TEAM_NAME}`,
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* 저장된 테마를 첫 페인트 전에 적용한다.
            이게 없으면 다크를 고른 사람도 새로고침마다 흰 화면이 번쩍인다. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('pf-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${noto.variable} ${jetbrains.variable} antialiased`}
      >
        <BlobBackground />
        <Navbar />
        {children}
        <footer className="mt-24 border-t border-(--border) py-11 text-[0.85rem] text-(--ink-3)">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-5 sm:px-10">
            <span>{SITE_NAME} · ITBT관 207호</span>
            <span className="font-mono text-[0.75rem] tracking-[0.08em] uppercase">
              {TEAM_NAME} · 2026 가을
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
