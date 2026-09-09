# 2주차 — 화폐의 시간가치

> 조건문(if) · 반복문(for/while) · 함수(def) → 복리 · 연속복리 · NPV · IRR

이번 주차부터 프로그램이 **판단하고, 반복하고, 재사용**할 수 있게 된다. 지난주에 배운 변수와 자료형이 값을 다루는 도구였다면, 이번 주에 배우는 세 가지는 **흐름을 다루는 도구**다. 그리고 이 도구들로 금융의 가장 근본적인 질문인 "오늘의 1원과 1년 뒤의 1원은 왜 다른가"에 답하는 계산을 직접 구현한다.

---

## 0. 1주차 복습 노트

본격적으로 시작하기 전에 지난주 내용을 한 번에 훑는다. 아래 표의 내용이 바로 떠오르지 않으면 1주차 자료를 먼저 확인하는 것이 좋다.

| 개념 | 한 줄 정의 | 핵심 |
|---|---|---|
| **변수** | 값을 저장하기 위해 이름을 붙인 공간 | `=`는 대입, `==`는 비교 |
| **자료형** | 값의 종류와 가능한 연산을 규정하는 분류 | `int`, `float`, `str`, `bool` / `type()`으로 확인 |
| **print()** | 값을 화면에 출력하는 함수 | 출력만 할 뿐 값을 저장하지 않는다 |
| **input()** | 사용자 입력을 받는 함수 | **결과는 항상 문자열**, 계산하려면 형변환 필수 |
| **f-string** | 문자열에 값을 삽입하는 서식 문법 | 금액은 `:,.0f`, 비율은 `:.2%` |
| **주석** | 실행되지 않는 설명문 | `#`, 무엇이 아니라 **왜**를 적는다 |

### 코드로 보는 1주차

```python
principal = int(input("원금(원): "))          # 입력 → int로 형변환
rate = float(input("연 이자율(예: 0.05): "))   # 입력 → float로 형변환
years = int(input("기간(년): "))

total = principal * (1 + rate) ** years       # ** 는 거듭제곱

print(f"{years}년 후 원리금은 {total:,.0f}원입니다")
```

### 이번 주 시작 전 준비

지난주에 만든 프로젝트 폴더를 열고 가상환경을 활성화한다.

| OS | 활성화 명령 |
|---|---|
| Windows | `.\venv\Scripts\Activate.ps1` |
| macOS / Linux | `source venv/bin/activate` |

프롬프트 앞에 `(venv)`가 보이면 준비 완료다. 이번 주 코드는 `week2.py` 파일에 작성한다.

---

## 1. 조건문 (Conditional Statement)

### 정의

**조건문이란 주어진 조건식의 참/거짓 여부에 따라 실행할 코드 블록을 선택하는 제어 구조다.** 파이썬에서는 `if`, `elif`, `else` 키워드로 표현한다.

### 비유

조건문은 **갈림길의 이정표**다. 프로그램은 위에서 아래로 한 줄씩 달리다가 조건문을 만나면 이정표를 읽고 어느 길로 갈지 정한다. 조건이 참인 길만 지나가고, 나머지 길은 아예 밟지 않는다.

### 기본 구조

```python
rate = 0.05

if rate > 0.03:
    print("고금리")
else:
    print("저금리")
```

주목할 두 가지 문법 요소가 있다.

1. **콜론(`:`)** — 조건식 끝에 반드시 붙인다. 빠뜨리면 `SyntaxError`가 난다.
2. **들여쓰기(indent)** — 조건이 참일 때 실행할 코드는 반드시 안쪽으로 들여쓴다. 파이썬은 중괄호 대신 **들여쓰기로 코드 블록을 구분**한다. 관례는 공백 4칸이며, VSCode에서 `Tab` 키를 누르면 자동으로 4칸이 입력된다.

```python
if rate > 0.03:
print("고금리")        # IndentationError: 들여쓰기가 없다
```

### 여러 갈래: `elif`

조건이 셋 이상일 때는 `elif`(else if)를 사용한다. 위에서부터 순서대로 검사하고, **처음으로 참이 되는 하나만** 실행한 뒤 조건문 전체를 빠져나온다.

```python
profit_rate = 0.12

if profit_rate > 0.10:
    grade = "우수"
elif profit_rate > 0.05:
    grade = "양호"
elif profit_rate > 0:
    grade = "보통"
else:
    grade = "손실"

print(f"수익률 {profit_rate:.2%} → {grade}")
# 수익률 12.00% → 우수
```

`elif`와 `else`는 생략할 수 있다. `if`만 단독으로 쓰는 것도 완전히 정상이다.

### 비교 연산자

| 연산자 | 의미 | 예시 | 결과 |
|---|---|---|---|
| `==` | 같다 | `5 == 5` | `True` |
| `!=` | 다르다 | `5 != 3` | `True` |
| `>` | 크다 | `5 > 3` | `True` |
| `<` | 작다 | `5 < 3` | `False` |
| `>=` | 크거나 같다 | `5 >= 5` | `True` |
| `<=` | 작거나 같다 | `5 <= 3` | `False` |

비교 연산의 결과는 항상 `bool`(`True` 또는 `False`)이다.

```python
print(5 > 3)          # True
print(type(5 > 3))    # <class 'bool'>
```

### 논리 연산자

여러 조건을 조합할 때 사용한다.

| 연산자 | 의미 | 예시 |
|---|---|---|
| `and` | 둘 다 참일 때 참 | `rate > 0 and years > 0` |
| `or` | 하나라도 참이면 참 | `rate > 0.1 or is_safe` |
| `not` | 참/거짓을 뒤집음 | `not is_safe` |

```python
rate = 0.05
years = 3

if rate > 0 and years > 0:
    print("계산 가능한 입력입니다")

if rate <= 0 or years <= 0:
    print("입력값을 다시 확인하세요")
```

파이썬에서는 범위 비교를 수학 표기처럼 이어 쓸 수 있다.

```python
if 0 < rate < 1:          # 0 < rate and rate < 1 과 동일
    print("정상 범위의 이자율")
```

### 실전: 입력값 검증

조건문의 가장 흔한 용도는 **잘못된 입력을 걸러내는 것**이다.

```python
principal = int(input("원금(원): "))

if principal <= 0:
    print("원금은 0보다 커야 합니다.")
else:
    print(f"원금 {principal:,}원이 입력되었습니다.")
```

---

## 2. 반복문 (Loop)

### 정의

**반복문이란 특정 조건이 만족되는 동안, 또는 정해진 횟수만큼 동일한 코드 블록을 반복 실행하는 제어 구조다.** 파이썬에는 `for`문과 `while`문 두 가지가 있다.

### 비유

반복문은 **복사기의 매수 설정**이다. 같은 동작을 사람이 손으로 열 번 적는 대신, "이 동작을 10번 하라"고 한 번만 지시하는 것이다. 복리 계산처럼 "매년 같은 계산을 반복"하는 금융 문제와 구조가 정확히 일치한다.

### for문 — 정해진 횟수만큼 반복

```python
for year in range(1, 4):
    print(f"{year}년차")

# 1년차
# 2년차
# 3년차
```

`range()`는 연속된 정수를 만들어내는 함수다.

| 표기 | 생성되는 값 |
|---|---|
| `range(3)` | 0, 1, 2 |
| `range(1, 4)` | 1, 2, 3 |
| `range(1, 10, 2)` | 1, 3, 5, 7, 9 |

**`range(a, b)`는 b를 포함하지 않는다.** 1년차부터 3년차까지 돌리려면 `range(1, 4)`라고 써야 한다. 초보자가 가장 자주 틀리는 부분이다.

### for문으로 복리 계산 추적하기

지난주에는 `principal * (1 + rate) ** years` 한 줄로 최종값만 구했다. 반복문을 쓰면 **매년의 잔액 변화 과정**을 볼 수 있다.

```python
principal = 1000000
rate = 0.05
years = 3

balance = principal   # 현재 잔액

for year in range(1, years + 1):
    interest = balance * rate      # 올해 붙은 이자
    balance = balance + interest   # 잔액에 이자를 더함
    print(f"{year}년차: 이자 {interest:,.0f}원 → 잔액 {balance:,.0f}원")

# 1년차: 이자 50,000원 → 잔액 1,050,000원
# 2년차: 이자 52,500원 → 잔액 1,102,500원
# 3년차: 이자 55,125원 → 잔액 1,157,625원
```

여기서 **이자가 매년 커진다**는 점이 복리의 본질이다. 이자가 원금에 합쳐져 다음 해 이자의 기준이 되기 때문이다.

`balance = balance + interest`는 `balance += interest`로 줄여 쓸 수 있다. 이런 축약 연산자를 복합 대입 연산자라고 한다.

| 축약형 | 원래 형태 |
|---|---|
| `x += 1` | `x = x + 1` |
| `x -= 1` | `x = x - 1` |
| `x *= 2` | `x = x * 2` |
| `x /= 2` | `x = x / 2` |

### while문 — 조건이 참인 동안 반복

`for`문은 반복 횟수를 미리 알 때 쓰고, `while`문은 **몇 번 반복할지 모르고 조건으로만 판단할 때** 쓴다.

```python
principal = 1000000
rate = 0.05
target = 2000000     # 목표: 원금의 2배

balance = principal
year = 0

while balance < target:
    balance *= (1 + rate)
    year += 1

print(f"{year}년 후 {balance:,.0f}원으로 목표를 달성합니다")
# 15년 후 2,078,928원으로 목표를 달성합니다
```

"자산이 두 배가 되는 데 몇 년이 걸리는가"는 횟수를 미리 알 수 없는 문제이므로 `while`이 적합하다.

### 무한 루프 주의

`while`문의 조건이 영원히 참이면 프로그램이 멈추지 않는다.

```python
balance = 1000000
while balance < 2000000:
    print(balance)      # balance가 변하지 않아 영원히 반복
```

반복문 안에서 **조건에 쓰인 변수가 반드시 변해야 한다.** 실수로 무한 루프에 빠졌다면 터미널에서 `Ctrl + C`를 눌러 강제 종료한다.

### break와 continue

| 키워드 | 동작 |
|---|---|
| `break` | 반복문을 즉시 완전히 빠져나온다 |
| `continue` | 이번 회차만 건너뛰고 다음 회차로 넘어간다 |

```python
for year in range(1, 21):
    balance = 1000000 * (1 + 0.05) ** year
    if balance >= 2000000:
        print(f"{year}년차에 목표 달성")
        break          # 찾았으므로 더 볼 필요 없음
```

---

## 3. 함수 (Function)

### 정의

**함수란 특정 작업을 수행하는 코드를 하나의 이름으로 묶어, 필요할 때마다 그 이름으로 호출해 재사용할 수 있게 만든 단위다.** 입력값(매개변수)을 받아 처리한 뒤 결과값(반환값)을 돌려줄 수 있다.

### 비유

함수는 **자판기**다. 돈과 버튼(입력)을 넣으면 음료(출력)가 나온다. 내부에서 어떤 일이 벌어지는지 몰라도 사용할 수 있고, 한 번 만들어두면 몇 번이든 다시 쓸 수 있다. 우리는 이미 `print()`, `input()`, `int()`, `type()` 같은 함수를 써왔다. 이제 직접 만든다.

### 기본 구조

```python
def compound(principal, rate, years):
    """복리 원리금을 계산해 반환한다."""
    total = principal * (1 + rate) ** years
    return total
```

구성 요소는 다음과 같다.

- `def` — 함수를 정의한다는 선언 (define)
- `compound` — 함수 이름 (변수 이름 규칙과 동일)
- `(principal, rate, years)` — **매개변수(parameter)**, 함수가 받을 입력
- `:` 와 들여쓰기 — 함수의 몸통
- `"""..."""` — **독스트링(docstring)**, 함수 설명. 생략 가능하지만 쓰는 것이 좋다
- `return` — 결과를 돌려주고 함수를 종료한다

### 호출하기

정의만 해서는 아무 일도 일어나지 않는다. **호출(call)** 해야 실행된다.

```python
result = compound(1000000, 0.05, 3)
print(f"{result:,.0f}")   # 1,157,625
```

호출할 때 넣는 값을 **인자(argument)** 라고 한다. 인자는 순서대로 매개변수에 대응된다.

### return이 있는 함수와 없는 함수

```python
# return이 있는 함수: 값을 돌려준다 → 변수에 저장 가능
def compound(principal, rate, years):
    return principal * (1 + rate) ** years

# return이 없는 함수: 화면에 출력만 하고 돌려주는 값이 없다
def show_result(principal, rate, years):
    total = principal * (1 + rate) ** years
    print(f"{total:,.0f}원")

a = compound(1000000, 0.05, 3)      # a = 1157625.0
b = show_result(1000000, 0.05, 3)   # 화면에 출력되지만 b는 None
```

계산 결과를 재사용해야 한다면 반드시 `return`을 써야 한다. `print()`는 사람에게 보여줄 뿐 프로그램에 값을 넘겨주지 않는다.

### 기본값 매개변수

매개변수에 기본값을 지정하면, 호출할 때 그 인자를 생략할 수 있다.

```python
def compound(principal, rate, years=1):    # years의 기본값은 1
    return principal * (1 + rate) ** years

print(compound(1000000, 0.05))       # 1050000.0  (years=1로 처리)
print(compound(1000000, 0.05, 3))    # 1157625.0
```

기본값이 있는 매개변수는 **반드시 뒤쪽에 배치**해야 한다.

### 함수를 쓰는 이유

1. **재사용** — 같은 계산을 여러 번 할 때 코드를 복사할 필요가 없다.
2. **수정의 용이성** — 계산식이 바뀌면 함수 한 곳만 고치면 된다.
3. **가독성** — `compound(principal, rate, years)`는 그 자체가 설명이다.
4. **검증의 용이성** — 함수 단위로 결과가 맞는지 확인할 수 있다.

7주차의 "함수 모듈화"는 여기서 배운 함수를 별도 파일로 분리하는 작업이다.

---

## 4. 복리 (Compound Interest)

### 정의

**복리란 원금에 대해 발생한 이자를 원금에 합산하고, 그 합계에 대해 다시 이자를 계산하는 방식이다.** 이자가 이자를 낳는 구조이며, 이자를 원금에 더하지 않고 원금에만 이자를 계산하는 방식은 단리(simple interest)라고 한다.

### 비유

단리가 **매년 같은 크기의 벽돌을 한 장씩 쌓는 것**이라면, 복리는 **쌓인 높이에 비례해 다음 벽돌이 커지는 것**이다. 초반에는 차이가 미미하지만 기간이 길어질수록 격차가 기하급수적으로 벌어진다.

### 공식

$$\text{단리: } A = P(1 + rt)$$
$$\text{복리: } A = P(1 + r)^t$$

- $P$: 원금(principal), $r$: 연 이자율(rate), $t$: 기간(time, 년)

### 코드

```python
def simple_interest(principal, rate, years):
    """단리 원리금을 반환한다."""
    return principal * (1 + rate * years)


def compound_interest(principal, rate, years):
    """연 1회 복리 원리금을 반환한다."""
    return principal * (1 + rate) ** years


P, r, t = 1000000, 0.05, 3

print(f"단리: {simple_interest(P, r, t):,.0f}원")     # 1,150,000원
print(f"복리: {compound_interest(P, r, t):,.0f}원")   # 1,157,625원
```

### 복리 횟수를 늘리면

이자를 1년에 한 번이 아니라 여러 번 나눠 지급하면 원리금은 더 커진다. 연 $m$회 복리의 공식은 다음과 같다.

$$A = P\left(1 + \frac{r}{m}\right)^{mt}$$

```python
def compound_m(principal, rate, years, m=1):
    """연 m회 복리 원리금을 반환한다. m=12면 월복리."""
    return principal * (1 + rate / m) ** (m * years)


for m, label in [(1, "연복리"), (2, "반기복리"), (4, "분기복리"), (12, "월복리"), (365, "일복리")]:
    total = compound_m(1000000, 0.05, 3, m)
    print(f"{label:<8}(m={m:>3}): {total:,.2f}원")

# 연복리    (m=  1): 1,157,625.00원
# 반기복리  (m=  2): 1,159,693.42원
# 분기복리  (m=  4): 1,160,754.52원
# 월복리    (m= 12): 1,161,472.23원
# 일복리    (m=365): 1,161,822.44원
```

$m$이 커질수록 원리금이 늘어나지만, 증가폭은 점점 작아지며 어떤 값에 수렴한다. 이 수렴값이 다음에 다룰 연속복리다.

---

## 5. 연속복리 (Continuous Compounding)

### 정의

**연속복리란 복리 계산 주기를 무한히 짧게 했을 때의 극한값으로 정의되는 이자 계산 방식이다.** 위 공식에서 $m \to \infty$의 극한을 취하면 자연상수 $e$를 사용한 형태로 정리된다.

$$A = \lim_{m \to \infty} P\left(1 + \frac{r}{m}\right)^{mt} = Pe^{rt}$$

### 비유

앞의 표에서 이자 지급 주기를 연 1회 → 월 → 일로 촘촘하게 만들었지만, 값은 무한히 커지지 않고 어느 지점에 멈춰 섰다. 연속복리는 **이 촘촘하게 만드는 과정을 끝까지 밀어붙였을 때 도달하는 천장**이다. 실제 예금 상품이 이렇게 이자를 주지는 않지만, 옵션 가격 결정(블랙-숄즈 모형)을 비롯한 금융공학 모형은 수식이 깔끔해지는 이 방식을 기본으로 사용한다.

### 코드

자연상수 $e$를 쓰려면 파이썬 표준 라이브러리 `math`가 필요하다. 파일 맨 위에서 불러온다.

```python
import math

print(math.e)          # 2.718281828459045
print(math.exp(1))     # 2.718281828459045  (e의 1제곱)
print(math.log(math.e))  # 1.0  (자연로그)
```

`import`는 3주차에서 본격적으로 다루지만, `math`는 파이썬에 기본 내장되어 있어 별도 설치 없이 바로 쓸 수 있다.

```python
import math


def continuous_compound(principal, rate, years):
    """연속복리 원리금을 반환한다."""
    return principal * math.exp(rate * years)


P, r, t = 1000000, 0.05, 3

print(f"연복리    : {P * (1 + r) ** t:,.2f}원")            # 1,157,625.00원
print(f"월복리    : {P * (1 + r/12) ** (12*t):,.2f}원")    # 1,161,472.23원
print(f"연속복리  : {continuous_compound(P, r, t):,.2f}원")  # 1,161,834.24원
```

일복리(1,161,822원)와 연속복리(1,161,834원)의 차이가 12원에 불과하다는 점에서, 극한값에 거의 도달했음을 확인할 수 있다.

---

## 6. NPV — 순현재가치 (Net Present Value)

### 정의

**순현재가치란 미래에 발생할 모든 현금흐름을 특정 할인율로 현재 시점의 가치로 환산해 합산한 값이다.** 투자안의 가치를 평가하는 가장 기본적인 지표다.

$$NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t}$$

- $CF_t$: $t$시점의 현금흐름 (투자금은 음수, 회수금은 양수)
- $r$: 할인율(discount rate)

### 비유

복리가 "오늘의 100만 원이 3년 뒤 얼마가 되는가"를 묻는다면, **NPV는 그 질문을 거꾸로 뒤집은 것**이다. "3년 뒤에 받을 100만 원은 오늘 기준으로 얼마짜리인가." 미래의 돈은 기다리는 동안 다른 곳에 투자할 기회를 포기한 대가가 있으므로, 오늘의 같은 금액보다 가치가 낮다. 그 할인 과정을 거쳐 모든 시점의 돈을 **오늘이라는 하나의 기준선 위에 나란히 세운 뒤** 더한 값이 NPV다.

### 판단 기준

| NPV | 의미 |
|---|---|
| `> 0` | 요구수익률 이상의 가치를 창출 → 투자 타당 |
| `= 0` | 요구수익률과 정확히 일치 |
| `< 0` | 요구수익률에 미달 → 투자 부적합 |

### 코드

현금흐름은 리스트(`list`)로 표현한다. 리스트는 3주차의 주제지만, 여기서는 "여러 값을 순서대로 담는 상자"라는 정도로만 이해하면 충분하다.

```python
def npv(rate, cashflows):
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
print(f"할인율 10% → NPV {npv(0.10, cashflows):,.0f}원")   # -5,259원
```

`len(cashflows)`는 리스트에 담긴 값의 개수(여기서는 4)를 돌려주고, `cashflows[t]`는 t번째 값을 꺼낸다. **파이썬의 순번은 0부터 시작**하므로 `cashflows[0]`이 현재 시점의 현금흐름이 된다. 이는 $t=0$에서 $(1+r)^0 = 1$이 되어 할인되지 않는다는 수식과도 자연스럽게 맞아떨어진다.

위 결과에서 할인율이 높아질수록 NPV가 작아지고, 9%와 10% 사이 어딘가에서 0을 지난다는 것을 알 수 있다. 바로 그 지점이 IRR이다.

---

## 7. IRR — 내부수익률 (Internal Rate of Return)

### 정의

**내부수익률이란 어떤 투자안의 순현재가치를 정확히 0으로 만드는 할인율이다.** 그 사업 자체가 만들어내는 수익률로 해석할 수 있다.

$$\sum_{t=0}^{n} \frac{CF_t}{(1+IRR)^t} = 0$$

### 비유

NPV가 "이 할인율에서 이 사업은 얼마짜리인가"를 묻는다면, IRR은 **"이 사업의 손익분기점이 되는 수익률은 몇 %인가"** 를 묻는다. 저울의 양쪽(투자금과 회수금)이 정확히 평형을 이루는 지점의 눈금을 찾는 것과 같다. 이 눈금이 내 요구수익률보다 높으면 투자할 만하다는 뜻이다.

### 왜 반복문이 필요한가

복리나 NPV는 공식에 값을 대입하면 바로 답이 나온다. 그러나 IRR은 다르다. 위 식에서 $IRR$은 분모의 거듭제곱 안에 갇혀 있어서, 일반적으로 **식을 정리해 $IRR = \cdots$ 형태로 풀어낼 수 없다.**

그래서 컴퓨터는 다른 전략을 쓴다. **여러 값을 대입해보며 정답에 가까워지는 방식**, 즉 수치해석적 탐색이다. 반복문이 필요한 이유가 여기에 있다.

### 방법 1: 이분법 (Bisection)

정답이 들어 있는 구간을 절반씩 좁혀나가는 방법이다. 스무고개에서 "50보다 큰가요?"를 반복해 범위를 좁히는 것과 같은 원리다.

앞의 예시에서 NPV는 9%일 때 양수(+12,518), 10%일 때 음수(-5,259)였다. 따라서 **정답은 반드시 9%와 10% 사이에 있다.** 이 구간을 계속 반으로 잘라가며 좁힌다.

```python
def irr_bisection(cashflows, low=0.0, high=1.0, tolerance=1e-7, max_iter=200):
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
print(f"검산 NPV = {npv(result, cashflows):,.4f}")   # 검산 NPV = 0.0000
```

`for _ in range(max_iter)`의 언더스코어(`_`)는 **반복 횟수만 필요하고 그 값 자체는 쓰지 않을 때** 관례적으로 쓰는 변수명이다.

`max_iter`로 반복 상한을 두는 이유는 안전장치 때문이다. 조건을 만족하지 못하는 입력이 들어와도 프로그램이 무한히 도는 일을 막는다.

### 탐색 과정 들여다보기

이분법이 어떻게 좁혀나가는지 직접 출력해보면 이해가 빨라진다.

```python
low, high = 0.0, 1.0
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
# ...
```

회차가 거듭될수록 구간이 절반씩 줄어들며 9.70% 근처로 수렴하는 것을 확인할 수 있다.

### IRR 해석 시 주의점

- **재투자 가정** — IRR은 회수한 현금을 다시 IRR과 같은 수익률로 재투자할 수 있다고 가정한다. 현실에서 항상 성립하지는 않는다.
- **복수 IRR 문제** — 현금흐름의 부호가 여러 번 바뀌면 NPV를 0으로 만드는 할인율이 두 개 이상 존재할 수 있다.
- **규모를 반영하지 못함** — IRR은 비율이므로 사업의 절대적 크기를 알려주지 않는다. 1억을 버는 사업과 100만 원을 버는 사업의 IRR이 같을 수 있다.

이런 이유로 실무에서는 NPV와 IRR을 함께 본다.

---

## 오늘 배운 것 정리

### 파이썬 문법

| 개념 | 한 줄 정의 | 핵심 |
|---|---|---|
| **조건문** | 조건의 참/거짓에 따라 실행할 블록을 고르는 구조 | `if`/`elif`/`else`, 콜론과 들여쓰기 필수 |
| **for문** | 정해진 횟수만큼 반복하는 구조 | `range(a, b)`는 **b를 포함하지 않는다** |
| **while문** | 조건이 참인 동안 반복하는 구조 | 조건 변수가 변하지 않으면 무한 루프 |
| **함수** | 코드를 이름으로 묶어 재사용하는 단위 | `def`로 정의, `return`으로 값 반환 |

기억할 것: `return`이 없으면 함수는 `None`을 돌려준다. 계산 결과를 재사용하려면 `print()`가 아니라 `return`을 써야 한다.

### 금융 개념

| 개념 | 정의 | 공식 |
|---|---|---|
| **단리** | 원금에만 이자를 계산 | $A = P(1+rt)$ |
| **복리** | 이자를 원금에 합산해 다시 이자를 계산 | $A = P(1+r)^t$ |
| **연 m회 복리** | 이자 지급 주기를 나눔 | $A = P(1+r/m)^{mt}$ |
| **연속복리** | 복리 주기를 무한히 짧게 한 극한 | $A = Pe^{rt}$ |
| **NPV** | 미래 현금흐름을 현재가치로 환산한 합 | $\sum CF_t/(1+r)^t$ |
| **IRR** | NPV를 0으로 만드는 할인율 | $\sum CF_t/(1+IRR)^t = 0$ |

세 가지를 연결해서 기억하면 좋다. **복리는 현재 → 미래, NPV는 미래 → 현재, IRR은 그 둘을 잇는 수익률**이다.

---

## 오늘의 코드

`week2.py` 파일에 아래 코드를 붙여넣고 실행한다. 이번 주에 배운 문법과 금융 개념이 모두 들어 있다.

```python
"""
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
print("=" * 46)
```

`"투자 타당" if value > 0 else "투자 부적합"`처럼 한 줄로 쓴 조건문을 **삼항 연산자**라고 한다. 간단한 분기를 짧게 쓸 때 유용하다.

---

## 오늘의 테스트

### Q1. 다음 코드의 출력 결과는?

```python
for i in range(1, 4):
    print(i, end=" ")
```

1. `0 1 2 3`
2. `1 2 3`
3. `1 2 3 4`
4. `0 1 2`

<details>
<summary>정답 보기</summary>

**정답: 2번 — `1 2 3`**

`range(1, 4)`는 1부터 시작해 **4를 포함하지 않고** 3까지 생성한다. `end=" "`는 줄바꿈 대신 공백을 붙인다.
</details>

### Q2. 다음 코드에서 발생하는 문제는?

```python
balance = 1000000
while balance < 2000000:
    print(balance)
```

1. `while` 뒤에 콜론이 없다
2. `balance`가 변하지 않아 무한 루프에 빠진다
3. `print()` 안에 f-string을 써야 한다
4. 문제없이 정상 동작한다

<details>
<summary>정답 보기</summary>

**정답: 2번**

반복문 안에서 조건에 쓰인 변수(`balance`)가 전혀 변하지 않으므로 조건이 영원히 참이다. 실행됐다면 `Ctrl + C`로 강제 종료한다.
</details>

### Q3. 다음 코드의 출력 결과는?

```python
def add_interest(balance, rate):
    balance = balance * (1 + rate)
    print(balance)

result = add_interest(1000000, 0.05)
print(result)
```

<details>
<summary>정답 보기</summary>

**정답:**

```
1050000.0
None
```

함수 안의 `print()`로 1050000.0이 출력되지만, `return`이 없으므로 함수는 `None`을 돌려준다. 따라서 `result`에는 `None`이 들어간다. 값을 사용하려면 `return balance`가 필요하다.
</details>

### Q4. 수익률에 따라 등급을 매기는 코드다. `profit_rate = 0.12`일 때 출력되는 값은?

```python
profit_rate = 0.12

if profit_rate > 0.05:
    print("양호")
elif profit_rate > 0.10:
    print("우수")
else:
    print("보통")
```

1. `우수`
2. `양호`
3. `양호`와 `우수` 둘 다
4. `보통`

<details>
<summary>정답 보기</summary>

**정답: 2번 — `양호`**

`if`/`elif`는 위에서부터 검사해 **처음 참이 되는 하나만** 실행하고 빠져나온다. 0.12는 첫 조건(`> 0.05`)에서 이미 참이므로 `우수`에는 도달하지 못한다. 의도대로 하려면 조건을 엄격한 순서(큰 값부터)로 배치해야 한다.
</details>

### Q5. 원금 100만 원, 연 이자율 5%, 3년일 때 원리금이 가장 큰 방식은?

1. 단리
2. 연복리
3. 월복리
4. 연속복리

<details>
<summary>정답 보기</summary>

**정답: 4번 — 연속복리**

```
단리     1,150,000원
연복리   1,157,625원
월복리   1,161,472원
연속복리 1,161,834원
```

복리 주기가 짧아질수록 원리금이 커지며, 그 극한이 연속복리($Pe^{rt}$)다.
</details>

### Q6. NPV에 대한 설명 중 옳지 않은 것은?

1. 할인율이 높아질수록 NPV는 작아진다
2. NPV가 0보다 크면 요구수익률 이상의 가치를 창출한다는 뜻이다
3. $t=0$ 시점의 현금흐름도 할인율로 나눠야 한다
4. 투자금은 음수, 회수금은 양수로 표현한다

<details>
<summary>정답 보기</summary>

**정답: 3번**

$t=0$은 현재 시점이므로 $(1+r)^0 = 1$이 되어 할인되지 않는다. 코드에서도 `cashflows[0] / (1+rate)**0`은 원래 값 그대로다.
</details>

### Q7. IRR을 구할 때 반복문(이분법)을 쓰는 이유로 가장 적절한 것은?

1. IRR 공식이 너무 길어서 한 줄에 쓸 수 없기 때문
2. IRR이 거듭제곱의 지수 안에 있어 일반적으로 식을 정리해 직접 풀 수 없기 때문
3. 파이썬에 거듭제곱 연산자가 없기 때문
4. 현금흐름이 리스트로 되어 있기 때문

<details>
<summary>정답 보기</summary>

**정답: 2번**

$\sum CF_t/(1+IRR)^t = 0$에서 IRR은 분모의 거듭제곱 안에 갇혀 있어 대수적으로 분리할 수 없다. 그래서 값을 대입해가며 정답에 접근하는 수치해석적 방법을 사용한다.
</details>

### Q8. 빈칸을 채워 함수를 완성하시오.

원금이 목표 금액에 도달하는 데 걸리는 햇수를 반환하는 함수다.

```python
def years_to_target(principal, rate, target):
    """복리로 목표 금액에 도달하기까지 걸리는 햇수를 반환한다."""
    balance = principal
    year = 0

    ______ balance < target:
        balance *= (1 + rate)
        year ______ 1

    ______ year


print(years_to_target(1000000, 0.05, 2000000))   # 15
```

<details>
<summary>정답 보기</summary>

```python
def years_to_target(principal, rate, target):
    """복리로 목표 금액에 도달하기까지 걸리는 햇수를 반환한다."""
    balance = principal
    year = 0

    while balance < target:
        balance *= (1 + rate)
        year += 1

    return year
```

반복 횟수를 미리 알 수 없으므로 `while`을 사용하고, 결과를 재사용해야 하므로 `return`으로 값을 돌려준다.
</details>

### Q9. (심화) 아래 코드의 실행 결과를 예상하시오.

```python
cashflows = [-1000000, 400000, 400000, 400000]

low, high = 0.0, 1.0
for _ in range(3):
    mid = (low + high) / 2
    if npv(mid, cashflows) > 0:
        low = mid
    else:
        high = mid

print(f"{low:.2%} ~ {high:.2%}")
```

<details>
<summary>정답 보기</summary>

**정답: `0.00% ~ 12.50%`**

- 1회차: mid=50%, NPV<0 → high=0.5
- 2회차: mid=25%, NPV<0 → high=0.25
- 3회차: mid=12.5%, NPV<0 → high=0.125

세 번 만에 구간이 1/8로 줄었다. 정답인 9.70%는 이 구간 안에 들어 있다.
</details>

---

## 다음 주 예고

3주차에서는 **수익률과 금융 데이터**를 다룬다. 이번 주에 잠깐 등장한 **리스트**를 제대로 배우고, **딕셔너리**와 **라이브러리 임포트**를 익힌 뒤 실제 주가 데이터로 **로그수익률**을 계산한다. `pandas`를 처음 사용하는 주차다.

이번 주에 만든 `npv()`, `irr()` 같은 함수는 7주차 포트폴리오 집행에서 다시 불러 쓰게 되므로 `week2.py`를 지우지 말고 보관해둔다.
