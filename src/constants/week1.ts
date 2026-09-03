/* ── Week 1 콘텐츠 데이터 ──
   글만 고치고 싶으면 이 파일만 건드리면 됩니다. 레이아웃은 Week1Content.tsx 에 있습니다. */

/* ── 01. 환경 구축 ── */

/** OS별 환경 세팅
 *  py_portfolio/1주차_환경세팅.md 를 그대로 옮긴 것.
 *  문장·순서·번호·코드를 바꾸지 않는다. 이모지 표시만 뺀다. */

export type Block =
  | { t: "p"; text: string }
  | { t: "ol"; items: { text: string; sub?: string[] }[] }
  | { t: "ul"; items: string[] }
  | { t: "note"; text: string }
  | { t: "h"; text: string }
  | { t: "code"; code: string; lang?: string }
  | { t: "out"; text: string };

export interface OsGuide {
  os: string;
  sections: { num: string; title: string; blocks: Block[] }[];
}

const TEST_CODE = `import numpy as np
import pandas as pd

print(np.array([1, 2, 3]))
print(pd.DataFrame({"a": [1, 2, 3]}))`;

const TEST_OUT = `[1 2 3]
   a
0  1
1  2
2  3`;

const TEST_P =
  "VSCode 왼쪽 탐색기에서 새 파일 <code>test.py</code> 를 만들고 아래 코드를 붙여넣습니다.";
const TEST_RUN =
  "우측 상단 실행(▷) 버튼을 클릭하거나, 터미널에 <code>python test.py</code> 를 입력해 실행합니다. 아래의 배열과 표가 출력되면 환경 구축 완료입니다.";

export const OS_GUIDES: OsGuide[] = [
  /* ═══════════════════ Windows ═══════════════════ */
  {
    os: "Windows",
    sections: [
      {
        num: "1단계",
        title: "Python 설치",
        blocks: [
          {
            t: "ol",
            items: [
              { text: "브라우저를 열고 주소창에 <code>https://www.python.org/downloads/</code> 입력 후 이동합니다." },
              { text: '페이지 중앙의 노란 버튼 <b>"Download Python 3.x.x"</b> 를 클릭해 설치 파일(.exe)을 내려받습니다. (3.11 이상 권장)' },
              { text: "다운로드 폴더에서 받은 <code>python-3.x.x-amd64.exe</code> 파일을 더블클릭해 실행합니다." },
              {
                text: '설치 창 <b>맨 아래</b>에 있는 체크박스 <b>"Add python.exe to PATH"</b> 를 반드시 체크합니다.',
                sub: ["이걸 체크하지 않으면 나중에 터미널에서 <code>python</code> 명령어가 전혀 인식되지 않습니다. 가장 많이 하는 실수이니 꼭 확인하세요."],
              },
              { text: '<b>"Install Now"</b> 를 클릭합니다.' },
              { text: '설치가 끝나면 "Disable path length limit"라는 링크가 나올 수 있는데, 클릭해서 해제해 줍니다 (긴 경로 이름 문제를 예방, 선택 사항이지만 권장).' },
              { text: '<b>"Close"</b> 를 눌러 마칩니다.' },
            ],
          },
        ],
      },
      {
        num: "2단계",
        title: "PowerShell 열기",
        blocks: [
          { t: "h", text: "방법 A (검색으로 열기)" },
          {
            t: "ol",
            items: [
              { text: "키보드에서 Windows 로고 키(⊞)를 누릅니다. 화면 하단에 시작 메뉴 검색창이 열립니다." },
              { text: "키보드로 <code>PowerShell</code> 을 입력합니다." },
              { text: '검색 결과 맨 위에 <b>"Windows PowerShell"</b> 앱이 나타납니다. 클릭하거나 Enter를 누릅니다.' },
            ],
          },
          { t: "h", text: "방법 B (우클릭 메뉴로 열기)" },
          {
            t: "ol",
            items: [
              { text: "Windows 로고 키를 누른 채로 X 키를 누릅니다 (Win + X)." },
              { text: '나타나는 메뉴에서 <b>"Windows PowerShell"</b> 또는 <b>"터미널"</b> 항목을 클릭합니다.' },
            ],
          },
          {
            t: "ul",
            items: ["파란색(또는 검은색) 창이 뜨고 <code>PS C:\\Users\\사용자이름&gt;</code> 같은 문구가 보이면 정상적으로 열린 것입니다."],
          },
        ],
      },
      {
        num: "3단계",
        title: "Python 설치 확인",
        blocks: [
          { t: "ul", items: ["PowerShell 창에 아래 명령어를 입력하고 Enter를 누릅니다."] },
          { t: "code", code: "python --version", lang: "powershell" },
          { t: "ul", items: ["<code>Python 3.14.7</code> 처럼 버전이 출력되면 성공입니다."] },
          {
            t: "note",
            text: '만약 "python은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다"라는 에러가 뜬다면 1단계에서 "Add to PATH" 체크를 놓친 것입니다. Python을 삭제(제어판 &gt; 프로그램 제거) 후 다시 설치하면서 체크박스를 확인하세요.',
          },
          {
            t: "note",
            text: "에러 없이 실행됐는데 갑자기 Microsoft Store가 열린다면, Windows 설정 &gt; 앱 &gt; 고급 앱 설정 &gt; 앱 실행 별칭에서 <code>python.exe</code>, <code>python3.exe</code> 스위치를 꺼주세요. (스토어용 가짜 실행 파일이 우선 실행되는 현상입니다.)",
          },
        ],
      },
      {
        num: "4단계",
        title: "VSCode 설치",
        blocks: [
          {
            t: "ol",
            items: [
              { text: "브라우저에서 <code>https://code.visualstudio.com/</code> 로 이동합니다." },
              { text: '큰 파란 버튼 <b>"Download for Windows"</b> 를 클릭합니다.' },
              { text: "다운로드된 <code>VSCodeUserSetup-x64-x.xx.x.exe</code> 파일을 더블클릭합니다." },
              { text: '라이선스 동의 후 계속 진행하다가, "추가 작업 선택" 화면에서 <b>"PATH에 추가"</b> 항목이 체크되어 있는지 확인합니다 (보통 기본 체크됨).' },
              { text: '"설치"를 클릭하고 완료되면 VSCode를 실행합니다.' },
            ],
          },
        ],
      },
      {
        num: "5단계",
        title: "VSCode에 Python 확장 설치",
        blocks: [
          {
            t: "ol",
            items: [
              { text: "VSCode 왼쪽 세로 아이콘 바에서 네모 4개가 겹친 모양의 <b>확장(Extensions)</b> 아이콘을 클릭합니다. (단축키 <code>Ctrl+Shift+X</code>)" },
              { text: "검색창에 <code>Python</code> 을 입력합니다." },
              { text: '게시자가 <b>Microsoft</b> 로 되어 있는 "Python" 확장을 찾아 <b>Install</b> 버튼을 클릭합니다.' },
            ],
          },
        ],
      },
      {
        num: "6단계",
        title: "프로젝트 폴더 만들고 VSCode로 열기",
        blocks: [
          {
            t: "ol",
            items: [
              { text: "원하는 위치에 폴더를 하나 만듭니다. 예: <code>C:\\Users\\사용자이름\\projects\\pyfinance-study</code>" },
              { text: "VSCode에서 상단 메뉴 <b>File &gt; Open Folder...</b> 를 클릭하고, 방금 만든 폴더를 선택합니다." },
            ],
          },
        ],
      },
      {
        num: "7단계",
        title: "통합 터미널에서 가상환경(venv) 만들기",
        blocks: [
          {
            t: "ol",
            items: [
              { text: "VSCode 상단 메뉴 <b>Terminal &gt; New Terminal</b> 을 클릭합니다 (단축키 <code>Ctrl+`</code>). 화면 하단에 터미널 패널이 열리며 기본적으로 PowerShell이 실행됩니다." },
              { text: "아래 명령어를 입력합니다." },
            ],
          },
          { t: "code", code: "python -m venv venv", lang: "powershell" },
          {
            t: "ul",
            items: ["현재 폴더 안에 <code>venv</code> 라는 하위 폴더가 생성됩니다. 이 안에 독립된 Python 실행 환경이 들어 있습니다."],
          },
        ],
      },
      {
        num: "8단계",
        title: "가상환경 활성화",
        blocks: [
          { t: "code", code: ".\\venv\\Scripts\\Activate.ps1", lang: "powershell" },
          { t: "p", text: "이 명령을 실행했을 때 아래와 같은 에러가 뜰 수 있습니다." },
          { t: "out", text: "이 시스템에서 스크립트를 실행할 수 없으므로 ... 파일을 로드할 수 없습니다." },
          {
            t: "p",
            text: "이는 PowerShell의 보안 정책(실행 정책) 때문입니다. 아래 명령으로 현재 사용자에 한해 정책을 완화해주면 해결됩니다.",
          },
          {
            t: "code",
            code: "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser",
            lang: "powershell",
          },
          { t: "p", text: "입력 후 <code>Y</code> 를 누르고 Enter로 확인합니다. 그 다음 8단계의 활성화 명령을 다시 실행합니다." },
          { t: "p", text: "성공적으로 활성화되면 프롬프트 맨 앞에 <code>(venv)</code> 표시가 붙습니다." },
          { t: "out", text: "(venv) PS C:\\Users\\사용자이름\\projects\\pyfinance-study>" },
        ],
      },
      {
        num: "9단계",
        title: "NumPy, Pandas 설치",
        blocks: [
          { t: "code", code: "pip install numpy pandas", lang: "powershell" },
          { t: "p", text: "설치 로그가 쭉 나오고 <code>Successfully installed ...</code> 문구가 뜨면 완료입니다." },
        ],
      },
      {
        num: "10단계",
        title: "VSCode에서 인터프리터 선택",
        blocks: [
          {
            t: "ol",
            items: [
              { text: "<code>Ctrl+Shift+P</code> 를 눌러 명령 팔레트를 엽니다." },
              { text: "<code>Python: Select Interpreter</code> 를 입력하고 Enter를 누릅니다." },
              { text: "목록에서 경로에 <code>.\\venv\\Scripts\\python.exe</code> 가 포함된 항목을 선택합니다." },
            ],
          },
        ],
      },
      {
        num: "11단계",
        title: "테스트",
        blocks: [
          { t: "p", text: TEST_P },
          { t: "code", code: TEST_CODE, lang: "python" },
          { t: "p", text: TEST_RUN },
          { t: "out", text: TEST_OUT },
        ],
      },
    ],
  },

  /* ═══════════════════ MacOS ═══════════════════ */
  {
    os: "MacOS",
    sections: [
      {
        num: "1단계",
        title: "Python 설치",
        blocks: [
          {
            t: "p",
            text: "macOS에는 구버전 Python이 기본 내장되어 있을 수 있으나 사용하지 않는 것을 권장합니다. 아래 두 방법 중 하나를 선택하세요.",
          },
          { t: "h", text: "방법 A. python.org에서 설치 (가장 쉬움, 처음이라면 이 방법 추천)" },
          {
            t: "ol",
            items: [
              { text: "브라우저에서 <code>https://www.python.org/downloads/macos/</code> 로 이동합니다." },
              { text: '<b>"Download macOS 64-bit universal2 installer"</b> 를 클릭해 <code>.pkg</code> 파일을 내려받습니다.' },
              { text: "다운로드된 <code>.pkg</code> 파일을 더블클릭합니다." },
              { text: "설치 마법사에서 계속(Continue) → 동의(Agree) → 설치(Install) 순서로 진행합니다." },
              { text: "macOS 로그인 비밀번호 입력을 요구할 수 있습니다. 입력 후 진행합니다." },
            ],
          },
          { t: "h", text: "방법 B. Homebrew 사용 (터미널 사용이 익숙하다면 추천)" },
          {
            t: "ol",
            items: [
              { text: "아래 3단계를 참고해 터미널을 먼저 엽니다." },
              { text: "Homebrew가 없다면 아래 명령을 붙여넣고 실행합니다." },
            ],
          },
          {
            t: "code",
            code: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
            lang: "bash",
          },
          { t: "ol", items: [{ text: "설치가 끝나면 다음 명령으로 Python을 설치합니다." }] },
          { t: "code", code: "brew install python", lang: "bash" },
        ],
      },
      {
        num: "2단계",
        title: "터미널 열기",
        blocks: [
          { t: "h", text: "방법 A (Spotlight 검색)" },
          {
            t: "ol",
            items: [
              { text: "<code>Cmd + Space</code> 를 눌러 Spotlight 검색창을 엽니다." },
              { text: "<code>Terminal</code> 을 입력하고 Enter를 누릅니다." },
            ],
          },
          { t: "h", text: "방법 B (Finder에서 직접 찾기)" },
          {
            t: "ol",
            items: [
              { text: "Finder를 엽니다." },
              { text: "상단 메뉴 <b>이동(Go) &gt; 유틸리티(Utilities)</b> 를 클릭합니다." },
              { text: "<b>Terminal.app</b> 을 더블클릭합니다." },
            ],
          },
        ],
      },
      {
        num: "3단계",
        title: "Python 설치 확인",
        blocks: [
          { t: "code", code: "python3 --version", lang: "bash" },
          {
            t: "p",
            text: "macOS에서는 <code>python</code> 이 아닌 <code>python3</code> 명령을 사용해야 하는 경우가 대부분입니다. <code>Python 3.14.7</code> 처럼 버전이 출력되면 성공입니다.",
          },
        ],
      },
      {
        num: "4단계",
        title: "VSCode 설치",
        blocks: [
          {
            t: "ol",
            items: [
              { text: '<code>https://code.visualstudio.com/</code> 에서 <b>"Download for Mac"</b> 을 클릭합니다.' },
              { text: "다운로드된 <code>.zip</code> 파일이 자동으로 풀리며 <code>Visual Studio Code.app</code> 이 생성됩니다 (안 풀리면 더블클릭)." },
              { text: "이 앱을 <b>Applications(응용 프로그램)</b> 폴더로 드래그해 옮깁니다." },
              { text: "Launchpad 또는 Spotlight(<code>Cmd+Space</code> → <code>Visual Studio Code</code>)에서 실행합니다." },
              { text: '처음 실행 시 "인터넷에서 다운로드한 앱인데 여시겠습니까?" 경고가 뜨면 <b>열기</b> 를 클릭합니다.' },
            ],
          },
        ],
      },
      {
        num: "5단계",
        title: "VSCode에 Python 확장 설치",
        blocks: [
          {
            t: "p",
            text: "Windows와 동일합니다. <code>Cmd+Shift+X</code> 로 확장 탭을 열고 <code>Python</code> 검색 후 Microsoft 제작 확장을 설치합니다.",
          },
        ],
      },
      {
        num: "6단계",
        title: "프로젝트 폴더 만들고 열기",
        blocks: [
          {
            t: "ol",
            items: [
              { text: "Finder에서 원하는 위치에 새 폴더를 만듭니다. 예: <code>~/projects/pyfinance-study</code>" },
              { text: "VSCode 상단 메뉴 <b>File &gt; Open...</b> 을 클릭하고 해당 폴더를 선택합니다." },
            ],
          },
        ],
      },
      {
        num: "7단계",
        title: "가상환경 만들기",
        blocks: [
          {
            t: "p",
            text: "<code>Ctrl+`</code> 로 VSCode 통합 터미널을 열고 (기본값은 zsh) 아래 명령을 입력합니다.",
          },
          { t: "code", code: "python3 -m venv venv", lang: "bash" },
        ],
      },
      {
        num: "8단계",
        title: "가상환경 활성화",
        blocks: [
          { t: "code", code: "source venv/bin/activate", lang: "bash" },
          { t: "p", text: "프롬프트 앞에 <code>(venv)</code> 가 붙으면 성공입니다." },
        ],
      },
      {
        num: "9단계",
        title: "NumPy, Pandas 설치",
        blocks: [{ t: "code", code: "pip install numpy pandas", lang: "bash" }],
      },
      {
        num: "10단계",
        title: "VSCode에서 인터프리터 선택",
        blocks: [
          {
            t: "p",
            text: "<code>Cmd+Shift+P</code> → <code>Python: Select Interpreter</code> 입력 → 경로에 <code>./venv/bin/python</code> 이 포함된 항목 선택.",
          },
        ],
      },
      {
        num: "11단계",
        title: "테스트",
        blocks: [
          { t: "p", text: TEST_P },
          { t: "code", code: TEST_CODE, lang: "python" },
          { t: "p", text: TEST_RUN },
          { t: "out", text: TEST_OUT },
        ],
      },
    ],
  },

  /* ═══════════════════ Linux ═══════════════════ */
  {
    os: "Linux",
    sections: [
      {
        num: "1단계",
        title: "터미널 열기",
        blocks: [
          {
            t: "ul",
            items: [
              "단축키 <code>Ctrl + Alt + T</code> 를 누르면 대부분의 배포판에서 터미널이 바로 열립니다.",
              "또는 애플리케이션 메뉴(작업 표시줄의 프로그램 목록)에서 <code>Terminal</code> 을 검색해 실행합니다.",
            ],
          },
        ],
      },
      {
        num: "2단계",
        title: "Python 설치 확인 및 설치",
        blocks: [
          {
            t: "p",
            text: "대부분의 Ubuntu/Debian 계열에는 Python 3가 기본 설치되어 있습니다. 확인:",
          },
          { t: "code", code: "python3 --version", lang: "bash" },
          {
            t: "p",
            text: "만약 설치되어 있지 않거나, 가상환경 모듈(<code>venv</code>)과 <code>pip</code>가 없다면 아래 명령으로 설치합니다.",
          },
          {
            t: "code",
            code: `sudo apt update
sudo apt install python3 python3-pip python3-venv`,
            lang: "bash",
          },
          {
            t: "p",
            text: "<code>sudo</code> 명령 실행 시 로그인 비밀번호 입력을 요구하면 입력합니다 (입력해도 화면에 글자가 안 보이는 게 정상입니다).",
          },
        ],
      },
      {
        num: "3단계",
        title: "VSCode 설치",
        blocks: [
          { t: "h", text: "방법 A. .deb 패키지로 설치" },
          {
            t: "ol",
            items: [
              { text: '<code>https://code.visualstudio.com/</code> 에서 <b>".deb"</b> 버튼을 클릭해 다운로드합니다.' },
              { text: "터미널에서 다운로드 폴더로 이동 후 설치합니다." },
            ],
          },
          {
            t: "code",
            code: `cd ~/Downloads
sudo apt install ./code_*.deb`,
            lang: "bash",
          },
          { t: "h", text: "방법 B. Snap으로 설치 (더 간단)" },
          { t: "code", code: "sudo snap install --classic code", lang: "bash" },
        ],
      },
      {
        num: "4단계",
        title: "VSCode에 Python 확장 설치",
        blocks: [
          {
            t: "p",
            text: "동일하게 <code>Ctrl+Shift+X</code> 로 확장 탭을 열고 <code>Python</code>(Microsoft 제작)을 검색해 설치합니다.",
          },
        ],
      },
      {
        num: "5단계",
        title: "프로젝트 폴더 만들고 열기",
        blocks: [
          { t: "code", code: "mkdir -p ~/projects/pyfinance-study", lang: "bash" },
          {
            t: "p",
            text: "VSCode에서 <b>File &gt; Open Folder</b> 로 해당 폴더를 엽니다. (또는 터미널에서 <code>code ~/projects/pyfinance-study</code> 로 바로 열 수도 있습니다.)",
          },
        ],
      },
      {
        num: "6단계",
        title: "가상환경 만들기",
        blocks: [
          { t: "p", text: "VSCode 통합 터미널(<code>Ctrl+`</code>, 기본 bash)에서:" },
          { t: "code", code: "python3 -m venv venv", lang: "bash" },
        ],
      },
      {
        num: "7단계",
        title: "가상환경 활성화",
        blocks: [
          { t: "code", code: "source venv/bin/activate", lang: "bash" },
          { t: "p", text: "프롬프트 앞에 <code>(venv)</code> 가 붙으면 성공입니다." },
        ],
      },
      {
        num: "8단계",
        title: "NumPy, Pandas 설치",
        blocks: [{ t: "code", code: "pip install numpy pandas", lang: "bash" }],
      },
      {
        num: "9단계",
        title: "VSCode에서 인터프리터 선택",
        blocks: [
          {
            t: "p",
            text: "<code>Ctrl+Shift+P</code> → <code>Python: Select Interpreter</code> → <code>./venv/bin/python</code> 경로 선택.",
          },
        ],
      },
      {
        num: "10단계",
        title: "테스트",
        blocks: [
          { t: "p", text: TEST_P },
          { t: "code", code: TEST_CODE, lang: "python" },
          { t: "p", text: TEST_RUN },
          { t: "out", text: TEST_OUT },
        ],
      },
    ],
  },
];
