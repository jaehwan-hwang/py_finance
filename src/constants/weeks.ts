/* ═══════════════════════════════════════════════════════════════════════
   ▼▼▼ 매주 여기를 고칩니다 ▼▼▼

   수업이 끝나면 해당 주차의  available 을  false → true  로 바꾸세요.
   그러면 홈 화면 카드가 열리고 /week/2 페이지로 들어갈 수 있게 됩니다.

   ▲▲▲ 매주 여기를 고칩니다 ▲▲▲
   ═══════════════════════════════════════════════════════════════════════ */

export interface WeekMeta {
  num: string;
  /** 수업 날짜 (YYYY-MM-DD) — D-day 계산에 쓴다 */
  date: string;
  title: string;
  desc: string;
  /** 함께 배우는 파이썬 문법 */
  python: string[];
  /** 덤으로 알아두면 좋은 것 */
  bonus: string;
  /** true 가 되면 주차 페이지가 열린다 */
  available: boolean;
}

export const weeks: WeekMeta[] = [
  {
    num: "01",
    date: "2026-09-09",
    title: "환경 구축",
    desc: "OS별 환경설정과 8주 방향 설명. 삼성전자 10년 주가 그래프를 내 화면에 띄우는 것이 오늘의 결승선입니다.",
    python: ["변수·자료형", "print", "주석"],
    bonus: "Jupyter 단축키, 가상환경(venv) 개념",
    available: true,
  },
  {
    num: "02",
    date: "2026-09-16",
    title: "화폐의 시간가치",
    desc: "복리, 연속복리, NPV, IRR. 반복문으로 복리 계산기를 직접 만듭니다.",
    python: ["if", "for / while", "def"],
    bonus: "f-string으로 결과 깔끔하게 출력하기",
    available: true,
  },
  {
    num: "03",
    date: "2026-09-23",
    title: "수익률과 금융 데이터",
    desc: "로그수익률을 이해하고, 실제 주가 데이터를 코드로 가져옵니다.",
    python: ["리스트·딕셔너리", "import", "pandas DataFrame"],
    bonus: "try/except로 데이터를 못 가져올 때 대비하기",
    available: true,
  },
  {
    num: "04",
    date: "2026-10-14",
    title: "위험을 재는 법",
    desc: "변동성, CAGR, 샤프지수, MDD. 수익률 1위와 샤프 1위와 MDD 1위가 전부 다르다는 것을 눈으로 확인합니다.",
    python: ["mean / std / rolling", "numpy 배열 연산"],
    bonus: "리스트 컴프리헨션으로 코드 간결하게 쓰기",
    available: true,
  },
  {
    num: "05",
    date: "2026-10-21",
    title: "자산 간의 관계",
    desc: "공분산, 상관계수, 베타, CAPM. 상관계수가 낮으면 왜 위험이 줄어드는지 코드로 확인합니다.",
    python: ["딕셔너리로 다중 자산 관리", "matplotlib 기초"],
    bonus: "zip()으로 여러 리스트 한 번에 다루기",
    available: true,
  },
  {
    num: "06",
    date: "2026-10-28",
    title: "포트폴리오 최적화",
    desc: "효율적 투자선. 비중을 1만 세트 뿌려보면 왜 우산 모양이 나오는지 직접 그려봅니다.",
    python: ["numpy 행렬연산", "몬테카를로 시뮬레이션", "scipy.optimize"],
    bonus: "코드 실행 시간 측정 (%timeit)",
    available: true,
  },
  {
    num: "07",
    date: "2026-11-04",
    title: "모의계좌로 포트폴리오 집행",
    desc: "6주간 만든 것을 조립해 모의계좌에 실제 주문을 넣습니다. 모든 주문은 dry_run으로 먼저 확인합니다.",
    python: ["함수 모듈화", "csv 파일 입출력"],
    bonus: "클래스(class) 맛보기",
    available: true,
  },
  {
    num: "08",
    date: "2026-11-11",
    title: "나만의 포트폴리오",
    desc: "각자 조사하고, 만들고, 설명합니다. 내 포트폴리오가 실패할 조건 3가지를 말할 수 있으면 8주를 제대로 보낸 것입니다.",
    python: ["문법 총정리", "코드 리팩토링"],
    bonus: "깃허브에 결과물 올려보기 (git 기초)",
    available: false,
  },
];

const KO_DAY = "일월화수목금토";

/** '9월 9일 (수)' 형태로 바꾼다 */
export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${KO_DAY[d.getDay()]})`;
}

/** 오늘 기준 아직 지나지 않은 가장 가까운 주차 */
export function findNextWeek(today: Date = new Date()): WeekMeta | undefined {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  return weeks.find((w) => new Date(w.date + "T00:00:00") >= t);
}

/** 남은 일수 (0 이면 당일) */
export function daysUntil(iso: string, today: Date = new Date()): number {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso + "T00:00:00").getTime() - t.getTime()) / 86400000);
}
