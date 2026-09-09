# 3주차 — 수익률과 금융 데이터

> 리스트 · 딕셔너리 · 라이브러리 임포트 → 단순수익률 · 로그수익률 · pandas

지난주까지는 값 하나하나를 직접 타이핑해서 계산했다. 이번 주부터는 **수백 개의 가격 데이터를 한꺼번에** 다룬다. 그러기 위해 여러 값을 담는 그릇(리스트·딕셔너리)을 배우고, 남이 만들어둔 도구를 가져다 쓰는 방법(임포트)을 익힌 뒤, 실제 주가 데이터로 수익률을 계산한다.

---

## 0. 2주차 복습 노트

### 파이썬 문법

| 개념 | 핵심 |
|---|---|
| **조건문** | `if` / `elif` / `else`, 콜론과 들여쓰기 필수. 처음 참이 되는 하나만 실행 |
| **for문** | `range(a, b)`는 **b를 포함하지 않는다** |
| **while문** | 조건 변수가 변하지 않으면 무한 루프 (`Ctrl + C`로 탈출) |
| **함수** | `def`로 정의, `return`으로 값 반환. `return`이 없으면 `None` |

### 금융 개념

| 개념 | 공식 |
|---|---|
| 복리 | $A = P(1+r)^t$ |
| 연 m회 복리 | $A = P(1+r/m)^{mt}$ |
| 연속복리 | $A = Pe^{rt}$ |
| NPV | $\sum CF_t/(1+r)^t$ |
| IRR | NPV를 0으로 만드는 $r$ |

### 코드로 보는 2주차

```python
def compound(principal, rate, years):
    """복리 원리금을 반환한다."""
    return principal * (1 + rate) ** years


balance = 1000000
for year in range(1, 4):          # 1, 2, 3
    balance *= (1 + 0.05)
    print(f"{year}년차 {balance:,.0f}원")

print(f"3년 후: {compound(1000000, 0.05, 3):,.0f}원")
```

### 이번 주 준비

가상환경을 활성화한 뒤, 이번 주에 사용할 라이브러리를 설치한다.

```bash
pip install pandas numpy finance-datareader
```

1주차에 numpy와 pandas는 이미 설치했으므로, 실제로 새로 받는 것은 `finance-datareader`다. 설치가 끝나면 `week3.py` 파일을 만든다.

---

## 1. 리스트 (List)

### 정의

**리스트란 여러 개의 값을 순서대로 담는 자료형이다.** 각 값은 0부터 시작하는 번호(인덱스)로 접근하며, 생성한 뒤에도 값을 추가·삭제·변경할 수 있다.

### 비유

리스트는 **번호가 매겨진 사물함 한 줄**이다. 변수가 상자 하나였다면, 리스트는 그런 상자를 일렬로 붙여놓고 앞에서부터 0번, 1번, 2번 번호를 붙인 것이다. 몇 번 칸인지만 알면 그 안의 물건을 바로 꺼낼 수 있다.

### 만들기와 꺼내기

```python
prices = [70000, 71400, 70700, 72100, 71000]

print(prices)         # [70000, 71400, 70700, 72100, 71000]
print(prices[0])      # 70000   ← 첫 번째
print(prices[2])      # 70700   ← 세 번째
print(len(prices))    # 5       ← 개수
```

**인덱스는 0부터 시작한다.** 다섯 개짜리 리스트의 인덱스는 0, 1, 2, 3, 4이며 `prices[5]`는 `IndexError`가 난다.

음수 인덱스는 뒤에서부터 센다. 가장 최근 종가를 꺼낼 때 특히 유용하다.

```python
print(prices[-1])     # 71000   ← 마지막 (최근 종가)
print(prices[-2])     # 72100   ← 뒤에서 두 번째
```

### 슬라이싱 — 일부만 잘라내기

```python
print(prices[0:3])    # [70000, 71400, 70700]   0번부터 3번 '앞'까지
print(prices[:3])     # [70000, 71400, 70700]   처음부터
print(prices[2:])     # [70700, 72100, 71000]   2번부터 끝까지
print(prices[-3:])    # [70700, 72100, 71000]   최근 3일치
```

`range()`와 마찬가지로 **끝 번호는 포함하지 않는다.**

### 값 바꾸기와 추가하기

```python
prices = [70000, 71400, 70700]

prices[0] = 69500          # 값 변경
prices.append(72100)       # 맨 뒤에 추가
print(prices)              # [69500, 71400, 70700, 72100]

prices.remove(70700)       # 값으로 삭제
print(prices)              # [69500, 71400, 72100]
```

`.append()`처럼 `점(.)`을 찍고 부르는 함수를 **메서드(method)** 라고 한다. "이 리스트에 속한 기능"이라는 뜻이다.

### 반복문과 함께 쓰기

리스트의 진짜 힘은 반복문과 결합할 때 나온다.

```python
prices = [70000, 71400, 70700, 72100, 71000]

# 방법 1: 값을 하나씩 꺼내기
for price in prices:
    print(f"{price:,}원")

# 방법 2: 인덱스가 필요할 때
for i in range(len(prices)):
    print(f"{i}일차: {prices[i]:,}원")

# 방법 3: 인덱스와 값을 동시에 (enumerate)
for i, price in enumerate(prices):
    print(f"{i}일차: {price:,}원")
```

### 유용한 내장 함수

```python
prices = [70000, 71400, 70700, 72100, 71000]

print(sum(prices))              # 355200    합계
print(len(prices))              # 5         개수
print(max(prices))              # 72100     최댓값
print(min(prices))              # 70000     최솟값
print(sum(prices) / len(prices))  # 71040.0  평균
```

### 리스트 컴프리헨션

리스트로부터 새 리스트를 만드는 간결한 문법이다.

```python
prices = [70000, 71400, 70700, 72100, 71000]

# 일반적인 방법
thousands = []
for p in prices:
    thousands.append(p / 1000)

# 리스트 컴프리헨션 (한 줄)
thousands = [p / 1000 for p in prices]
print(thousands)     # [70.0, 71.4, 70.7, 72.1, 71.0]

# 조건을 붙일 수도 있다
high = [p for p in prices if p > 71000]
print(high)          # [71400, 72100]
```

처음에는 낯설지만 금융 데이터 처리에서 매우 자주 쓰이므로 눈에 익혀두면 좋다.

---

## 2. 딕셔너리 (Dictionary)

### 정의

**딕셔너리란 키(key)와 값(value)을 한 쌍으로 묶어 저장하는 자료형이다.** 리스트가 순서 번호로 값을 찾는다면, 딕셔너리는 의미 있는 이름으로 값을 찾는다.

### 비유

딕셔너리는 **국어사전**이다. 사전에서 단어를 찾을 때 "374쪽 5번째 단어"라고 하지 않고 그냥 "사과"라고 찾는다. 마찬가지로 주가를 다룰 때 `prices[0]`보다 `prices["삼성전자"]`가 훨씬 명확하다.

### 만들기와 꺼내기

```python
portfolio = {
    "삼성전자": 70000,
    "SK하이닉스": 180000,
    "NAVER": 210000,
}

print(portfolio["삼성전자"])     # 70000
print(len(portfolio))            # 3
```

중괄호 `{}`로 감싸고, `키: 값` 형태로 콤마로 구분한다.

### 추가·수정·삭제

```python
portfolio["카카오"] = 45000       # 없는 키 → 추가
portfolio["삼성전자"] = 71500     # 있는 키 → 수정
del portfolio["NAVER"]            # 삭제

print(portfolio)
# {'삼성전자': 71500, 'SK하이닉스': 180000, '카카오': 45000}
```

### 안전하게 꺼내기: `.get()`

없는 키를 대괄호로 꺼내면 `KeyError`가 난다. `.get()`은 에러 대신 `None`(또는 지정한 기본값)을 돌려준다.

```python
# print(portfolio["LG전자"])          # ❌ KeyError
print(portfolio.get("LG전자"))         # None
print(portfolio.get("LG전자", 0))      # 0  ← 기본값 지정
```

### 반복문과 함께 쓰기

```python
portfolio = {"삼성전자": 70000, "SK하이닉스": 180000, "NAVER": 210000}

for name in portfolio:                    # 키만
    print(name)

for name, price in portfolio.items():     # 키와 값 동시에
    print(f"{name:<12}{price:>10,}원")

print(list(portfolio.keys()))    # ['삼성전자', 'SK하이닉스', 'NAVER']
print(list(portfolio.values()))  # [70000, 180000, 210000]
```

### 포트폴리오 표현하기

딕셔너리는 포트폴리오를 표현하기에 자연스러운 구조다.

```python
weights = {"삼성전자": 0.4, "SK하이닉스": 0.35, "NAVER": 0.25}

print(f"비중 합계: {sum(weights.values()):.2f}")   # 비중 합계: 1.00

for name, w in weights.items():
    print(f"{name:<12}{w:>8.2%}")
```

5주차에서 여러 자산을 관리할 때 이 구조를 그대로 사용한다.

### 리스트 vs 딕셔너리

| | 리스트 | 딕셔너리 |
|---|---|---|
| 접근 방법 | 순서 번호 `prices[0]` | 키 `prices["삼성전자"]` |
| 적합한 데이터 | 시간순 가격, 수익률 시계열 | 종목별 가격, 종목별 비중 |
| 기호 | `[ ]` | `{ }` |

---

## 3. 라이브러리 임포트 (Import)

### 정의

**라이브러리란 특정 목적을 위해 미리 작성된 코드의 묶음이며, 임포트란 그 라이브러리를 현재 파일로 불러와 사용할 수 있게 만드는 동작이다.**

### 비유

임포트는 **도서관에서 책을 빌려오는 것**이다. 통계 계산이 필요할 때마다 표준편차 공식을 직접 구현할 필요 없이, 이미 검증된 도구를 빌려 쓰는 것이다. 2주차에 `import math`로 자연상수를 가져왔던 것이 첫 사례였다.

### 임포트의 네 가지 방식

```python
# 1) 통째로 가져오기
import math
print(math.exp(1))

# 2) 별명(alias)을 붙여 가져오기 — 가장 흔한 방식
import pandas as pd
import numpy as np

# 3) 일부만 콕 집어 가져오기
from math import exp, log
print(exp(1))          # math. 없이 바로 사용

# 4) 전부 가져오기 — 권장하지 않음
from math import *     # 이름 충돌 위험이 있어 실무에서 지양
```

`pd`, `np`는 전 세계가 공유하는 관례적 별명이다. 다른 이름을 써도 동작하지만, 남이 읽을 코드에서는 관례를 따르는 편이 좋다.

### 표준 라이브러리와 외부 라이브러리

| 구분 | 설치 | 예시 |
|---|---|---|
| 표준 라이브러리 | 불필요 (파이썬에 내장) | `math`, `random`, `datetime`, `csv` |
| 외부 라이브러리 | `pip install` 필요 | `pandas`, `numpy`, `matplotlib`, `finance-datareader` |

**외부 라이브러리는 가상환경 안에 설치된다.** 가상환경을 활성화하지 않은 채 실행하면 `ModuleNotFoundError`가 나는데, 이때는 `(venv)` 표시가 있는지부터 확인한다.

### 임포트는 파일 맨 위에

```python
import math

import numpy as np
import pandas as pd
import FinanceDataReader as fdr

# ↓ 이 아래부터 실제 코드
```

관례상 표준 라이브러리 → 외부 라이브러리 순으로 묶어 쓰고, 그 사이를 한 줄 띄운다.

---

## 4. pandas — 표 형태 데이터 다루기

### 정의

**pandas는 표(table) 형태의 데이터를 다루기 위한 파이썬 라이브러리다.** 핵심 자료구조는 1차원 데이터를 담는 `Series`와 2차원 표를 담는 `DataFrame`이다.

### 비유

pandas는 **프로그래밍이 가능한 엑셀**이다. 엑셀에서 열 하나를 선택해 평균을 구하듯, pandas에서는 열 이름으로 데이터를 뽑아 계산한다. 다만 엑셀과 달리 100만 행도 코드 한 줄로 처리할 수 있고, 그 과정이 코드로 남아 재현 가능하다.

### Series — 한 줄짜리 데이터

```python
import pandas as pd

prices = pd.Series([70000, 71400, 70700, 72100, 71000])
print(prices)

# 0    70000
# 1    71400
# 2    70700
# 3    72100
# 4    71000
# dtype: int64
```

왼쪽 열이 **인덱스(index)**, 오른쪽이 값이다. 인덱스를 날짜로 지정할 수도 있다.

```python
dates = ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05"]
prices = pd.Series([70000, 71400, 70700, 72100, 71000], index=dates)
print(prices["2026-09-03"])   # 70700
```

### Series의 강력함: 벡터 연산

리스트와 결정적으로 다른 점이다. 반복문 없이 전체에 연산이 적용된다.

```python
prices = pd.Series([70000, 71400, 70700, 72100, 71000])

print(prices / 1000)       # 모든 값을 1000으로 나눔
print(prices * 1.1)        # 모든 값에 1.1을 곱함
print(prices > 71000)      # 각 값의 참/거짓
```

리스트로 같은 일을 하려면 반복문이나 컴프리헨션이 필요하다. **데이터가 커질수록 이 차이가 결정적**이다.

### 통계 메서드

```python
prices = pd.Series([70000, 71400, 70700, 72100, 71000])

print(prices.mean())     # 71040.0   평균
print(prices.max())      # 72100     최댓값
print(prices.min())      # 70000     최솟값
print(prices.std())      # 810.55    표준편차
print(prices.describe()) # 주요 통계량 한 번에
```

### DataFrame — 여러 열을 가진 표

```python
df = pd.DataFrame({
    "삼성전자": [70000, 71400, 70700],
    "SK하이닉스": [180000, 182000, 179000],
}, index=["2026-09-01", "2026-09-02", "2026-09-03"])

print(df)
#             삼성전자  SK하이닉스
# 2026-09-01   70000    180000
# 2026-09-02   71400    182000
# 2026-09-03   70700    179000
```

딕셔너리로 DataFrame을 만드는 이 패턴을 기억해두면 좋다. **키가 열 이름, 값이 그 열의 데이터**가 된다.

```python
print(df["삼성전자"])        # 열 하나 선택 → Series
print(df.head(2))            # 위에서 2행
print(df.tail(2))            # 아래에서 2행
print(df.shape)              # (3, 2)  행 개수, 열 개수
print(df.columns)            # 열 이름 목록
print(df.mean())             # 열별 평균
```

### 핵심 메서드: `.shift()`

수익률 계산의 열쇠가 되는 메서드다. 데이터를 한 칸씩 밀어낸다.

```python
prices = pd.Series([70000, 71400, 70700, 72100])

print(prices.shift(1))
# 0        NaN      ← 전날이 없으므로 비어 있음
# 1    70000.0
# 2    71400.0
# 3    70700.0
```

`shift(1)`을 하면 각 행 옆에 **전날 가격**이 놓인다. 오늘 가격과 전날 가격을 나란히 두면 수익률을 한 번에 계산할 수 있다.

`NaN`(Not a Number)은 값이 없음을 뜻한다. `.dropna()`로 제거할 수 있다.

---

## 5. 실제 주가 데이터 가져오기

`FinanceDataReader`는 한국·미국 주식의 가격 데이터를 코드 한 줄로 가져오는 라이브러리다.

```python
import FinanceDataReader as fdr

# 삼성전자(005930)의 2026년 데이터
df = fdr.DataReader("005930", "2026-01-01")
print(df.head())
print(df.columns)   # Open, High, Low, Close, Volume, Change
```

| 심볼 | 대상 |
|---|---|
| `"005930"` | 삼성전자 (한국은 6자리 종목코드) |
| `"069500"` | KODEX 200 ETF |
| `"360750"` | TIGER 미국S&P500 |
| `"439870"` | KODEX 국고채30년액티브 |
| `"132030"` | KODEX 골드선물(H) |
| `"AAPL"` | 애플 (미국은 티커) |
| `"KS11"` | 코스피 지수 |
| `"KQ11"` | 코스닥 지수 |

아래 다섯 종목을 이번 주부터 7주차까지 공통으로 쓴다. 주식 하나, 국내 지수, 해외 지수, 채권, 원자재로 **성격이 다른 자산을 섞어야** 5주차의 상관계수와 6주차의 분산 효과가 눈에 보이기 때문이다.

우리가 주로 쓸 것은 **종가(Close)** 열이다.

```python
close = df["Close"]
print(close.head())
print(f"최근 종가: {close.iloc[-1]:,.0f}원")
```

`.iloc[-1]`은 위치 기준으로 마지막 행을 꺼낸다. 인덱스가 날짜일 때 `[-1]` 대신 `.iloc[-1]`을 쓰는 습관을 들이면 안전하다.

> **네트워크가 안 될 때**: 인터넷이 막혀 있거나 서버가 응답하지 않으면 데이터를 못 가져온다. 이럴 때를 대비해 아래 코드로 데이터를 CSV로 저장해두면 오프라인에서도 실습할 수 있다. CSV 입출력은 7주차에서 자세히 다룬다.
>
> ```python
> df.to_csv("samsung.csv")                              # 저장
> df = pd.read_csv("samsung.csv", index_col=0)          # 불러오기
> ```

---

## 6. 단순수익률 (Simple Return)

### 정의

**단순수익률이란 일정 기간 동안 자산 가격의 변화율이다.** 산술수익률이라고도 한다.

$$R_t = \frac{P_t - P_{t-1}}{P_{t-1}} = \frac{P_t}{P_{t-1}} - 1$$

### 비유

단순수익률은 **"내가 실제로 몇 % 벌었나"** 를 그대로 말해주는 숫자다. 7만 원에 사서 7만 1,400원이 되었다면 2% 벌었다. 계좌 잔고와 직접 연결되는 직관적인 값이다.

### 계산

```python
import pandas as pd

prices = pd.Series([70000, 71400, 70700, 72100, 71000])

# 방법 1: 직접 계산
returns = prices / prices.shift(1) - 1

# 방법 2: pandas 전용 메서드 (동일한 결과)
returns = prices.pct_change()

print(returns)
# 0         NaN
# 1    0.020000    ← +2.00%
# 2   -0.009804    ← -0.98%
# 3    0.019802    ← +1.98%
# 4   -0.015257    ← -1.53%
```

### 단순수익률의 성질

**자산 간 합산이 가능하다.** 포트폴리오 수익률은 각 자산의 수익률을 비중으로 가중평균해서 구한다.

$$R_p = \sum_i w_i R_i$$

```python
weights = {"삼성전자": 0.6, "SK하이닉스": 0.4}
day_returns = {"삼성전자": 0.020, "SK하이닉스": -0.010}

portfolio_return = 0
for name in weights:
    portfolio_return += weights[name] * day_returns[name]

print(f"포트폴리오 수익률: {portfolio_return:.2%}")   # 0.80%
```

**시간에 대해서는 합산이 불가능하다.** 이것이 다음 절의 출발점이다.

```python
# +50% 후 -50%는 0%가 아니다
print(1000 * (1 + 0.5) * (1 - 0.5))   # 750.0  → 실제로는 -25%
```

---

## 7. 로그수익률 (Log Return)

### 정의

**로그수익률이란 가격비에 자연로그를 취한 값이다.** 연속복리수익률이라고도 한다.

$$r_t = \ln\left(\frac{P_t}{P_{t-1}}\right) = \ln P_t - \ln P_{t-1}$$

### 비유

2주차에서 연속복리 $A = Pe^{rt}$를 배웠다. **로그수익률은 그 식을 $r$에 대해 푼 것**이다. "가격이 이만큼 오르려면 연속복리로 몇 %가 필요했나"를 묻는 값이다.

또 다른 관점에서, 단순수익률이 **계좌 잔고의 언어**라면 로그수익률은 **수학의 언어**다. 시간축으로 더할 수 있고 정규분포에 가깝게 행동해서, 통계 모형과 금융공학 이론은 거의 예외 없이 로그수익률을 쓴다.

### 계산

```python
import numpy as np
import pandas as pd

prices = pd.Series([70000, 71400, 70700, 72100, 71000])

log_returns = np.log(prices / prices.shift(1))

print(log_returns)
# 0         NaN
# 1    0.019803
# 2   -0.009852
# 3    0.019608
# 4   -0.015374
```

### 핵심 성질 1: 시간에 대해 더할 수 있다

로그의 성질 $\ln(a \times b) = \ln a + \ln b$ 때문이다. 여러 날의 로그수익률을 그냥 더하면 그 기간 전체의 로그수익률이 된다.

```python
prices = pd.Series([70000, 71400, 70700, 72100, 71000, 72500, 73200, 72000, 74000, 75000])

simple = prices.pct_change().dropna()
log_ret = np.log(prices / prices.shift(1)).dropna()

total_actual = prices.iloc[-1] / prices.iloc[0] - 1

print(f"실제 총수익률       : {total_actual:.6f}")      # 0.071429
print(f"단순수익률 단순합계 : {simple.sum():.6f}")       # 0.070421  ← 틀림
print(f"로그수익률 합계 복원: {np.exp(log_ret.sum()) - 1:.6f}")  # 0.071429  ← 정확
```

단순수익률을 그냥 더하면 실제 수익률과 어긋난다. 반면 로그수익률은 더한 뒤 $e^x - 1$로 되돌리면 정확히 일치한다.

### 핵심 성질 2: 두 수익률의 변환

$$r = \ln(1 + R) \qquad R = e^{r} - 1$$

```python
R = 0.02                      # 단순수익률 2%
r = np.log(1 + R)
print(f"로그수익률: {r:.6f}")   # 0.019803

print(f"복원: {np.exp(r) - 1:.6f}")   # 0.020000
```

수익률이 작을 때는 두 값이 거의 같다. 위 예에서도 2.0000%와 1.9803%로 차이가 미미하다. 하지만 변동이 커질수록 차이가 벌어진다.

```python
for R in [0.01, 0.05, 0.20, 0.50, -0.50]:
    print(f"단순 {R:>7.2%} → 로그 {np.log(1+R):>8.4f}")

# 단순   1.00% → 로그   0.0100
# 단순   5.00% → 로그   0.0488
# 단순  20.00% → 로그   0.1823
# 단순  50.00% → 로그   0.4055
# 단순 -50.00% → 로그  -0.6931
```

-50%의 로그수익률(-0.6931)이 +50%(0.4055)보다 절댓값이 크다는 점에 주목할 만하다. **반토막 난 자산이 원상복구되려면 100%가 올라야 한다**는 비대칭성을 로그수익률은 자연스럽게 반영한다.

### 언제 무엇을 쓰는가

| | 단순수익률 | 로그수익률 |
|---|---|---|
| 시간축 합산 | ❌ | ⭕ |
| 자산 간 합산 | ⭕ | ❌ |
| 직관성 | 높음 (실제 손익) | 낮음 |
| 주 용도 | 성과 보고, 포트폴리오 수익률 | 통계 분석, 변동성 계산, 모형 |

정리하면 **포트폴리오를 가로로 합칠 때는 단순수익률, 시계열을 세로로 합치거나 통계를 낼 때는 로그수익률**이다. 4주차의 변동성 계산에서는 로그수익률을 사용한다.

---

## 오늘 배운 것 정리

### 파이썬 문법

| 개념 | 한 줄 정의 | 핵심 |
|---|---|---|
| **리스트** | 값을 순서대로 담는 자료형 | `[ ]`, 인덱스 0부터, `[-1]`은 마지막 |
| **딕셔너리** | 키-값 쌍으로 저장하는 자료형 | `{ }`, `.items()`로 순회, `.get()`은 안전 |
| **임포트** | 외부 코드를 불러오는 동작 | `import pandas as pd`, 파일 맨 위에 |
| **Series** | pandas의 1차원 데이터 | 반복문 없이 벡터 연산 |
| **DataFrame** | pandas의 2차원 표 | `df["열이름"]`으로 선택 |
| **`.shift(1)`** | 데이터를 한 칸 밀기 | 수익률 계산의 열쇠 |

### 금융 개념

| 개념 | 공식 | pandas 코드 |
|---|---|---|
| 단순수익률 | $P_t/P_{t-1} - 1$ | `prices.pct_change()` |
| 로그수익률 | $\ln(P_t/P_{t-1})$ | `np.log(prices / prices.shift(1))` |
| 변환 | $r = \ln(1+R)$ | `np.log(1 + R)` |
| 역변환 | $R = e^r - 1$ | `np.exp(r) - 1` |

---

## 오늘의 코드

`week3.py` 파일에 붙여넣고 실행한다.

```python
"""
3주차 실습 — 주가 데이터로 수익률 계산하기
FinanceDataReader로 실제 주가를 받아 단순수익률과 로그수익률을 비교한다.
"""

import numpy as np
import pandas as pd
import FinanceDataReader as fdr


# ── 1) 종목 정보를 딕셔너리로 관리 ──────────────────────

TICKERS = {
    "삼성전자": "005930",       # 개별 주식
    "KODEX200": "069500",      # 국내 주식 (코스피200 ETF)
    "미국S&P500": "360750",    # 해외 주식
    "국고채30년": "439870",     # 채권
    "금": "132030",            # 원자재
}

# 국고채30년 ETF 상장일(2022-08-23) 이후로 잡아야 다섯 종목이 모두 채워진다
START = "2022-09-01"


def get_close(ticker, start=START):
    """종목코드를 받아 종가 Series를 반환한다."""
    df = fdr.DataReader(ticker, start)
    return df["Close"]


# ── 2) 여러 종목의 종가를 하나의 DataFrame으로 ────────────

close_data = {}
for name, ticker in TICKERS.items():
    close_data[name] = get_close(ticker)
    print(f"{name} 데이터 수집 완료 ({len(close_data[name])}일치)")

prices = pd.DataFrame(close_data)

print()
print("최근 5일 종가")
print(prices.tail())


# ── 3) 수익률 계산 ──────────────────────────────────────

simple_returns = prices.pct_change().dropna()
log_returns = np.log(prices / prices.shift(1)).dropna()

print()
print("최근 5일 단순수익률")
print(simple_returns.tail().map(lambda x: f"{x:.2%}"))


# ── 4) 종목별 요약 ──────────────────────────────────────

print()
print("=" * 56)
print(f"{'종목':<12}{'총수익률':>12}{'평균일수익률':>14}{'거래일수':>10}")
print("=" * 56)

for name in prices.columns:
    total = prices[name].iloc[-1] / prices[name].iloc[0] - 1
    daily_mean = simple_returns[name].mean()
    days = len(prices[name])
    print(f"{name:<12}{total:>12.2%}{daily_mean:>14.4%}{days:>10}")

print("=" * 56)


# ── 5) 로그수익률의 가법성 확인 ──────────────────────────

print()
print("로그수익률은 시간축으로 더할 수 있다")
print("-" * 56)

for name in prices.columns:
    actual = prices[name].iloc[-1] / prices[name].iloc[0] - 1
    by_simple = simple_returns[name].sum()
    by_log = np.exp(log_returns[name].sum()) - 1

    print(f"{name}")
    print(f"  실제 총수익률       {actual:>10.4%}")
    print(f"  단순수익률 단순합계 {by_simple:>10.4%}   (부정확)")
    print(f"  로그수익률로 복원   {by_log:>10.4%}   (정확)")


# ── 6) 데이터 저장 (다음 주에 재사용) ────────────────────

prices.to_csv("prices.csv")
print()
print("prices.csv 저장 완료 — 다음 주에 이 파일을 사용한다.")
```

`.map(lambda x: f"{x:.2%}")`는 각 값에 서식을 적용하는 코드다. `lambda`는 이름 없이 즉석에서 만드는 함수로, 지금은 "각 값 x를 백분율 문자열로 바꾼다" 정도로 이해하면 충분하다.

**데이터를 못 받는 경우**를 대비해, 인터넷 없이 돌려볼 수 있는 축소판도 함께 둔다.

```python
"""오프라인 연습용 — 하드코딩한 가격으로 동일한 계산 수행"""
import numpy as np
import pandas as pd

prices = pd.Series(
    [70000, 71400, 70700, 72100, 71000, 72500, 73200, 72000, 74000, 75000]
)

simple = prices.pct_change().dropna()
log_ret = np.log(prices / prices.shift(1)).dropna()

print(f"실제 총수익률        {prices.iloc[-1]/prices.iloc[0]-1:.4%}")   # 7.1429%
print(f"단순수익률 단순합계  {simple.sum():.4%}")                       # 7.0421%
print(f"로그수익률로 복원    {np.exp(log_ret.sum())-1:.4%}")            # 7.1429%
print(f"평균 일간 수익률     {simple.mean():.4%}")                      # 0.7825%
print(f"일간 수익률 표준편차 {simple.std():.4%}")                       # 1.7075%
```

---

## 오늘의 테스트

### Q1. 다음 코드의 출력 결과는?

```python
prices = [70000, 71400, 70700, 72100, 71000]
print(prices[1:3])
```

1. `[71400, 70700, 72100]`
2. `[71400, 70700]`
3. `[70000, 71400, 70700]`
4. `[70700, 72100]`

<details>
<summary>정답 보기</summary>

**정답: 2번 — `[71400, 70700]`**

슬라이싱 `[1:3]`은 인덱스 1부터 시작해 **3을 포함하지 않고** 2까지 가져온다.
</details>

### Q2. 리스트의 마지막 값(최근 종가)을 꺼내는 방법으로 옳은 것을 모두 고르시오.

1. `prices[-1]`
2. `prices[len(prices)]`
3. `prices[len(prices) - 1]`
4. `prices[0]`

<details>
<summary>정답 보기</summary>

**정답: 1번, 3번**

인덱스는 0부터 시작하므로 마지막 인덱스는 `len - 1`이다. `prices[len(prices)]`는 범위를 벗어나 `IndexError`가 난다.
</details>

### Q3. 다음 코드에서 에러가 나는 줄은?

```python
portfolio = {"삼성전자": 70000, "NAVER": 210000}
print(portfolio["삼성전자"])       # (A)
print(portfolio.get("LG전자"))     # (B)
print(portfolio["LG전자"])         # (C)
print(portfolio.get("LG전자", 0))  # (D)
```

<details>
<summary>정답 보기</summary>

**정답: (C)**

없는 키를 대괄호로 접근하면 `KeyError`가 발생한다. `.get()`은 에러 대신 `None` 또는 지정한 기본값을 돌려주므로 (B), (D)는 안전하다.
</details>

### Q4. `import pandas as pd`에서 `as pd`의 역할은?

1. pandas를 설치한다
2. pandas에 `pd`라는 별명을 붙여 짧게 부를 수 있게 한다
3. pandas의 일부 기능만 가져온다
4. pandas를 다른 이름으로 저장한다

<details>
<summary>정답 보기</summary>

**정답: 2번**

`as`는 별명(alias)을 지정한다. `pd`, `np`는 관례적으로 굳어진 별명이다.
</details>

### Q5. 다음 코드의 출력 결과는?

```python
import pandas as pd

prices = pd.Series([100, 110, 121])
print(prices.pct_change())
```

<details>
<summary>정답 보기</summary>

**정답:**

```
0    NaN
1    0.1
2    0.1
dtype: float64
```

첫 행은 전날 값이 없어 `NaN`이고, 이후는 각각 100→110(+10%), 110→121(+10%)이다.
</details>

### Q6. 단순수익률과 로그수익률에 대한 설명 중 **옳지 않은** 것은?

1. 로그수익률은 시간축으로 더할 수 있다
2. 포트폴리오 수익률은 각 자산의 단순수익률을 비중으로 가중평균해 구한다
3. 수익률이 작을 때 두 값은 거의 비슷하다
4. 로그수익률은 자산 간 가중평균이 정확히 성립한다

<details>
<summary>정답 보기</summary>

**정답: 4번**

로그수익률은 **시간축(세로)** 으로는 더할 수 있지만 **자산 간(가로)** 가중평균은 정확히 성립하지 않는다. 포트폴리오 합산에는 단순수익률을 쓴다.
</details>

### Q7. 어떤 자산이 하루에 +50%, 다음 날 -50%를 기록했다. 이틀간 실제 수익률은?

1. `0%`
2. `-25%`
3. `+25%`
4. `-50%`

<details>
<summary>정답 보기</summary>

**정답: 2번 — `-25%`**

`1 × 1.5 × 0.5 = 0.75`이므로 -25%다. 단순수익률을 그냥 더하면 0%라는 잘못된 답이 나온다. 로그수익률로 계산하면 `ln(1.5) + ln(0.5) = 0.4055 - 0.6931 = -0.2877`이고, `exp(-0.2877) - 1 = -0.25`로 정확히 맞는다.
</details>

### Q8. 빈칸을 채워 함수를 완성하시오.

가격 Series를 받아 로그수익률 Series를 반환하는 함수다.

```python
import numpy as np
import pandas as pd


def log_return(prices):
    """가격 Series를 받아 로그수익률 Series를 반환한다."""
    return np.____(prices / prices.____(1)).dropna()
```

<details>
<summary>정답 보기</summary>

```python
def log_return(prices):
    """가격 Series를 받아 로그수익률 Series를 반환한다."""
    return np.log(prices / prices.shift(1)).dropna()
```

`shift(1)`로 전날 가격을 옆에 놓고, 가격비에 `np.log()`를 취한다. 첫 행의 `NaN`은 `.dropna()`로 제거한다.
</details>

### Q9. (심화) 다음 코드의 출력 결과를 예상하시오.

```python
weights = {"A": 0.5, "B": 0.3, "C": 0.2}
returns = {"A": 0.02, "B": -0.01, "C": 0.03}

total = 0
for name in weights:
    total += weights[name] * returns[name]

print(f"{total:.2%}")
```

<details>
<summary>정답 보기</summary>

**정답: `1.30%`**

`0.5 × 0.02 + 0.3 × (-0.01) + 0.2 × 0.03 = 0.01 - 0.003 + 0.006 = 0.013`

이것이 포트폴리오 수익률의 기본 계산이며, 6주차 포트폴리오 최적화의 출발점이다.
</details>

---

## 다음 주 예고

4주차에서는 **위험을 재는 법**을 다룬다. 이번 주에 구한 수익률을 재료로 **변동성(표준편차), CAGR, 샤프지수, MDD**를 계산한다. pandas의 통계 메서드(`.mean()`, `.std()`, `.rolling()`)와 numpy 배열 연산을 본격적으로 사용하는 주차다.

이번 주 코드가 만든 `prices.csv`를 다음 주에 그대로 쓰므로 지우지 않는다.

> 3주차와 4주차 사이에는 추석 연휴로 3주간의 공백이 있다. 다음 시간 도입부에 리스트·딕셔너리·pandas 기초를 짧게 복습하고 시작한다. 그 사이에 `week3.py`를 한 번씩 다시 실행해보면 감을 유지하는 데 도움이 된다.
