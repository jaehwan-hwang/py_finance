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
    date: "2026-09-16",
    title: "OT",
    desc: "Windows·MacOS·Linux 환경 세팅. NumPy와 Pandas가 잘 돌아가는지 확인합니다.",
    python: ["Python 설치", "venv", "VSCode"],
    bonus: "NumPy · Pandas 설치와 test.py 실행",
    available: true,
  },
  {
    num: "02",
    date: "2026-09-23",
    title: "화폐의 시간가치",
    desc: "복리 · 연속복리 · NPV · IRR. 조건문과 반복문, 함수로 직접 구현합니다.",
    python: ["조건문 (if)", "반복문 (for / while)", "함수 (def)"],
    bonus: "이분법으로 IRR 구하기",
    available: true,
  },
  {
    num: "03",
    date: "2026-09-30",
    title: "수익률과 금융 데이터",
    desc: "단순수익률과 로그수익률. 실제 주가 데이터를 받아 pandas로 다룹니다.",
    python: ["리스트", "딕셔너리", "라이브러리 임포트"],
    bonus: "pandas Series · DataFrame · .shift()",
    available: true,
  },
  {
    num: "04",
    date: "2026-10-21",
    title: "위험을 재는 법",
    desc: "변동성 · CAGR · 샤프지수 · MDD. 네 지표를 한 장의 표로 함께 봅니다.",
    python: ["pandas 통계 메서드", "numpy 배열 연산"],
    bonus: ".cummax() 와 .rolling()",
    available: true,
  },
  {
    num: "05",
    date: "2026-10-28",
    title: "자산 간의 관계",
    desc: "공분산 · 상관계수 · 베타 · CAPM. 상관계수가 낮으면 왜 위험이 줄어드는지 확인합니다.",
    python: ["다중 자산 관리", "matplotlib 시각화"],
    bonus: "np.polyfit 으로 베타 그리기",
    available: true,
  },
  {
    num: "06",
    date: "2026-11-04",
    title: "포트폴리오 최적화",
    desc: "효율적 투자선. 비중 2만 세트를 무작위로 뿌려 최적 포트폴리오를 찾습니다.",
    python: ["numpy 행렬 연산", "몬테카를로 시뮬레이션"],
    bonus: "argmax 로 최적 비중 꺼내기",
    available: true,
  },
  {
    num: "07",
    date: "2026-11-11",
    title: "모의계좌로 포트폴리오 집행하기",
    desc: "흩어진 코드를 quantkit 패키지로 정리하고, 그 도구로 모의투자를 집행합니다.",
    python: ["함수 모듈화", "csv 파일 입출력", "클래스 (class)"],
    bonus: "Account 클래스로 계좌 관리하기",
    available: true,
  },
  {
    num: "08",
    date: "2026-11-18",
    title: "나만의 포트폴리오",
    desc: "문법 총정리와 코드 리팩토링. 각자 기준으로 포트폴리오를 설계해 발표합니다.",
    python: ["문법 총정리", "코드 리팩토링"],
    bonus: "학습·검증 구간을 나눠 과최적화 점검하기",
    available: true,
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
