import type { Block } from "./mdBlock";

/** files/weekN-*.md 원문을 슬라이드로 옮길 때 쓰는 규격.
 *  문장·순서·코드를 바꾸지 않는다. 슬라이드 단위로만 나눈다. */

export interface DocSlide {
  title?: string;
  blocks: Block[];
}

export interface WeekDoc {
  /** 표지 부제 — md 맨 위 인용구 */
  sub: string;
  /** 표지 도입 문단 */
  lead: string;
  slides: DocSlide[];
  /** 마무리 화면 (다음 주 예고 등) */
  outroTitle: string;
  outro: Block[];
}
