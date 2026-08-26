export const SITE_NAME = "PYTHON으로 알아보는 기초 금융공학";
export const SITE_SHORT = "기초 금융공학";
export const TEAM_NAME = "FORIF";
export const SEMESTER = "2026-2";
export const MENTOR_NAME = "멘토 황재환";

/** 화면에는 안 나온다. 검색 결과와 카톡·디스코드 링크 미리보기에만 쓰인다. */
export const SITE_SEO_DESC =
  "FORIF 8주 스터디. 파이썬을 처음부터 배우면서 복리·수익률·위험·포트폴리오를 직접 계산하고, 모의계좌로 집행해 봅니다.";

export const SITE_META = [
  { key: "Period", value: "2026.09.09 – 11.11 · 8주 (예정)" },
  { key: "When", value: "매주 수요일 16:00 – 18:00" },
  { key: "Where", value: "ITBT관 207호" },
  { key: "For", value: "파이썬과 기초 재무에 관심있는 누구든" },
];

/** FORIF 공식 사이트 — 상단 로고가 여기로 연결된다. */
export const FORIF_URL = "https://forif.org";

/* ═══════════════════════════════════════════════════════════════════════
   참고자료 — 링크·책 추천·추가 문법 등을 여기에 한 줄씩 추가하면
   홈의 REFERENCE 칸에 카드로 나옵니다. 비어 있으면 안내 문구만 나옵니다.

     { kind: '분류', title: '제목', desc: '한 줄 설명', href: '링크' }

   href 를 빼면 링크가 아닌 그냥 카드가 됩니다.
   ═══════════════════════════════════════════════════════════════════════ */
export interface RefItem {
  kind: string;
  title: string;
  desc: string;
  href?: string;
}

export const REFERENCES: RefItem[] = [];

export const MAIN_TAGS = ["Python", "Finance", "No experience needed"];

/** 스터디 운영 원칙 — 홈 화면 3원 */
export const PRINCIPLES = [
  {
    en: "Ladder",
    ko: "두 개의 사다리",
    desc: "매주 <b>파이썬 한 칸, 금융 한 칸</b>을 같이 올라갑니다. 그 주에 쓸 문법만 그 주에 배웁니다.",
  },
  {
    en: "Build",
    ko: "직접 만들기",
    desc: "정의대로 <b>직접 짜본 뒤</b> 라이브러리로 검증합니다. 숫자가 무엇인지 모르면 쓸 수 없기 때문입니다.",
  },
  {
    en: "Ship",
    ko: "실제로 굴리기",
    desc: "7주차에 <b>모의계좌로 실제 주문</b>을 넣고, 8주차에 근거를 댈 수 있는 내 포트폴리오를 만듭니다.",
  },
];
