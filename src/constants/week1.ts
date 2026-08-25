/* ── Week 1 콘텐츠 데이터 ──
   글만 고치고 싶으면 이 파일만 건드리면 됩니다. 레이아웃은 Week1Content.tsx 에 있습니다. */

export const WEEK1_TOC = [
  { num: "01", title: "환경 구축", href: "#setup" },
  { num: "02", title: "8주 지도", href: "#map" },
  { num: "03", title: "파이썬 첫걸음", href: "#python" },
  { num: "04", title: "금융 첫걸음", href: "#finance" },
  { num: "05", title: "치트시트", href: "#cheatsheet" },
  { num: "06", title: "미션 1", href: "#mission" },
];

export const WEEK1_GOAL =
  "삼성전자 10년 주가 그래프를 내 화면에 띄운다.";

export const WEEK1_TIMETABLE = [
  { time: "0–40분", what: "환경 구축 (오리엔테이션 포함)" },
  { time: "40–45분", what: "쉬는 시간" },
  { time: "45–55분", what: "8주 지도 — 우리가 무엇을 만드는가" },
  { time: "55–85분", what: "파이썬 첫걸음" },
  { time: "85–95분", what: "금융 첫걸음 — 수익률 + 실습" },
  { time: "95–100분", what: "정리와 미션" },
];

/* ── 01. 환경 구축 ── */

export const ENV_OS_TABS = ["Windows", "macOS", "Linux"];

export const ENV_COMMANDS = [
  `py -3.12 -m venv .venv\n.venv\\Scripts\\activate\npython -m pip install -r requirements.txt`,
  `brew install python@3.12\npython3.12 -m venv .venv\nsource .venv/bin/activate\npython -m pip install -r requirements.txt`,
  `sudo apt install python3.12 python3.12-venv\npython3.12 -m venv .venv\nsource .venv/bin/activate\npython -m pip install -r requirements.txt`,
];

export const ENV_OS_NOTES = [
  "설치 프로그램 맨 아래 <b>Add python.exe to PATH</b> 체크를 반드시 하세요. PowerShell에서 실행정책 오류가 나면 진행자에게 말씀해 주세요.",
  "Apple Silicon(M1~)이라면 터미널이 Rosetta로 실행 중인지 먼저 확인하세요.",
  "그래프 한글이 깨지면 <b>sudo apt install fonts-nanum</b> 후 커널을 재시작해야 합니다.",
];

export const ENV_STEPS = [
  { num: 1, title: "Python 3.12 설치", body: "python.org에서 받습니다. 3.13이 이미 깔려 있어도 그대로 쓰셔도 됩니다." },
  { num: 2, title: "VS Code + 확장 설치", body: "Python·Jupyter 확장을 함께 설치합니다." },
  { num: 3, title: "가상환경 만들고 활성화", body: "프롬프트 앞에 <b>(.venv)</b> 가 보이면 성공입니다." },
  { num: 4, title: "패키지 설치", body: "requirements.txt 에 적힌 것을 한 번에 받습니다." },
  { num: 5, title: "VS Code 인터프리터 지정", body: "오른쪽 아래 또는 노트북 우상단에서 .venv 를 고릅니다." },
  { num: 6, title: "환경 검증", body: "python 1week/check_env.py 를 실행해 전부 [ OK ] 인지 확인합니다." },
];

export const ENV_CHECK3 = [
  { q: "파이썬이 잡히는가", a: "python --version" },
  { q: "가상환경이 켜졌는가", a: "프롬프트 앞의 (.venv)" },
  { q: "VS Code가 같은 파이썬을 보는가", a: "노트북 오른쪽 위 커널 표시" },
];

/* ── 02. 8주 지도 ── */

export const LADDER = [
  { week: "1주", py: "변수·자료형·f-string", fin: "수익률" },
  { week: "2주", py: "리스트·for·if·def", fin: "복리" },
  { week: "3주", py: "pandas 기초", fin: "화폐의 시간가치" },
  { week: "4주", py: "통계 메서드·numpy", fin: "위험 (변동성·샤프·MDD)" },
  { week: "5주", py: "matplotlib", fin: "공분산·상관·베타" },
  { week: "6주", py: "행렬 연산", fin: "포트폴리오 최적화" },
  { week: "7주", py: "모듈화·csv", fin: "모의계좌 주문" },
  { week: "8주", py: "총정리·리팩토링", fin: "나만의 포트폴리오" },
];

/* ── 03. 파이썬 첫걸음 ── */

export const PY_TYPES = [
  { t: "int 정수", ex: "70000", use: "주가, 수량" },
  { t: "float 실수", ex: "0.0234", use: "수익률, 비중" },
  { t: "str 문자열", ex: '"005930"', use: "종목코드, 종목명" },
  { t: "bool 참/거짓", ex: "True", use: "조건 판단" },
];

export const PY_PRINT = `print("안녕하세요")      # 화면에 출력한다
print(70000)

# 이렇게 #으로 시작하는 줄은 파이썬이 무시합니다. 사람에게 남기는 메모입니다.`;

export const PY_VAR = `ticker = "005930"    # 따옴표가 있으면 문자열
name   = "삼성전자"
price  = 70000       # 따옴표가 없으면 숫자
weight = 0.15

print(type(price))   # <class 'int'>  ← 자료형 확인`;

export const PY_MATH = `print(10 + 3)     # 13    더하기
print(10 - 3)     # 7     빼기
print(10 * 3)     # 30    곱하기
print(10 / 3)     # 3.333 나누기 (항상 실수)
print(10 ** 3)    # 1000  거듭제곱 ← 오늘의 주인공`;

export const PY_COMPOUND = `# 100만원을 연 5%로 10년 넣어두면?
principal = 1000000
result = principal * (1 + 0.05) ** 10
print(result)     # 1628894.6267774416`;

export const PY_FSTRING = `print(f"{result:,.0f}원")     # 1,628,895원

print(f"{name}({ticker}) 현재가 {price:,}원, 비중 {weight:.1%}")
# 삼성전자(005930) 현재가 70,000원, 비중 15.0%`;

export const PY_FORMATS = [
  { f: "{x}", mean: "그냥 넣기", ex: 'f"{70000}"', out: "70000" },
  { f: "{x:,}", mean: "천 단위 쉼표", ex: 'f"{70000:,}"', out: "70,000" },
  { f: "{x:.0f}", mean: "소수점 없이", ex: 'f"{1628894.6:.0f}"', out: "1628895" },
  { f: "{x:,.0f}", mean: "쉼표 + 소수점 없이", ex: 'f"{1628894.6:,.0f}"', out: "1,628,895" },
  { f: "{x:.1%}", mean: "퍼센트 1자리", ex: 'f"{0.15:.1%}"', out: "15.0%" },
  { f: "{x:+.2%}", mean: "부호 포함 퍼센트", ex: 'f"{0.0294:+.2%}"', out: "+2.94%" },
];

export const PY_CALL = `print(len("005930"))      # 6      길이
print(round(3.14159, 2))  # 3.14   반올림
print(abs(-0.05))         # 0.05   절댓값
print(max(70000, 71500))  # 71500  최댓값`;

export const PY_IMPORT = `import math                        # 도구 상자 통째로
print(math.sqrt(16))               # 4.0

import FinanceDataReader as fdr    # 이름이 길면 별명(as)을 붙인다`;

/* ── 04. 금융 첫걸음 ── */

export const FIN_RETURN = `before = 68000     # 어제 종가
after  = 70000     # 오늘 종가

ret = (after - before) / before
print(f"수익률: {ret:+.2%}")     # 수익률: +2.94%`;

export const FIN_PRACTICE = `import FinanceDataReader as fdr
import matplotlib.pyplot as plt
from finance.plotting import setup_korean_font, default_figsize
from finance.config import START_DATE

setup_korean_font()

df = fdr.DataReader("005930", START_DATE)      # 삼성전자

fig, ax = plt.subplots(figsize=default_figsize())
ax.plot(df.index, df["Close"], linewidth=1.2)
ax.set_title("삼성전자 종가 추이")
ax.set_xlabel("날짜")
ax.set_ylabel("종가 (원)")
ax.grid(alpha=0.3)
plt.show()`;

export const FIN_TENYEAR = `first = df["Close"].iloc[0]     # 첫 날 종가
last  = df["Close"].iloc[-1]    # 마지막 날 종가

ret = (last - first) / first
print(f"10년 수익률: {ret:+.2%}")`;

/* ── 05. 치트시트 · 자주 나는 에러 ── */

export const ERRORS = [
  { msg: "SyntaxError", why: "따옴표·괄호를 빠뜨림", fix: "005930 → \"005930\"" },
  { msg: "NameError: name 'Price' is not defined", why: "대소문자·철자 틀림", fix: "파이썬은 대소문자를 구분합니다" },
  { msg: "TypeError: can only concatenate str", why: "문자열 + 숫자", fix: "f-문자열을 쓰세요" },
  { msg: "ModuleNotFoundError: No module named 'finance'", why: "실행 위치가 틀림", fix: "py_portfolio 폴더에서 실행" },
  { msg: "그래프 한글이 □□□", why: "폰트 미설정", fix: "setup_korean_font() 먼저 실행" },
];

export const WEEK1_SUMMARY = [
  "가상환경(.venv)은 프로젝트 전용 서랍이다. 항상 켜고 작업한다.",
  "변수는 값에 이름을 붙이는 것, ** 는 거듭제곱 — 다음 주 복리 공식의 재료다.",
  "금융은 가격이 아니라 수익률로 말하고, 수익률은 더하지 않고 곱한다.",
];

/* ── 06. 미션 ── */

export const MISSION = {
  title: "미션 1 — 내 관심 종목의 5년 수익률",
  due: "2주차 스터디 시작 전까지",
  time: "30~40분",
  why: "오늘 배운 것은 변수 · 계산 · f-문자열 세 가지입니다. 여기서 계산하는 수익률이 다음 주 「복리」의 재료입니다.",
  steps: [
    "관심 종목 3개를 고르고 종목코드를 찾습니다.",
    "종목마다 5년 수익률을 계산합니다.",
    "세 종목을 보기 좋게 한 번에 출력합니다. (반복문은 다음 주에 배우니 지금은 복사·붙여넣기로 세 번)",
    "세 줄 소감을 씁니다.",
  ],
  code: `import FinanceDataReader as fdr

ticker = "005930"                       # TODO: 내 종목코드로 바꾸기
name   = "삼성전자"                      # TODO: 종목 이름

df = fdr.DataReader(ticker, "2020-01-01")

first = df["Close"].iloc[0]
last  = df["Close"].iloc[-1]

ret = ...                               # TODO: 수익률 공식을 여기에

print(f"{name}({ticker}) 5년 수익률: {ret:+.2%}")`,
  done: [
    "노트북을 Restart & Run All 했을 때 오류 없이 끝까지 실행된다",
    "세 종목의 수익률이 퍼센트 형식(+23.45%)으로 출력된다",
    "세 줄 소감이 적혀 있다",
  ],
};
