/* ── Week 1 콘텐츠 데이터 ──
   글만 고치고 싶으면 이 파일만 건드리면 됩니다. 레이아웃은 Week1Content.tsx 에 있습니다. */

/* ── 01. 환경 구축 ── */

/** OS별 설치 가이드 — py_portfolio/1week/setup_*.md 를 그대로 옮긴 것.
    단계마다 명령을 따로 두어 그 자리에서 복사해 붙여넣을 수 있게 한다. */
export interface OsSection {
  num: string;
  title: string;
  body?: string;
  code?: string;
}

export interface OsGuide {
  os: string;
  subtitle: string;
  lang: string;
  sections: OsSection[];
  troubles: { symptom: string; fix: string }[];
}

export const OS_GUIDES: OsGuide[] = [
  /* ───────────────────────── Windows ───────────────────────── */
  {
    os: "Windows",
    subtitle: "PowerShell 로 진행합니다.",
    lang: "powershell",
    sections: [
      {
        num: "1",
        title: "Python 3.12 설치",
        body: "python.org/downloads/windows 에서 <b>Python 3.12.x → Windows installer (64-bit)</b> 를 받습니다. 설치 화면 맨 아래 <b>Add python.exe to PATH</b> 를 반드시 체크한 뒤 Install Now.",
        code: "python --version",
      },
      {
        num: "2",
        title: "VS Code 설치",
        body: "code.visualstudio.com 에서 설치 → 왼쪽 확장(Extensions) 아이콘 → <b>Python</b>(Microsoft) 과 <b>Jupyter</b>(Microsoft) 설치.",
      },
      {
        num: "3",
        title: "Git 설치와 저장소 내려받기",
        body: "git-scm.com/download/win 에서 설치합니다(옵션 전부 기본값).",
        code: `git clone <스터디_저장소_주소> py_portfolio
cd py_portfolio`,
      },
      {
        num: "4",
        title: "가상환경(.venv) 만들기",
        body: "활성화에 성공하면 프롬프트 앞에 <b>(.venv)</b> 가 붙습니다.",
        code: `python -m venv .venv
.venv\\Scripts\\activate`,
      },
      {
        num: "5",
        title: "패키지 설치",
        body: "3~5분 정도 걸립니다.",
        code: `python -m pip install --upgrade pip
python -m pip install -r requirements.txt`,
      },
      {
        num: "6",
        title: "VS Code에 가상환경 연결",
        body: "py_portfolio 폴더 열기 → <b>Ctrl + Shift + P</b> → <b>Python: Select Interpreter</b> → 목록에서 <b>.venv 가 포함된 항목</b> 선택.",
      },
      {
        num: "7",
        title: "최종 확인",
        body: "전부 <b>[ OK ]</b> 로 끝나면 준비 완료입니다.",
        code: "python 1week/check_env.py",
      },
    ],
    troubles: [
      {
        symptom: "python : 명령을 찾을 수 없습니다",
        fix: "설치 시 Add python.exe to PATH 를 체크하지 않은 경우. 설치 프로그램 재실행 → Modify → Next → <b>Add Python to environment variables</b> 체크 → Install → PowerShell 을 완전히 닫고 새로 엽니다.",
      },
      {
        symptom: "pip : 명령을 찾을 수 없습니다",
        fix: "pip 만 PATH 에 없는 경우. 다시 설치할 필요 없이 <b>python -m pip</b> 를 쓰면 됩니다.",
      },
      {
        symptom: "activate.ps1 을 로드할 수 없습니다",
        fix: "PowerShell 실행 정책 문제. <b>Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</b> 실행 후 Y 를 누르고 다시 활성화합니다.",
      },
      {
        symptom: "VS Code 에서 No module named 'pandas'",
        fix: "VS Code 가 다른 파이썬을 보고 있는 경우. Select Interpreter 로 .venv 선택 → 노트북 우상단 커널을 .venv 로 변경 → <b>커널 재시작</b>.",
      },
      {
        symptom: "No module named 'finance'",
        fix: "프로젝트 최상위 폴더가 아닌 곳에서 실행한 경우. <b>cd py_portfolio</b> 후 다시 실행합니다.",
      },
      {
        symptom: "SSL: CERTIFICATE_VERIFY_FAILED",
        fix: "학교·회사 네트워크의 보안 장비 때문입니다. 개인 핫스팟으로 바꿔서 시도합니다.",
      },
    ],
  },

  /* ───────────────────────── macOS ───────────────────────── */
  {
    os: "macOS",
    subtitle: "터미널(⌘ + Space → 터미널)로 진행합니다.",
    lang: "bash",
    sections: [
      {
        num: "0",
        title: "내 맥 확인하기",
        body: " → 이 Mac에 관하여 에서 칩을 확인합니다. <b>Apple M1~M4</b> 는 Apple Silicon, <b>Intel Core</b> 는 Intel. 절차는 같고 Homebrew 경로만 다릅니다.",
      },
      {
        num: "1",
        title: "Homebrew 설치",
        body: "설치가 끝나면 화면에 나오는 <b>Next steps:</b> 안내를 그대로 복사해 실행하세요. 보통 아래 두 줄입니다(Apple Silicon 기준).",
        code: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

brew --version`,
      },
      {
        num: "2",
        title: "Python 3.12 설치",
        body: "macOS 에 원래 있는 <b>python3(3.9.x)는 쓰지 않습니다.</b> 반드시 python3.12 를 씁니다.",
        code: `brew install python@3.12
python3.12 --version`,
      },
      {
        num: "3",
        title: "VS Code 설치",
        body: "code.visualstudio.com 에서 받아 응용 프로그램 폴더로 이동 → 확장에서 <b>Python</b> 과 <b>Jupyter</b> 설치.",
      },
      {
        num: "4",
        title: "저장소 내려받기",
        body: "git 이 없으면 설치 안내창이 뜹니다. 설치 후 진행하세요.",
        code: `git --version
cd ~/Documents
git clone <스터디_저장소_주소> py_portfolio
cd py_portfolio`,
      },
      {
        num: "5",
        title: "가상환경(.venv) 만들기",
        body: "성공하면 프롬프트 앞에 <b>(.venv)</b> 가 붙습니다.",
        code: `python3.12 -m venv .venv
source .venv/bin/activate`,
      },
      {
        num: "6",
        title: "패키지 설치",
        body: "가상환경을 켠 뒤에는 python3.12 가 아니라 그냥 <b>python</b> 을 씁니다.",
        code: `python -m pip install --upgrade pip
python -m pip install -r requirements.txt`,
      },
      {
        num: "7",
        title: "한글 폰트 (권장)",
        body: "기본 AppleGothic 으로도 되지만 나눔고딕이 더 깔끔합니다. 설치 후 <b>커널을 재시작</b>해야 인식됩니다.",
        code: "brew install --cask font-nanum-gothic",
      },
      {
        num: "8",
        title: "VS Code에 가상환경 연결",
        body: "py_portfolio 폴더 열기 → <b>⌘ + Shift + P</b> → <b>Python: Select Interpreter</b> → <b>.venv 가 포함된 항목</b> 선택.",
      },
      {
        num: "9",
        title: "최종 확인",
        body: "전부 <b>[ OK ]</b> 로 끝나면 준비 완료입니다.",
        code: "python 1week/check_env.py",
      },
    ],
    troubles: [
      {
        symptom: "brew: command not found",
        fix: "PATH 등록을 안 한 경우. 1번의 echo 두 줄을 실행한 뒤 터미널을 완전히 닫고 새로 엽니다. Intel 맥이라면 경로가 <b>/usr/local/bin/brew</b> 입니다.",
      },
      {
        symptom: "python3.12: command not found",
        fix: "brew install 이 끝났는지 확인하고, 그래도 안 되면 <b>brew link python@3.12</b>.",
      },
      {
        symptom: "터미널이 Rosetta 로 돌고 있음 (Apple Silicon)",
        fix: "<b>uname -m</b> 이 arm64 면 정상, <b>x86_64</b> 면 Rosetta. 터미널 우클릭 → 정보 가져오기 → <b>Rosetta를 사용하여 열기 체크 해제</b> → 재시작. Rosetta 상태로 설치하면 numpy·scipy 가 느리거나 실패합니다.",
      },
      {
        symptom: "zsh: permission denied",
        fix: "sudo 를 붙이지 마세요. 가상환경 안에서는 관리자 권한이 필요 없습니다. <b>sudo pip install 은 시스템 파이썬을 망가뜨립니다.</b>",
      },
      {
        symptom: "VS Code 에서 No module named 'pandas'",
        fix: "Select Interpreter 로 .venv 선택 → 노트북 우상단 커널을 .venv 로 변경 → <b>커널 재시작</b>.",
      },
      {
        symptom: "그래프의 한글이 □□□",
        fix: "7번의 나눔고딕을 설치하고 커널을 재시작합니다.",
      },
    ],
  },

  /* ───────────────────────── Linux ───────────────────────── */
  {
    os: "Linux",
    subtitle: "Ubuntu·Debian 기준입니다. 다른 배포판은 패키지 관리자만 바꾸면 동일합니다.",
    lang: "bash",
    sections: [
      {
        num: "1",
        title: "Python 3.12 설치",
        body: "Ubuntu 22.04 이하라 3.12 가 없다면 아래 deadsnakes 저장소를 먼저 추가합니다.",
        code: `sudo apt update
sudo apt install -y python3.12 python3.12-venv python3-pip
python3.12 --version

# 3.12 가 없다면
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.12 python3.12-venv`,
      },
      {
        num: "2",
        title: "Git 과 빌드 도구",
        body: "<b>build-essential</b> 은 일부 패키지를 소스에서 빌드할 때 필요합니다.",
        code: "sudo apt install -y git build-essential",
      },
      {
        num: "3",
        title: "한글 폰트 설치 — 리눅스는 필수",
        body: "리눅스에는 한글 폰트가 기본으로 없어 <b>설치하지 않으면 그래프의 한글이 전부 깨집니다.</b> 설치 후 커널을 반드시 재시작합니다.",
        code: `sudo apt install -y fonts-nanum
fc-cache -fv`,
      },
      {
        num: "4",
        title: "VS Code 설치",
        body: "또는 code.visualstudio.com 에서 .deb 를 받아 설치합니다. 확장에서 <b>Python</b> 과 <b>Jupyter</b> 를 설치하세요.",
        code: "sudo snap install code --classic",
      },
      {
        num: "5",
        title: "저장소 내려받기",
        code: `cd ~
git clone <스터디_저장소_주소> py_portfolio
cd py_portfolio`,
      },
      {
        num: "6",
        title: "가상환경(.venv) 만들기",
        body: "성공하면 프롬프트 앞에 <b>(.venv)</b> 가 붙습니다.",
        code: `python3.12 -m venv .venv
source .venv/bin/activate`,
      },
      {
        num: "7",
        title: "패키지 설치",
        body: "가상환경을 켠 뒤에는 python3.12 가 아니라 그냥 <b>python</b> 을 씁니다.",
        code: `python -m pip install --upgrade pip
python -m pip install -r requirements.txt`,
      },
      {
        num: "8",
        title: "VS Code에 가상환경 연결",
        body: "py_portfolio 폴더 열기 → <b>Ctrl + Shift + P</b> → <b>Python: Select Interpreter</b> → <b>.venv 가 포함된 항목</b> 선택.",
      },
      {
        num: "9",
        title: "최종 확인",
        body: "전부 <b>[ OK ]</b> 로 끝나면 준비 완료입니다.",
        code: "python 1week/check_env.py",
      },
    ],
    troubles: [
      {
        symptom: "ensurepip is not available",
        fix: "python3.12-venv 패키지가 빠진 경우. <b>sudo apt install -y python3.12-venv</b>.",
      },
      {
        symptom: "error: externally-managed-environment",
        fix: "가상환경을 켜지 않은 상태에서 pip install 을 한 경우. 먼저 <b>source .venv/bin/activate</b>. <b>--break-system-packages 로 강제하지 마세요.</b>",
      },
      {
        symptom: "그래프의 한글이 □□□",
        fix: "3번을 건너뛴 경우. fonts-nanum 설치 후 <b>rm -rf ~/.cache/matplotlib</b> 로 폰트 캐시를 지우고 커널을 재시작합니다.",
      },
      {
        symptom: "No module named 'finance'",
        fix: "프로젝트 최상위 폴더에서 실행해야 합니다. <b>cd ~/py_portfolio</b> 후 다시 실행.",
      },
      {
        symptom: "sudo pip install 을 써도 되나요",
        fix: "안 됩니다. 시스템 파이썬이 망가져 OS 도구가 동작하지 않을 수 있습니다. 반드시 가상환경 안에서 <b>python -m pip</b> 를 씁니다.",
      },
    ],
  },
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
