import { cookies } from "next/headers";

export { MENTOR_UI_COOKIE } from "./mentorCookie";

/** 멘토 열쇠를 담아두는 쿠키. 값 자체를 서버에서만 확인한다. */
export const MENTOR_COOKIE = "pf-mentor";
/** 1년 */
export const MENTOR_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * 이 요청이 멘토인가.
 *
 * MENTOR_KEY 환경변수가 없으면 아무도 통과하지 못한다.
 * 설정을 빠뜨렸을 때 전부 열려버리는 것보다 전부 잠기는 편이 안전하다.
 */
export async function isMentor(): Promise<boolean> {
  const key = process.env.MENTOR_KEY;
  if (!key) return false;

  const jar = await cookies();
  return jar.get(MENTOR_COOKIE)?.value === key;
}
