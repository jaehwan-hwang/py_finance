/* ── Week 1 콘텐츠 데이터 ──
   글만 고치고 싶으면 이 파일만 건드리면 됩니다. 레이아웃은 Week1Content.tsx 에 있습니다. */

/* ── 01. 환경 구축 ── */

/** OS별 설치 가이드
 *  py_portfolio/1week/setup_windows.md / setup_macos.md / setup_linux.md 의 내용을
 *  그대로 옮긴 것. 문장·순서·코드를 바꾸지 않는다. */

export type Block =
  | { t: "p"; text: string }
  | { t: "ol"; items: string[] }
  | { t: "ul"; items: string[] }
  | { t: "note"; text: string }
  | { t: "h"; text: string }
  | { t: "code"; code: string };

export interface OsGuide {
  os: string;
  intro: Block[];
  sections: { num: string; title: string; blocks: Block[] }[];
  troubles: { symptom: string; blocks: Block[] }[];
}

export const OS_GUIDES: OsGuide[] = [
  /* ═══════════════════ Windows ═══════════════════ */
  {
    os: "Windows",
    intro: [
      {
        t: "note",
        text: "<b>스터디 3일 전까지 여기까지 끝내고 오세요.</b><br>막히면 에러 화면을 캡처해서 스터디 채널에 올려주세요. (OS와 함께)",
      },
    ],
    sections: [
      {
        num: "1",
        title: "Python 3.12 설치",
        blocks: [
          {
            t: "ol",
            items: [
              "https://www.python.org/downloads/windows/ 접속",
              "<b>Python 3.12.x → Windows installer (64-bit)</b> 다운로드",
              "설치 프로그램 실행 → 맨 아래 <code>Add python.exe to PATH</code> 반드시 체크",
              "<code>Install Now</code> 클릭",
            ],
          },
          {
            t: "note",
            text: "<b>왜 3.12인가</b>: 스터디원 전원이 같은 버전을 써야 문제가 생겼을 때 원인을 좁힐 수 있기 때문입니다. 이 스터디는 무거운 라이브러리를 쓰지 않아 <b>이미 3.13이 깔려 있다면 그대로 쓰셔도 됩니다.</b>",
          },
          { t: "h", text: "설치 확인" },
          { t: "p", text: "<b>시작 → PowerShell</b> 을 열고:" },
          { t: "code", code: "python --version" },
          { t: "p", text: "<code>Python 3.12.x</code> 가 나오면 성공입니다." },
        ],
      },
      {
        num: "2",
        title: "VS Code 설치",
        blocks: [
          {
            t: "ol",
            items: [
              "https://code.visualstudio.com 에서 다운로드 후 설치",
              "VS Code 실행 → 왼쪽 확장(Extensions) 아이콘 클릭 → 아래 두 개 설치",
            ],
          },
          { t: "ul", items: ["<b>Python</b> (Microsoft)", "<b>Jupyter</b> (Microsoft)"] },
        ],
      },
      {
        num: "3",
        title: "Git 설치와 저장소 내려받기",
        blocks: [
          {
            t: "ol",
            items: [
              "https://git-scm.com/download/win 에서 설치 (옵션은 전부 기본값)",
              "프로젝트를 둘 폴더에서 PowerShell을 열고:",
            ],
          },
          {
            t: "code",
            code: `git clone <스터디_저장소_주소> py_portfolio
cd py_portfolio`,
          },
        ],
      },
      {
        num: "4",
        title: "가상환경(.venv) 만들기",
        blocks: [
          { t: "p", text: "프로젝트마다 패키지를 따로 관리하는 공간입니다." },
          { t: "code", code: "python -m venv .venv" },
          { t: "h", text: "활성화" },
          { t: "code", code: ".venv\\Scripts\\activate" },
          { t: "p", text: "성공하면 프롬프트 앞에 <code>(.venv)</code> 가 붙습니다." },
        ],
      },
      {
        num: "5",
        title: "패키지 설치",
        blocks: [
          {
            t: "code",
            code: `python -m pip install --upgrade pip
python -m pip install -r requirements.txt`,
          },
          { t: "p", text: "3~5분 정도 걸립니다." },
        ],
      },
      {
        num: "6",
        title: "VS Code에 가상환경 연결",
        blocks: [
          {
            t: "ol",
            items: [
              "VS Code에서 <code>py_portfolio</code> 폴더 열기 (File → Open Folder)",
              "<code>Ctrl + Shift + P</code> → <code>Python: Select Interpreter</code> 입력",
              "목록에서 <b><code>.venv</code> 가 포함된 항목</b> 선택",
            ],
          },
        ],
      },
      {
        num: "7",
        title: "최종 확인",
        blocks: [
          { t: "code", code: "python 1week/check_env.py" },
          { t: "p", text: "전부 <code>[ OK ]</code> 로 끝나면 준비 완료입니다." },
        ],
      },
    ],
    troubles: [
      {
        symptom: "python : 명령을 찾을 수 없습니다",
        blocks: [
          { t: "p", text: "설치 시 <code>Add python.exe to PATH</code> 를 체크하지 않은 경우입니다." },
          {
            t: "p",
            text: "<b>해결</b>: Python 설치 프로그램을 다시 실행 → <code>Modify</code> → <code>Next</code> → <code>Add Python to environment variables</code> 체크 → <code>Install</code> → <b>PowerShell을 완전히 닫고 새로 여세요.</b>",
          },
        ],
      },
      {
        symptom: "pip : 명령을 찾을 수 없습니다",
        blocks: [
          {
            t: "p",
            text: "<code>pip</code> 만 PATH에 없는 경우입니다. 다시 설치할 필요 없이 <b><code>python -m pip</code></b> 를 쓰면 됩니다.",
          },
          { t: "code", code: "python -m pip install -r requirements.txt" },
          { t: "p", text: "스터디 자료는 전부 <code>python -m pip</code> 형태로 안내합니다." },
        ],
      },
      {
        symptom: "이 시스템에서 스크립트를 실행할 수 없으므로 ... activate.ps1을 로드할 수 없습니다",
        blocks: [
          { t: "p", text: "PowerShell 실행 정책 때문입니다. 가장 흔한 문제입니다." },
          {
            t: "code",
            code: "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser",
          },
          { t: "p", text: "<code>Y</code> 입력 후 다시 <code>.venv\\Scripts\\activate</code> 를 실행하세요." },
          {
            t: "note",
            text: "이 설정은 현재 사용자에게만 적용되며, 인터넷에서 받은 서명 없는 스크립트는 여전히 막습니다.",
          },
        ],
      },
      {
        symptom: "VS Code에서 ModuleNotFoundError: No module named 'pandas'",
        blocks: [
          {
            t: "p",
            text: "터미널에서는 되는데 노트북에서만 안 되는 경우 = <b>VS Code가 다른 파이썬을 보고 있는 것</b>입니다.",
          },
          {
            t: "p",
            text: "<b>해결</b>: <code>Ctrl + Shift + P</code> → <code>Python: Select Interpreter</code> → <code>.venv</code> 항목 선택 → 노트북 오른쪽 위 커널 표시를 눌러 <code>.venv</code> 로 변경 → <b>커널 재시작</b>",
          },
        ],
      },
      {
        symptom: "ModuleNotFoundError: No module named 'finance'",
        blocks: [
          { t: "p", text: "프로젝트 최상위 폴더가 아닌 곳에서 실행한 경우입니다." },
          {
            t: "code",
            code: `cd C:\\...\\py_portfolio      # 최상위로 이동
python 1week/check_env.py`,
          },
        ],
      },
      {
        symptom: "그래프의 한글이 네모(□□□)로 나옴",
        blocks: [
          {
            t: "p",
            text: "Windows는 보통 <code>맑은 고딕(Malgun Gothic)</code>이 기본 설치되어 있어 자동 해결됩니다. 그래도 깨지면 노트북 첫 셀에서 <code>setup_korean_font(verbose=True)</code> 출력을 확인하고, <code>[WARN]</code> 이 뜨면 스터디 채널에 알려주세요.",
          },
        ],
      },
      {
        symptom: "pip install 중 SSL: CERTIFICATE_VERIFY_FAILED",
        blocks: [
          {
            t: "p",
            text: "학교·회사 네트워크의 보안 장비 때문입니다. 개인 핫스팟으로 바꿔서 시도해 보세요.",
          },
        ],
      },
    ],
  },

  /* ═══════════════════ macOS ═══════════════════ */
  {
    os: "macOS",
    intro: [
      {
        t: "note",
        text: "<b>스터디 3일 전까지 여기까지 끝내고 오세요.</b><br>막히면 에러 화면을 캡처해서 스터디 채널에 올려주세요. (OS와 함께)",
      },
    ],
    sections: [
      {
        num: "0",
        title: "내 맥 확인하기",
        blocks: [
          { t: "p", text: "메뉴 →  → <code>이 Mac에 관하여</code> 에서 칩 종류를 확인하세요." },
          {
            t: "ul",
            items: [
              "<b>Apple M1/M2/M3/M4</b> → Apple Silicon",
              "<b>Intel Core</b> → Intel",
            ],
          },
          { t: "p", text: "둘 다 아래 절차는 같습니다. Homebrew 설치 경로만 다릅니다." },
        ],
      },
      {
        num: "1",
        title: "Homebrew 설치",
        blocks: [
          { t: "p", text: "터미널(⌘ + Space → <code>터미널</code>)을 열고:" },
          {
            t: "code",
            code: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
          },
          {
            t: "p",
            text: "설치가 끝나면 화면에 나오는 <code>Next steps:</code> 안내를 <b>그대로 복사해서 실행</b>하세요. 보통 아래 두 줄입니다 (Apple Silicon 기준).",
          },
          {
            t: "code",
            code: `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"`,
          },
          { t: "p", text: "확인:" },
          { t: "code", code: "brew --version" },
        ],
      },
      {
        num: "2",
        title: "Python 3.12 설치",
        blocks: [
          {
            t: "code",
            code: `brew install python@3.12
python3.12 --version`,
          },
          {
            t: "note",
            text: "<b>왜 3.12인가</b>: 스터디원 전원이 같은 버전을 써야 문제가 생겼을 때 원인을 좁힐 수 있기 때문입니다. 이 스터디는 무거운 라이브러리를 쓰지 않아 <b>이미 3.13이 깔려 있다면 그대로 쓰셔도 됩니다.</b>",
          },
          {
            t: "note",
            text: "macOS에 원래 있는 <code>python3</code> (3.9.x)는 <b>쓰지 않습니다.</b> 반드시 <code>python3.12</code> 를 씁니다.",
          },
        ],
      },
      {
        num: "3",
        title: "VS Code 설치",
        blocks: [
          {
            t: "ol",
            items: [
              "https://code.visualstudio.com 에서 다운로드 → 응용 프로그램 폴더로 이동",
              "VS Code 실행 → 왼쪽 확장(Extensions) 아이콘 → 아래 두 개 설치",
            ],
          },
          { t: "ul", items: ["<b>Python</b> (Microsoft)", "<b>Jupyter</b> (Microsoft)"] },
        ],
      },
      {
        num: "4",
        title: "저장소 내려받기",
        blocks: [
          {
            t: "code",
            code: `git --version     # 없으면 설치 안내창이 뜬다. 설치 후 진행
cd ~/Documents
git clone <스터디_저장소_주소> py_portfolio
cd py_portfolio`,
          },
        ],
      },
      {
        num: "5",
        title: "가상환경(.venv) 만들기",
        blocks: [
          {
            t: "code",
            code: `python3.12 -m venv .venv
source .venv/bin/activate`,
          },
          { t: "p", text: "성공하면 프롬프트 앞에 <code>(.venv)</code> 가 붙습니다." },
        ],
      },
      {
        num: "6",
        title: "패키지 설치",
        blocks: [
          {
            t: "code",
            code: `python -m pip install --upgrade pip
python -m pip install -r requirements.txt`,
          },
          {
            t: "note",
            text: "가상환경을 켠 뒤에는 <code>python3.12</code> 가 아니라 그냥 <code>python</code> 을 쓰면 됩니다.",
          },
        ],
      },
      {
        num: "7",
        title: "한글 폰트 (권장)",
        blocks: [
          {
            t: "p",
            text: "macOS 기본 <code>AppleGothic</code> 으로도 되지만, 나눔고딕이 더 깔끔합니다.",
          },
          { t: "code", code: "brew install --cask font-nanum-gothic" },
          { t: "p", text: "설치 후 <b>노트북 커널을 재시작</b>해야 인식됩니다." },
        ],
      },
      {
        num: "8",
        title: "VS Code에 가상환경 연결",
        blocks: [
          {
            t: "ol",
            items: [
              "VS Code에서 <code>py_portfolio</code> 폴더 열기",
              "<code>⌘ + Shift + P</code> → <code>Python: Select Interpreter</code>",
              "<b><code>.venv</code> 가 포함된 항목</b> 선택",
            ],
          },
        ],
      },
      {
        num: "9",
        title: "최종 확인",
        blocks: [
          { t: "code", code: "python 1week/check_env.py" },
          { t: "p", text: "전부 <code>[ OK ]</code> 로 끝나면 준비 완료입니다." },
        ],
      },
    ],
    troubles: [
      {
        symptom: "brew: command not found",
        blocks: [
          {
            t: "p",
            text: "Homebrew 설치 후 PATH 등록을 안 한 경우입니다. 1번의 <code>echo ... &gt;&gt; ~/.zprofile</code> 두 줄을 실행한 뒤 <b>터미널을 완전히 닫고 새로 여세요.</b>",
          },
          { t: "p", text: "Intel 맥이라면 경로가 <code>/usr/local/bin/brew</code> 입니다." },
        ],
      },
      {
        symptom: "python3.12: command not found",
        blocks: [
          { t: "p", text: "<code>brew install python@3.12</code> 가 끝났는지 확인하고, 그래도 안 되면:" },
          { t: "code", code: "brew link python@3.12" },
        ],
      },
      {
        symptom: "터미널이 Rosetta로 돌고 있음 (Apple Silicon)",
        blocks: [
          { t: "code", code: "uname -m" },
          {
            t: "ul",
            items: ["<code>arm64</code> → 정상", "<code>x86_64</code> → Rosetta로 실행 중입니다"],
          },
          {
            t: "p",
            text: "<b>해결</b>: 응용 프로그램 → 유틸리티 → 터미널 우클릭 → <code>정보 가져오기</code> → <b><code>Rosetta를 사용하여 열기</code> 체크 해제</b> → 터미널 재시작",
          },
          { t: "p", text: "Rosetta 상태로 설치하면 numpy·scipy가 느리거나 설치가 실패합니다." },
        ],
      },
      {
        symptom: "zsh: permission denied",
        blocks: [
          {
            t: "p",
            text: "<code>sudo</code> 를 붙이지 마세요. 가상환경 안에서는 관리자 권한이 필요 없습니다. <code>sudo pip install</code> 은 시스템 파이썬을 망가뜨리므로 <b>절대 쓰지 않습니다.</b>",
          },
        ],
      },
      {
        symptom: "VS Code에서 ModuleNotFoundError: No module named 'pandas'",
        blocks: [
          {
            t: "p",
            text: "터미널에서는 되는데 노트북만 안 되면 <b>VS Code가 다른 파이썬을 보고 있는 것</b>입니다.",
          },
          {
            t: "p",
            text: "<code>⌘ + Shift + P</code> → <code>Python: Select Interpreter</code> → <code>.venv</code> 선택 → 노트북 오른쪽 위 커널 표시를 <code>.venv</code> 로 변경 → <b>커널 재시작</b>",
          },
        ],
      },
      {
        symptom: "ModuleNotFoundError: No module named 'finance'",
        blocks: [
          { t: "p", text: "프로젝트 최상위 폴더에서 실행해야 합니다." },
          {
            t: "code",
            code: `cd ~/Documents/py_portfolio
python 1week/check_env.py`,
          },
        ],
      },
      {
        symptom: "그래프의 한글이 네모(□□□)로 나옴",
        blocks: [
          {
            t: "p",
            text: "7번의 나눔고딕을 설치하고 <b>커널을 재시작</b>하세요. 그래도 안 되면 <code>setup_korean_font(verbose=True)</code> 출력을 채널에 공유해 주세요.",
          },
        ],
      },
    ],
  },

  /* ═══════════════════ Linux ═══════════════════ */
  {
    os: "Linux",
    intro: [
      {
        t: "note",
        text: "<b>스터디 3일 전까지 여기까지 끝내고 오세요.</b><br>막히면 에러 화면을 캡처해서 스터디 채널에 올려주세요. (배포판 이름과 함께)",
      },
      { t: "p", text: "Ubuntu / Debian 기준입니다. Fedora·Arch 등 다른 배포판은 패키지 관리자만 바꾸면 동일합니다." },
    ],
    sections: [
      {
        num: "1",
        title: "Python 3.12 설치",
        blocks: [
          {
            t: "code",
            code: `sudo apt update
sudo apt install -y python3.12 python3.12-venv python3-pip
python3.12 --version`,
          },
          { t: "p", text: "Ubuntu 22.04 이하라 3.12가 없다면:" },
          {
            t: "code",
            code: `sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.12 python3.12-venv`,
          },
          {
            t: "note",
            text: "<b>왜 3.12인가</b>: 스터디원 전원이 같은 버전을 써야 문제가 생겼을 때 원인을 좁힐 수 있기 때문입니다. 이 스터디는 무거운 라이브러리를 쓰지 않아 <b>이미 3.13이 깔려 있다면 그대로 쓰셔도 됩니다.</b>",
          },
        ],
      },
      {
        num: "2",
        title: "Git과 빌드 도구",
        blocks: [
          { t: "code", code: "sudo apt install -y git build-essential" },
          { t: "p", text: "<code>build-essential</code> 은 일부 패키지를 소스에서 빌드할 때 필요합니다." },
        ],
      },
      {
        num: "3",
        title: "한글 폰트 설치 — 리눅스는 필수",
        blocks: [
          {
            t: "p",
            text: "리눅스에는 한글 폰트가 기본으로 없어서 <b>설치하지 않으면 그래프의 한글이 전부 깨집니다.</b>",
          },
          {
            t: "code",
            code: `sudo apt install -y fonts-nanum
fc-cache -fv`,
          },
          { t: "p", text: "설치 후 <b>노트북 커널을 반드시 재시작</b>해야 인식됩니다." },
        ],
      },
      {
        num: "4",
        title: "VS Code 설치",
        blocks: [
          { t: "code", code: "sudo snap install code --classic" },
          {
            t: "p",
            text: "또는 https://code.visualstudio.com 에서 <code>.deb</code> 파일을 받아 설치합니다.",
          },
          { t: "p", text: "실행 후 확장(Extensions)에서 아래 두 개를 설치하세요." },
          { t: "ul", items: ["<b>Python</b> (Microsoft)", "<b>Jupyter</b> (Microsoft)"] },
        ],
      },
      {
        num: "5",
        title: "저장소 내려받기",
        blocks: [
          {
            t: "code",
            code: `cd ~
git clone <스터디_저장소_주소> py_portfolio
cd py_portfolio`,
          },
        ],
      },
      {
        num: "6",
        title: "가상환경(.venv) 만들기",
        blocks: [
          {
            t: "code",
            code: `python3.12 -m venv .venv
source .venv/bin/activate`,
          },
          { t: "p", text: "성공하면 프롬프트 앞에 <code>(.venv)</code> 가 붙습니다." },
        ],
      },
      {
        num: "7",
        title: "패키지 설치",
        blocks: [
          {
            t: "code",
            code: `python -m pip install --upgrade pip
python -m pip install -r requirements.txt`,
          },
          {
            t: "note",
            text: "가상환경을 켠 뒤에는 <code>python3.12</code> 가 아니라 그냥 <code>python</code> 을 쓰면 됩니다.",
          },
        ],
      },
      {
        num: "8",
        title: "VS Code에 가상환경 연결",
        blocks: [
          {
            t: "ol",
            items: [
              "VS Code에서 <code>py_portfolio</code> 폴더 열기",
              "<code>Ctrl + Shift + P</code> → <code>Python: Select Interpreter</code>",
              "<b><code>.venv</code> 가 포함된 항목</b> 선택",
            ],
          },
        ],
      },
      {
        num: "9",
        title: "최종 확인",
        blocks: [
          { t: "code", code: "python 1week/check_env.py" },
          { t: "p", text: "전부 <code>[ OK ]</code> 로 끝나면 준비 완료입니다." },
        ],
      },
    ],
    troubles: [
      {
        symptom: "The virtual environment was not created ... ensurepip is not available",
        blocks: [
          { t: "p", text: "<code>python3.12-venv</code> 패키지가 빠진 경우입니다." },
          { t: "code", code: "sudo apt install -y python3.12-venv" },
        ],
      },
      {
        symptom: "error: externally-managed-environment",
        blocks: [
          {
            t: "p",
            text: "최근 배포판이 시스템 파이썬에 직접 설치하는 것을 막아서 나는 오류입니다. <b>가상환경을 켜지 않은 상태</b>에서 <code>pip install</code> 을 했다는 뜻입니다.",
          },
          {
            t: "code",
            code: `source .venv/bin/activate     # 먼저 활성화
python -m pip install -r requirements.txt`,
          },
          {
            t: "p",
            text: "<code>--break-system-packages</code> 옵션으로 강제하지 마세요. 시스템이 망가집니다.",
          },
        ],
      },
      {
        symptom: "그래프의 한글이 네모(□□□)로 나옴",
        blocks: [
          { t: "p", text: "3번을 건너뛴 경우입니다. 리눅스에서 가장 흔한 문제입니다." },
          {
            t: "code",
            code: `sudo apt install -y fonts-nanum
fc-cache -fv`,
          },
          { t: "p", text: "그다음 <b>matplotlib 폰트 캐시를 지우고</b> 커널을 재시작하세요." },
          { t: "code", code: "rm -rf ~/.cache/matplotlib" },
        ],
      },
      {
        symptom: "ModuleNotFoundError: No module named 'finance'",
        blocks: [
          { t: "p", text: "프로젝트 최상위 폴더에서 실행해야 합니다." },
          {
            t: "code",
            code: `cd ~/py_portfolio
python 1week/check_env.py`,
          },
        ],
      },
      {
        symptom: "sudo pip install 을 써도 되나요?",
        blocks: [
          {
            t: "p",
            text: "<b>안 됩니다.</b> 시스템 파이썬이 망가져서 OS 도구가 동작하지 않을 수 있습니다. 반드시 가상환경 안에서 <code>python -m pip</code> 를 쓰세요.",
          },
        ],
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
