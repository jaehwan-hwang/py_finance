export const SITE_NAME = "PYTHON으로 알아보는 기초 금융공학";
export const TEAM_NAME = "FORIF";

/** 배포 주소 — sitemap·robots·OG 이미지 경로의 기준이 된다. */
export const SITE_URL = "https://financepy.site";

/** 화면에는 안 나온다. 검색 결과와 카톡·디스코드 링크 미리보기에만 쓰인다. */
export const SITE_SEO_DESC =
  "FORIF 8주 스터디. 파이썬을 처음부터 배우면서 복리·수익률·위험·포트폴리오를 직접 계산하고, 모의계좌로 집행해 봅니다.";

export const SITE_META = [
  { key: "Period", value: "2026.09.16 – 11.18 · 8주 (예정)" },
  { key: "When", value: "매주 수요일 16:00 – 18:00" },
  { key: "Where", value: "ITBT관 207호" },
  { key: "For", value: "파이썬과 기초 재무에 관심있는 누구든" },
];

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
  /** 지은이 등 부가 정보 */
  by?: string;
  /** 표지 이미지. public/refs/ 아래에 두고 경로를 적는다 */
  cover?: string;
  coverW?: number;
  coverH?: number;
}

export const REFERENCES: RefItem[] = [
  {
    kind: "책",
    title: "파이썬을 이용한 퀀트 투자 포트폴리오 만들기",
    by: "이현열 · 제이펍",
    desc: "데이터 수집부터 종목 선정, 포트폴리오 구성, 증권사 API 자동매매까지 다룬다. 책의 코드는 깃허브에 공개되어 있다.",
    href: "https://github.com/hyunyulhenry/quant_py",
    cover: "/refs/quant-py.jpg",
    coverW: 396,
    coverH: 542,
  },
  {
    kind: "라이브러리",
    title: "NumPy",
    by: "위키백과",
    desc: "4주차부터 쓰는 수치 계산 라이브러리. 배열이 무엇이고 왜 리스트보다 빠른지, 어디서 나왔는지를 훑어보기 좋다.",
    href: "https://ko.wikipedia.org/wiki/NumPy",
  },
  {
    kind: "라이브러리",
    title: "pandas",
    by: "위키백과",
    desc: "3주차부터 쓰는 표 데이터 라이브러리. Series와 DataFrame이라는 이름이 어디서 왔는지 알고 쓰면 덜 헷갈린다.",
    href: "https://ko.wikipedia.org/wiki/Pandas",
  },
  {
    kind: "공식 문서",
    title: "NumPy: the absolute basics for beginners",
    desc: "배열 만들기·모양 바꾸기·연산을 처음부터 짚어주는 공식 입문 문서.",
    href: "https://numpy.org/doc/stable/user/absolute_beginners.html",
  },
  {
    kind: "공식 문서",
    title: "pandas: 10 minutes to pandas",
    desc: "3주차에서 배운 Series·DataFrame·인덱싱을 한 번에 복습할 수 있다. 한 번 정독할 가치가 있다.",
    href: "https://pandas.pydata.org/docs/user_guide/10min.html",
  },
];
