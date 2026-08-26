import type { Metadata } from "next";
import { Outfit, Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import { BlobBackground, Navbar } from "@/components";
import { SITE_NAME, SITE_SEO_DESC, TEAM_NAME } from "@/constants/site";
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
  description: SITE_SEO_DESC,
  openGraph: {
    title: SITE_NAME,
    description: SITE_SEO_DESC,
    siteName: `${SITE_NAME} · ${TEAM_NAME}`,
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* suppressHydrationWarning: 아래 인라인 스크립트가 하이드레이션 전에
       data-theme 을 붙이므로 서버 HTML과 달라지는 것이 정상이다. */
    <html lang="ko" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
