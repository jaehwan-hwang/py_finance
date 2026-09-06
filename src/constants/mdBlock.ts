/** md 문서를 슬라이드에 그대로 옮길 때 쓰는 블록 규격.
 *  문단 / 목록 / 인용구 / 소제목 / 코드 / 출력 / 표 / 문제 */

/** 빈칸 하나. accept 에 적은 값 중 하나와 맞으면 정답으로 친다. */
export interface Blank {
  label: string;
  accept: string[];
}

export interface QuizBlock {
  t: "quiz";
  /** 문제 번호 — Q1, Q2 … */
  no: string;
  q: string;
  /** 문제에 딸린 코드 */
  code?: string;

  /* ── 객관식 ── */
  options?: string[];
  /** 정답 번호(1부터). 두 개 이상이면 '모두 고르시오' 문제가 된다. */
  correct?: number[];

  /* ── 빈칸 채우기 ── */
  blanks?: Blank[];

  /* ── 단답 · 출력 결과 ── */
  input?: {
    label?: string;
    /** 허용하는 정답들. 표기가 달라도 되도록 여러 개 적는다. */
    accept: string[];
    /** 여러 줄 입력 (출력 결과처럼) */
    multiline?: boolean;
    placeholder?: string;
  };

  /** 채점 후 보여줄 해설 */
  explain: string;
  explainCode?: string;
}

export type Block =
  | { t: "p"; text: string }
  | { t: "ol"; items: { text: string; sub?: string[] }[] }
  | { t: "ul"; items: string[] }
  | { t: "note"; text: string }
  | { t: "h"; text: string }
  | { t: "code"; code: string; lang?: string }
  | { t: "out"; text: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | QuizBlock;
