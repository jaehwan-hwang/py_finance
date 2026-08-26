/* ═══════════════════════════════════════════════════════════════════════
   주차 콘텐츠 규격

   week2.ts ~ week7.ts 는 이 모양으로만 쓰면 슬라이드가 자동으로 만들어집니다.
   컴포넌트를 새로 짤 필요가 없습니다.

   한 슬라이드에 아래 항목을 원하는 만큼 섞어 쓰면 되고,
   적힌 순서(문단 → 목록 → 코드 → 표 → 카드 → 강조박스)대로 배치됩니다.
   본문에는 <b>굵게</b> 만 쓸 수 있습니다.
   ═══════════════════════════════════════════════════════════════════════ */

export interface CodeSpec {
  code: string;
  lang?: string;
  caption?: string;
}

export interface SlideData {
  /** 슬라이드 제목 (표지 슬라이드는 비워 둔다) */
  title?: string;
  /** 도입 문단 */
  lead?: string;
  /** 점 목록 */
  bullets?: string[];
  /** 코드 블록. 여러 개면 순서대로 */
  codes?: CodeSpec[];
  /** 표 */
  table?: { head: string[]; rows: string[][] };
  /** 나란히 놓는 카드 */
  cards?: { title: string; body: string }[];
  /** 강조 박스 */
  callout?: { kind: "tip" | "warn" | "note"; title: string; body: string };
}

export interface WeekContent {
  /** 표지 — 주차 제목 아래에 붙는 한 문단과 오늘의 목표 */
  cover: { lead: string; goal: string };
  slides: SlideData[];
  /** 마무리 화면의 "오늘 배운 것" 3줄 */
  summary: string[];
  /** 마무리 화면의 다음 주 예고 */
  nextPreview: string;
}
