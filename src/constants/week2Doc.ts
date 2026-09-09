import type { WeekDoc } from "./weekDoc";

/** 2주차 — 화폐의 시간가치.
 *  files/week2-time-value-of-money.md 를 옮긴 것. */

export const WEEK2_DOC: WeekDoc = {
  sub: "조건문(if) · 반복문(for/while) · 함수(def) → 복리 · 연속복리 · NPV · IRR",
  lead: "이번 주차부터 프로그램이 <b>판단하고, 반복하고, 재사용</b>할 수 있게 된다. 지난주에 배운 변수와 자료형이 값을 다루는 도구였다면, 이번 주에 배우는 세 가지는 <b>흐름을 다루는 도구</b>다. 그리고 이 도구들로 금융의 가장 근본적인 질문인 \"오늘의 1원과 1년 뒤의 1원은 왜 다른가\"에 답하는 계산을 직접 구현한다.",

  slides: [
    /* ── 0. 1주차 복습 노트 ── */
    {
      title: "0. 1주차 복습 노트",
      blocks: [
        {
          t: "p",
          text: "본격적으로 시작하기 전에 지난주 내용을 한 번에 훑는다. 아래 표의 내용이 바로 떠오르지 않으면 1주차 자료를 먼저 확인하는 것이 좋다.",
        },
        {
          t: "table",
          head: ["개념", "한 줄 정의", "핵심"],
          rows: [
            ["<b>변수</b>", "값을 저장하기 위해 이름을 붙인 공간", "<code>=</code>는 대입, <code>==</code>는 비교"],
            ["<b>자료형</b>", "값의 종류와 가능한 연산을 규정하는 분류", "<code>int</code>, <code>float</code>, <code>str</code>, <code>bool</code> / <code>type()</code>으로 확인"],
            ["<b>print()</b>", "값을 화면에 출력하는 함수", "출력만 할 뿐 값을 저장하지 않는다"],
            ["<b>input()</b>", "사용자 입력을 받는 함수", "<b>결과는 항상 문자열</b>, 계산하려면 형변환 필수"],
            ["<b>f-string</b>", "문자열에 값을 삽입하는 서식 문법", "금액은 <code>:,.0f</code>, 비율은 <code>:.2%</code>"],
            ["<b>주석</b>", "실행되지 않는 설명문", "<code>#</code>, 무엇이 아니라 <b>왜</b>를 적는다"],
          ],
        },
        { t: "h", text: "코드로 보는 1주차" },
        {
          t: "code",
          lang: "python",
          code: `principal = int(input("원금(원): "))          # 입력 → int로 형변환
rate = float(input("연 이자율(예: 0.05): "))   # 입력 → float로 형변환
years = int(input("기간(년): "))

total = principal * (1 + rate) ** years       # ** 는 거듭제곱

print(f"{years}년 후 원리금은 {total:,.0f}원입니다")`,
        },
      ],
    },
    {
      title: "이번 주 시작 전 준비",
      blocks: [
        { t: "p", text: "지난주에 만든 프로젝트 폴더를 열고 가상환경을 활성화한다." },
        {
          t: "table",
          head: ["OS", "활성화 명령"],
          rows: [
            ["Windows", "<code>.\\venv\\Scripts\\Activate.ps1</code>"],
            ["macOS / Linux", "<code>source venv/bin/activate</code>"],
          ],
        },
        {
          t: "p",
          text: "프롬프트 앞에 <code>(venv)</code>가 보이면 준비 완료다. 이번 주 코드는 <code>week2.py</code> 파일에 작성한다.",
        },
      ],
    },

    /* ── 1. 조건문 ── */
    {
      title: "1. 조건문 (Conditional Statement)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>조건문이란 주어진 조건식의 참/거짓 여부에 따라 실행할 코드 블록을 선택하는 제어 구조다.</b> 파이썬에서는 <code>if</code>, <code>elif</code>, <code>else</code> 키워드로 표현한다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "조건문은 <b>갈림길의 이정표</b>다. 프로그램은 위에서 아래로 한 줄씩 달리다가 조건문을 만나면 이정표를 읽고 어느 길로 갈지 정한다. 조건이 참인 길만 지나가고, 나머지 길은 아예 밟지 않는다.",
        },
        { t: "h", text: "기본 구조" },
        {
          t: "code",
          lang: "python",
          code: `rate = 0.05

if rate > 0.03:
    print("고금리")
else:
    print("저금리")`,
        },
        { t: "p", text: "주목할 두 가지 문법 요소가 있다." },
        {
          t: "ol",
          items: [
            { text: "<b>콜론(<code>:</code>)</b> — 조건식 끝에 반드시 붙인다. 빠뜨리면 <code>SyntaxError</code>가 난다." },
            { text: "<b>들여쓰기(indent)</b> — 조건이 참일 때 실행할 코드는 반드시 안쪽으로 들여쓴다. 파이썬은 중괄호 대신 <b>들여쓰기로 코드 블록을 구분</b>한다. 관례는 공백 4칸이며, VSCode에서 <code>Tab</code> 키를 누르면 자동으로 4칸이 입력된다." },
          ],
        },
        {
          t: "code",
          lang: "python",
          code: `if rate > 0.03:
print("고금리")        # IndentationError: 들여쓰기가 없다`,
        },
      ],
    },
    {
      title: "여러 갈래: elif",
      blocks: [
        {
          t: "p",
          text: "조건이 셋 이상일 때는 <code>elif</code>(else if)를 사용한다. 위에서부터 순서대로 검사하고, <b>처음으로 참이 되는 하나만</b> 실행한 뒤 조건문 전체를 빠져나온다.",
        },
        {
          t: "code",
          lang: "python",
          code: `profit_rate = 0.12

if profit_rate > 0.10:
    grade = "우수"
elif profit_rate > 0.05:
    grade = "양호"
elif profit_rate > 0:
    grade = "보통"
else:
    grade = "손실"

print(f"수익률 {profit_rate:.2%} → {grade}")
# 수익률 12.00% → 우수`,
        },
        {
          t: "p",
          text: "<code>elif</code>와 <code>else</code>는 생략할 수 있다. <code>if</code>만 단독으로 쓰는 것도 완전히 정상이다.",
        },
      ],
    },
    {
      title: "비교 연산자",
      blocks: [
        {
          t: "table",
          head: ["연산자", "의미", "예시", "결과"],
          rows: [
            ["<code>==</code>", "같다", "<code>5 == 5</code>", "<code>True</code>"],
            ["<code>!=</code>", "다르다", "<code>5 != 3</code>", "<code>True</code>"],
            ["<code>&gt;</code>", "크다", "<code>5 &gt; 3</code>", "<code>True</code>"],
            ["<code>&lt;</code>", "작다", "<code>5 &lt; 3</code>", "<code>False</code>"],
            ["<code>&gt;=</code>", "크거나 같다", "<code>5 &gt;= 5</code>", "<code>True</code>"],
            ["<code>&lt;=</code>", "작거나 같다", "<code>5 &lt;= 3</code>", "<code>False</code>"],
          ],
        },
        {
          t: "p",
          text: "비교 연산의 결과는 항상 <code>bool</code>(<code>True</code> 또는 <code>False</code>)이다.",
        },
        {
          t: "code",
          lang: "python",
          code: `print(5 > 3)          # True
print(type(5 > 3))    # <class 'bool'>`,
        },
      ],
    },
    {
      title: "논리 연산자",
      blocks: [
        { t: "p", text: "여러 조건을 조합할 때 사용한다." },
        {
          t: "table",
          head: ["연산자", "의미", "예시"],
          rows: [
            ["<code>and</code>", "둘 다 참일 때 참", "<code>rate &gt; 0 and years &gt; 0</code>"],
            ["<code>or</code>", "하나라도 참이면 참", "<code>rate &gt; 0.1 or is_safe</code>"],
            ["<code>not</code>", "참/거짓을 뒤집음", "<code>not is_safe</code>"],
          ],
        },
        {
          t: "code",
          lang: "python",
          code: `rate = 0.05
years = 3

if rate > 0 and years > 0:
    print("계산 가능한 입력입니다")

if rate <= 0 or years <= 0:
    print("입력값을 다시 확인하세요")`,
        },
        { t: "p", text: "파이썬에서는 범위 비교를 수학 표기처럼 이어 쓸 수 있다." },
        {
          t: "code",
          lang: "python",
          code: `if 0 < rate < 1:          # 0 < rate and rate < 1 과 동일
    print("정상 범위의 이자율")`,
        },
      ],
    },
    {
      title: "실전: 입력값 검증",
      blocks: [
        {
          t: "p",
          text: "조건문의 가장 흔한 용도는 <b>잘못된 입력을 걸러내는 것</b>이다.",
        },
        {
          t: "code",
          lang: "python",
          code: `principal = int(input("원금(원): "))

if principal <= 0:
    print("원금은 0보다 커야 합니다.")
else:
    print(f"원금 {principal:,}원이 입력되었습니다.")`,
        },
      ],
    },

    /* ── 2. 반복문 ── */
    {
      title: "2. 반복문 (Loop)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>반복문이란 특정 조건이 만족되는 동안, 또는 정해진 횟수만큼 동일한 코드 블록을 반복 실행하는 제어 구조다.</b> 파이썬에는 <code>for</code>문과 <code>while</code>문 두 가지가 있다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "반복문은 <b>복사기의 매수 설정</b>이다. 같은 동작을 사람이 손으로 열 번 적는 대신, \"이 동작을 10번 하라\"고 한 번만 지시하는 것이다. 복리 계산처럼 \"매년 같은 계산을 반복\"하는 금융 문제와 구조가 정확히 일치한다.",
        },
        { t: "h", text: "for문 — 정해진 횟수만큼 반복" },
        {
          t: "code",
          lang: "python",
          code: `for year in range(1, 4):
    print(f"{year}년차")

# 1년차
# 2년차
# 3년차`,
        },
        { t: "p", text: "<code>range()</code>는 연속된 정수를 만들어내는 함수다." },
        {
          t: "table",
          head: ["표기", "생성되는 값"],
          rows: [
            ["<code>range(3)</code>", "0, 1, 2"],
            ["<code>range(1, 4)</code>", "1, 2, 3"],
            ["<code>range(1, 10, 2)</code>", "1, 3, 5, 7, 9"],
          ],
        },
        {
          t: "p",
          text: "<b><code>range(a, b)</code>는 b를 포함하지 않는다.</b> 1년차부터 3년차까지 돌리려면 <code>range(1, 4)</code>라고 써야 한다. 초보자가 가장 자주 틀리는 부분이다.",
        },
      ],
    },
    {
      title: "for문으로 복리 계산 추적하기",
      blocks: [
        {
          t: "p",
          text: "지난주에는 <code>principal * (1 + rate) ** years</code> 한 줄로 최종값만 구했다. 반복문을 쓰면 <b>매년의 잔액 변화 과정</b>을 볼 수 있다.",
        },
        {
          t: "code",
          lang: "python",
          code: `principal = 1000000
rate = 0.05
years = 3

balance = principal   # 현재 잔액

for year in range(1, years + 1):
    interest = balance * rate      # 올해 붙은 이자
    balance = balance + interest   # 잔액에 이자를 더함
    print(f"{year}년차: 이자 {interest:,.0f}원 → 잔액 {balance:,.0f}원")

# 1년차: 이자 50,000원 → 잔액 1,050,000원
# 2년차: 이자 52,500원 → 잔액 1,102,500원
# 3년차: 이자 55,125원 → 잔액 1,157,625원`,
        },
        {
          t: "p",
          text: "여기서 <b>이자가 매년 커진다</b>는 점이 복리의 본질이다. 이자가 원금에 합쳐져 다음 해 이자의 기준이 되기 때문이다.",
        },
        {
          t: "p",
          text: "<code>balance = balance + interest</code>는 <code>balance += interest</code>로 줄여 쓸 수 있다. 이런 축약 연산자를 복합 대입 연산자라고 한다.",
        },
        {
          t: "table",
          head: ["축약형", "원래 형태"],
          rows: [
            ["<code>x += 1</code>", "<code>x = x + 1</code>"],
            ["<code>x -= 1</code>", "<code>x = x - 1</code>"],
            ["<code>x *= 2</code>", "<code>x = x * 2</code>"],
            ["<code>x /= 2</code>", "<code>x = x / 2</code>"],
          ],
        },
      ],
    },
    {
      title: "while문 — 조건이 참인 동안 반복",
      blocks: [
        {
          t: "p",
          text: "<code>for</code>문은 반복 횟수를 미리 알 때 쓰고, <code>while</code>문은 <b>몇 번 반복할지 모르고 조건으로만 판단할 때</b> 쓴다.",
        },
        {
          t: "code",
          lang: "python",
          code: `principal = 1000000
rate = 0.05
target = 2000000     # 목표: 원금의 2배

balance = principal
year = 0

while balance < target:
    balance *= (1 + rate)
    year += 1

print(f"{year}년 후 {balance:,.0f}원으로 목표를 달성합니다")
# 15년 후 2,078,928원으로 목표를 달성합니다`,
        },
        {
          t: "p",
          text: "\"자산이 두 배가 되는 데 몇 년이 걸리는가\"는 횟수를 미리 알 수 없는 문제이므로 <code>while</code>이 적합하다.",
        },
        { t: "h", text: "무한 루프 주의" },
        { t: "p", text: "<code>while</code>문의 조건이 영원히 참이면 프로그램이 멈추지 않는다." },
        {
          t: "code",
          lang: "python",
          code: `balance = 1000000
while balance < 2000000:
    print(balance)      # balance가 변하지 않아 영원히 반복`,
        },
        {
          t: "p",
          text: "반복문 안에서 <b>조건에 쓰인 변수가 반드시 변해야 한다.</b> 실수로 무한 루프에 빠졌다면 터미널에서 <code>Ctrl + C</code>를 눌러 강제 종료한다.",
        },
      ],
    },
    {
      title: "break와 continue",
      blocks: [
        {
          t: "table",
          head: ["키워드", "동작"],
          rows: [
            ["<code>break</code>", "반복문을 즉시 완전히 빠져나온다"],
            ["<code>continue</code>", "이번 회차만 건너뛰고 다음 회차로 넘어간다"],
          ],
        },
        {
          t: "code",
          lang: "python",
          code: `for year in range(1, 21):
    balance = 1000000 * (1 + 0.05) ** year
    if balance >= 2000000:
        print(f"{year}년차에 목표 달성")
        break          # 찾았으므로 더 볼 필요 없음`,
        },
      ],
    },

    /* ── 3. 함수 ── */
    {
      title: "3. 함수 (Function)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>함수란 특정 작업을 수행하는 코드를 하나의 이름으로 묶어, 필요할 때마다 그 이름으로 호출해 재사용할 수 있게 만든 단위다.</b> 입력값(매개변수)을 받아 처리한 뒤 결과값(반환값)을 돌려줄 수 있다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "함수는 <b>자판기</b>다. 돈과 버튼(입력)을 넣으면 음료(출력)가 나온다. 내부에서 어떤 일이 벌어지는지 몰라도 사용할 수 있고, 한 번 만들어두면 몇 번이든 다시 쓸 수 있다. 우리는 이미 <code>print()</code>, <code>input()</code>, <code>int()</code>, <code>type()</code> 같은 함수를 써왔다. 이제 직접 만든다.",
        },
        { t: "h", text: "기본 구조" },
        {
          t: "code",
          lang: "python",
          code: `def compound(principal, rate, years):
    """복리 원리금을 계산해 반환한다."""
    total = principal * (1 + rate) ** years
    return total`,
        },
        { t: "p", text: "구성 요소는 다음과 같다." },
        {
          t: "ul",
          items: [
            "<code>def</code> — 함수를 정의한다는 선언 (define)",
            "<code>compound</code> — 함수 이름 (변수 이름 규칙과 동일)",
            "<code>(principal, rate, years)</code> — <b>매개변수(parameter)</b>, 함수가 받을 입력",
            "<code>:</code> 와 들여쓰기 — 함수의 몸통",
            "<code>\"\"\"...\"\"\"</code> — <b>독스트링(docstring)</b>, 함수 설명. 생략 가능하지만 쓰는 것이 좋다",
            "<code>return</code> — 결과를 돌려주고 함수를 종료한다",
          ],
        },
      ],
    },
    {
      title: "호출하기",
      blocks: [
        {
          t: "p",
          text: "정의만 해서는 아무 일도 일어나지 않는다. <b>호출(call)</b> 해야 실행된다.",
        },
        {
          t: "code",
          lang: "python",
          code: `result = compound(1000000, 0.05, 3)
print(f"{result:,.0f}")   # 1,157,625`,
        },
        {
          t: "p",
          text: "호출할 때 넣는 값을 <b>인자(argument)</b> 라고 한다. 인자는 순서대로 매개변수에 대응된다.",
        },
        { t: "h", text: "return이 있는 함수와 없는 함수" },
        {
          t: "code",
          lang: "python",
          code: `# return이 있는 함수: 값을 돌려준다 → 변수에 저장 가능
def compound(principal, rate, years):
    return principal * (1 + rate) ** years

# return이 없는 함수: 화면에 출력만 하고 돌려주는 값이 없다
def show_result(principal, rate, years):
    total = principal * (1 + rate) ** years
    print(f"{total:,.0f}원")

a = compound(1000000, 0.05, 3)      # a = 1157625.0
b = show_result(1000000, 0.05, 3)   # 화면에 출력되지만 b는 None`,
        },
        {
          t: "p",
          text: "계산 결과를 재사용해야 한다면 반드시 <code>return</code>을 써야 한다. <code>print()</code>는 사람에게 보여줄 뿐 프로그램에 값을 넘겨주지 않는다.",
        },
      ],
    },
    {
      title: "기본값 매개변수 · 함수를 쓰는 이유",
      blocks: [
        {
          t: "p",
          text: "매개변수에 기본값을 지정하면, 호출할 때 그 인자를 생략할 수 있다.",
        },
        {
          t: "code",
          lang: "python",
          code: `def compound(principal, rate, years=1):    # years의 기본값은 1
    return principal * (1 + rate) ** years

print(compound(1000000, 0.05))       # 1050000.0  (years=1로 처리)
print(compound(1000000, 0.05, 3))    # 1157625.0`,
        },
        {
          t: "p",
          text: "기본값이 있는 매개변수는 <b>반드시 뒤쪽에 배치</b>해야 한다.",
        },
        { t: "h", text: "함수를 쓰는 이유" },
        {
          t: "ol",
          items: [
            { text: "<b>재사용</b> — 같은 계산을 여러 번 할 때 코드를 복사할 필요가 없다." },
            { text: "<b>수정의 용이성</b> — 계산식이 바뀌면 함수 한 곳만 고치면 된다." },
            { text: "<b>가독성</b> — <code>compound(principal, rate, years)</code>는 그 자체가 설명이다." },
            { text: "<b>검증의 용이성</b> — 함수 단위로 결과가 맞는지 확인할 수 있다." },
          ],
        },
        {
          t: "p",
          text: "7주차의 \"함수 모듈화\"는 여기서 배운 함수를 별도 파일로 분리하는 작업이다.",
        },
      ],
    },

    /* ── 4. 복리 ── */
    {
      title: "4. 복리 (Compound Interest)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>복리란 원금에 대해 발생한 이자를 원금에 합산하고, 그 합계에 대해 다시 이자를 계산하는 방식이다.</b> 이자가 이자를 낳는 구조이며, 이자를 원금에 더하지 않고 원금에만 이자를 계산하는 방식은 단리(simple interest)라고 한다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "단리가 <b>매년 같은 크기의 벽돌을 한 장씩 쌓는 것</b>이라면, 복리는 <b>쌓인 높이에 비례해 다음 벽돌이 커지는 것</b>이다. 초반에는 차이가 미미하지만 기간이 길어질수록 격차가 기하급수적으로 벌어진다.",
        },
        { t: "h", text: "공식" },
        { t: "math", tex: "\\text{단리: } A = P(1 + rt)" },
        { t: "math", tex: "\\text{복리: } A = P(1 + r)^t" },
        {
          t: "ul",
          items: ["$P$: 원금(principal), $r$: 연 이자율(rate), $t$: 기간(time, 년)"],
        },
        { t: "h", text: "코드" },
        {
          t: "code",
          lang: "python",
          code: `def simple_interest(principal, rate, years):
    """단리 원리금을 반환한다."""
    return principal * (1 + rate * years)


def compound_interest(principal, rate, years):
    """연 1회 복리 원리금을 반환한다."""
    return principal * (1 + rate) ** years


P, r, t = 1000000, 0.05, 3

print(f"단리: {simple_interest(P, r, t):,.0f}원")     # 1,150,000원
print(f"복리: {compound_interest(P, r, t):,.0f}원")   # 1,157,625원`,
        },
      ],
    },
    {
      title: "복리 횟수를 늘리면",
      blocks: [
        {
          t: "p",
          text: "이자를 1년에 한 번이 아니라 여러 번 나눠 지급하면 원리금은 더 커진다. 연 $m$회 복리의 공식은 다음과 같다.",
        },
        { t: "math", tex: "A = P\\left(1 + \\frac{r}{m}\\right)^{mt}" },
        {
          t: "code",
          lang: "python",
          code: `def compound_m(principal, rate, years, m=1):
    """연 m회 복리 원리금을 반환한다. m=12면 월복리."""
    return principal * (1 + rate / m) ** (m * years)


for m, label in [(1, "연복리"), (2, "반기복리"), (4, "분기복리"), (12, "월복리"), (365, "일복리")]:
    total = compound_m(1000000, 0.05, 3, m)
    print(f"{label:<8}(m={m:>3}): {total:,.2f}원")

# 연복리    (m=  1): 1,157,625.00원
# 반기복리  (m=  2): 1,159,693.42원
# 분기복리  (m=  4): 1,160,754.52원
# 월복리    (m= 12): 1,161,472.23원
# 일복리    (m=365): 1,161,822.44원`,
        },
        {
          t: "p",
          text: "$m$이 커질수록 원리금이 늘어나지만, 증가폭은 점점 작아지며 어떤 값에 수렴한다. 이 수렴값이 다음에 다룰 연속복리다.",
        },
      ],
    },

    /* ── 5. 연속복리 ── */
    {
      title: "5. 연속복리 (Continuous Compounding)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>연속복리란 복리 계산 주기를 무한히 짧게 했을 때의 극한값으로 정의되는 이자 계산 방식이다.</b> 위 공식에서 $m \\to \\infty$의 극한을 취하면 자연상수 $e$를 사용한 형태로 정리된다.",
        },
        {
          t: "math",
          tex: "A = \\lim_{m \\to \\infty} P\\left(1 + \\frac{r}{m}\\right)^{mt} = Pe^{rt}",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "앞의 표에서 이자 지급 주기를 연 1회 → 월 → 일로 촘촘하게 만들었지만, 값은 무한히 커지지 않고 어느 지점에 멈춰 섰다. 연속복리는 <b>이 촘촘하게 만드는 과정을 끝까지 밀어붙였을 때 도달하는 천장</b>이다. 실제 예금 상품이 이렇게 이자를 주지는 않지만, 옵션 가격 결정(블랙-숄즈 모형)을 비롯한 금융공학 모형은 수식이 깔끔해지는 이 방식을 기본으로 사용한다.",
        },
      ],
    },
    {
      title: "연속복리 — 코드",
      blocks: [
        {
          t: "p",
          text: "자연상수 $e$를 쓰려면 파이썬 표준 라이브러리 <code>math</code>가 필요하다. 파일 맨 위에서 불러온다.",
        },
        {
          t: "code",
          lang: "python",
          code: `import math

print(math.e)          # 2.718281828459045
print(math.exp(1))     # 2.718281828459045  (e의 1제곱)
print(math.log(math.e))  # 1.0  (자연로그)`,
        },
        {
          t: "p",
          text: "<code>import</code>는 3주차에서 본격적으로 다루지만, <code>math</code>는 파이썬에 기본 내장되어 있어 별도 설치 없이 바로 쓸 수 있다.",
        },
        {
          t: "code",
          lang: "python",
          code: `import math


def continuous_compound(principal, rate, years):
    """연속복리 원리금을 반환한다."""
    return principal * math.exp(rate * years)


P, r, t = 1000000, 0.05, 3

print(f"연복리    : {P * (1 + r) ** t:,.2f}원")            # 1,157,625.00원
print(f"월복리    : {P * (1 + r/12) ** (12*t):,.2f}원")    # 1,161,472.23원
print(f"연속복리  : {continuous_compound(P, r, t):,.2f}원")  # 1,161,834.24원`,
        },
        {
          t: "p",
          text: "일복리(1,161,822원)와 연속복리(1,161,834원)의 차이가 12원에 불과하다는 점에서, 극한값에 거의 도달했음을 확인할 수 있다.",
        },
      ],
    },

    /* ── 6. NPV ── */
    {
      title: "6. NPV — 순현재가치 (Net Present Value)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>순현재가치란 미래에 발생할 모든 현금흐름을 특정 할인율로 현재 시점의 가치로 환산해 합산한 값이다.</b> 투자안의 가치를 평가하는 가장 기본적인 지표다.",
        },
        { t: "math", tex: "NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}" },
        {
          t: "ul",
          items: [
            "$CF_t$: $t$시점의 현금흐름 (투자금은 음수, 회수금은 양수)",
            "$r$: 할인율(discount rate)",
          ],
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "복리가 \"오늘의 100만 원이 3년 뒤 얼마가 되는가\"를 묻는다면, <b>NPV는 그 질문을 거꾸로 뒤집은 것</b>이다. \"3년 뒤에 받을 100만 원은 오늘 기준으로 얼마짜리인가.\" 미래의 돈은 기다리는 동안 다른 곳에 투자할 기회를 포기한 대가가 있으므로, 오늘의 같은 금액보다 가치가 낮다. 그 할인 과정을 거쳐 모든 시점의 돈을 <b>오늘이라는 하나의 기준선 위에 나란히 세운 뒤</b> 더한 값이 NPV다.",
        },
        { t: "h", text: "판단 기준" },
        {
          t: "table",
          head: ["NPV", "의미"],
          rows: [
            ["<code>&gt; 0</code>", "요구수익률 이상의 가치를 창출 → 투자 타당"],
            ["<code>= 0</code>", "요구수익률과 정확히 일치"],
            ["<code>&lt; 0</code>", "요구수익률에 미달 → 투자 부적합"],
          ],
        },
      ],
    },
    {
      title: "NPV — 코드",
      blocks: [
        {
          t: "p",
          text: "현금흐름은 리스트(<code>list</code>)로 표현한다. 리스트는 3주차의 주제지만, 여기서는 \"여러 값을 순서대로 담는 상자\"라는 정도로만 이해하면 충분하다.",
        },
        {
          t: "code",
          lang: "python",
          code: `def npv(rate, cashflows):
    """
    할인율과 현금흐름 리스트를 받아 순현재가치를 반환한다.
    cashflows[0]은 0시점(현재), cashflows[1]은 1년 후, ... 를 의미한다.
    """
    total = 0
    for t in range(len(cashflows)):
        total += cashflows[t] / (1 + rate) ** t
    return total


# 지금 100만원을 투자하고, 이후 3년간 매년 40만원씩 회수하는 사업
cashflows = [-1000000, 400000, 400000, 400000]

print(f"할인율 8%  → NPV {npv(0.08, cashflows):,.0f}원")   # 30,839원
print(f"할인율 9%  → NPV {npv(0.09, cashflows):,.0f}원")   # 12,518원
print(f"할인율 10% → NPV {npv(0.10, cashflows):,.0f}원")   # -5,259원`,
        },
        {
          t: "p",
          text: "<code>len(cashflows)</code>는 리스트에 담긴 값의 개수(여기서는 4)를 돌려주고, <code>cashflows[t]</code>는 t번째 값을 꺼낸다. <b>파이썬의 순번은 0부터 시작</b>하므로 <code>cashflows[0]</code>이 현재 시점의 현금흐름이 된다. 이는 $t=0$에서 $(1+r)^0 = 1$이 되어 할인되지 않는다는 수식과도 자연스럽게 맞아떨어진다.",
        },
        {
          t: "p",
          text: "위 결과에서 할인율이 높아질수록 NPV가 작아지고, 9%와 10% 사이 어딘가에서 0을 지난다는 것을 알 수 있다. 바로 그 지점이 IRR이다.",
        },
      ],
    },

    /* ── 7. IRR ── */
    {
      title: "7. IRR — 내부수익률 (Internal Rate of Return)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>내부수익률이란 어떤 투자안의 순현재가치를 정확히 0으로 만드는 할인율이다.</b> 그 사업 자체가 만들어내는 수익률로 해석할 수 있다.",
        },
        { t: "math", tex: "\\sum_{t=0}^{n} \\frac{CF_t}{(1+IRR)^t} = 0" },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "NPV가 \"이 할인율에서 이 사업은 얼마짜리인가\"를 묻는다면, IRR은 <b>\"이 사업의 손익분기점이 되는 수익률은 몇 %인가\"</b> 를 묻는다. 저울의 양쪽(투자금과 회수금)이 정확히 평형을 이루는 지점의 눈금을 찾는 것과 같다. 이 눈금이 내 요구수익률보다 높으면 투자할 만하다는 뜻이다.",
        },
        { t: "h", text: "왜 반복문이 필요한가" },
        {
          t: "p",
          text: "복리나 NPV는 공식에 값을 대입하면 바로 답이 나온다. 그러나 IRR은 다르다. 위 식에서 $IRR$은 분모의 거듭제곱 안에 갇혀 있어서, 일반적으로 <b>식을 정리해 $IRR = \\cdots$ 형태로 풀어낼 수 없다.</b>",
        },
        {
          t: "p",
          text: "그래서 컴퓨터는 다른 전략을 쓴다. <b>여러 값을 대입해보며 정답에 가까워지는 방식</b>, 즉 수치해석적 탐색이다. 반복문이 필요한 이유가 여기에 있다.",
        },
      ],
    },
    {
      title: "방법 1: 이분법 (Bisection)",
      blocks: [
        {
          t: "p",
          text: "정답이 들어 있는 구간을 절반씩 좁혀나가는 방법이다. 스무고개에서 \"50보다 큰가요?\"를 반복해 범위를 좁히는 것과 같은 원리다.",
        },
        {
          t: "p",
          text: "앞의 예시에서 NPV는 9%일 때 양수(+12,518), 10%일 때 음수(-5,259)였다. 따라서 <b>정답은 반드시 9%와 10% 사이에 있다.</b> 이 구간을 계속 반으로 잘라가며 좁힌다.",
        },
        {
          t: "code",
          lang: "python",
          code: `def irr_bisection(cashflows, low=0.0, high=1.0, tolerance=1e-7, max_iter=200):
    """
    이분법으로 IRR을 구한다.
    low, high : 탐색을 시작할 할인율 구간
    tolerance : 이 정도로 구간이 좁아지면 정답으로 인정
    max_iter  : 최대 반복 횟수 (무한 루프 방지)
    """
    for _ in range(max_iter):
        mid = (low + high) / 2
        value = npv(mid, cashflows)

        if abs(value) < tolerance or (high - low) < tolerance:
            return mid

        if value > 0:
            low = mid       # NPV가 양수 → 할인율을 더 올려야 함
        else:
            high = mid      # NPV가 음수 → 할인율을 낮춰야 함

    return mid


cashflows = [-1000000, 400000, 400000, 400000]
result = irr_bisection(cashflows)

print(f"IRR = {result:.4%}")                    # IRR = 9.7010%
print(f"검산 NPV = {npv(result, cashflows):,.4f}")   # 검산 NPV = 0.0000`,
        },
        {
          t: "p",
          text: "<code>for _ in range(max_iter)</code>의 언더스코어(<code>_</code>)는 <b>반복 횟수만 필요하고 그 값 자체는 쓰지 않을 때</b> 관례적으로 쓰는 변수명이다.",
        },
        {
          t: "p",
          text: "<code>max_iter</code>로 반복 상한을 두는 이유는 안전장치 때문이다. 조건을 만족하지 못하는 입력이 들어와도 프로그램이 무한히 도는 일을 막는다.",
        },
      ],
    },
    {
      title: "탐색 과정 들여다보기",
      blocks: [
        {
          t: "p",
          text: "이분법이 어떻게 좁혀나가는지 직접 출력해보면 이해가 빨라진다.",
        },
        {
          t: "code",
          lang: "python",
          code: `low, high = 0.0, 1.0
cashflows = [-1000000, 400000, 400000, 400000]

for i in range(1, 11):
    mid = (low + high) / 2
    value = npv(mid, cashflows)
    print(f"{i:>2}회차: 구간 [{low:.4%}, {high:.4%}] 중간 {mid:.4%} → NPV {value:>12,.0f}")

    if value > 0:
        low = mid
    else:
        high = mid

#  1회차: 구간 [0.0000%, 100.0000%] 중간 50.0000% → NPV     -288,889
#  2회차: 구간 [0.0000%, 50.0000%] 중간 25.0000% → NPV      -219,200
#  3회차: 구간 [0.0000%, 25.0000%] 중간 12.5000% → NPV      -40,741
# ...`,
        },
        {
          t: "p",
          text: "회차가 거듭될수록 구간이 절반씩 줄어들며 9.70% 근처로 수렴하는 것을 확인할 수 있다.",
        },
      ],
    },
    {
      title: "IRR 해석 시 주의점",
      blocks: [
        {
          t: "ul",
          items: [
            "<b>재투자 가정</b> — IRR은 회수한 현금을 다시 IRR과 같은 수익률로 재투자할 수 있다고 가정한다. 현실에서 항상 성립하지는 않는다.",
            "<b>복수 IRR 문제</b> — 현금흐름의 부호가 여러 번 바뀌면 NPV를 0으로 만드는 할인율이 두 개 이상 존재할 수 있다.",
            "<b>규모를 반영하지 못함</b> — IRR은 비율이므로 사업의 절대적 크기를 알려주지 않는다. 1억을 버는 사업과 100만 원을 버는 사업의 IRR이 같을 수 있다.",
          ],
        },
        { t: "p", text: "이런 이유로 실무에서는 NPV와 IRR을 함께 본다." },
      ],
    },

    /* ── 정리 ── */
    {
      title: "오늘 배운 것 정리 — 파이썬 문법",
      blocks: [
        {
          t: "table",
          head: ["개념", "한 줄 정의", "핵심"],
          rows: [
            ["<b>조건문</b>", "조건의 참/거짓에 따라 실행할 블록을 고르는 구조", "<code>if</code>/<code>elif</code>/<code>else</code>, 콜론과 들여쓰기 필수"],
            ["<b>for문</b>", "정해진 횟수만큼 반복하는 구조", "<code>range(a, b)</code>는 <b>b를 포함하지 않는다</b>"],
            ["<b>while문</b>", "조건이 참인 동안 반복하는 구조", "조건 변수가 변하지 않으면 무한 루프"],
            ["<b>함수</b>", "코드를 이름으로 묶어 재사용하는 단위", "<code>def</code>로 정의, <code>return</code>으로 값 반환"],
          ],
        },
        {
          t: "p",
          text: "기억할 것: <code>return</code>이 없으면 함수는 <code>None</code>을 돌려준다. 계산 결과를 재사용하려면 <code>print()</code>가 아니라 <code>return</code>을 써야 한다.",
        },
      ],
    },
    {
      title: "오늘 배운 것 정리 — 금융 개념",
      blocks: [
        {
          t: "table",
          head: ["개념", "정의", "공식"],
          rows: [
            ["<b>단리</b>", "원금에만 이자를 계산", "$A = P(1+rt)$"],
            ["<b>복리</b>", "이자를 원금에 합산해 다시 이자를 계산", "$A = P(1+r)^t$"],
            ["<b>연 m회 복리</b>", "이자 지급 주기를 나눔", "$A = P(1+r/m)^{mt}$"],
            ["<b>연속복리</b>", "복리 주기를 무한히 짧게 한 극한", "$A = Pe^{rt}$"],
            ["<b>NPV</b>", "미래 현금흐름을 현재가치로 환산한 합", "$\\sum CF_t/(1+r)^t$"],
            ["<b>IRR</b>", "NPV를 0으로 만드는 할인율", "$\\sum CF_t/(1+IRR)^t = 0$"],
          ],
        },
        {
          t: "p",
          text: "세 가지를 연결해서 기억하면 좋다. <b>복리는 현재 → 미래, NPV는 미래 → 현재, IRR은 그 둘을 잇는 수익률</b>이다.",
        },
      ],
    },

    /* ── 오늘의 코드 ── */
    {
      title: "오늘의 코드",
      blocks: [
        {
          t: "p",
          text: "<code>week2.py</code> 파일에 아래 코드를 붙여넣고 실행한다. 이번 주에 배운 문법과 금융 개념이 모두 들어 있다.",
        },
        {
          t: "code",
          lang: "python",
          code: `"""
2주차 실습 — 화폐의 시간가치 계산기
복리 / 연속복리 / NPV / IRR을 함수로 구현하고 결과를 비교한다.
"""

import math


# ── 이자 계산 함수 ────────────────────────────────────

def simple_interest(principal, rate, years):
    """단리 원리금을 반환한다."""
    return principal * (1 + rate * years)


def compound_interest(principal, rate, years, m=1):
    """연 m회 복리 원리금을 반환한다. m=1이면 연복리, m=12면 월복리."""
    return principal * (1 + rate / m) ** (m * years)


def continuous_compound(principal, rate, years):
    """연속복리 원리금을 반환한다."""
    return principal * math.exp(rate * years)


# ── 투자안 평가 함수 ──────────────────────────────────

def npv(rate, cashflows):
    """할인율과 현금흐름 리스트로 순현재가치를 계산한다."""
    total = 0
    for t in range(len(cashflows)):
        total += cashflows[t] / (1 + rate) ** t
    return total


def irr(cashflows, low=0.0, high=1.0, tolerance=1e-7, max_iter=200):
    """이분법으로 NPV를 0으로 만드는 할인율(IRR)을 찾는다."""
    for _ in range(max_iter):
        mid = (low + high) / 2
        value = npv(mid, cashflows)

        if abs(value) < tolerance or (high - low) < tolerance:
            return mid

        if value > 0:
            low = mid
        else:
            high = mid

    return mid


# ── 1) 이자 계산 방식 비교 ────────────────────────────

principal = int(input("원금(원): "))
rate = float(input("연 이자율(예: 0.05): "))
years = int(input("기간(년): "))

# 입력값 검증
if principal <= 0 or years <= 0:
    print("원금과 기간은 0보다 커야 합니다.")
else:
    print()
    print("=" * 46)
    print(f"원금 {principal:,}원 / 연 {rate:.2%} / {years}년")
    print("=" * 46)
    print(f"{'단리':<12}{simple_interest(principal, rate, years):>18,.0f}원")
    print(f"{'연복리':<11}{compound_interest(principal, rate, years, 1):>18,.0f}원")
    print(f"{'분기복리':<10}{compound_interest(principal, rate, years, 4):>18,.0f}원")
    print(f"{'월복리':<11}{compound_interest(principal, rate, years, 12):>18,.0f}원")
    print(f"{'연속복리':<10}{continuous_compound(principal, rate, years):>18,.0f}원")
    print("=" * 46)

    # ── 2) 연도별 복리 잔액 추이 ──────────────────────
    print()
    print("연도별 복리 잔액")
    print("-" * 46)

    balance = principal
    for year in range(1, years + 1):
        interest = balance * rate
        balance += interest
        print(f"{year:>2}년차   이자 {interest:>12,.0f}원   잔액 {balance:>14,.0f}원")

    # ── 3) 원금 2배 도달 시점 ─────────────────────────
    print()
    balance = principal
    year = 0
    while balance < principal * 2:
        balance *= (1 + rate)
        year += 1
    print(f"원금이 2배가 되기까지 {year}년 (잔액 {balance:,.0f}원)")


# ── 4) 투자안 평가 ────────────────────────────────────

cashflows = [-1000000, 400000, 400000, 400000]

print()
print("=" * 46)
print("투자안 평가 (0년차 -100만원, 1~3년차 +40만원)")
print("=" * 46)

for r in [0.05, 0.08, 0.10, 0.15]:
    value = npv(r, cashflows)
    verdict = "투자 타당" if value > 0 else "투자 부적합"
    print(f"할인율 {r:>6.2%}   NPV {value:>12,.0f}원   {verdict}")

print("-" * 46)
print(f"IRR = {irr(cashflows):.4%}")
print("=" * 46)`,
        },
        {
          t: "p",
          text: "<code>\"투자 타당\" if value &gt; 0 else \"투자 부적합\"</code>처럼 한 줄로 쓴 조건문을 <b>삼항 연산자</b>라고 한다. 간단한 분기를 짧게 쓸 때 유용하다.",
        },
      ],
    },

    /* ── 오늘의 테스트 ── */
    {
      title: "오늘의 테스트 (1)",
      blocks: [
        {
          t: "quiz",
          no: "Q1",
          q: "다음 코드의 출력 결과는?",
          code: `for i in range(1, 4):
    print(i, end=" ")`,
          options: ["<code>0 1 2 3</code>", "<code>1 2 3</code>", "<code>1 2 3 4</code>", "<code>0 1 2</code>"],
          correct: [2],
          explain:
            "<code>range(1, 4)</code>는 1부터 시작해 <b>4를 포함하지 않고</b> 3까지 생성한다. <code>end=\" \"</code>는 줄바꿈 대신 공백을 붙인다.",
        },
        {
          t: "quiz",
          no: "Q2",
          q: "다음 코드에서 발생하는 문제는?",
          code: `balance = 1000000
while balance < 2000000:
    print(balance)`,
          options: [
            "<code>while</code> 뒤에 콜론이 없다",
            "<code>balance</code>가 변하지 않아 무한 루프에 빠진다",
            "<code>print()</code> 안에 f-string을 써야 한다",
            "문제없이 정상 동작한다",
          ],
          correct: [2],
          explain:
            "반복문 안에서 조건에 쓰인 변수(<code>balance</code>)가 전혀 변하지 않으므로 조건이 영원히 참이다. 실행됐다면 <code>Ctrl + C</code>로 강제 종료한다.",
        },
        {
          t: "quiz",
          no: "Q3",
          q: "다음 코드의 출력 결과는?",
          code: `def add_interest(balance, rate):
    balance = balance * (1 + rate)
    print(balance)

result = add_interest(1000000, 0.05)
print(result)`,
          input: {
            label: "출력 결과 (두 줄)",
            accept: ["1050000.0\nNone"],
            multiline: true,
            placeholder: "한 줄에 하나씩",
          },
          explain:
            "함수 안의 <code>print()</code>로 1050000.0이 출력되지만, <code>return</code>이 없으므로 함수는 <code>None</code>을 돌려준다. 따라서 <code>result</code>에는 <code>None</code>이 들어간다. 값을 사용하려면 <code>return balance</code>가 필요하다.",
        },
      ],
    },
    {
      title: "오늘의 테스트 (2)",
      blocks: [
        {
          t: "quiz",
          no: "Q4",
          q: "수익률에 따라 등급을 매기는 코드다. <code>profit_rate = 0.12</code>일 때 출력되는 값은?",
          code: `profit_rate = 0.12

if profit_rate > 0.05:
    print("양호")
elif profit_rate > 0.10:
    print("우수")
else:
    print("보통")`,
          options: ["<code>우수</code>", "<code>양호</code>", "<code>양호</code>와 <code>우수</code> 둘 다", "<code>보통</code>"],
          correct: [2],
          explain:
            "<code>if</code>/<code>elif</code>는 위에서부터 검사해 <b>처음 참이 되는 하나만</b> 실행하고 빠져나온다. 0.12는 첫 조건(<code>&gt; 0.05</code>)에서 이미 참이므로 <code>우수</code>에는 도달하지 못한다. 의도대로 하려면 조건을 엄격한 순서(큰 값부터)로 배치해야 한다.",
        },
        {
          t: "quiz",
          no: "Q5",
          q: "원금 100만 원, 연 이자율 5%, 3년일 때 원리금이 가장 큰 방식은?",
          options: ["단리", "연복리", "월복리", "연속복리"],
          correct: [4],
          explain: "복리 주기가 짧아질수록 원리금이 커지며, 그 극한이 연속복리($Pe^{rt}$)다.",
          explainCode: `단리     1,150,000원
연복리   1,157,625원
월복리   1,161,472원
연속복리 1,161,834원`,
        },
        {
          t: "quiz",
          no: "Q6",
          q: "NPV에 대한 설명 중 옳지 <b>않은</b> 것은?",
          options: [
            "할인율이 높아질수록 NPV는 작아진다",
            "NPV가 0보다 크면 요구수익률 이상의 가치를 창출한다는 뜻이다",
            "$t=0$ 시점의 현금흐름도 할인율로 나눠야 한다",
            "투자금은 음수, 회수금은 양수로 표현한다",
          ],
          correct: [3],
          explain:
            "$t=0$은 현재 시점이므로 $(1+r)^0 = 1$이 되어 할인되지 않는다. 코드에서도 <code>cashflows[0] / (1+rate)**0</code>은 원래 값 그대로다.",
        },
      ],
    },
    {
      title: "오늘의 테스트 (3)",
      blocks: [
        {
          t: "quiz",
          no: "Q7",
          q: "IRR을 구할 때 반복문(이분법)을 쓰는 이유로 가장 적절한 것은?",
          options: [
            "IRR 공식이 너무 길어서 한 줄에 쓸 수 없기 때문",
            "IRR이 거듭제곱의 지수 안에 있어 일반적으로 식을 정리해 직접 풀 수 없기 때문",
            "파이썬에 거듭제곱 연산자가 없기 때문",
            "현금흐름이 리스트로 되어 있기 때문",
          ],
          correct: [2],
          explain:
            "$\\sum CF_t/(1+IRR)^t = 0$에서 IRR은 분모의 거듭제곱 안에 갇혀 있어 대수적으로 분리할 수 없다. 그래서 값을 대입해가며 정답에 접근하는 수치해석적 방법을 사용한다.",
        },
        {
          t: "quiz",
          no: "Q8",
          q: "빈칸을 채워 함수를 완성하시오. 원금이 목표 금액에 도달하는 데 걸리는 햇수를 반환하는 함수다.",
          code: `def years_to_target(principal, rate, target):
    """복리로 목표 금액에 도달하기까지 걸리는 햇수를 반환한다."""
    balance = principal
    year = 0

    ______ balance < target:
        balance *= (1 + rate)
        year ______ 1

    ______ year


print(years_to_target(1000000, 0.05, 2000000))   # 15`,
          blanks: [
            { label: "첫 번째 빈칸", accept: ["while"] },
            { label: "두 번째 빈칸", accept: ["+=", "+ ="] },
            { label: "세 번째 빈칸", accept: ["return"] },
          ],
          explain:
            "반복 횟수를 미리 알 수 없으므로 <code>while</code>을 사용하고, 결과를 재사용해야 하므로 <code>return</code>으로 값을 돌려준다.",
          explainCode: `def years_to_target(principal, rate, target):
    """복리로 목표 금액에 도달하기까지 걸리는 햇수를 반환한다."""
    balance = principal
    year = 0

    while balance < target:
        balance *= (1 + rate)
        year += 1

    return year`,
        },
        {
          t: "quiz",
          no: "Q9",
          q: "(심화) 아래 코드의 실행 결과를 예상하시오.",
          code: `cashflows = [-1000000, 400000, 400000, 400000]

low, high = 0.0, 1.0
for _ in range(3):
    mid = (low + high) / 2
    if npv(mid, cashflows) > 0:
        low = mid
    else:
        high = mid

print(f"{low:.2%} ~ {high:.2%}")`,
          input: {
            label: "출력 결과",
            accept: ["0.00% ~ 12.50%"],
            placeholder: "예: 0.00% ~ 50.00%",
          },
          explain:
            "1회차: mid=50%, NPV&lt;0 → high=0.5<br>2회차: mid=25%, NPV&lt;0 → high=0.25<br>3회차: mid=12.5%, NPV&lt;0 → high=0.125<br><br>세 번 만에 구간이 1/8로 줄었다. 정답인 9.70%는 이 구간 안에 들어 있다.",
        },
      ],
    },
  ],

  outroTitle: "다음 주 예고",
  outro: [
    {
      t: "p",
      text: "3주차에서는 <b>수익률과 금융 데이터</b>를 다룬다. 이번 주에 잠깐 등장한 <b>리스트</b>를 제대로 배우고, <b>딕셔너리</b>와 <b>라이브러리 임포트</b>를 익힌 뒤 실제 주가 데이터로 <b>로그수익률</b>을 계산한다. <code>pandas</code>를 처음 사용하는 주차다.",
    },
    {
      t: "p",
      text: "이번 주에 만든 <code>npv()</code>, <code>irr()</code> 같은 함수는 7주차 포트폴리오 집행에서 다시 불러 쓰게 되므로 <code>week2.py</code>를 지우지 말고 보관해둔다.",
    },
  ],
};
