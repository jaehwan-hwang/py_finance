import { NextResponse } from "next/server";
import {
  MENTOR_COOKIE,
  MENTOR_UI_COOKIE,
  MENTOR_MAX_AGE,
} from "@/lib/mentor";

export const dynamic = "force-dynamic";

/**
 * 멘토 전용 입구.
 *
 *   /mentor?key=...   열쇠가 맞으면 쿠키를 심고 홈으로 보낸다
 *   /mentor?logout=1  쿠키를 지운다
 *
 * 열쇠는 MENTOR_KEY 환경변수에 둔다. 저장소에 적지 않는다.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const home = new URL("/", url.origin);

  if (url.searchParams.get("logout") !== null) {
    const res = NextResponse.redirect(home);
    res.cookies.delete(MENTOR_COOKIE);
    res.cookies.delete(MENTOR_UI_COOKIE);
    return res;
  }

  const key = process.env.MENTOR_KEY;
  const given = url.searchParams.get("key");

  if (!key || !given || given !== key) {
    // 열쇠가 틀리면 조용히 홈으로 보낸다. 맞았는지 알려주지 않는다.
    return NextResponse.redirect(home);
  }

  // Vercel 은 앞단에서 TLS 를 끊으므로 x-forwarded-proto 를 먼저 본다.
  // localhost(http) 에서도 쿠키가 오가야 개발 중에 확인할 수 있다.
  const proto =
    request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");

  const res = NextResponse.redirect(home);
  const opts = {
    maxAge: MENTOR_MAX_AGE,
    sameSite: "lax" as const,
    path: "/",
    secure: proto === "https",
  };

  res.cookies.set(MENTOR_COOKIE, key, { ...opts, httpOnly: true });
  // 홈 화면이 카드를 전부 열어 그리도록 하는 표시. 접근 통제는 서버가 한다.
  res.cookies.set(MENTOR_UI_COOKIE, "1", { ...opts, httpOnly: false });

  return res;
}
