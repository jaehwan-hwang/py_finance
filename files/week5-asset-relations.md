# 5주차 — 자산 간의 관계

> 다중 자산 관리 · matplotlib 시각화 → 공분산 · 상관계수 · 베타 · CAPM

지난주까지는 자산을 하나씩 따로 놓고 평가했다. 하지만 포트폴리오는 **여러 자산을 함께 담는 일**이고, 그때 결정적으로 중요해지는 것은 각 자산의 성질이 아니라 **자산들 사이의 관계**다. 이번 주에 배우는 개념이 다음 주 포트폴리오 최적화의 직접적인 재료가 된다.

---

## 0. 4주차 복습 노트

### 파이썬 문법

| 개념 | 핵심 |
|---|---|
| **통계 메서드** | `.mean()`, `.std()`, `.describe()` |
| **누적 메서드** | `.cummax()` — MDD 계산의 핵심 |
| **`.rolling(n)`** | n개짜리 창을 밀며 계산, 앞의 n-1개는 `NaN` |
| **numpy 배열** | 원소별 연산, `np.sqrt()`, `np.dot()` |

### 금융 지표

| 지표 | 공식 | 답하는 질문 |
|---|---|---|
| 변동성 | $\sigma_{일} \times \sqrt{252}$ | 평소 얼마나 요동쳤나 |
| CAGR | $(V_{end}/V_{start})^{1/n} - 1$ | 결국 연 몇 %로 불어났나 |
| 샤프지수 | $(R_p - R_f)/\sigma_p$ | 위험 대비 얼마나 효율적이었나 |
| MDD | $\min(V_t/\max V_s - 1)$ | 최악의 순간 얼마나 잃었나 |

기억할 것: **수익률 연율화는 × 252, 변동성 연율화는 × √252.**

### 코드로 보는 4주차

```python
import numpy as np

def sharpe_ratio(returns, risk_free=0.03, periods=252):
    """연율화 샤프지수를 반환한다."""
    annual_return = returns.mean() * periods
    annual_vol = returns.std() * np.sqrt(periods)
    return (annual_return - risk_free) / annual_vol


def max_drawdown(prices):
    """최대낙폭을 반환한다."""
    return (prices / prices.cummax() - 1).min()
```

### 이번 주 준비

가상환경을 활성화하고 `prices.csv`가 있는지 확인한다. `week5.py`를 새로 만든다.

---

## 1. 다중 자산 데이터 관리

### 정의

**다중 자산 관리란 여러 종목의 가격·수익률 데이터를 일관된 구조로 묶어, 종목이 늘거나 줄어도 코드를 고치지 않고 처리할 수 있게 만드는 설계 방식이다.**

### 비유

종목마다 변수를 따로 만드는 것은 **서류를 책상 위에 아무렇게나 쌓아두는 것**과 같다. 세 장일 때는 괜찮지만 서른 장이 되면 감당이 안 된다. 딕셔너리와 DataFrame은 **라벨이 붙은 서류함**이다. 몇 장이 들어오든 같은 방식으로 꺼낼 수 있다.

### 나쁜 방식과 좋은 방식

```python
# ❌ 종목이 늘어날 때마다 코드를 고쳐야 한다
samsung = 70000
hynix = 180000
naver = 210000
total = samsung + hynix + naver

# ⭕ 종목이 몇 개든 코드는 그대로다
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
returns = prices.pct_change().dropna()   # 모든 열의 수익률을 한 번에

print(returns.mean())        # 열별 평균
print(returns.std())         # 열별 표준편차
print(returns.corr())        # 열끼리의 상관계수 행렬
```

**반복문이 필요 없다.** 종목이 3개든 300개든 코드는 같다.

### 포트폴리오 수익률 계산

```python
weights = {"삼성전자": 0.2, "KODEX200": 0.2, "미국S&P500": 0.2,
           "국고채30년": 0.2, "금": 0.2}

# 방법 1: 반복문 (이해하기 쉬움)
portfolio_returns = 0
for name, w in weights.items():
    portfolio_returns += returns[name] * w

# 방법 2: pandas 벡터 연산 (간결함)
w_series = pd.Series(weights)
portfolio_returns = (returns * w_series).sum(axis=1)
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
        print(f"⚠️  비중 합계가 {total:.4f}입니다. 1이 되도록 조정하세요.")
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
import matplotlib.pyplot as plt

# 선 그래프 — 시계열
plt.plot(prices.index, prices["삼성전자"], label="삼성전자")
plt.legend()

# 산점도 — 두 변수의 관계
plt.scatter(returns["KODEX200"], returns["삼성전자"], alpha=0.5, s=10)

# 히스토그램 — 분포
plt.hist(returns["삼성전자"], bins=50)

# 막대 그래프 — 항목별 비교
plt.bar(list(weights.keys()), list(weights.values()))
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

**공분산이란 두 변수가 각자의 평균에서 벗어나는 방향이 얼마나 함께 움직이는지를 나타내는 값이다.**

$$\text{Cov}(X, Y) = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})$$

### 비유

공분산은 **두 사람이 함께 걷는지 재는 지표**다. 한 사람이 앞서갈 때 다른 사람도 앞서가면 두 편차의 곱이 양수가 되고, 한 사람이 앞설 때 다른 사람이 뒤처지면 음수가 된다. 이 곱들을 평균 낸 것이 공분산이다.

- 공분산 > 0: 같은 방향으로 움직이는 경향
- 공분산 < 0: 반대 방향으로 움직이는 경향
- 공분산 = 0: 뚜렷한 관계 없음

### 왜 중요한가

포트폴리오의 위험은 **각 자산 위험의 단순 평균이 아니다.** 두 자산 포트폴리오의 분산은 다음과 같다.

$$\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\text{Cov}(1,2)$$

세 번째 항이 공분산이다. **이 항이 음수라면 포트폴리오 전체 위험이 각 자산의 위험보다 낮아진다.** 분산투자가 작동하는 수학적 이유가 바로 여기에 있다.

### 코드

```python
import pandas as pd

a = pd.Series([0.010, -0.005, 0.020, 0.000, -0.010, 0.015, 0.005, -0.008, 0.012, 0.003])
m = pd.Series([0.008, -0.003, 0.012, 0.002, -0.006, 0.010, 0.004, -0.005, 0.009, 0.001])

print(f"공분산: {a.cov(m):.8f}")   # 0.00006462
```

DataFrame 전체의 공분산 행렬은 한 줄로 구한다.

```python
cov_matrix = returns.cov()
print(cov_matrix)
```

**공분산 행렬(covariance matrix)** 은 대각선에 각 자산의 분산, 나머지에 자산 쌍의 공분산이 들어간 정사각 표다. 6주차 포트폴리오 최적화의 핵심 재료다.

### 공분산의 한계

공분산 값 자체는 해석하기 어렵다. 단위가 "수익률의 제곱"이고, 자산의 변동성 크기에 따라 값의 스케일이 완전히 달라지기 때문이다. 위 예시의 0.00006462가 강한 관계인지 약한 관계인지 이 숫자만으로는 알 수 없다. 그래서 표준화한 지표가 필요하다.

---

## 4. 상관계수 (Correlation Coefficient)

### 정의

**상관계수란 공분산을 두 변수의 표준편차의 곱으로 나누어 -1과 1 사이의 값으로 표준화한 지표다.**

$$\rho_{XY} = \frac{\text{Cov}(X,Y)}{\sigma_X \sigma_Y}$$

### 비유

상관계수는 **공분산을 백분율처럼 읽을 수 있게 만든 것**이다. 키를 재는데 어떤 사람은 cm, 어떤 사람은 inch를 쓰면 비교가 안 된다. 상관계수는 모든 자산 쌍을 -1 ~ +1이라는 공통 자로 재게 해준다.

### 해석

| 상관계수 | 의미 |
|---|---|
| `+1.0` | 완전히 같은 방향으로 움직임 |
| `+0.7 ~ +1.0` | 강한 양의 상관 |
| `+0.3 ~ +0.7` | 중간 정도 양의 상관 |
| `-0.3 ~ +0.3` | 약한 관계 |
| `-1.0 ~ -0.7` | 강한 음의 상관 |
| `-1.0` | 완전히 반대 방향으로 움직임 |

### 분산투자와 상관계수

**포트폴리오 분산 효과는 상관계수가 낮을수록 커진다.**

- 상관계수 +1인 두 자산을 섞으면 위험이 전혀 줄지 않는다. 사실상 같은 자산이다.
- 상관계수 0인 두 자산을 섞으면 위험이 줄어든다.
- 상관계수 -1이면 이론상 위험을 0으로 만들 수 있다.

같은 시장의 주식을 여러 개 사는 것이 진짜 분산투자가 아닌 이유다. 삼성전자와 KODEX200의 상관계수는 **0.90**으로, 사실상 같은 것을 두 번 사는 셈이다. 반면 미국S&P500과 국고채30년은 **0.02**로 거의 무관하다.

### 코드

```python
print(f"상관계수: {a.corr(m):.4f}")    # 0.9891

# 전체 상관계수 행렬
corr_matrix = returns.corr()
print(corr_matrix)
```

대각선은 항상 1이다(자기 자신과의 상관계수).

### 히트맵으로 보기

```python
import matplotlib.pyplot as plt

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

---

## 5. 베타 (Beta)

### 정의

**베타란 시장 전체의 움직임에 대한 개별 자산의 민감도를 나타내는 계수다.** 자산 수익률과 시장 수익률의 공분산을 시장 수익률의 분산으로 나눈 값이다.

$$\beta_i = \frac{\text{Cov}(R_i, R_m)}{\text{Var}(R_m)}$$

### 비유

베타는 **파도에 대한 배의 반응**이다. 시장이라는 파도가 1만큼 출렁일 때, 베타 1.5인 배는 1.5만큼 흔들리고 베타 0.5인 배는 0.5만큼만 흔들린다. 파도가 클 때 더 크게 오르지만, 파도가 꺼질 때도 더 크게 떨어진다.

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
| **체계적 위험** | 시장 전체에 영향 (금리, 경기, 전쟁) | ❌ 불가능 |
| **비체계적 위험** | 개별 기업 고유 (경영진 교체, 신제품 실패) | ⭕ 가능 |

종목을 늘리면 비체계적 위험은 상쇄되어 사라지지만, 체계적 위험은 남는다. **베타는 이 남는 위험, 즉 피할 수 없는 위험의 크기를 재는 지표다.** 다음 절의 CAPM이 "피할 수 없는 위험만큼만 보상받는다"고 말하는 근거가 여기에 있다.

### 코드

```python
def beta(asset_returns, market_returns):
    """자산 수익률과 시장 수익률로 베타를 계산한다."""
    covariance = asset_returns.cov(market_returns)
    market_variance = market_returns.var()
    return covariance / market_variance


print(f"베타: {beta(a, m):.4f}")   # 1.5403
```

베타 1.54는 시장이 1% 오를 때 이 자산은 평균적으로 약 1.54% 오르는 경향이 있다는 뜻이다.

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

무위험수익률 3%, 시장 기대수익률 8%, 베타 1.54일 때:

$$E(R) = 0.03 + 1.54 \times (0.08 - 0.03) = 0.03 + 0.077 = 0.107$$

```python
def capm_expected_return(beta_value, risk_free=0.03, market_return=0.08):
    """CAPM으로 기대수익률을 계산한다."""
    return risk_free + beta_value * (market_return - risk_free)


print(f"{capm_expected_return(1.5403):.2%}")   # 10.70%
```

### 알파 (Alpha)

**실제 수익률이 CAPM이 요구하는 기대수익률보다 높은 초과분을 알파라고 한다.**

$$\alpha = R_{\text{실제}} - E(R_{\text{CAPM}})$$

```python
def alpha(actual_return, beta_value, risk_free=0.03, market_return=0.08):
    """CAPM 기대수익률 대비 초과수익(알파)을 계산한다."""
    expected = capm_expected_return(beta_value, risk_free, market_return)
    return actual_return - expected


print(f"알파: {alpha(0.13, 1.5403):.2%}")   # 2.30%
```

알파가 양수면 "감수한 위험에 비해 잘했다"는 뜻이다. 액티브 펀드 매니저의 성과를 평가하는 기준이자, 퀀트 투자가 찾으려는 목표이기도 하다.

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
        print(f"⚠️  비중 합계가 {total:.4f}입니다.")
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

asset = pd.Series([0.010, -0.005, 0.020, 0.000, -0.010,
                   0.015, 0.005, -0.008, 0.012, 0.003])
market = pd.Series([0.008, -0.003, 0.012, 0.002, -0.006,
                    0.010, 0.004, -0.005, 0.009, 0.001])

cov = asset.cov(market)
corr = asset.corr(market)
b = cov / market.var()

print(f"공분산      {cov:.8f}")     # 0.00006462
print(f"상관계수    {corr:.4f}")     # 0.9891
print(f"베타        {b:.4f}")        # 1.5403
print(f"CAPM 기대   {0.03 + b * (0.08 - 0.03):.2%}")   # 10.70%
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
