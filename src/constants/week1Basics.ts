import type { Block } from "./mdBlock";

/** 파이썬 기초 — week1-python-basics.md 를 옮긴 것.
 *  문장·순서·코드를 바꾸지 않는다. 슬라이드 단위로만 나눈다. */

export interface BasicSlide {
  title: string;
  blocks: Block[];
}

export const WEEK1_INTRO =
  "변수 · 자료형 · print() · input() · f-string · 주석";

export const WEEK1_INTRO_P =
  "이번 주차는 앞으로 8주 동안 계속 사용할 파이썬의 가장 기본적인 문법을 다룬다. 여기서 다루는 여섯 가지 개념은 2주차 복리 계산부터 8주차 포트폴리오 구성까지 예외 없이 매주 등장한다.";

export const BASICS: BasicSlide[] = [
  /* ── 1. 변수 ── */
  {
    title: "1. 변수 (Variable)",
    blocks: [
      { t: "h", text: "정의" },
      {
        t: "p",
        text: "<b>변수란 값을 저장하기 위해 이름을 붙인 메모리 공간이다.</b> 프로그램이 실행되는 동안 값을 보관하고, 필요할 때 그 이름으로 다시 꺼내 쓸 수 있다.",
      },
      { t: "h", text: "비유" },
      {
        t: "p",
        text: "변수는 <b>이름표가 붙은 상자</b>다. <code>principal</code>이라는 이름표를 붙인 상자에 1,000,000을 넣어두면, 이후에는 상자 안의 숫자를 기억할 필요 없이 <code>principal</code>이라는 이름만 부르면 된다. 상자 안의 내용물은 언제든 다른 값으로 바꿔 넣을 수 있다.",
      },
      { t: "h", text: "대입 연산자 =" },
      { t: "code", code: "principal = 1000000", lang: "python" },
      {
        t: "p",
        text: '<code>=</code>는 수학의 "같다"가 아니라 <b>"오른쪽 값을 왼쪽 이름에 저장하라"</b> 는 명령이다. 이를 대입(assignment)이라고 한다.',
      },
      {
        t: "table",
        head: ["기호", "의미", "예시"],
        rows: [
          ["<code>=</code>", "대입 (저장하라)", "<code>rate = 0.05</code>"],
          ["<code>==</code>", "비교 (같은가?)", "<code>rate == 0.05</code> → <code>True</code>"],
        ],
      },
      { t: "p", text: "<code>==</code> 비교 연산자는 2주차 조건문에서 본격적으로 다룬다." },
    ],
  },
  {
    title: "변수 이름 규칙",
    blocks: [
      { t: "h", text: "반드시 지켜야 하는 규칙 (어기면 에러)" },
      {
        t: "ul",
        items: [
          "영문자, 숫자, 언더스코어(<code>_</code>)만 사용할 수 있다.",
          "숫자로 시작할 수 없다. → <code>1rate</code> 불가 / <code>rate1</code> 가능",
          "파이썬 예약어(<code>if</code>, <code>for</code>, <code>def</code>, <code>class</code>, <code>True</code> 등)는 사용할 수 없다.",
          "대소문자를 구분한다. <code>Rate</code>와 <code>rate</code>는 서로 다른 변수다.",
        ],
      },
      { t: "h", text: "지키면 좋은 관례 (어겨도 실행은 됨)" },
      {
        t: "ul",
        items: [
          "여러 단어는 언더스코어로 연결한다: <code>interest_rate</code>, <code>annual_return</code> (스네이크 케이스)",
          "<code>a</code>, <code>b</code>, <code>x</code> 같은 이름 대신 값의 의미를 담은 이름을 쓴다: <code>principal</code>, <code>rate</code>",
          "<code>print</code>, <code>type</code>, <code>sum</code>처럼 파이썬이 이미 제공하는 함수 이름은 피한다. 덮어쓰면 그 함수를 쓸 수 없게 된다.",
        ],
      },
      { t: "h", text: "값의 재대입" },
      {
        t: "code",
        lang: "python",
        code: `principal = 1000000
print(principal)      # 1000000

principal = 2000000   # 같은 이름에 새 값을 덮어씀
print(principal)      # 2000000`,
      },
      { t: "h", text: "여러 변수 한 번에 만들기" },
      {
        t: "code",
        lang: "python",
        code: `principal, rate, years = 1000000, 0.05, 3
print(principal, rate, years)   # 1000000 0.05 3`,
      },
    ],
  },

  /* ── 2. 자료형 ── */
  {
    title: "2. 자료형 (Data Type)",
    blocks: [
      { t: "h", text: "정의" },
      {
        t: "p",
        text: "<b>자료형이란 값이 어떤 종류의 데이터인지, 그리고 그 값으로 어떤 연산을 할 수 있는지를 규정하는 분류 체계다.</b> 파이썬은 변수를 만들 때 자료형을 따로 선언하지 않고, 대입된 값을 보고 자동으로 판단한다.",
      },
      { t: "h", text: "비유" },
      {
        t: "p",
        text: '자료형은 <b>물건의 종류</b>다. "1000000원"과 "천만이라는 글자"는 겉보기엔 비슷해도 성질이 다르다. 돈은 더하고 뺄 수 있지만 글자는 그럴 수 없다. 파이썬도 같은 이유로 값의 종류를 구분하며, 종류가 맞지 않는 연산을 시도하면 에러를 낸다.',
      },
      { t: "h", text: "파이썬의 주요 자료형" },
      {
        t: "table",
        head: ["자료형", "어원", "의미", "예시"],
        rows: [
          ["<code>int</code>", "integer", "정수", "<code>1000000</code>, <code>-3</code>, <code>0</code>"],
          ["<code>float</code>", "floating point number", "실수 (소수점)", "<code>0.05</code>, <code>3.14</code>, <code>-1.5</code>"],
          ["<code>str</code>", "string", "문자열", "<code>\"KRW\"</code>, <code>'삼성전자'</code>"],
          ["<code>bool</code>", "boolean", "참/거짓", "<code>True</code>, <code>False</code>"],
          ["<code>list</code>", "list", "순서가 있는 값의 묶음 (수정 가능)", "<code>[100, 200, 300]</code>"],
          ["<code>tuple</code>", "tuple", "순서가 있는 값의 묶음 (수정 불가)", "<code>(37.5, 127.0)</code>"],
          ["<code>dict</code>", "dictionary", "이름-값 쌍의 묶음", "<code>{\"삼성전자\": 70000}</code>"],
          ["<code>set</code>", "set", "중복이 없는 값의 묶음", "<code>{\"KRW\", \"USD\"}</code>"],
          ["<code>NoneType</code>", "none", "값이 없음을 나타내는 특별한 값", "<code>None</code>"],
        ],
      },
      {
        t: "p",
        text: '<code>list</code>, <code>tuple</code>, <code>dict</code>, <code>set</code>은 3주차에서 본격적으로 다룬다. 이번 주에는 "이런 것도 있다" 정도만 알아두면 된다.',
      },
      { t: "h", text: "자료형 확인하기: type()" },
      {
        t: "code",
        lang: "python",
        code: `principal = 1000000
rate = 0.05
currency = "KRW"
is_guaranteed = True
prices = [70000, 71000, 69500]
empty = None

print(type(principal))       # <class 'int'>
print(type(rate))            # <class 'float'>
print(type(currency))        # <class 'str'>
print(type(is_guaranteed))   # <class 'bool'>
print(type(prices))          # <class 'list'>
print(type(empty))           # <class 'NoneType'>`,
      },
    ],
  },
  {
    title: "문자열과 형변환",
    blocks: [
      { t: "h", text: "문자열은 반드시 따옴표로 감싼다" },
      {
        t: "code",
        lang: "python",
        code: `currency = "KRW"    # 문자열
currency = 'KRW'    # 작은따옴표도 동일
# currency = KRW    # 에러: KRW라는 변수를 찾다가 실패`,
      },
      {
        t: "p",
        text: "작은따옴표와 큰따옴표는 기능이 완전히 같다. 다만 문자열 안에 따옴표가 들어가야 할 때는 서로 다른 쪽을 쓰면 편하다.",
      },
      {
        t: "code",
        lang: "python",
        code: `message = "그는 '매수'라고 말했다"`,
      },
      { t: "h", text: "숫자처럼 생긴 문자열에 주의" },
      {
        t: "p",
        text: "따옴표로 감싼 순간, 겉모습이 숫자여도 파이썬은 글자로 취급한다.",
      },
      {
        t: "code",
        lang: "python",
        code: `a = 5        # int
b = "5"      # str

print(a + a)   # 10   → 숫자 덧셈
print(b + b)   # 55   → 문자열 이어붙이기(연결)
# print(a + b) # TypeError: int와 str은 더할 수 없음`,
      },
      { t: "h", text: "형변환 (Type Casting)" },
      { t: "p", text: "값의 자료형을 다른 자료형으로 바꾸는 것을 형변환이라 한다." },
      {
        t: "code",
        lang: "python",
        code: `print(int("5"))            # 5        문자열 → 정수
print(float("3.14"))       # 3.14     문자열 → 실수
print(str(1000000))        # '1000000'  숫자 → 문자열
print(int(3.9))            # 3        실수 → 정수 (버림, 반올림 아님)
print(bool(0))             # False    0은 거짓
print(bool(1))             # True     0이 아닌 모든 숫자는 참`,
      },
      {
        t: "p",
        text: "<code>int(3.9)</code>가 4가 아니라 3이 되는 것에 주의한다. 반올림이 아니라 소수점 아래를 버린다. 반올림이 필요하면 <code>round()</code>를 쓴다.",
      },
      {
        t: "code",
        lang: "python",
        code: `print(round(3.9))          # 4
print(round(3.14159, 2))   # 3.14   (소수점 둘째 자리까지)`,
      },
    ],
  },
  {
    title: "숫자 연산자",
    blocks: [
      {
        t: "table",
        head: ["연산자", "의미", "예시", "결과"],
        rows: [
          ["<code>+</code>", "덧셈", "<code>7 + 3</code>", "<code>10</code>"],
          ["<code>-</code>", "뺄셈", "<code>7 - 3</code>", "<code>4</code>"],
          ["<code>*</code>", "곱셈", "<code>7 * 3</code>", "<code>21</code>"],
          ["<code>/</code>", "나눗셈 (결과는 항상 float)", "<code>7 / 3</code>", "<code>2.333...</code>"],
          ["<code>//</code>", "몫", "<code>7 // 3</code>", "<code>2</code>"],
          ["<code>%</code>", "나머지", "<code>7 % 3</code>", "<code>1</code>"],
          ["<code>**</code>", "거듭제곱", "<code>7 ** 3</code>", "<code>343</code>"],
        ],
      },
      {
        t: "p",
        text: "<code>**</code>(거듭제곱)은 2주차 복리 계산에서 핵심적으로 사용된다.",
      },
      {
        t: "code",
        lang: "python",
        code: `principal = 1000000
rate = 0.05
years = 3

total = principal * (1 + rate) ** years
print(total)   # 1157625.0000000002`,
      },
    ],
  },

  /* ── 3. print() ── */
  {
    title: "3. print() — 화면에 출력하기",
    blocks: [
      { t: "h", text: "정의" },
      {
        t: "p",
        text: "<b><code>print()</code>는 괄호 안에 전달된 값을 화면(표준 출력)에 표시하는 내장 함수다.</b> 프로그램이 계산한 결과를 사람이 확인할 수 있게 만들어주는 통로다.",
      },
      { t: "h", text: "비유" },
      {
        t: "p",
        text: "print()는 <b>프로그램의 입</b>이다. 프로그램은 내부적으로 아무리 많은 계산을 해도, print()로 말하지 않으면 결과를 알려주지 않는다. 코드를 실행했는데 아무것도 안 나온다면, 대부분 계산은 됐지만 출력을 안 한 것이다.",
      },
      { t: "h", text: "기본 사용" },
      {
        t: "code",
        lang: "python",
        code: `print("안녕하세요")
print(1000000)
print(1000000 * 1.05)`,
      },
      { t: "h", text: "여러 값을 한 번에 출력" },
      { t: "p", text: "콤마로 구분하면 자동으로 공백 한 칸이 삽입된다." },
      {
        t: "code",
        lang: "python",
        code: `name = "황재환"
principal = 1000000

print(name, "님의 원금은", principal, "원입니다")
# 황재환 님의 원금은 1000000 원입니다`,
      },
      { t: "h", text: "유용한 옵션: sep와 end" },
      {
        t: "code",
        lang: "python",
        code: `# sep: 값 사이를 무엇으로 구분할지 (기본값은 공백)
print("2026", "09", "09", sep="-")   # 2026-09-09

# end: 출력이 끝난 뒤 무엇을 붙일지 (기본값은 줄바꿈)
print("계산 중", end="")
print("...완료")                      # 계산 중...완료`,
      },
      { t: "h", text: "print()는 값을 반환하지 않는다" },
      {
        t: "p",
        text: "<code>print()</code>는 화면에 보여줄 뿐, 그 값을 변수에 저장해주지 않는다.",
      },
      {
        t: "code",
        lang: "python",
        code: `result = print(100)   # 화면에는 100이 찍히지만
print(result)         # None ← result에는 아무것도 들어 있지 않다`,
      },
      { t: "p", text: "계산 결과를 나중에 쓰려면 반드시 변수에 대입해야 한다." },
      {
        t: "code",
        lang: "python",
        code: `result = 1000000 * 1.05   # 저장
print(result)             # 출력`,
      },
    ],
  },

  /* ── 4. input() ── */
  {
    title: "4. input() — 사용자에게 값 입력받기",
    blocks: [
      { t: "h", text: "정의" },
      {
        t: "p",
        text: "<b><code>input()</code>은 사용자가 키보드로 입력한 내용을 문자열로 받아오는 내장 함수다.</b> 괄호 안에 문자열을 넣으면 입력을 기다리는 동안 그 안내 문구가 화면에 표시된다.",
      },
      { t: "h", text: "비유" },
      {
        t: "p",
        text: "input()은 <b>프로그램의 귀</b>다. print()가 말하는 쪽이라면 input()은 듣는 쪽이다. input()을 만난 프로그램은 사용자가 Enter를 누를 때까지 그 자리에서 멈춰 기다린다.",
      },
      { t: "h", text: "기본 사용" },
      {
        t: "code",
        lang: "python",
        code: `name = input("이름을 입력하세요: ")
print(f"안녕하세요, {name}님!")`,
      },
      { t: "h", text: "가장 중요한 규칙: input()의 결과는 항상 문자열이다" },
      {
        t: "p",
        text: "사용자가 숫자를 입력했더라도, <code>input()</code>이 돌려주는 값은 예외 없이 <code>str</code>이다.",
      },
      {
        t: "code",
        lang: "python",
        code: `principal = input("원금을 입력하세요: ")   # 사용자가 1000000 입력
print(type(principal))    # <class 'str'>  ← 숫자가 아니다

# print(principal * 1.05)  # TypeError`,
      },
      { t: "p", text: "그래서 숫자 계산에 쓰려면 반드시 형변환을 거쳐야 한다." },
      {
        t: "code",
        lang: "python",
        code: `principal = int(input("원금을 입력하세요(원): "))
rate = float(input("연 이자율을 입력하세요(예: 0.05): "))

interest = principal * rate
print(interest)`,
      },
      {
        t: "p",
        text: '<b>"input()으로 받고 → int()/float()로 변환하고 → 계산한다."</b> 이 세 단계 패턴은 앞으로 매주 반복해서 사용한다.',
      },
    ],
  },
  {
    title: "input() — 흔한 실수",
    blocks: [
      {
        t: "code",
        lang: "python",
        code: `# 변환을 잊음
years = input("기간(년): ")
# total = principal * (1 + rate) ** years   → TypeError

# 변환함
years = int(input("기간(년): "))
total = principal * (1 + rate) ** years`,
      },
      {
        t: "code",
        lang: "python",
        code: `# 소수점이 있는 값을 int()로 변환 시도
rate = int(input("이자율: "))     # 사용자가 0.05 입력 → ValueError

# 소수점이 있는 값은 float()로
rate = float(input("이자율: "))`,
      },
      {
        t: "p",
        text: "소수점이 있을 수 있는 값(이자율, 수익률)은 <code>float()</code>, 개수나 연수처럼 딱 떨어지는 값은 <code>int()</code>를 쓴다.",
      },
    ],
  },

  /* ── 5. f-string ── */
  {
    title: "5. f-string — 문자열 안에 값 끼워 넣기",
    blocks: [
      { t: "h", text: "정의" },
      {
        t: "p",
        text: "<b>f-string(formatted string literal)은 문자열 앞에 <code>f</code>를 붙이고 중괄호 <code>{}</code> 안에 변수나 식을 넣으면 그 결과가 문자열 안에 삽입되는 문법이다.</b> 파이썬 3.6부터 도입되었으며, 현재 가장 널리 쓰이는 문자열 서식 방법이다.",
      },
      { t: "h", text: "비유" },
      {
        t: "p",
        text: 'f-string은 <b>빈칸이 뚫린 서류 양식</b>이다. "____님의 원금은 ____원입니다"라는 양식을 미리 만들어두고 빈칸에 해당하는 값만 자동으로 채워 넣는 방식이다. 콤마로 값을 나열하는 것보다 최종 문장의 모습을 예측하기 쉽다.',
      },
      { t: "h", text: "기본 사용" },
      {
        t: "code",
        lang: "python",
        code: `name = "황재환"
principal = 1000000

print(f"{name}님의 원금은 {principal}원입니다")
# 황재환님의 원금은 1000000원입니다`,
      },
      { t: "p", text: "<code>f</code>를 빠뜨리면 중괄호가 그대로 출력된다." },
      {
        t: "code",
        lang: "python",
        code: `print("{name}님")    # {name}님  ← f가 없어서 치환되지 않음
print(f"{name}님")   # 황재환님`,
      },
      { t: "h", text: "중괄호 안에는 식도 들어간다" },
      {
        t: "code",
        lang: "python",
        code: `principal = 1000000
rate = 0.05

print(f"1년 후 이자는 {principal * rate}원입니다")
# 1년 후 이자는 50000.0원입니다`,
      },
    ],
  },
  {
    title: "숫자 서식 지정 (금융 데이터에서 특히 중요)",
    blocks: [
      { t: "p", text: "중괄호 안에 콜론(<code>:</code>)을 쓰면 출력 형식을 지정할 수 있다." },
      {
        t: "code",
        lang: "python",
        code: `total = 1157625.0000000002
rate = 0.0532

print(f"{total:.2f}")     # 1157625.00   소수점 둘째 자리까지
print(f"{total:.0f}")     # 1157625      소수점 없이
print(f"{total:,.0f}")    # 1,157,625    천 단위 콤마
print(f"{rate:.2%}")      # 5.32%        백분율`,
      },
      {
        t: "table",
        head: ["서식", "의미", "예시 결과"],
        rows: [
          ["<code>:.2f</code>", "소수점 둘째 자리까지", "<code>1157625.00</code>"],
          ["<code>:,</code>", "천 단위 콤마", "<code>1,157,625</code>"],
          ["<code>:,.0f</code>", "천 단위 콤마 + 소수점 없음", "<code>1,157,625</code>"],
          ["<code>:.2%</code>", "백분율, 소수점 둘째 자리", "<code>5.32%</code>"],
          ["<code>:&lt;10</code>", "왼쪽 정렬, 폭 10칸", "<code>삼성전자      </code>"],
          ["<code>:&gt;10</code>", "오른쪽 정렬, 폭 10칸", "<code>      70000</code>"],
        ],
      },
      {
        t: "p",
        text: "부동소수점 연산 특성상 <code>1157625.0000000002</code> 같은 지저분한 값이 자주 나온다. 결과를 출력할 때는 <code>:,.0f</code>나 <code>:.2f</code>로 정리해서 보여주는 습관을 들이는 것이 좋다.",
      },
      { t: "h", text: "실전 예시" },
      {
        t: "code",
        lang: "python",
        code: `principal = 1000000
rate = 0.05
years = 3
total = principal * (1 + rate) ** years

print(f"원금 {principal:,}원을 연 {rate:.2%}로 {years}년간 예치하면")
print(f"원리금은 {total:,.0f}원, 이자는 {total - principal:,.0f}원입니다")

# 원금 1,000,000원을 연 5.00%로 3년간 예치하면
# 원리금은 1,157,625원, 이자는 157,625원입니다`,
      },
    ],
  },

  /* ── 6. 주석 ── */
  {
    title: "6. 주석 (Comment)",
    blocks: [
      { t: "h", text: "정의" },
      {
        t: "p",
        text: "<b>주석이란 소스 코드에 포함되지만 실행되지 않는, 사람이 읽기 위한 설명문이다.</b> 파이썬은 <code>#</code> 기호를 만나면 그 줄의 끝까지를 무시한다.",
      },
      { t: "h", text: "비유" },
      {
        t: "p",
        text: '주석은 <b>교과서 여백에 적은 필기</b>다. 본문(코드)은 그대로 두면서, 나중에 다시 볼 나를 위해 "이 부분이 왜 이렇게 되는지"를 옆에 적어두는 것이다. 시험지에 필기가 채점되지 않듯 주석도 프로그램 실행에 아무 영향을 주지 않는다.',
      },
      { t: "h", text: "한 줄 주석" },
      {
        t: "code",
        lang: "python",
        code: `# 원금과 이자율을 정의한다
principal = 1000000   # 단위: 원
rate = 0.05           # 연 이자율 5%`,
      },
      {
        t: "p",
        text: "<code>#</code> 뒤에는 한 칸 띄우고, 코드 뒤에 붙이는 주석은 코드와 두 칸 이상 띄우는 것이 관례다.",
      },
      { t: "h", text: "여러 줄 주석" },
      { t: "p", text: "각 줄 앞에 <code>#</code>을 붙이거나, 따옴표 세 개로 감싼다." },
      {
        t: "code",
        lang: "python",
        code: `# 아래 코드는 원금과 이자율을 입력받아
# 1년 후 이자를 계산한다.

"""
따옴표 세 개로 감싸는 방식도 자주 쓰인다.
엄밀히 말하면 이것은 주석이 아니라 문자열이지만,
변수에 대입하지 않으면 아무 일도 일어나지 않으므로
주석처럼 사용할 수 있다.
"""`,
      },
    ],
  },
  {
    title: "주석을 쓰는 이유",
    blocks: [
      {
        t: "ol",
        items: [
          { text: "<b>미래의 나를 위해.</b> 2주 뒤에 자기 코드를 다시 볼 때 왜 그렇게 짰는지 기억나지 않는 경우가 대부분이다." },
          { text: "<b>함께 보는 사람을 위해.</b> 코드를 공유할 때 상대방의 이해 속도가 크게 달라진다." },
          { text: "<b>디버깅을 위해.</b> 특정 줄을 지우지 않고 <code>#</code>으로 잠시 꺼두고 실행해볼 수 있다." },
        ],
      },
      {
        t: "code",
        lang: "python",
        code: `principal = 1000000
# principal = 2000000   ← 잠시 꺼둠. 필요하면 #만 지우면 됨`,
      },
      {
        t: "p",
        text: "VSCode에서는 줄을 선택하고 <code>Ctrl + /</code> (macOS는 <code>Cmd + /</code>)를 누르면 주석을 한 번에 켜고 끌 수 있다.",
      },
      { t: "h", text: "좋은 주석과 나쁜 주석" },
      {
        t: "code",
        lang: "python",
        code: `# 나쁜 주석: 코드를 그대로 읽어준다
principal = 1000000   # principal에 1000000을 대입한다

# 좋은 주석: 코드에 드러나지 않는 '왜'를 설명한다
principal = 1000000   # 예시용 원금. 실제 값은 사용자 입력으로 대체 예정
rate = 0.05           # 2026년 기준 정기예금 평균 금리 가정`,
      },
      {
        t: "p",
        text: "주석은 <b>무엇을(What)이 아니라 왜(Why)를 쓴다.</b> 무엇을 하는지는 코드 자체가 이미 말해준다.",
      },
    ],
  },

  /* ── 정리 ── */
  {
    title: "핵심 문법 요약",
    blocks: [
      {
        t: "table",
        head: ["개념", "한 줄 정의", "핵심"],
        rows: [
          ["<b>변수</b>", "값을 저장하기 위해 이름을 붙인 공간", "<code>=</code>는 대입, <code>==</code>는 비교"],
          ["<b>자료형</b>", "값의 종류와 가능한 연산을 규정하는 분류", "<code>type()</code>으로 확인, <code>int()</code>/<code>float()</code>/<code>str()</code>로 변환"],
          ["<b>print()</b>", "값을 화면에 출력하는 함수", "출력만 할 뿐 값을 저장하지 않는다"],
          ["<b>input()</b>", "사용자 입력을 받는 함수", "<b>결과는 항상 문자열</b>, 계산하려면 형변환 필수"],
          ["<b>f-string</b>", "문자열에 값을 삽입하는 서식 문법", "<code>f\"{변수}\"</code>, 금액은 <code>:,.0f</code>, 비율은 <code>:.2%</code>"],
          ["<b>주석</b>", "실행되지 않는 설명문", "<code>#</code>, 무엇이 아니라 <b>왜</b>를 적는다"],
        ],
      },
    ],
  },

  /* ── 오늘의 코드 ── */
  {
    title: "오늘의 코드",
    blocks: [
      {
        t: "p",
        text: "VSCode에서 <code>week1.py</code> 파일을 만들고 아래 코드를 그대로 붙여넣어 실행해본다. 오늘 배운 여섯 가지 개념이 모두 들어 있다.",
      },
      {
        t: "code",
        lang: "python",
        code: `"""
1주차 실습 — 단리/복리 계산기
원금, 연 이자율, 예치 기간을 입력받아 만기 원리금을 계산한다.
"""

# 1) 사용자 입력 받기 (input의 결과는 문자열이므로 형변환 필수)
name = input("이름을 입력하세요: ")
principal = int(input("원금을 입력하세요(원): "))           # 정수
rate = float(input("연 이자율을 입력하세요(예: 0.05): "))    # 실수
years = int(input("예치 기간을 입력하세요(년): "))           # 정수

# 2) 계산
simple_total = principal * (1 + rate * years)      # 단리
compound_total = principal * (1 + rate) ** years   # 복리
difference = compound_total - simple_total         # 복리가 더 번 금액

# 3) f-string으로 서식을 맞춰 출력
print()
print("=" * 40)
print(f"{name}님의 예금 계산 결과")
print("=" * 40)
print(f"원금        : {principal:>15,}원")
print(f"연 이자율   : {rate:>15.2%}")
print(f"예치 기간   : {years:>15}년")
print("-" * 40)
print(f"단리 원리금 : {simple_total:>15,.0f}원")
print(f"복리 원리금 : {compound_total:>15,.0f}원")
print(f"복리 이득   : {difference:>15,.0f}원")
print("=" * 40)

# 4) 자료형 확인 (학습용)
print()
print(f"principal의 자료형: {type(principal)}")
print(f"rate의 자료형: {type(rate)}")
print(f"name의 자료형: {type(name)}")`,
      },
      {
        t: "p",
        text: "<b>실행 예시</b> — 원금 <code>1000000</code>, 이자율 <code>0.05</code>, 기간 <code>3</code> 입력 시",
      },
      {
        t: "out",
        text: `========================================
황재환님의 예금 계산 결과
========================================
원금        :       1,000,000원
연 이자율   :           5.00%
예치 기간   :               3년
----------------------------------------
단리 원리금 :       1,150,000원
복리 원리금 :       1,157,625원
복리 이득   :           7,625원
========================================`,
      },
      {
        t: "p",
        text: '<code>"=" * 40</code>처럼 문자열에 숫자를 곱하면 그 횟수만큼 반복된다. 구분선을 그릴 때 유용하다.',
      },
    ],
  },

  /* ── 테스트 ── */
  {
    title: "오늘의 테스트 (1)",
    blocks: [
      {
        t: "quiz",
        no: "Q1",
        q: "다음 중 변수 이름으로 사용할 수 없는 것은?",
        options: [
          "<code>interest_rate</code>",
          "<code>rate2026</code>",
          "<code>2026rate</code>",
          "<code>_rate</code>",
          "<code>annual_rate</code>",
        ],
        correct: [3],
        explain:
          "변수 이름은 <b>숫자로 시작할 수 없다.</b> 언더스코어로 시작하는 것은 가능하다.",
      },
      {
        t: "quiz",
        no: "Q2",
        q: "다음 코드의 출력 결과는?",
        code: `a = "5"
b = "5"
print(a + b)`,
        options: ["<code>10</code>", "<code>55</code>", "<code>25</code>", "에러 발생", "<code>None</code>"],
        correct: [2],
        explain:
          '<code>"5"</code>는 따옴표로 감싸여 있으므로 <code>str</code>이다. 문자열끼리의 <code>+</code>는 덧셈이 아니라 이어붙이기(연결)다.',
      },
      {
        t: "quiz",
        no: "Q3",
        q: "다음 코드에서 에러가 발생하는 이유는?",
        code: `principal = input("원금: ")   # 사용자가 1000000 입력
print(principal * 1.05)`,
        options: [
          "<code>input()</code>은 괄호 안에 문자열을 넣을 수 없다",
          "<code>principal</code>이 문자열이므로 실수와 곱할 수 없다",
          "<code>print()</code> 안에서는 계산을 할 수 없다",
          "<code>1.05</code>는 <code>float</code>이라 곱셈에 쓸 수 없다",
          "<code>print()</code>는 f-string 없이는 변수를 출력할 수 없다",
        ],
        correct: [2],
        explain:
          "<code>input()</code>의 반환값은 항상 <code>str</code>이다. <code>int(input(...))</code> 또는 <code>float(input(...))</code>으로 형변환해야 한다.",
      },
      {
        t: "quiz",
        no: "Q4",
        q: "다음 중 출력 결과가 <code>3</code>인 것을 <b>모두</b> 고르시오.",
        options: [
          "<code>print(int(3.9))</code>",
          "<code>print(round(3.9))</code>",
          "<code>print(7 // 2)</code>",
          "<code>print(7 % 4)</code>",
          "<code>print(7 / 2)</code>",
        ],
        correct: [1, 3, 4],
        explain:
          "<code>int(3.9)</code> → <code>3</code> (버림, 반올림이 아님)<br><code>round(3.9)</code> → <code>4</code> (반올림)<br><code>7 // 2</code> → <code>3</code> (몫)<br><code>7 % 4</code> → <code>3</code> (나머지)<br><code>7 / 2</code> → <code>3.5</code> (나눗셈 결과는 항상 float)",
      },
    ],
  },
  {
    title: "오늘의 테스트 (2)",
    blocks: [
      {
        t: "quiz",
        no: "Q5",
        q: "아래 코드의 출력 결과를 쓰시오.",
        code: `rate = 0.0532
print(f"{rate:.1%}")`,
        input: {
          label: "출력 결과",
          accept: ["5.3%"],
          placeholder: "예: 12.3%",
        },
        explain:
          "<code>:.1%</code>는 값을 백분율로 변환하고 소수점 첫째 자리까지 표시한다. 0.0532 → <b>5.3%</b>",
      },
      {
        t: "quiz",
        no: "Q6",
        q: "원금 1,000,000원을 연 5%로 3년간 복리 예치했을 때의 원리금을 계산하는 코드로 올바른 것은?",
        options: [
          "<code>1000000 * (1 + 0.05) * 3</code>",
          "<code>1000000 * (1 + 0.05) ** 3</code>",
          "<code>1000000 * 1 + 0.05 ** 3</code>",
          "<code>1000000 ** (1 + 0.05) * 3</code>",
          "<code>1000000 + (1 + 0.05) ** 3</code>",
        ],
        correct: [2],
        explain:
          "복리 공식은 <code>원금 × (1 + 이자율)^기간</code>이며, 파이썬에서 거듭제곱은 <code>**</code>로 표기한다. 1번은 단리에 가깝고, 나머지는 연산 순서가 어긋난다.",
      },
      {
        t: "quiz",
        no: "Q7",
        q: "빈칸을 채워 프로그램을 완성하시오.<br>주식 종목명과 매수 가격, 현재 가격을 입력받아 수익률을 백분율로 출력하는 프로그램이다.",
        code: `name = ______("종목명: ")
buy_price = ______(input("매수 가격(원): "))
now_price = ______(input("현재 가격(원): "))

profit_rate = (now_price - buy_price) / buy_price

print(f"{name}의 수익률은 {profit_rate:______}입니다")`,
        blanks: [
          { label: "첫 번째 빈칸", accept: ["input"] },
          { label: "두 번째 빈칸", accept: ["int", "float"] },
          { label: "세 번째 빈칸", accept: ["int", "float"] },
          { label: "네 번째 빈칸", accept: [".2%", ":.2%", ".1%", ".0%", "%"] },
        ],
        explain:
          "종목명은 문자열 그대로 쓰므로 <code>input()</code>, 가격은 원 단위 정수이므로 <code>int()</code>를 쓴다. 소수점이 섞일 수 있는 값이라면 <code>float()</code>도 맞다. 서식은 백분율이면 되므로 <code>.2%</code>가 기준 답이고 <code>.1%</code>, <code>.0%</code>도 정답으로 인정한다.",
        explainCode: `name = input("종목명: ")
buy_price = int(input("매수 가격(원): "))
now_price = int(input("현재 가격(원): "))

profit_rate = (now_price - buy_price) / buy_price

print(f"{name}의 수익률은 {profit_rate:.2%}입니다")`,
      },
      {
        t: "quiz",
        no: "Q8",
        q: "(심화) 아래 코드의 출력 결과를 세 줄로 쓰시오.",
        code: `total = 1157625.0000000002

print(f"{total:,.0f}")
print(int(total))
print(round(total, 2))`,
        input: {
          label: "출력 결과 (한 줄에 하나씩)",
          accept: ["1,157,625\n1157625\n1157625.0"],
          multiline: true,
          placeholder: "1,157,625\n1157625\n1157625.0",
        },
        explain:
          "<code>1,157,625</code> / <code>1157625</code> / <code>1157625.0</code><br>첫 줄은 천 단위 콤마와 함께 소수점 없이 반올림, 둘째 줄은 소수점 버림, 셋째 줄은 소수점 둘째 자리까지 반올림한 결과다. 부동소수점 오차 때문에 나타나는 <code>...0002</code>는 서식 지정으로 정리할 수 있다.",
      },
    ],
  },
];

/** 마무리 화면 — md 의 다음 주 예고 */
export const WEEK1_NEXT: Block[] = [
  {
    t: "p",
    text: "2주차에서는 <b>화폐의 시간가치</b>를 다룬다. 오늘 배운 변수와 자료형 위에 <b>조건문(if), 반복문(for/while), 함수 정의(def)</b> 를 얹어 복리, 연속복리, NPV를 직접 계산하는 코드를 작성한다.",
  },
  {
    t: "p",
    text: "오늘 만든 가상환경은 8주 내내 그대로 사용한다. 다음 주에도 같은 폴더를 열고 <code>source venv/bin/activate</code> (Windows는 <code>.\\venv\\Scripts\\Activate.ps1</code>)로 시작하면 된다.",
  },
];

/** 환경 세팅 직후에 보여준다. venv를 만들어 본 뒤 바로 "왜"를 설명하기 위해
 *  BASICS에서 빼내 따로 두었다. */
export const VENV_WHY: BasicSlide =
  {
    title: "가상환경을 왜 쓰는가",
    blocks: [
      {
        t: "p",
        text: "가상환경(virtual environment)은 프로젝트별로 독립된 파이썬 실행 환경을 만드는 도구다. 프로젝트마다 별도의 옷장을 두는 것과 같다.",
      },
      {
        t: "ul",
        items: [
          "<b>버전 충돌 방지</b> — A 프로젝트는 pandas 2.2, B 프로젝트는 pandas 1.5가 필요할 때, 가상환경이 없으면 둘 중 하나는 반드시 깨진다.",
          "<b>시스템 파이썬 보호</b> — 전역에 라이브러리를 계속 설치하면 원인을 알기 어려운 오류가 쌓인다.",
          "<b>정리와 재현이 쉬움</b> — 프로젝트 폴더째 지우면 환경도 함께 사라지고, 다른 사람에게 동일한 환경을 그대로 재현해줄 수 있다.",
        ],
      },
      {
        t: "table",
        head: ["OS", "생성", "활성화"],
        rows: [
          ["Windows", "<code>python -m venv venv</code>", "<code>.\\venv\\Scripts\\Activate.ps1</code>"],
          ["macOS / Linux", "<code>python3 -m venv venv</code>", "<code>source venv/bin/activate</code>"],
        ],
      },
      {
        t: "p",
        text: "프롬프트 앞에 <code>(venv)</code>가 표시되면 활성화된 상태다. 종료는 <code>deactivate</code>.",
      },
    ],
  };
