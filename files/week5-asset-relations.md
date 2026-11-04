# 5주차 — 자산 간의 관계

> 다중 자산 관리 · matplotlib 시각화 → 공분산 · 상관계수 · 베타 · CAPM

지난주까지는 자산을 하나씩 따로 놓고 평가했다. 하지만 포트폴리오는 **여러 자산을 함께 담는 일**이고, 그때 결정적으로 중요해지는 것은 각 자산의 성질이 아니라 **자산들 사이의 관계**다. 이번 주에 배우는 개념이 다음 주 포트폴리오 최적화의 직접적인 재료가 된다.

---

## 0. 복습 (1) — 1주차 파이썬 기초

3주간 공백이 있었으므로 1주차부터 4주차까지를 한 주씩 짚는다. **각 코드는 그대로 복사해 실행하면 아래 출력이 그대로 나온다.**

| 개념 | 핵심 |
|---|---|
| **변수** | 값에 이름을 붙여 저장한다. `=`는 대입, `==`는 비교 |
| **자료형** | `int`(정수) · `float`(실수) · `str`(문자열) · `bool`(참/거짓) |
| **`print()`** | 화면에 출력한다 |
| **`input()`** | 입력을 받는다. 결과는 **항상 문자열**이라 계산하려면 `int()`나 `float()`로 바꾼다 |
| **f-string** | `f"{변수}"`로 값을 끼워 넣는다. 금액은 `:,.0f`, 비율은 `:.2%` |
| **주석** | `#` 뒤는 실행되지 않는다 |

```python
principal = 1000000       # 원금
rate = 0.05               # 연 이자율
years = 3                 # 기간

total = principal * (1 + rate) ** years

print("원금:", principal)
print(f"연 이자율 {rate:.2%}로 {years}년 두면")
print(f"원리금은 {total:,.0f}원")
```

**실행 결과**

```
원금: 1000000
연 이자율 5.00%로 3년 두면
원리금은 1,157,625원
```

---

## 0. 복습 (2) — 2주차 화폐의 시간가치

| 개념 | 핵심 |
|---|---|
| **조건문** | `if` / `elif` / `else`. 콜론과 들여쓰기가 필수다 |
| **반복문** | `for`는 횟수를 알 때, `while`은 조건으로 돈다. `range(a, b)`는 **b를 포함하지 않는다** |
| **함수** | `def`로 정의하고 `return`으로 값을 돌려준다. `return`이 없으면 `None` |
| **복리** | 원금 × (1 + 이자율)^기간. 이자가 이자를 낳는다 |
| **NPV · IRR** | 미래의 현금흐름을 현재가치로 환산해 더한 값, 그리고 그 합을 0으로 만드는 할인율 |

```python
def compound(principal, rate, years):
    """복리 원리금을 반환한다."""
    return principal * (1 + rate) ** years


for year in range(1, 4):
    balance = compound(1000000, 0.05, year)
    state = "목표 달성" if balance >= 1150000 else "진행 중"
    print(f"{year}년차  {balance:>12,.0f}원  {state}")
```

**실행 결과**

```
1년차     1,050,000원  진행 중
2년차     1,102,500원  진행 중
3년차     1,157,625원  목표 달성
```

함수 하나와 반복문 하나, 그리고 한 줄짜리 조건문(삼항 연산자)이 모두 들어 있다.

---

## 0. 복습 (3) — 3주차 수익률과 금융 데이터

| 개념 | 핵심 |
|---|---|
| **리스트 · 딕셔너리** | `[ ]`는 순서로 꺼내고(`[-1]`은 마지막), `{ }`는 이름으로 꺼낸다 |
| **Series · DataFrame** | pandas의 1차원 · 2차원 데이터. 반복문 없이 전체에 연산이 걸린다 |
| **`.shift(1)`** | 한 칸 밀어 전날 값을 옆에 놓는다 |
| **단순수익률** | `prices.pct_change()` — 실제로 몇 % 벌었나 |
| **로그수익률** | `np.log(prices / prices.shift(1))` — 시간축으로 더할 수 있다 |

```python
import pandas as pd

prices = pd.Series([70000, 71400, 70700, 72100, 71000])
returns = prices.pct_change().dropna()

print(returns)
print(f"평균 일간 수익률 {returns.mean():.4%}")
```

**실행 결과**

```
1    0.020000
2   -0.009804
3    0.019802
4   -0.015257
dtype: float64
평균 일간 수익률 0.3685%
```

첫날은 전날이 없어 수익률이 없다. `.dropna()`가 그 줄을 떼어낸 것이다.

---

## 0. 복습 (4) — 4주차 위험을 재는 법

| 개념 | 핵심 |
|---|---|
| **통계 메서드** | `.mean()`, `.std()`, `.describe()` |
| **`.cummax()`** | 그때까지의 최고점. MDD 계산의 핵심 |
| **`.rolling(n)`** | n개짜리 창을 밀며 계산한다 |
| **변동성** | 수익률의 표준편차 × √252 (연 단위로 환산) |
| **CAGR · 샤프지수 · MDD** | 연평균 복리 수익률 · 위험 1단위당 초과수익 · 최악의 순간 낙폭 |

```python
import numpy as np
import pandas as pd

prices = pd.Series([70000, 71400, 70700, 72100, 71000])
returns = prices.pct_change().dropna()

print(f"연율화 변동성 {returns.std() * np.sqrt(252):>8.2%}")
print(f"최대낙폭(MDD) {(prices / prices.cummax() - 1).min():>8.2%}")
```

**실행 결과**

```
연율화 변동성   29.93%
최대낙폭(MDD)   -1.53%
```

기억할 것: **연율화할 때 수익률은 × 252, 변동성은 × √252.**

---

## 0-1. 4주차 그래프 직접 그려보기

아래 코드를 `week5.py`에 **그대로 복사해 붙여넣고 실행한다.** `prices.csv`가 같은 폴더에 있으면 바로 돌아간다. 없으면 [4주차 자료](/week/4)에서 내려받는다.

```python
"""4주차에서 그린 그래프 다시 그리기"""
import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams["font.family"] = "Malgun Gothic"   # macOS: AppleGothic, Linux: NanumGothic
plt.rcParams["axes.unicode_minus"] = False

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8), sharex=True)

# 위 — 시작을 1로 맞춘 누적 성과
normalized = prices / prices.iloc[0]
for name in prices.columns:
    ax1.plot(normalized.index, normalized[name], label=name)
ax1.set_title("누적 성과 (시작=1)")
ax1.legend()
ax1.grid(alpha=0.3)

# 아래 — 최고점 대비 낙폭
for name in prices.columns:
    ax2.plot(prices.index, prices[name] / prices[name].cummax() - 1, label=name)
ax2.set_title("최고점 대비 낙폭 (Drawdown)")
ax2.legend()
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()
```

그래프 창을 닫으면 프로그램이 끝난다. 한글이 네모로 나오면 `font.family` 줄에서 본인 OS에 맞는 것만 남긴다.

---

## 0-2. 4주차에서 그린 그래프

![4주차에서 그린 누적 성과와 낙폭 그래프](/week4-risk.png)

위는 다섯 자산의 누적 성과(시작을 1로 맞춘 것), 아래는 각 자산의 최고점 대비 낙폭이다. 그림 한 장에 지금까지 배운 것이 모여 있다.

| 그래프를 이루는 것 | 배운 주차 |
|---|---|
| `prices.csv`를 읽어 표로 만들기 | 3주차 |
| 시작값으로 나눠 모두 1에서 출발시키기 | 3주차 |
| `.cummax()`로 최고점을 만들어 낙폭 구하기 | 4주차 |
| 종목을 하나씩 돌며 선을 그리기 | 2주차 |
| 축·범례·격자를 붙여 그림으로 만들기 | 오늘 |

**데이터를 받아 위험을 재고 그림으로 그리는 데까지 4주가 걸렸다.** 자산을 하나씩 따로 보는 일은 이제 할 수 있다. 오늘은 여기에 **자산들이 서로 어떻게 움직이는가**를 더한다.

가상환경을 활성화하고 `prices.csv`가 있는지 확인한 뒤 `week5.py`를 새로 만든다.

---

## 1. 다중 자산 데이터 관리

### 정의

**다중 자산 관리란 여러 종목의 가격·수익률 데이터를 일관된 구조로 묶어, 종목이 늘거나 줄어도 코드를 고치지 않고 처리할 수 있게 만드는 설계 방식이다.**

### 비유

종목마다 변수를 따로 만드는 것은 **서류를 책상 위에 아무렇게나 쌓아두는 것**과 같다. 세 장일 때는 괜찮지만 서른 장이 되면 감당이 안 된다. 딕셔너리와 DataFrame은 **라벨이 붙은 서류함**이다. 몇 장이 들어오든 같은 방식으로 꺼낼 수 있다.

### 나쁜 방식과 좋은 방식

```python
# 나쁜 예 — 종목이 늘어날 때마다 코드를 고쳐야 한다
samsung = 70000
hynix = 180000
naver = 210000
total = samsung + hynix + naver

# 좋은 예 — 종목이 몇 개든 코드는 그대로다
portfolio = {"삼성전자": 70000, "SK하이닉스": 180000, "NAVER": 210000}
total = sum(portfolio.values())
```

### 표준 구조 세 가지

앞으로 다룰 데이터는 이 세 가지 형태로 정리한다.

```python
import pandas as pd

# 1) 종목 정보 — 딕셔너리 {이름: 종목코드}
TICKERS = {
    "삼성전자": "005930",
    "KODEX200": "069500",
    "미국S&P500": "360750",
    "국고채30년": "439870",
    "금": "132030",
}

# 2) 가격 — DataFrame (행: 날짜, 열: 종목)
prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)

# 3) 비중 — 딕셔너리 {이름: 비중}
weights = {"삼성전자": 0.2, "KODEX200": 0.2, "미국S&P500": 0.2,
           "국고채30년": 0.2, "금": 0.2}
```

### DataFrame 전체에 연산 적용하기

3주차에 Series 하나에 했던 일을 DataFrame에 그대로 할 수 있다.

```python
import pandas as pd

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)

returns = prices.pct_change().dropna()   # 모든 열의 수익률을 한 번에

print(returns.mean())        # 열별 평균
print(returns.std())         # 열별 표준편차
print(returns.corr())        # 열끼리의 상관계수 행렬
```

**반복문이 필요 없다.** 종목이 3개든 300개든 코드는 같다.

### 포트폴리오 수익률 계산

```python
import pandas as pd

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

weights = {"삼성전자": 0.2, "KODEX200": 0.2, "미국S&P500": 0.2,
           "국고채30년": 0.2, "금": 0.2}

# 방법 1: 반복문 (이해하기 쉬움)
portfolio_returns = 0
for name, w in weights.items():
    portfolio_returns += returns[name] * w

# 방법 2: pandas 벡터 연산 (간결함)
w_series = pd.Series(weights)
portfolio_returns = (returns * w_series).sum(axis=1)

print(portfolio_returns.tail())
```

`axis=1`은 "가로 방향(행 단위)으로 합산하라"는 뜻이다. 각 날짜마다 종목별 기여분을 더해 그날의 포트폴리오 수익률을 만든다.

| axis | 방향 | 의미 |
|---|---|---|
| `axis=0` (기본) | 세로 ↓ | 각 열에 대해 계산 |
| `axis=1` | 가로 → | 각 행에 대해 계산 |

### 비중 검증 습관

```python
def validate_weights(weights, tolerance=1e-6):
    """비중의 합이 1인지 검사한다."""
    total = sum(weights.values())
    if abs(total - 1) > tolerance:
        print(f"비중 합계가 {total:.4f}입니다. 1이 되도록 조정하세요.")
        return False
    return True
```

비중 합이 1이 아니면 이후 모든 계산이 틀어진다. 2주차에서 배운 조건문을 이런 검증에 활용한다.

---

## 2. matplotlib — 데이터 시각화

### 정의

**matplotlib은 파이썬에서 그래프를 그리기 위한 표준 라이브러리다.** 선 그래프, 산점도, 막대 그래프, 히스토그램 등을 그릴 수 있다.

### 비유

숫자 표는 **정확하지만 느리게 읽힌다.** 그래프는 **부정확하지만 순식간에 읽힌다.** 두 자산이 함께 움직이는지 아닌지를 상관계수 0.87이라는 숫자로 아는 것과, 산점도에서 점들이 우상향으로 늘어선 모습을 보는 것은 이해의 속도가 다르다. 시각화는 계산을 대체하는 것이 아니라 **계산 결과를 빠르게 검증하는 눈**이다.

### 기본 구조

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4], [10, 20, 15, 25])
plt.title("제목")
plt.xlabel("x축 이름")
plt.ylabel("y축 이름")
plt.grid(alpha=0.3)
plt.show()
```

### 한글 폰트 설정

기본 설정으로는 한글이 네모(□)로 깨진다. 파일 맨 위에서 OS에 맞게 지정한다.

```python
import matplotlib.pyplot as plt

plt.rcParams["font.family"] = "Malgun Gothic"    # Windows
# plt.rcParams["font.family"] = "AppleGothic"    # macOS
# plt.rcParams["font.family"] = "NanumGothic"    # Linux
plt.rcParams["axes.unicode_minus"] = False        # 마이너스 기호 깨짐 방지
```

Linux에서 폰트가 없다면 `sudo apt install fonts-nanum`으로 설치한다.

### 자주 쓰는 그래프

```python
import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams["font.family"] = "Malgun Gothic"   # macOS: AppleGothic, Linux: NanumGothic
plt.rcParams["axes.unicode_minus"] = False

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()
weights = {"삼성전자": 0.2, "KODEX200": 0.2, "미국S&P500": 0.2,
           "국고채30년": 0.2, "금": 0.2}

fig, ax = plt.subplots(2, 2, figsize=(11, 7))

# 선 그래프 — 시계열
ax[0][0].plot(prices.index, prices["삼성전자"])
ax[0][0].set_title("선 그래프 — 삼성전자 주가")

# 산점도 — 두 변수의 관계
ax[0][1].scatter(returns["KODEX200"], returns["삼성전자"], alpha=0.5, s=10)
ax[0][1].set_title("산점도 — 코스피200 vs 삼성전자")

# 히스토그램 — 분포
ax[1][0].hist(returns["삼성전자"], bins=50)
ax[1][0].set_title("히스토그램 — 일간 수익률 분포")

# 막대 그래프 — 항목별 비교
ax[1][1].bar(list(weights.keys()), list(weights.values()))
ax[1][1].set_title("막대 그래프 — 종목별 비중")
ax[1][1].tick_params(axis="x", rotation=30)

plt.tight_layout()
plt.show()
```

| 옵션 | 의미 |
|---|---|
| `label=` | 범례에 표시할 이름 (`plt.legend()`와 함께) |
| `alpha=` | 투명도 0~1 (점이 겹칠 때 유용) |
| `s=` | 점 크기 (scatter) |
| `color=` | 색상 |
| `linestyle=` | 선 모양 (`"--"`, `":"` 등) |

### 여러 그래프를 한 화면에

```python
import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams["font.family"] = "Malgun Gothic"   # macOS: AppleGothic, Linux: NanumGothic
plt.rcParams["axes.unicode_minus"] = False

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8), sharex=True)

ax1.plot(prices.index, prices["삼성전자"])
ax1.set_title("주가")

ax2.plot(returns.index, returns["삼성전자"])
ax2.set_title("일간 수익률")

plt.tight_layout()
plt.savefig("chart.png", dpi=120)
plt.show()
```

`plt.savefig()`는 `plt.show()` **앞에** 와야 한다. `show()` 이후에는 그림이 비워지기 때문이다.

---

## 3. 공분산 (Covariance)

### 정의

**공분산이란 두 자산이 각자의 평균에서 벗어나는 방향이 얼마나 함께 움직이는지를 나타내는 값이다.**

$$\text{Cov}(X, Y) = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})$$

- $X$, $Y$ — 비교하는 두 대상의 수익률 (예: 자산과 시장)
- $x_i$, $y_i$ — $i$번째 날의 각 수익률
- $\bar{x}$, $\bar{y}$ — 각 수익률의 평균
- $n$ — 관측한 날의 수 (아래 표에서는 5일)

### 비유

**두 사람이 보조를 맞춰 걷는지 재는 지표**다. 한 사람이 앞서갈 때 다른 사람도 앞서가면 두 편차의 곱이 양수가 되고, 한 사람이 앞설 때 다른 사람이 뒤처지면 음수가 된다. 이 곱들을 평균 낸 것이 공분산이다.

### 숫자로 따라가기

어떤 자산과 시장(코스피200 같은 지수)의 5일치 수익률이 아래와 같다고 하자. 공분산은 표를 오른쪽으로 한 칸씩 채워 나가면 손으로도 구할 수 있다.

**1단계 — 각각의 평균을 구한다.** 자산 평균 `+1%`, 시장 평균 `+1%`.

**2단계 — 각 날이 평균에서 얼마나 벗어났는지(편차) 구한다.**

**3단계 — 두 편차를 곱한다.** 둘 다 평균 위면 (+)×(+) = 양수, 둘 다 평균 아래면 (−)×(−) = 양수, 서로 엇갈리면 음수가 된다.

| 일 | 자산 | 시장 | 자산 편차 | 시장 편차 | 편차의 곱 |
|---|---|---|---|---|---|
| 1 | +3% | +2% | +2 | +1 | +2 |
| 2 | −1% | −1% | −2 | −2 | +4 |
| 3 | +2% | +1% | +1 | 0 | 0 |
| 4 | 0% | 0% | −1 | −1 | +1 |
| 5 | +1% | +3% | 0 | +2 | 0 |
| **합** | | | | | **+7** |

**4단계 — 곱의 합을 (개수 − 1)로 나눈다.** 7 ÷ 4 = **1.75**

마지막 열에 음수가 거의 없다는 점을 보자. 자산이 평균보다 좋은 날은 시장도 좋았고, 나쁜 날은 시장도 나빴다는 뜻이다. **그래서 합이 크게 양수가 되고, 공분산도 양수가 된다.**

반대로 한쪽이 오를 때 다른 쪽이 내리는 자산이라면 곱이 음수로 쌓여 공분산이 음수가 된다. 이것이 포트폴리오에서 결정적인 차이를 만든다.

### 세 가지 모양

같은 이야기를 그림으로 보면 분명하다. 가로축이 자산 A의 수익률, 세로축이 자산 B의 수익률이고, 점 하나가 하루다.

![상관 정도에 따른 산점도 세 가지](/week5-corr-shapes.png)

- **왼쪽**: A가 오른 날 B도 올랐다. 점들이 오른쪽 위로 몰린다. 공분산 양수
- **가운데**: A의 등락과 B의 등락이 무관하다. 점들이 사방에 흩어진다. 공분산 0에 가까움
- **오른쪽**: A가 오른 날 B는 내렸다. 점들이 오른쪽 아래로 몰린다. 공분산 음수

### 왜 중요한가

포트폴리오의 위험은 **각 자산 위험의 단순 평균이 아니다.** 두 자산 포트폴리오의 분산은 다음과 같다.

$$\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\text{Cov}(1,2)$$

- $\sigma_p^2$ — 포트폴리오 수익률의 **분산** (변동성의 제곱). 변동성은 $\sigma_p = \sqrt{\sigma_p^2}$
- $w_1$, $w_2$ — 1번·2번 자산에 넣은 비중 (둘을 더하면 1)
- $\sigma_1$, $\sigma_2$ — 각 자산의 변동성(표준편차)
- $\sigma_1^2$, $\sigma_2^2$ — 각 자산의 분산
- $\text{Cov}(1,2)$ — 두 자산의 공분산

앞의 두 항은 각 자산이 혼자 가진 위험이고, **세 번째 항이 둘의 관계**다. 이 항이 작거나 음수이면 포트폴리오 전체 위험이 각 자산의 위험보다 낮아진다. 분산투자가 작동하는 수학적 이유가 여기에 있다.

### 코드

```python
import pandas as pd

a = pd.Series([0.03, -0.01, 0.02, 0.00, 0.01])   # 자산의 5일 수익률
m = pd.Series([0.02, -0.01, 0.01, 0.00, 0.03])   # 시장의 5일 수익률

print(f"공분산: {a.cov(m):.6f}")   # 0.000175
```

위에서 손으로 구한 1.75와 같은 값이다. 표에서는 %단위로 계산했고 코드는 소수로 계산해서 자리수만 다르다(1.75 %² = 0.000175).

다섯 자산 전체의 공분산 행렬도 한 줄로 구한다.

```python
import pandas as pd

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

print(returns.cov())
```

**공분산 행렬(covariance matrix)** 은 대각선에 각 자산의 분산, 나머지에 자산 쌍의 공분산이 들어간 정사각 표다. 6주차 포트폴리오 최적화의 핵심 재료다.

### 공분산의 한계

공분산 값 자체는 해석하기 어렵다. 단위가 "수익률의 제곱"이고, 자산의 변동성 크기에 따라 값의 스케일이 완전히 달라지기 때문이다. 위 예시의 `0.000175`가 강한 관계인지 약한 관계인지 이 숫자만으로는 알 수 없다. **그래서 크기를 지우고 방향만 남긴 지표가 필요하다.**

---

## 4. 상관계수 (Correlation Coefficient)

### 정의

**상관계수란 공분산을 두 자산의 표준편차의 곱으로 나누어 −1과 +1 사이로 표준화한 값이다.**

$$\rho_{XY} = \frac{\text{Cov}(X,Y)}{\sigma_X \sigma_Y}$$

- $\rho_{XY}$ — 두 자산의 상관계수. 항상 −1과 +1 사이
- $\text{Cov}(X,Y)$ — 두 자산의 공분산 (함께 움직인 정도)
- $\sigma_X$, $\sigma_Y$ — 각 자산 수익률의 표준편차 (각자 흔들린 정도)

### 비유

키를 재는데 한 사람은 cm, 다른 사람은 inch를 쓰면 비교할 수 없다. 상관계수는 **모든 자산 쌍을 −1 ~ +1이라는 공통 자로 재게 해주는 장치**다.

### 숫자로 따라가기

앞 절의 표를 그대로 이어서 쓴다. 공분산은 **1.75** 였다. 이제 분모에 들어갈 표준편차가 필요하다.

**분산과 표준편차는 공분산과 똑같은 방법으로 구한다.** 공분산에서는 *자산 편차 × 시장 편차*를 더했다면, 분산은 *자기 편차 × 자기 편차*, 즉 편차를 제곱해서 더한다. **분산은 자기 자신과의 공분산**인 셈이다.

| 일 | 자산 편차 | 자산 편차² | 시장 편차 | 시장 편차² |
|---|---|---|---|---|
| 1 | +2 | 4 | +1 | 1 |
| 2 | −2 | 4 | −2 | 4 |
| 3 | +1 | 1 | 0 | 0 |
| 4 | −1 | 1 | −1 | 1 |
| 5 | 0 | 0 | +2 | 4 |
| **합** | | **10** | | **10** |

제곱의 합이 양쪽 다 10이고, 공분산과 똑같이 (개수 − 1)로 나눈다.

- 자산의 분산 = 10 ÷ 4 = **2.5**
- 시장의 분산 = 10 ÷ 4 = **2.5**

표준편차는 분산의 제곱근이므로 $\sqrt{2.5} = 1.58$, 즉 **1.58%** 다. 편차를 %단위로 적었으므로 분산 2.5의 단위는 %², 표준편차의 단위는 %가 된다. 우연히 두 자산의 분산이 같게 나온 예시라는 점만 염두에 두면 된다.

$$\rho = \frac{1.75}{1.58 \times 1.58} = \frac{1.75}{2.5} = \mathbf{0.70}$$

분모가 "두 자산이 각자 흔들린 정도"이므로, **상관계수는 "함께 움직인 정도를 각자 흔들린 정도로 나눈 비율"** 이 된다. 그래서 아무리 변동성이 큰 자산이라도 값이 −1과 +1 사이에 들어온다. 0.70은 대체로 같은 방향으로 움직였다는 뜻이다.

### 해석

| 상관계수 | 의미 |
|---|---|
| `+1.0` | 완전히 같은 방향으로 움직임 |
| `+0.7 ~ +1.0` | 강한 양의 상관 |
| `+0.3 ~ +0.7` | 중간 정도 양의 상관 |
| `−0.3 ~ +0.3` | 약한 관계 |
| `−1.0 ~ −0.7` | 강한 음의 상관 |
| `−1.0` | 완전히 반대 방향으로 움직임 |

### 실제 자산으로 보기

우리가 쓰는 다섯 자산 중 두 쌍을 찍어 보면 차이가 한눈에 보인다. 점 하나가 하루고, 빨간 선은 점들의 경향을 나타낸 직선이다.

![실제 자산 두 쌍의 산점도](/week5-corr-real.png)

- **왼쪽 (삼성전자 vs KODEX200, 0.90)** — 점들이 직선에 바짝 붙어 있다. 코스피200이 오른 날 삼성전자도 거의 어김없이 올랐다. 삼성전자는 코스피200에서 가장 비중이 큰 종목이므로 당연한 결과다. **둘 다 사는 것은 사실상 같은 것을 두 번 사는 셈이다.**
- **오른쪽 (미국S&P500 vs 국고채30년, 0.02)** — 점들이 공처럼 흩어져 있다. 한쪽이 오른 날 다른 쪽이 어떻게 됐는지 예측할 수 없다. **이런 조합이 진짜 분산투자다.**

### 분산투자와 상관계수

왜 상관계수가 낮으면 위험이 줄어드는지, 숫자로 보면 이렇다. **변동성이 똑같이 20%인 두 자산을 50:50으로 섞는다**고 하자.

### 그래프를 그린 식

앞에서 본 두 자산 포트폴리오의 분산 공식에서 출발한다. 공분산을 상관계수로 바꿔 쓴 형태다($\text{Cov}(1,2) = \rho\,\sigma_1\sigma_2$).

$$\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\,\rho\,\sigma_1\sigma_2$$

여기에 조건을 넣는다. 비중은 $w_1 = w_2 = 0.5$, 변동성은 $\sigma_1 = \sigma_2 = 0.2$ 이므로

$$\sigma_p^2 = 0.25(0.04) + 0.25(0.04) + 2(0.5)(0.5)\,\rho\,(0.2)(0.2) = 0.01 + 0.01 + 0.02\rho$$

정리하면 **상관계수 $\rho$ 하나만 남는다.**

$$\sigma_p^2 = 0.02\,(1 + \rho) \qquad \Longrightarrow \qquad \sigma_p = 0.2\sqrt{\frac{1 + \rho}{2}}$$

- $\sigma_p$ — 포트폴리오의 변동성 (그래프의 세로축)
- $\rho$ — 두 자산의 상관계수 (그래프의 가로축)
- $0.2$ — 각 자산의 변동성 20%

**그래프는 이 식에 $\rho$ 를 −1부터 +1까지 넣어 그린 곡선이다.**

![상관계수에 따른 포트폴리오 변동성](/week5-diversification.png)

| 상관계수 $\rho$ | 분산 $\sigma_p^2$ | 변동성 $\sigma_p$ | 20% 대비 |
|---|---|---|---|
| **+1** (똑같이 움직임) | 0.02 × 2 = 0.04 | **20.0%** | 그대로 |
| **+0.5** | 0.02 × 1.5 = 0.03 | **17.3%** | 13% 감소 |
| **0** (무관) | 0.02 × 1 = 0.02 | **14.1%** | **29% 감소** |
| **−0.5** | 0.02 × 0.5 = 0.01 | **10.0%** | 50% 감소 |
| **−1** (완전 반대) | 0.02 × 0 = 0 | **0.0%** | 사라짐 |

### 왜 하필 29%인가

가운데 줄을 뜯어보면 이렇다. 상관계수가 0이면 공식의 **세 번째 항이 통째로 사라진다.** 그러면 분산은 0.04에서 0.02로, **정확히 절반**이 된다.

그런데 우리가 보는 변동성은 분산이 아니라 **그 제곱근**이다. 절반이 된 것의 제곱근은 절반이 아니라

$$\sqrt{\tfrac{1}{2}} = 0.707 \quad \rightarrow \quad 20\% \times 0.707 = 14.1\%$$

즉 **변동성은 0.707배, 약 29% 줄어든다.** 분산이 반으로 줄었는데 변동성은 29%만 줄어드는 이유가 제곱근 때문이다. 4주차에서 연율화할 때 √252를 곱했던 것과 같은 성질이다.

반대로 상관계수가 +1이면 세 번째 항이 최대가 되어 분산이 0.04 그대로다. 섞어도 아무 효과가 없다.

**그리고 이 모든 과정에서 기대수익률은 한 번도 등장하지 않는다.** 포트폴리오의 기대수익률은 각 자산 기대수익률의 가중평균이라 상관계수와 무관하게 일정하다. **수익은 그대로 두고 위험만 깎는 것**, 이것이 분산투자를 "공짜 점심"이라고 부르는 이유다.

그래서 같은 시장의 주식을 여러 개 사는 것은 진짜 분산투자가 아니다. 성격이 다른 자산 — 주식과 채권, 국내와 해외, 원자재 — 을 섞어야 상관계수가 낮아진다. 우리가 다섯 자산을 그렇게 고른 이유다.

### 코드

```python
import pandas as pd

a = pd.Series([0.03, -0.01, 0.02, 0.00, 0.01])   # 자산의 5일 수익률
m = pd.Series([0.02, -0.01, 0.01, 0.00, 0.03])   # 시장의 5일 수익률

print(f"상관계수: {a.corr(m):.4f}")    # 0.7000
```

다섯 자산 전체의 상관계수 행렬도 한 줄이다.

```python
import pandas as pd

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

print(returns.corr().round(2))
```

대각선은 항상 1이다(자기 자신과의 상관계수).

### 히트맵으로 보기

숫자 표보다 색으로 보면 어느 자산끼리 묶여 있는지 한눈에 들어온다.

```python
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams["font.family"] = "Malgun Gothic"   # macOS: AppleGothic, Linux: NanumGothic
plt.rcParams["axes.unicode_minus"] = False

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

corr = returns.corr()

fig, ax = plt.subplots(figsize=(6, 5))
im = ax.imshow(corr, cmap="coolwarm", vmin=-1, vmax=1)

ax.set_xticks(range(len(corr)))
ax.set_yticks(range(len(corr)))
ax.set_xticklabels(corr.columns, rotation=45, ha="right")
ax.set_yticklabels(corr.columns)

# 각 칸에 숫자 표시
for i in range(len(corr)):
    for j in range(len(corr)):
        ax.text(j, i, f"{corr.iloc[i, j]:.2f}", ha="center", va="center")

plt.colorbar(im)
plt.title("자산 간 상관계수")
plt.tight_layout()
plt.show()
```

붉을수록 함께 움직이고, 흰색에 가까울수록 무관하다. 삼성전자–KODEX200 칸이 가장 붉고, 미국S&P500–국고채30년 칸이 거의 흰색으로 나온다.

---

## 5. 베타 (Beta)

### 정의

**베타란 시장 전체의 움직임에 대한 개별 자산의 민감도를 나타내는 계수다.** 자산 수익률과 시장 수익률의 공분산을 시장 수익률의 분산으로 나눈 값이다.

$$\beta_i = \frac{\text{Cov}(R_i, R_m)}{\text{Var}(R_m)}$$

- $\beta_i$ — 자산 $i$의 베타
- $R_i$ — 자산 $i$의 수익률, $R_m$ — 시장의 수익률
- $\text{Cov}(R_i, R_m)$ — 자산과 시장의 공분산
- $\text{Var}(R_m)$ — 시장 수익률의 분산 (시장 변동성의 제곱)

### 분모가 하는 일

분자인 공분산만 보면 "함께 움직였다"는 사실은 알아도 **얼마나** 움직였는지는 알 수 없다. 앞에서 봤듯 공분산은 자산이 크게 출렁일수록 같이 커지기 때문이다. 그래서 **시장의 분산으로 나눠 "시장이 움직인 만큼을 1로 놓았을 때의 배수"로 바꾼다.**

분모가 기준자 역할을 한다는 것은 시장 자신의 베타를 구해보면 바로 보인다.

$$\beta_m = \frac{\text{Cov}(R_m, R_m)}{\text{Var}(R_m)} = \frac{\text{Var}(R_m)}{\text{Var}(R_m)} = 1$$

자기 자신과의 공분산은 곧 분산이므로 **시장의 베타는 언제나 정확히 1**이다. 모든 자산의 베타는 이 1을 기준으로 읽는다.

### 성장주와 인버스 ETF로 보기

시장이 5일간 아래처럼 움직였다고 하자. 평균이 0%라 편차가 곧 수익률이어서 계산이 간단하다.

| 일 | 시장 | 성장주 | 인버스 ETF |
|---|---|---|---|
| 1 | +2% | +4% | −2% |
| 2 | −2% | −4% | +2% |
| 3 | +1% | +2% | −1% |
| 4 | −1% | −2% | +1% |
| 5 | 0% | 0% | 0% |

**성장주**는 시장이 오른 날 두 배로 오르고 내린 날 두 배로 내렸다. **인버스 ETF**는 시장과 정확히 반대로, 같은 크기만큼 움직였다.

분모부터 구한다. 시장 편차의 제곱합은 $4+4+1+1+0 = 10$ 이므로

$$\text{Var}(R_m) = 10 \div 4 = 2.5$$

**이 2.5는 어떤 자산을 재든 바뀌지 않는다.** 시장 하나로 정해지는 값이기 때문이다. 자산마다 달라지는 것은 분자뿐이다.

| | 편차의 곱을 더하면 | 공분산 (÷4) | 베타 (÷2.5) |
|---|---|---|---|
| **성장주** | 8+8+2+2+0 = **20** | 5.0 | **+2.0** |
| **인버스 ETF** | −4−4−1−1+0 = **−10** | −2.5 | **−1.0** |
| **시장 자신** | 4+4+1+1+0 = **10** | 2.5 | **+1.0** |

성장주는 매일 시장의 2배로 움직였으므로 편차의 곱도 시장 자신의 2배가 되어 **베타가 정확히 2**다. 일반화하면 **자산이 시장의 $k$ 배로 움직일 때 베타는 $k$** 가 된다.

인버스 ETF는 시장이 오른 날 내렸으므로 **편차의 곱이 전부 음수**다. 그래서 공분산이 음수가 되고 베타도 음수다. 크기는 시장과 같으니 정확히 −1이다. 시장이 20% 빠질 때 20% 오르는 자산이라는 뜻이고, **이런 자산을 섞으면 포트폴리오 전체의 베타가 내려간다.**

### 우리 자산들의 베타

같은 방법으로 실제 다섯 자산을 재면 이렇게 나온다(시장은 KODEX200).

| 자산 | 베타 | 읽는 법 |
|---|---|---|
| 삼성전자 | **+1.19** | 코스피200이 1% 오르면 평균 1.19% 오른다 |
| KODEX200 | **+1.00** | 시장 자신이므로 정의상 1 |
| 금 | **+0.19** | 시장과 거의 따로 논다 |
| 미국S&P500 | **+0.14** | 같은 주식이어도 시장이 다르면 베타가 낮다 |
| 국고채30년 | **+0.08** | 코스피와 사실상 무관하다 |

실제 자산은 예시처럼 정확히 배수로 움직이지 않으므로, 베타는 **"평균적으로 몇 배였나"** 를 뜻한다.

### 해석

| 베타 | 의미 | 예시 성격 |
|---|---|---|
| `β > 1` | 시장보다 크게 움직임 (공격적) | 성장주, 기술주 |
| `β = 1` | 시장과 같이 움직임 | 시장지수 ETF |
| `0 < β < 1` | 시장보다 덜 움직임 (방어적) | 필수소비재, 유틸리티 |
| `β = 0` | 시장과 무관 | 현금, 무위험자산 |
| `β < 0` | 시장과 반대로 움직임 | 인버스 ETF, 일부 금 |

### 체계적 위험과 비체계적 위험

베타를 이해하려면 위험을 두 종류로 나눠야 한다.

| 구분 | 내용 | 분산투자로 제거 가능? |
|---|---|---|
| **체계적 위험** | 시장 전체에 영향 (금리, 경기, 전쟁) | 불가능 |
| **비체계적 위험** | 개별 기업 고유 (경영진 교체, 신제품 실패) | 가능 |

종목을 늘리면 비체계적 위험은 상쇄되어 사라지지만, 체계적 위험은 남는다. **베타는 이 남는 위험, 즉 피할 수 없는 위험의 크기를 재는 지표다.** 다음 절의 CAPM이 "피할 수 없는 위험만큼만 보상받는다"고 말하는 근거가 여기에 있다.

### 코드

여기서도 앞에서 만든 `a`, `m`을 그대로 쓴다.

```python
import pandas as pd

a = pd.Series([0.03, -0.01, 0.02, 0.00, 0.01])   # 자산의 5일 수익률
m = pd.Series([0.02, -0.01, 0.01, 0.00, 0.03])   # 시장의 5일 수익률


def beta(asset_returns, market_returns):
    """자산 수익률과 시장 수익률로 베타를 계산한다."""
    covariance = asset_returns.cov(market_returns)
    market_variance = market_returns.var()
    return covariance / market_variance


print(f"베타: {beta(a, m):.4f}")   # 0.7000
```

베타 0.70은 시장이 1% 오를 때 이 자산은 평균적으로 약 0.70% 오르는 경향이 있다는 뜻이다. 시장보다 덜 움직이는 자산이다. 이 예시에서는 자산과 시장의 변동성이 같아서 베타와 상관계수가 0.70으로 똑같이 나왔다. 변동성이 다르면 두 값은 달라진다.

### 시장 대용치

한국 주식의 베타를 구할 때는 보통 KOSPI 지수(`KS11`)나 KODEX 200 ETF(`069500`)를 시장으로 삼는다.

```python
import FinanceDataReader as fdr

market = fdr.DataReader("069500", "2025-01-01")["Close"]   # KODEX 200
```

### 산점도로 확인하기

베타는 사실 **산점도에 그은 회귀선의 기울기**다.

```python
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

plt.rcParams["font.family"] = "Malgun Gothic"   # macOS: AppleGothic, Linux: NanumGothic
plt.rcParams["axes.unicode_minus"] = False

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

x = returns["KODEX200"]
y = returns["삼성전자"]

plt.scatter(x, y, alpha=0.4, s=12)

# 회귀선
slope, intercept = np.polyfit(x, y, 1)
xs = np.linspace(x.min(), x.max(), 100)
plt.plot(xs, slope * xs + intercept, color="red",
         label=f"β = {slope:.2f}")

plt.xlabel("시장 수익률")
plt.ylabel("자산 수익률")
plt.axhline(0, color="gray", lw=0.5)
plt.axvline(0, color="gray", lw=0.5)
plt.legend()
plt.grid(alpha=0.3)
plt.show()
```

`np.polyfit(x, y, 1)`은 1차 함수(직선)로 점들을 가장 잘 설명하는 기울기와 절편을 구해준다. 그 기울기가 베타다.

---

## 6. CAPM — 자본자산가격결정모형

### 정의

**CAPM(Capital Asset Pricing Model)이란 자산의 기대수익률이 무위험수익률과, 그 자산의 체계적 위험(베타)에 비례하는 위험 프리미엄의 합으로 결정된다고 설명하는 모형이다.**

$$E(R_i) = R_f + \beta_i \left( E(R_m) - R_f \right)$$

- $R_f$: 무위험수익률
- $E(R_m)$: 시장 기대수익률
- $E(R_m) - R_f$: **시장 위험 프리미엄** (시장에 투자한 대가)

### 비유

CAPM은 **위험의 가격표**다. "이만큼의 피할 수 없는 위험(β)을 감수했다면, 이만큼의 수익은 받아야 마땅하다"고 말하는 공정 가격표다.

식을 세 조각으로 읽으면 이해하기 쉽다.

1. $R_f$ — 위험을 하나도 안 져도 받는 기본급
2. $\beta_i$ — 내가 감수한 시장 위험의 배수
3. $(E(R_m) - R_f)$ — 시장 위험 한 단위당 지급되는 보상 단가

즉 **기본급 + (내가 진 위험의 양 × 위험의 단가)** 다.

### 계산 예시

무위험수익률 3%, 시장 기대수익률 8%, 베타 0.70일 때:

$$E(R) = 0.03 + 0.70 \times (0.08 - 0.03) = 0.03 + 0.035 = 0.065$$

```python
def capm_expected_return(beta_value, risk_free=0.03, market_return=0.08):
    """CAPM으로 기대수익률을 계산한다."""
    return risk_free + beta_value * (market_return - risk_free)


print(f"{capm_expected_return(0.70):.2%}")   # 6.50%
```

### 알파 (Alpha)

**실제 수익률이 CAPM이 요구하는 기대수익률보다 높은 초과분을 알파라고 한다.**

$$\alpha = R_{\text{실제}} - E(R_{\text{CAPM}})$$

- $\alpha$ — 알파. CAPM이 요구한 것보다 더 번 부분
- $R_{\text{실제}}$ — 실제로 올린 수익률
- $E(R_{\text{CAPM}})$ — CAPM이 요구하는 기대수익률

앞 절에서 정의한 `capm_expected_return()` 함수를 그대로 불러 쓴다.

```python
def capm_expected_return(beta_value, risk_free=0.03, market_return=0.08):
    """CAPM으로 기대수익률을 계산한다."""
    return risk_free + beta_value * (market_return - risk_free)


def alpha(actual_return, beta_value, risk_free=0.03, market_return=0.08):
    """CAPM 기대수익률 대비 초과수익(알파)을 계산한다."""
    expected = capm_expected_return(beta_value, risk_free, market_return)
    return actual_return - expected


print(f"알파: {alpha(0.13, 0.70):.2%}")   # 6.50%
```

알파가 양수면 "감수한 위험에 비해 잘했다"는 뜻이다. 액티브 펀드 매니저의 성과를 평가하는 기준이자, 퀀트 투자가 찾으려는 목표이기도 하다.

### 내 계좌로 이어보기

여기까지가 이론이고, 실제 계좌에 어떻게 적용되는지 보자. 1,000만 원을 다섯 자산에 아래처럼 나눠 담은 계좌가 있다고 하자. 증권 앱의 보유 종목 화면을 떠올리면 된다.

![예시 계좌의 종목별 평가금액과 비중](/week5-portfolio.png)

이 계좌의 성과를 CAPM으로 평가하는 순서는 이렇다.

1. **계좌의 하루 수익률을 구한다** — 종목별 수익률을 비중으로 가중평균한다. 3주차에서 배운 "자산 간에는 단순수익률을 쓴다"가 여기서 쓰인다
2. **계좌의 베타를 구한다** — 계좌 수익률과 시장(KODEX200)의 공분산 ÷ 시장의 분산
3. **CAPM이 요구하는 수익률을 구한다** — 무위험 3% + 베타 × (시장 8% − 무위험 3%)
4. **실제 올린 수익률과 비교한다** — 그 차이가 알파다

```python
"""예시 계좌의 베타와 알파 — prices.csv 와 같은 폴더에 두고 실행한다."""
import pandas as pd

RF, RM = 0.03, 0.08          # 무위험수익률 3%, 시장 기대수익률 8%

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

weights = {"삼성전자": 0.30, "KODEX200": 0.20, "미국S&P500": 0.30,
           "국고채30년": 0.10, "금": 0.10}

# 1) 계좌 전체의 하루 수익률 = 종목별 수익률을 비중으로 가중평균
portfolio = sum(returns[name] * w for name, w in weights.items())

# 2) 베타 = 시장과의 공분산 ÷ 시장의 분산
market = returns["KODEX200"]
beta = portfolio.cov(market) / market.var()

# 3) CAPM이 요구하는 수익률
expected = RF + beta * (RM - RF)

# 4) 실제로 올린 연평균 수익률
years = len(prices) / 252
actual = (1 + portfolio).prod() ** (1 / years) - 1

print(f"계좌 베타       {beta:.4f}")
print(f"CAPM 요구수익률 {expected:.2%}")
print(f"실제 연수익률   {actual:.2%}")
print(f"알파            {actual - expected:+.2%}p")
```

**실행 결과**

```
계좌 베타       0.6260
CAPM 요구수익률 6.13%
실제 연수익률   31.89%
알파            +25.76%p
```

이 네 숫자를 그림 한 장에 올리면 CAPM이 무엇을 하는 모형인지 분명해진다.

![예시 계좌를 증권시장선 위에 올린 그림](/week5-capm-sml.png)

파란 직선이 **증권시장선**이다. 가로축은 베타(피할 수 없는 위험을 얼마나 졌나), 세로축은 수익률이다. 이 선이 말하는 것은 하나다. **"이만큼 위험을 졌으면 최소한 이만큼은 벌어야 한다."**

- 베타 0 — 위험을 전혀 안 졌으니 무위험수익률 3%면 충분하다
- 베타 1 — 시장만큼 위험을 졌으니 시장 수익률 8%는 받아야 한다
- 이 계좌는 베타 **0.63** — 주식 비중이 절반이고 나머지가 해외·채권·금이라 시장보다 덜 흔들렸다. 그래서 선 위의 요구 수익률이 **6.13%** 로 낮다

그런데 실제로는 **31.89%** 를 벌었다. 점이 선보다 한참 위에 찍힌다. **선 위에 있으면 위험에 비해 잘한 것이고, 아래에 있으면 못한 것이다.** 그 수직 거리가 알파다.

> **이 알파가 비현실적으로 큰 이유** — 이 기간(2022~2026)이 국내 주식에 유난히 좋았고, 시장을 코스피200 하나로만 잡았기 때문이다. 계좌의 30%를 차지한 미국S&P500은 코스피200과 거의 무관하게 움직이므로 베타에 거의 반영되지 않는다. 실무에서는 자산군별로 다른 시장 지수를 쓰거나 여러 요인을 함께 보는 이유다. 알파가 크게 나왔다고 실력이 좋았다고 단정할 수 없다.

**정리하면 이번 주의 네 개념은 한 줄로 이어진다.**

> 자산들이 함께 움직이는 정도를 재고(**공분산**) → 비교할 수 있게 표준화하고(**상관계수**) → 그중 시장과 함께 움직이는 부분만 떼어내어(**베타**) → 그 위험에 걸맞은 수익률을 계산한다(**CAPM**).

### CAPM의 한계

CAPM은 금융이론의 출발점이지만, 현실을 완전히 설명하지는 못한다.

- **가정이 강하다.** 모든 투자자가 같은 정보를 갖고 합리적으로 행동하며, 세금·거래비용이 없다고 가정한다.
- **베타 하나로 부족하다.** 실증 연구에서 기업 규모(size), 가치(value), 모멘텀 등 베타로 설명되지 않는 수익률 패턴이 반복적으로 발견되었다. 이를 반영해 파마-프렌치 3팩터, 5팩터 모형 등이 제시되었다.
- **과거 베타가 미래 베타가 아니다.** 베타는 추정한 기간에 따라 크게 달라진다.

그럼에도 CAPM을 배우는 이유는, **"위험과 수익은 비례한다"는 사고의 틀**이 이후 모든 모형의 기초이기 때문이다.

---

## 오늘 배운 것 정리

### 파이썬 문법

| 개념 | 한 줄 정의 | 핵심 |
|---|---|---|
| **다중 자산 관리** | 종목 수와 무관하게 동작하는 데이터 구조 | 딕셔너리 + DataFrame |
| **`axis`** | 연산 방향 지정 | `axis=1`은 가로(행 단위) |
| **matplotlib** | 그래프를 그리는 표준 라이브러리 | `plot`, `scatter`, `hist`, `bar` |
| **한글 폰트** | OS별 폰트 지정 필요 | `plt.rcParams["font.family"]` |
| **`np.polyfit`** | 직선 회귀의 기울기·절편 계산 | 기울기가 곧 베타 |

### 금융 개념

| 개념 | 공식 | 코드 |
|---|---|---|
| 공분산 | $\text{Cov}(X,Y)$ | `a.cov(b)`, `returns.cov()` |
| 상관계수 | $\text{Cov}/(\sigma_X\sigma_Y)$ | `a.corr(b)`, `returns.corr()` |
| 베타 | $\text{Cov}(R_i,R_m)/\text{Var}(R_m)$ | `a.cov(m) / m.var()` |
| CAPM | $R_f + \beta(E(R_m)-R_f)$ | `rf + beta * (rm - rf)` |
| 알파 | $R_{실제} - E(R_{CAPM})$ | `actual - expected` |

한 문장으로: **공분산은 함께 움직이는 정도, 상관계수는 그것을 -1~1로 표준화한 것, 베타는 시장에 대한 민감도, CAPM은 베타만큼 보상받는다는 이론.**

---

## 오늘의 코드

`week5.py` 파일에 붙여넣고 실행한다.

```python
"""
5주차 실습 — 자산 간의 관계 분석
공분산, 상관계수, 베타, CAPM을 계산하고 시각화한다.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# 한글 폰트 (본인 OS에 맞는 줄만 남긴다)
plt.rcParams["font.family"] = "Malgun Gothic"    # Windows
# plt.rcParams["font.family"] = "AppleGothic"    # macOS
# plt.rcParams["font.family"] = "NanumGothic"    # Linux
plt.rcParams["axes.unicode_minus"] = False

TRADING_DAYS = 252
RISK_FREE = 0.03
MARKET = "KODEX200"        # 시장 대용치로 사용할 열 이름


# ── 관계 지표 함수 ───────────────────────────────────────

def beta(asset_returns, market_returns):
    """시장 대비 베타를 반환한다."""
    return asset_returns.cov(market_returns) / market_returns.var()


def capm_expected_return(beta_value, risk_free=RISK_FREE, market_return=0.08):
    """CAPM 기대수익률을 반환한다."""
    return risk_free + beta_value * (market_return - risk_free)


def alpha(actual_return, beta_value, risk_free=RISK_FREE, market_return=0.08):
    """CAPM 기대수익률 대비 초과수익을 반환한다."""
    return actual_return - capm_expected_return(beta_value, risk_free, market_return)


def portfolio_returns(returns, weights):
    """비중 딕셔너리를 받아 포트폴리오 일간 수익률 Series를 반환한다."""
    w = pd.Series(weights)
    return (returns[w.index] * w).sum(axis=1)


def validate_weights(weights, tolerance=1e-6):
    """비중 합계가 1인지 검사한다."""
    total = sum(weights.values())
    if abs(total - 1) > tolerance:
        print(f"비중 합계가 {total:.4f}입니다.")
        return False
    return True


# ── 1) 데이터 준비 ───────────────────────────────────────

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

print("분석 종목:", list(prices.columns))
print("시장 대용치:", MARKET)


# ── 2) 공분산 행렬 ───────────────────────────────────────

print()
print("=" * 60)
print("공분산 행렬 (일간)")
print("=" * 60)
print(returns.cov().round(8))


# ── 3) 상관계수 행렬 ─────────────────────────────────────

corr = returns.corr()

print()
print("=" * 60)
print("상관계수 행렬")
print("=" * 60)
print(corr.round(4))

print()
print("해석:")
for i in range(len(corr.columns)):
    for j in range(i + 1, len(corr.columns)):
        a_name, b_name = corr.columns[i], corr.columns[j]
        c = corr.iloc[i, j]

        if c > 0.7:
            note = "강한 양의 상관 — 분산 효과가 작다"
        elif c > 0.3:
            note = "중간 양의 상관"
        elif c > -0.3:
            note = "약한 관계 — 분산 효과가 크다"
        else:
            note = "음의 상관 — 헤지 효과"

        print(f"  {a_name} ↔ {b_name}: {c:>7.4f}  {note}")


# ── 4) 베타와 CAPM ───────────────────────────────────────

print()
print("=" * 72)
print(f"{'종목':<12}{'베타':>8}{'CAPM기대':>12}{'실제CAGR':>12}{'알파':>10}")
print("=" * 72)

market_returns = returns[MARKET]

for name in prices.columns:
    b = beta(returns[name], market_returns)

    years = len(prices) / TRADING_DAYS
    actual_cagr = (prices[name].iloc[-1] / prices[name].iloc[0]) ** (1 / years) - 1

    expected = capm_expected_return(b)
    a_value = actual_cagr - expected

    print(f"{name:<12}{b:>8.3f}{expected:>12.2%}{actual_cagr:>12.2%}{a_value:>10.2%}")

print("=" * 72)


# ── 5) 포트폴리오 vs 개별 자산 ───────────────────────────

n = len(prices.columns)
weights = {name: 1 / n for name in prices.columns}    # 균등 비중

if validate_weights(weights):
    port_ret = portfolio_returns(returns, weights)

    print()
    print("=" * 60)
    print("균등 비중 포트폴리오 vs 개별 자산 (연율화 변동성)")
    print("=" * 60)

    for name in prices.columns:
        vol = returns[name].std() * np.sqrt(TRADING_DAYS)
        print(f"{name:<16}{vol:>10.2%}")

    port_vol = port_ret.std() * np.sqrt(TRADING_DAYS)
    avg_vol = np.mean([returns[c].std() * np.sqrt(TRADING_DAYS) for c in prices.columns])

    print("-" * 60)
    print(f"{'개별 평균':<16}{avg_vol:>10.2%}")
    print(f"{'포트폴리오':<16}{port_vol:>10.2%}")
    print(f"{'분산 효과':<16}{port_vol - avg_vol:>10.2%}")
    print("=" * 60)
    print("포트폴리오 변동성이 개별 평균보다 낮다면 분산투자가 작동한 것이다.")


# ── 6) 시각화 ────────────────────────────────────────────

fig = plt.figure(figsize=(13, 9))

# (1) 상관계수 히트맵
ax1 = fig.add_subplot(2, 2, 1)
im = ax1.imshow(corr, cmap="coolwarm", vmin=-1, vmax=1)
ax1.set_xticks(range(len(corr)))
ax1.set_yticks(range(len(corr)))
ax1.set_xticklabels(corr.columns, rotation=45, ha="right", fontsize=8)
ax1.set_yticklabels(corr.columns, fontsize=8)
for i in range(len(corr)):
    for j in range(len(corr)):
        ax1.text(j, i, f"{corr.iloc[i, j]:.2f}", ha="center", va="center", fontsize=8)
ax1.set_title("상관계수 히트맵")
fig.colorbar(im, ax=ax1)

# (2) 베타 산점도 (시장이 아닌 첫 종목)
target = [c for c in prices.columns if c != MARKET][0]
ax2 = fig.add_subplot(2, 2, 2)
x, y = returns[MARKET], returns[target]
ax2.scatter(x, y, alpha=0.4, s=12)
slope, intercept = np.polyfit(x, y, 1)
xs = np.linspace(x.min(), x.max(), 100)
ax2.plot(xs, slope * xs + intercept, color="red", label=f"β = {slope:.2f}")
ax2.axhline(0, color="gray", lw=0.5)
ax2.axvline(0, color="gray", lw=0.5)
ax2.set_xlabel(f"{MARKET} 수익률")
ax2.set_ylabel(f"{target} 수익률")
ax2.set_title(f"{target}의 시장 민감도")
ax2.legend()
ax2.grid(alpha=0.3)

# (3) 누적 성과
ax3 = fig.add_subplot(2, 2, 3)
normalized = prices / prices.iloc[0]
for name in prices.columns:
    ax3.plot(normalized.index, normalized[name], label=name, lw=1.2)
port_cum = (1 + port_ret).cumprod()
ax3.plot(port_cum.index, port_cum, label="포트폴리오", lw=2, color="black", ls="--")
ax3.set_title("누적 성과 (시작=1)")
ax3.legend(fontsize=8)
ax3.grid(alpha=0.3)

# (4) 수익률 분포
ax4 = fig.add_subplot(2, 2, 4)
ax4.hist(returns[target], bins=50, alpha=0.6, label=target)
ax4.hist(port_ret, bins=50, alpha=0.6, label="포트폴리오")
ax4.set_title("일간 수익률 분포")
ax4.legend(fontsize=8)
ax4.grid(alpha=0.3)

plt.tight_layout()
plt.savefig("week5_relations.png", dpi=120)
print()
print("그래프를 week5_relations.png로 저장했다.")
plt.show()
```

### 오프라인 연습용

```python
"""데이터를 못 받을 때 — 하드코딩한 수익률로 관계 지표 계산"""
import pandas as pd

asset = pd.Series([0.03, -0.01, 0.02, 0.00, 0.01])
market = pd.Series([0.02, -0.01, 0.01, 0.00, 0.03])

cov = asset.cov(market)
corr = asset.corr(market)
b = cov / market.var()

print(f"공분산      {cov:.8f}")     # 0.000175
print(f"상관계수    {corr:.4f}")     # 0.7000
print(f"베타        {b:.4f}")        # 0.7000
print(f"CAPM 기대   {0.03 + b * (0.08 - 0.03):.2%}")   # 6.50%
```

---

## 오늘의 테스트

### Q1. `df.sum(axis=1)`의 의미로 옳은 것은?

1. 각 열의 합계를 구한다
2. 각 행의 합계를 구한다
3. 전체 값의 합계를 구한다
4. 첫 번째 열만 합계를 구한다

<details>
<summary>정답 보기</summary>

**정답: 2번**

`axis=1`은 가로 방향(행 단위) 연산이다. 포트폴리오 수익률을 구할 때 각 날짜별로 종목 기여분을 합산하는 데 쓴다. 기본값 `axis=0`은 세로(열 단위)다.
</details>

### Q2. 공분산 대신 상관계수를 주로 쓰는 이유는?

1. 계산이 더 빠르기 때문
2. 값이 -1~1로 표준화되어 서로 다른 자산 쌍을 비교할 수 있기 때문
3. 공분산은 항상 0이기 때문
4. pandas가 공분산을 지원하지 않기 때문

<details>
<summary>정답 보기</summary>

**정답: 2번**

공분산은 자산의 변동성 크기에 따라 스케일이 달라져 값 자체를 해석하기 어렵다. 상관계수는 표준편차로 나눠 표준화한 값이다.
</details>

### Q3. 분산투자 효과가 가장 큰 조합은?

1. 상관계수 +0.95인 두 자산
2. 상관계수 +0.50인 두 자산
3. 상관계수 0.00인 두 자산
4. 상관계수 -0.80인 두 자산

<details>
<summary>정답 보기</summary>

**정답: 4번**

상관계수가 낮을수록(음수에 가까울수록) 분산 효과가 크다. 한쪽이 떨어질 때 다른 쪽이 올라 서로를 상쇄하기 때문이다. 상관계수 +1이면 분산 효과가 전혀 없다.
</details>

### Q4. 베타가 0.6인 자산에 대한 설명으로 옳은 것은?

1. 시장보다 크게 움직이는 공격적 자산이다
2. 시장이 10% 오를 때 평균적으로 약 6% 오르는 경향이 있다
3. 시장과 반대로 움직인다
4. 시장과 아무 관계가 없다

<details>
<summary>정답 보기</summary>

**정답: 2번**

0 < β < 1은 시장보다 덜 움직이는 방어적 자산이다. 시장이 떨어질 때 덜 떨어지지만, 오를 때도 덜 오른다.
</details>

### Q5. 무위험수익률 3%, 시장 기대수익률 9%, 베타 1.2일 때 CAPM 기대수익률은?

<details>
<summary>정답 보기</summary>

**정답: 10.2%**

$$E(R) = 0.03 + 1.2 \times (0.09 - 0.03) = 0.03 + 1.2 \times 0.06 = 0.03 + 0.072 = 0.102$$
</details>

### Q6. 위 Q5의 자산이 실제로 연 13%를 기록했다면 알파는?

<details>
<summary>정답 보기</summary>

**정답: +2.8%**

`13% - 10.2% = 2.8%`. 감수한 위험(β=1.2)에 비해 2.8%포인트 더 벌었다는 뜻이다.
</details>

### Q7. 분산투자로 제거할 수 **없는** 위험은?

1. 특정 기업의 CEO가 교체되는 위험
2. 한 회사의 신제품이 실패하는 위험
3. 기준금리 인상으로 시장 전체가 하락하는 위험
4. 개별 기업의 회계 부정이 드러나는 위험

<details>
<summary>정답 보기</summary>

**정답: 3번**

1, 2, 4는 개별 기업 고유의 **비체계적 위험**으로 종목을 늘리면 상쇄된다. 3번은 시장 전체에 영향을 주는 **체계적 위험**으로 분산투자로 제거할 수 없다. 베타는 이 체계적 위험의 크기를 잰다.
</details>

### Q8. 빈칸을 채워 베타 함수를 완성하시오.

```python
def beta(asset_returns, market_returns):
    """시장 대비 베타를 반환한다."""
    covariance = asset_returns.____(market_returns)
    market_variance = market_returns.____()
    return covariance ____ market_variance
```

<details>
<summary>정답 보기</summary>

```python
def beta(asset_returns, market_returns):
    """시장 대비 베타를 반환한다."""
    covariance = asset_returns.cov(market_returns)
    market_variance = market_returns.var()
    return covariance / market_variance
```

$\beta = \text{Cov}(R_i, R_m) / \text{Var}(R_m)$
</details>

### Q9. (심화) 두 자산의 연율화 변동성이 각각 30%, 25%이고 상관계수가 -0.5다. 50:50으로 섞은 포트폴리오의 변동성은 개별 자산보다 클까 작을까? 그 이유는?

<details>
<summary>정답 보기</summary>

**정답: 두 자산 모두보다 작다.**

$$\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2$$

$$= 0.25 \times 0.09 + 0.25 \times 0.0625 + 2 \times 0.25 \times (-0.5) \times 0.30 \times 0.25$$

$$= 0.0225 + 0.015625 - 0.01875 = 0.019375$$

$$\sigma_p = \sqrt{0.019375} \approx 13.92\%$$

**개별 자산(30%, 25%) 어느 쪽보다도 낮다.** 상관계수가 음수라 세 번째 항이 전체 분산을 깎아내렸기 때문이다. 이것이 분산투자가 작동하는 수학적 원리이며, 다음 주 효율적 투자선의 출발점이다.
</details>

---

## 다음 주 예고

6주차에서는 **포트폴리오 최적화**를 다룬다. 이번 주에 구한 **공분산 행렬**을 재료로, 비중을 어떻게 배분해야 위험 대비 수익이 최적이 되는지 찾는다. **numpy 행렬 연산**과 **몬테카를로 시뮬레이션**으로 수만 개의 포트폴리오를 생성해 **효율적 투자선(Efficient Frontier)** 을 직접 그린다.

이번 주 핵심 결론을 기억해두면 다음 주가 수월하다. **포트폴리오의 위험은 개별 위험의 평균이 아니라, 자산 간 상관관계에 따라 그보다 낮아질 수 있다.**
