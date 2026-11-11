# 6주차 — 포트폴리오 최적화

> numpy 행렬 연산 · 몬테카를로 시뮬레이션 → 효율적 투자선

지난주에 **자산 간 상관관계가 낮으면 포트폴리오 위험이 개별 위험보다 낮아진다**는 것을 확인했다. 그렇다면 자연스러운 질문이 따라온다. **비중을 어떻게 나눠야 가장 좋은가?** 이번 주는 그 질문에 답한다.

이번 주는 8주 중 수학적으로 가장 무거운 주차다. 다만 실제로 쓰는 도구는 지금까지 배운 것의 조합이며, 새로 배우는 것은 **행렬 곱셈 기호 하나**와 **난수 생성** 정도다.

---

## 0. 5주차 복습 노트

### 파이썬 문법

| 개념 | 핵심 |
|---|---|
| **다중 자산 관리** | 딕셔너리 + DataFrame, 종목 수와 무관한 코드 |
| **`axis=1`** | 가로(행 단위) 연산 — 포트폴리오 수익률 합산 |
| **matplotlib** | `plot`, `scatter`, `hist`, `bar`, 한글 폰트 설정 필요 |

### 금융 개념

| 개념 | 공식 | 의미 |
|---|---|---|
| 공분산 | $\text{Cov}(X,Y)$ | 함께 움직이는 정도 |
| 상관계수 | $\text{Cov}/(\sigma_X\sigma_Y)$ | -1~1로 표준화한 관계 |
| 베타 | $\text{Cov}(R_i,R_m)/\text{Var}(R_m)$ | 시장에 대한 민감도 |
| CAPM | $R_f + \beta(E(R_m)-R_f)$ | 위험만큼 보상받는다 |

### 이번 주의 출발점

지난주 마지막에 확인한 두 자산 포트폴리오의 분산 공식이 이번 주의 시작이다.

$$\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho_{12}\sigma_1\sigma_2$$

- $\sigma_p^2$ — 포트폴리오 분산, $\sigma_p$ — 그 제곱근인 변동성
- $w_1$, $w_2$ — 각 자산의 비중, $\sigma_1$, $\sigma_2$ — 각 자산의 변동성
- $\rho_{12}$ — 두 자산의 상관계수 (5주차에서 배운 그 값)

변동성 30%와 25%인 두 자산을 상관계수 -0.5로 반씩 섞으면 포트폴리오 변동성은 **13.92%** 였다. 어느 개별 자산보다도 낮다.

여기서 생기는 질문: **50:50이 최선이었을까?** 60:40이나 30:70이 더 나았을 수도 있다.

오늘은 이 질문에 답한다. **먼저 자산 두 개로 끝까지 해본 뒤, 다섯 개로 늘린다.** 둘일 때는 손으로 다 세어볼 수 있지만 다섯이 되면 그럴 수 없고, 바로 그 지점에서 오늘의 새 도구 두 가지(**무작위 추출**과 **행렬 표기**)가 필요해진다.

### 이번 주 준비

가상환경을 활성화하고 `prices.csv`가 있는지 확인한 뒤 `week6.py`를 만든다.

---

## 1. 먼저 둘로만 나눠보자

자산 다섯 개는 한 번에 머리에 안 들어온다. **삼성전자와 금, 둘만** 놓고 시작한다. 이 둘로 이번 주 개념이 거의 다 나온다.

두 자산의 성격은 이렇다. 지난주까지 구한 값이다.

| 자산 | 연 기대수익률 | 위험(변동성) |
|---|---|---|
| 삼성전자 | 48.78% | 44.97% |
| 금 | 20.27% | 20.84% |

둘의 상관계수는 **0.28** 로 낮은 편이다. 서로 따로 노는 자산이라는 뜻이다.

질문은 하나다. **이 둘을 몇 대 몇으로 나눠 담을까?**

### 11가지만 계산해보면

둘뿐이니 비중은 사실상 하나만 정하면 된다. 삼성전자를 30% 담으면 금은 자동으로 70%다. 그래서 0%부터 100%까지 10%씩 끊어 **11가지**만 계산해보면 된다.

계산에 쓰는 식은 **지난주에 배운 것 그대로**다. 새 공식은 없다.

- 수익률 = 삼성 비중 × 48.78% + 금 비중 × 20.27%
- 위험 = $\sqrt{w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2}$

| 삼성전자 | 금 | 기대수익률 | 위험 | 샤프 |
|---|---|---|---|---|
| 0% | 100% | 20.27% | 20.84% | 0.83 |
| **10%** | **90%** | **23.12%** | **20.47%** | 0.98 |
| 20% | 80% | 25.97% | 21.03% | 1.09 |
| 30% | 70% | 28.83% | 22.45% | 1.15 |
| **40%** | **60%** | **31.68%** | **24.59%** | **1.17** |
| 50% | 50% | 34.53% | 27.28% | 1.16 |
| 60% | 40% | 37.38% | 30.37% | 1.13 |
| 70% | 30% | 40.23% | 33.75% | 1.10 |
| 80% | 20% | 43.08% | 37.35% | 1.07 |
| 90% | 10% | 45.93% | 41.10% | 1.04 |
| 100% | 0% | 48.78% | 44.97% | 1.02 |

**첫 두 줄을 비교해보자.** 금만 100% 들고 있을 때 위험이 20.84%였다. 여기에 삼성전자를 10% 섞었더니

- 수익률은 20.27% → **23.12%로 올랐는데**
- 위험은 20.84% → **20.47%로 내려갔다**

둘 중 더 위험한 자산(삼성전자 44.97%)을 넣었는데 **전체 위험이 줄었다.** 지난주에 말한 "수익을 포기하지 않고 위험만 줄인다"가 실제 숫자로 나타난 것이다. 둘이 서로 다르게 움직이기 때문에(상관계수 0.28) 생기는 일이다.

### 점을 이으면 곡선이 된다

11개 줄을 각각 점으로 찍고 이으면 이런 모양이 나온다. 가로축이 위험, 세로축이 수익률이다.

![삼성전자와 금의 비중을 바꿔가며 그린 곡선](/week6-two-assets.png)

오른쪽 끝이 삼성전자 100%, 왼쪽 아래가 금 100%다. 비중을 바꾸면 점이 이 곡선을 따라 이동한다.

**곡선이 왼쪽으로 한 번 휘어 들어가는 것**이 핵심이다. 금 100%에서 삼성전자를 조금씩 섞으면 점이 왼쪽 위로 움직인다. 위험은 줄고 수익은 느는 구간이다. 그러다 어느 지점을 지나면 방향이 바뀌어 오른쪽 위로 간다.

### 곡선 위의 두 점

그림에 표시한 두 점이 오늘의 목표다.

| 점 | 어떤 조합인가 | 결과 |
|---|---|---|
| **가장 안전한 조합** (다이아몬드) | 삼성 9% / 금 91% | 위험 20.46% — 곡선의 가장 왼쪽 |
| **가성비가 가장 좋은 조합** (별) | 삼성 40% / 금 60% | 샤프 1.17 — 위험 1단위당 수익이 최고 |

정식 이름은 각각 **최소분산 포트폴리오**와 **최대 샤프 포트폴리오**다. 이름보다 **"가장 안전한 것"과 "가성비가 가장 좋은 것"** 으로 기억하면 된다.

> 둘 중 무엇을 고를지는 정답이 없다. 위험을 지기 싫으면 왼쪽, 수익을 더 원하면 오른쪽이다. 다만 **곡선 아래쪽에 있는 조합은 누구에게도 답이 아니다.** 다음 쪽에서 그 이유를 본다.

### 아래쪽은 왜 고를 이유가 없나

그림에서 **금 100% 점(맨 아래)** 을 보자. 위험 20.84%에 수익 20.27%다. 그런데 바로 위의 삼성 10% 조합은 **위험이 더 낮은데(20.47%) 수익은 더 높다(23.12%).**

이럴 때 "금 100%는 **지배당했다**"고 말한다.

![A와 C가 B를 지배하는 관계](/week6-dominance.png)

- **A는 B와 위험이 같은데 수익이 더 높다** — 같은 위험이면 A가 낫다
- **C는 B와 수익이 같은데 위험이 더 낮다** — 같은 수익이면 C가 낫다

어느 쪽이든 B를 고를 이유가 없다. 이렇게 지배당하는 점을 전부 지우면 **곡선의 위쪽 부분만 남는다.** 그 남은 부분을 **효율적 투자선**이라고 부른다.

### 직접 해보기

위 표를 만드는 코드다. 반복문 하나와 지난주 공식이 전부다.

```python
import numpy as np
import pandas as pd

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

pair = ["삼성전자", "금"]
mu = returns[pair].mean() * 252       # 연 기대수익률
cov = returns[pair].cov() * 252       # 연 공분산

print(f"{'삼성':>6}{'금':>6}{'수익률':>10}{'위험':>9}{'샤프':>7}")

for i in range(11):
    w = i / 10                        # 삼성전자 비중
    ret = w * mu.iloc[0] + (1 - w) * mu.iloc[1]
    var = (w**2 * cov.iloc[0, 0]
           + (1 - w)**2 * cov.iloc[1, 1]
           + 2 * w * (1 - w) * cov.iloc[0, 1])
    vol = np.sqrt(var)
    print(f"{w:>6.0%}{1-w:>6.0%}{ret:>10.2%}{vol:>9.2%}{(ret - 0.03) / vol:>7.2f}")
```

**실행 결과**

```
    삼성     금       수익률       위험     샤프
    0%  100%    20.27%   20.84%   0.83
   10%   90%    23.12%   20.47%   0.98
   20%   80%    25.97%   21.03%   1.09
   30%   70%    28.83%   22.45%   1.15
   40%   60%    31.68%   24.59%   1.17
   50%   50%    34.53%   27.28%   1.16
   60%   40%    37.38%   30.37%   1.13
   70%   30%    40.23%   33.75%   1.10
   80%   20%    43.08%   37.35%   1.07
   90%   10%    45.93%   41.10%   1.04
  100%    0%    48.78%   44.97%   1.02
```

---

## 2. 자산이 다섯 개라면

둘일 때는 11가지만 해보면 됐다. 그런데 자산이 다섯 개가 되면 사정이 달라진다.

### 다 해볼 수가 없다

다섯 자산에 1%씩 끊어서 100%를 나누는 경우의 수는 **4,598,126 가지**다. 460만 가지. 0.1% 단위로 더 잘게 쪼개면 수십억 가지가 된다.

그런데 생각해보면 **우리에게 필요한 건 모든 점이 아니라 곡선의 모양**이다. 2자산에서도 11개만 찍어도 곡선이 보였다.

### 그래서 무작위로 뽑는다

**비중을 무작위로 2만 개 만들어서 전부 계산해보고, 그중 제일 좋은 것을 고른다.** 이 방법을 **몬테카를로 시뮬레이션**이라고 한다.

여론조사에서 5천만 명에게 다 묻지 않고 1,000명만 뽑아 물어도 전체 경향을 알 수 있는 것과 같다. 2주차에 IRR을 이분법으로 구한 것과도 같은 계열이다. **식으로 못 풀면 컴퓨터의 반복 능력으로 푼다.**

### 무작위 비중 만들기

비중에는 두 가지 조건이 있다. **합이 1이어야 하고, 전부 0 이상이어야 한다.** 난수를 다섯 개 만든 뒤 그 합으로 나누면 두 조건이 한 번에 해결된다.

```python
import numpy as np

rng = np.random.default_rng(42)       # 42는 씨앗. 아무 정수나 된다

w = rng.random(5)                     # 0~1 사이 난수 5개
print("나눈 전:", w.round(3))

w = w / w.sum()                       # 합으로 나눈다
print("나눈 후:", w.round(3))
print("합계   :", w.sum())
```

**실행 결과**

```
나눈 전: [0.774 0.439 0.859 0.697 0.094]
나눈 후: [0.27  0.153 0.3   0.244 0.033]
합계   : 1.0
```

씨앗(seed)을 정해두면 몇 번을 실행해도 같은 난수가 나온다. **결과를 남과 맞춰봐야 할 때 반드시 넣는다.**

2만 개를 한꺼번에 만들 때도 똑같다. 세로로 2만 줄을 쌓는다고 생각하면 된다.

```python
import numpy as np

rng = np.random.default_rng(42)
N = 20000

W = rng.random((N, 5))                      # 2만 줄 × 5열
W = W / W.sum(axis=1, keepdims=True)        # 줄마다 합을 1로

print(W.shape)
print(W[0].round(3))                        # 첫 번째 포트폴리오
print(W[0].sum())
```

**실행 결과**

```
(20000, 5)
[0.27  0.153 0.3   0.244 0.033]
1.0
```

`axis=1`은 지난주에 쓴 그 옵션이다. **가로 방향(줄 단위)으로 더하라**는 뜻이다.

---

## 3. 다섯 개를 한 번에 계산하기

비중 2만 개를 만들었으니 각각의 수익률과 위험을 구해야 한다. 그런데 2자산에서 쓴 식을 다섯 자산으로 늘리면 항이 **15개**가 된다. 손으로 쓰기 어렵다.

여기서 **행렬**이 등장한다. 새로운 이론이 아니라, **같은 계산을 짧게 쓰는 표기법**이다.

### 수익률 — 곱해서 더하기

비중과 기대수익률을 하나씩 곱해서 더하는 것이 전부다.

```python
import numpy as np

weights = np.array([0.4, 0.3, 0.3])
mean_returns = np.array([0.12, 0.10, 0.07])

# 하나씩 곱해서 더하기
total = 0
for w, m in zip(weights, mean_returns):
    total += w * m
print(total)

# 같은 계산을 한 글자로
print(weights @ mean_returns)
```

**실행 결과**

```
0.099
0.099
```

`@` 기호가 **"곱해서 전부 더하라"** 는 뜻이다. 자산이 100개여도 코드는 그대로다.

### 위험 — 두 번 곱한다

변동성은 `w @ cov @ w` 로 구한다. 한 덩어리로 보이지만 **곱셈을 두 번 하는 것**뿐이다. 2자산으로 손으로 따라가 보자.

```python
import numpy as np

# 변동성 30%, 25%, 상관계수 -0.5인 두 자산
cov = np.array([[ 0.0900, -0.0375],
                [-0.0375,  0.0625]])
w = np.array([0.5, 0.5])

print(w @ cov @ w)              # 분산
print(np.sqrt(w @ cov @ w))     # 변동성
```

**실행 결과**

```
0.019375
0.13919410907075055
```

**1단계 — `cov @ w` 를 먼저 구한다.**

```
1행: 0.0900 × 0.5 + (−0.0375) × 0.5 =  0.0450 − 0.01875 =  0.02625
2행: (−0.0375) × 0.5 + 0.0625 × 0.5 = −0.01875 + 0.03125 =  0.01250

cov @ w = [0.02625, 0.01250]
```

이 두 숫자는 **"1번 자산이 전체 위험에 기여한 몫, 2번 자산이 기여한 몫"** 이다.

**2단계 — 거기에 다시 비중을 곱해 더한다.**

```
0.5 × 0.02625 + 0.5 × 0.01250 = 0.019375   ← 분산
√0.019375 = 0.1392                          ← 변동성 13.92%
```

지난주에 공식으로 손으로 구한 13.92%와 같은 값이다. **행렬은 지름길일 뿐 다른 계산이 아니다.**

### 공분산 행렬

`cov` 자리에 들어가는 표는 pandas가 만들어준다. 5주차에 본 그 표다.

```python
import pandas as pd

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

cov_annual = returns.cov() * 252      # 분산은 시간에 비례하므로 × 252

print(cov_annual.round(4))
```

**실행 결과**

```
            삼성전자  KODEX200  미국S&P500  국고채30년       금
삼성전자      0.2022    0.1385    0.0180  0.0108  0.0260
KODEX200  0.1385    0.1168    0.0168  0.0093  0.0225
미국S&P500  0.0180    0.0168    0.0245  0.0003  0.0015
국고채30년    0.0108    0.0093    0.0003  0.0169  0.0063
금         0.0260    0.0225    0.0015  0.0063  0.0434
```

**분산은 × 252, 변동성(표준편차)은 × √252** 였던 것을 기억하면 된다.

---

## 4. 2만 개를 뿌리고 가장 좋은 것 고르기

재료가 다 모였다. 비중 2만 개, 기대수익률, 공분산 행렬. 이제 **2만 번 반복**하면 된다.

### 반복문으로 2만 번

```python
import numpy as np
import pandas as pd

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

mu = returns.mean().values * 252
cov = returns.cov().values * 252

rng = np.random.default_rng(42)
N = 20000
W = rng.random((N, 5))
W = W / W.sum(axis=1, keepdims=True)

rets = []
vols = []

for i in range(N):
    w = W[i]                              # i번째 비중
    rets.append(w @ mu)                   # 수익률
    vols.append(np.sqrt(w @ cov @ w))     # 위험

rets = np.array(rets)
vols = np.array(vols)
sharpe = (rets - 0.03) / vols

print(f"2만 개 계산 완료")
print(f"수익률 범위 {rets.min():.2%} ~ {rets.max():.2%}")
print(f"위험 범위   {vols.min():.2%} ~ {vols.max():.2%}")
```

**실행 결과**

```
2만 개 계산 완료
수익률 범위 7.22% ~ 43.20%
위험 범위   10.03% ~ 38.96%
```

2주차에 배운 반복문과 방금 배운 `@` 가 전부다. **새로운 개념은 없다.**

### 가장 좋은 것 고르기

2만 개 중에서 고르는 것은 한 줄이다. 먼저 작은 예로 `.argmax()` 가 무엇을 돌려주는지 보자.

```python
import numpy as np

sharpe = np.array([0.80, 1.42, 1.10, 0.90])   # 포트폴리오 4개의 샤프지수

print(sharpe.max())        # 가장 큰 값
print(sharpe.argmax())     # 그 값이 몇 번째인지 (0부터 센다)
```

**실행 결과**

```
1.42
1
```

`.argmax()`는 최댓값 자체가 아니라 **최댓값이 몇 번째에 있는지**를 알려준다. 위에서는 1.42가 1번 자리에 있으므로 `1`이 나온다.

2만 개짜리 배열에서도 똑같다.

```
best = sharpe.argmax()      # 샤프가 가장 큰 것의 '위치'
safest = vols.argmin()      # 위험이 가장 작은 것의 '위치'

W[best]                     # 그 위치의 비중을 꺼낸다
```

**그 번호로 `W`에서 비중을 꺼내는 것**이 핵심이다. 번호 하나로 "2만 개 중 몇 번째 조합이 정답인지"가 정해진다.

| 메서드 | 돌려주는 것 |
|---|---|
| `.max()` | 가장 큰 **값** |
| `.argmax()` | 가장 큰 값의 **위치** |
| `.min()` | 가장 작은 값 |
| `.argmin()` | 가장 작은 값의 위치 |

### 결과를 그림으로

2만 개를 전부 점으로 찍으면 이렇게 된다. 색이 밝을수록 샤프지수가 높다.

![무작위 비중 2만 개와 효율적 투자선](/week6-cloud.png)

2자산에서 본 곡선과 **같은 모양**이다. 점이 11개에서 2만 개로 늘고, 선이 면으로 두꺼워졌을 뿐이다.

| | 비중 | 수익률 | 위험 | 샤프 |
|---|---|---|---|---|
| **가성비 최고** (별) | 삼성 16% / K200 1% / S&P 59% / 채권 0% / 금 25% | 24.24% | 14.95% | **1.42** |
| **가장 안전** (다이아) | 삼성 2% / K200 2% / S&P 38% / 채권 50% / 금 8% | 10.54% | **10.03%** | 0.75 |

2자산일 때 가성비 최고가 샤프 1.17이었는데, **다섯 자산으로 늘리니 1.42로 올라갔다.** 섞을 수 있는 자산이 많아질수록 더 좋은 조합을 찾을 수 있다는 뜻이다.

---

## 5. 효율적 투자선 (Efficient Frontier)

구름의 **위쪽 테두리**, 즉 지배당하지 않고 살아남은 점들을 이은 선을 **효율적 투자선**이라고 한다. 해리 마코위츠가 1952년에 제시한 개념이고, 이 공로로 노벨경제학상을 받았다.

### 이 이론이 말하는 것

1. 투자는 수익률만 보는 게 아니라 **위험과 함께** 봐야 한다
2. 자산을 하나씩 떼어 평가하지 말고 **포트폴리오 전체**로 봐야 한다
3. 서로 다르게 움직이는 자산을 섞으면 **수익을 포기하지 않고도 위험이 줄어든다**
4. 합리적인 선택은 **위쪽 테두리 위에서만** 이루어진다

3번이 오늘 2자산 표의 첫 두 줄에서 눈으로 확인한 것이다.

### 한계

- **과거로 미래를 추정한다.** 기대수익률과 공분산을 과거 데이터로 구하는데, 특히 기대수익률은 오차가 매우 크다
- **입력이 조금만 바뀌어도 답이 크게 흔들린다.** 그래서 실무에서는 종목별 상한(예: 40%)을 두거나, 아예 균등 비중을 쓰기도 한다
- **위험을 변동성 하나로만 잰다.** 실제 폭락은 정규분포가 예측하는 것보다 자주 일어난다

한계가 분명한데도 배우는 이유는, **위험과 수익을 함께 놓고 고른다는 사고방식**이 이후 모든 자산배분 이론의 출발점이기 때문이다.

---

## 오늘 배운 것 정리

### 파이썬 문법

| 개념 | 한 줄 정의 | 핵심 |
|---|---|---|
| **`@`** | 곱해서 전부 더하라 | 자산이 몇 개여도 코드가 같다 |
| **`np.random.default_rng(seed)`** | 씨앗을 넣어 난수 생성기를 만든다 | 같은 씨앗이면 같은 결과 |
| **`.argmax()` / `.argmin()`** | 극값의 **위치** 반환 | 최적 비중을 꺼내는 열쇠 |
| **`axis=1`, `keepdims`** | 가로 방향 연산과 모양 유지 | 비중 합을 1로 만들 때 |

### 금융 개념

| 개념 | 공식 | 코드 |
|---|---|---|
| 포트폴리오 수익률 | $w^T\mu$ | `w @ mu` |
| 포트폴리오 분산 | $w^T\Sigma w$ | `w @ cov @ w` |
| 포트폴리오 변동성 | $\sqrt{w^T\Sigma w}$ | `np.sqrt(w @ cov @ w)` |
| 공분산 연율화 | $\Sigma_{일} \times 252$ | `returns.cov() * 252` |
| 효율적 투자선 | 각 위험 수준의 최고 수익 조합 | 몬테카를로 구름의 위쪽 테두리 |

한 문장으로: **모든 비중 조합을 무작위로 만들어 수익률과 위험을 계산한 뒤, 그중 지배당하지 않는 것들만 남긴 것이 효율적 투자선이다.**

---

## 오늘의 코드

아래 세 조각을 순서대로 `week6.py` 한 파일에 붙여넣으면 된다. 조각마다 어떤 출력이 나오는지 확인하며 따라간다.

### 1단계 — 데이터 준비와 함수

먼저 데이터를 읽고, 오늘 쓸 계산 함수 세 개를 만든다. 자산별 지표와 상관계수를 출력해 재료를 확인하는 단계다.

```python
"""
6주차 실습 — 포트폴리오 최적화
몬테카를로 시뮬레이션으로 효율적 투자선을 그리고 최적 포트폴리오를 찾는다.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams["font.family"] = "Malgun Gothic"    # Windows
# plt.rcParams["font.family"] = "AppleGothic"    # macOS
# plt.rcParams["font.family"] = "NanumGothic"    # Linux
plt.rcParams["axes.unicode_minus"] = False

TRADING_DAYS = 252
RISK_FREE = 0.03
N_SIMULATIONS = 20000
SEED = 42               # 씨앗을 고정해야 매번 같은 결과가 나온다


# ── 포트폴리오 계산 함수 ─────────────────────────────────

def portfolio_return(weights, mean_returns):
    """연율화 기대수익률을 반환한다."""
    return weights @ mean_returns


def portfolio_volatility(weights, cov_matrix):
    """연율화 변동성을 반환한다."""
    return np.sqrt(weights @ cov_matrix @ weights)


def portfolio_sharpe(weights, mean_returns, cov_matrix, risk_free=RISK_FREE):
    """샤프지수를 반환한다."""
    ret = portfolio_return(weights, mean_returns)
    vol = portfolio_volatility(weights, cov_matrix)
    return (ret - risk_free) / vol


def random_weights(n_assets, n_samples, seed=None):
    """합이 1이고 모두 0 이상인 무작위 비중 행렬을 만든다."""
    rng = np.random.default_rng(seed)
    W = rng.random((n_samples, n_assets))
    return W / W.sum(axis=1, keepdims=True)


def describe_portfolio(label, weights, names, mean_returns, cov_matrix):
    """포트폴리오 하나를 보기 좋게 출력한다."""
    ret = portfolio_return(weights, mean_returns)
    vol = portfolio_volatility(weights, cov_matrix)
    sharpe = (ret - RISK_FREE) / vol

    print(f"\n[{label}]")
    print(f"  기대수익률 {ret:>8.2%}   변동성 {vol:>8.2%}   샤프 {sharpe:>6.3f}")
    print("  비중")
    for name, w in zip(names, weights):
        bar = "█" * int(w * 40)
        print(f"    {name:<12}{w:>7.2%}  {bar}")


# ── 1) 데이터 준비 ───────────────────────────────────────

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
returns = prices.pct_change().dropna()

names = list(prices.columns)
n_assets = len(names)

mean_returns = returns.mean().values * TRADING_DAYS        # 연율화 기대수익률
cov_matrix = returns.cov().values * TRADING_DAYS           # 연율화 공분산 행렬

print("=" * 62)
print("자산별 연율화 지표")
print("=" * 62)
print(f"{'종목':<12}{'기대수익률':>14}{'변동성':>12}")
print("-" * 62)
for i, name in enumerate(names):
    vol = np.sqrt(cov_matrix[i, i])
    print(f"{name:<12}{mean_returns[i]:>14.2%}{vol:>12.2%}")

print()
print("상관계수 행렬")
print(returns.corr().round(3))
```

**실행 결과**

```
==============================================================
자산별 연율화 지표
==============================================================
종목                   기대수익률         변동성
--------------------------------------------------------------
삼성전자                48.78%      44.97%
KODEX200            39.16%      34.18%
미국S&P500            19.29%      15.66%
국고채30년              -0.04%      12.99%
금                   20.27%      20.84%

상관계수 행렬
           삼성전자  KODEX200  미국S&P500  국고채30년      금
삼성전자      1.000     0.901     0.256   0.185  0.277
KODEX200  0.901     1.000     0.313   0.209  0.316
미국S&P500  0.256     0.313     1.000   0.017  0.045
국고채30년    0.185     0.209     0.017   1.000  0.234
금         0.277     0.316     0.045   0.234  1.000
```

### 2단계 — 2만 개 뿌리고 고르기

무작위 비중 2만 개를 만들어 전부 계산한 뒤, 가장 좋은 것들을 꺼낸다. 앞에서 배운 반복문과 `argmax` 가 여기 쓰인다.

```python
# ── 2) 몬테카를로 시뮬레이션 ─────────────────────────────

print()
print(f"{N_SIMULATIONS:,}개 포트폴리오 시뮬레이션 중...")

W = random_weights(n_assets, N_SIMULATIONS, SEED)

sim_returns = W @ mean_returns
sim_vols = np.array([np.sqrt(w @ cov_matrix @ w) for w in W])
sim_sharpe = (sim_returns - RISK_FREE) / sim_vols

print("완료")


# ── 3) 특별한 포트폴리오 찾기 ────────────────────────────

max_sharpe_idx = sim_sharpe.argmax()
min_vol_idx = sim_vols.argmin()
equal_weights = np.ones(n_assets) / n_assets

print()
print("=" * 62)
print("주요 포트폴리오")
print("=" * 62)

describe_portfolio("최대 샤프 포트폴리오", W[max_sharpe_idx], names,
                   mean_returns, cov_matrix)
describe_portfolio("최소분산 포트폴리오", W[min_vol_idx], names,
                   mean_returns, cov_matrix)
describe_portfolio("균등 비중 포트폴리오 (1/N)", equal_weights, names,
                   mean_returns, cov_matrix)
```

**실행 결과**

```
20,000개 포트폴리오 시뮬레이션 중...
완료

==============================================================
주요 포트폴리오
==============================================================

[최대 샤프 포트폴리오]
  기대수익률   24.24%   변동성   14.95%   샤프  1.420
  비중
    삼성전자         15.83%  ██████
    KODEX200      0.48%  
    미국S&P500     58.60%  ███████████████████████
    국고채30년        0.31%  
    금            24.78%  █████████

[최소분산 포트폴리오]
  기대수익률   10.54%   변동성   10.03%   샤프  0.752
  비중
    삼성전자          1.81%  
    KODEX200      1.92%  
    미국S&P500     38.44%  ███████████████
    국고채30년       50.37%  ████████████████████
    금             7.46%  ██

[균등 비중 포트폴리오 (1/N)]
  기대수익률   25.49%   변동성   19.02%   샤프  1.183
  비중
    삼성전자         20.00%  ████████
    KODEX200     20.00%  ████████
    미국S&P500     20.00%  ████████
    국고채30년       20.00%  ████████
    금            20.00%  ████████
```

### 3단계 — 그림과 저장

결과를 그래프로 그리고, 최적 비중을 `optimal_weights.csv` 로 저장한다. 이 파일을 7주차 모의투자에서 그대로 쓴다.

```python
# ── 4) 효율적 투자선 추출 ────────────────────────────────

def efficient_frontier(vols, rets, n_bins=60):
    """
    변동성 구간별로 최고 수익률 포트폴리오만 골라
    효율적 투자선을 이루는 점들의 인덱스를 반환한다.
    """
    edges = np.linspace(vols.min(), vols.max(), n_bins + 1)
    idx_list = []

    for i in range(n_bins):
        in_bin = (vols >= edges[i]) & (vols < edges[i + 1])
        if in_bin.sum() == 0:
            continue
        candidates = np.where(in_bin)[0]
        best = candidates[rets[candidates].argmax()]
        idx_list.append(best)

    # 최소분산점보다 왼쪽(비효율 구간)은 제외
    idx_arr = np.array(idx_list)
    min_v = vols[idx_arr].argmin()
    return idx_arr[min_v:]


frontier_idx = efficient_frontier(sim_vols, sim_returns)


# ── 5) 시각화 ────────────────────────────────────────────

fig, ax = plt.subplots(figsize=(11, 7))

scatter = ax.scatter(sim_vols, sim_returns, c=sim_sharpe,
                     cmap="viridis", s=4, alpha=0.35)
plt.colorbar(scatter, label="샤프지수")

# 효율적 투자선
ax.plot(sim_vols[frontier_idx], sim_returns[frontier_idx],
        color="black", lw=2, label="효율적 투자선")

# 특별한 점들
ax.scatter(sim_vols[max_sharpe_idx], sim_returns[max_sharpe_idx],
           marker="*", s=420, color="red", edgecolor="black",
           zorder=5, label="최대 샤프")
ax.scatter(sim_vols[min_vol_idx], sim_returns[min_vol_idx],
           marker="D", s=140, color="orange", edgecolor="black",
           zorder=5, label="최소분산")

eq_vol = portfolio_volatility(equal_weights, cov_matrix)
eq_ret = portfolio_return(equal_weights, mean_returns)
ax.scatter(eq_vol, eq_ret, marker="s", s=140, color="cyan",
           edgecolor="black", zorder=5, label="균등 비중")

# 개별 자산
for i, name in enumerate(names):
    ax.scatter(np.sqrt(cov_matrix[i, i]), mean_returns[i],
               marker="X", s=140, color="white", edgecolor="black", zorder=5)
    ax.annotate(name, (np.sqrt(cov_matrix[i, i]), mean_returns[i]),
                xytext=(7, 7), textcoords="offset points", fontsize=9)

# 자본시장선 (무위험수익률 → 최대 샤프 포트폴리오)
cml_x = np.linspace(0, sim_vols.max(), 50)
cml_y = RISK_FREE + sim_sharpe[max_sharpe_idx] * cml_x
ax.plot(cml_x, cml_y, ls="--", color="red", lw=1.2, alpha=0.8,
        label="자본시장선 (CML)")

ax.set_xlabel("연율화 변동성 (위험)")
ax.set_ylabel("연율화 기대수익률")
ax.set_title(f"효율적 투자선 — {N_SIMULATIONS:,}개 포트폴리오 시뮬레이션")
ax.legend(loc="lower right")
ax.grid(alpha=0.3)

plt.tight_layout()
plt.savefig("week6_frontier.png", dpi=120)
print()
print("그래프를 week6_frontier.png로 저장했다.")
plt.show()


# ── 6) 다음 주를 위해 최적 비중 저장 ─────────────────────

optimal = pd.Series(W[max_sharpe_idx], index=names, name="weight")
optimal.to_csv("optimal_weights.csv")

print()
print("optimal_weights.csv 저장 완료 — 7주차 모의투자에서 이 비중을 사용한다.")
print(optimal.map(lambda x: f"{x:.2%}"))
```

**실행 결과**

```
그래프를 week6_frontier.png로 저장했다.

optimal_weights.csv 저장 완료 — 7주차 모의투자에서 이 비중을 사용한다.
삼성전자        15.83%
KODEX200     0.48%
미국S&P500    58.60%
국고채30년       0.31%
금           24.78%
Name: weight, dtype: object
```

### 오프라인 연습용

```python
"""데이터를 못 받을 때 — 가정한 3자산으로 최적화 실습"""
import numpy as np

rng = np.random.default_rng(42)

names = ["주식A", "주식B", "채권C"]
mu = np.array([0.12, 0.10, 0.07])        # 기대수익률
vols = np.array([0.30, 0.25, 0.15])      # 변동성
corr = np.array([[1.0, 0.6, 0.2],
                 [0.6, 1.0, 0.3],
                 [0.2, 0.3, 1.0]])
cov = np.outer(vols, vols) * corr

N = 200000
W = rng.random((N, 3))
W = W / W.sum(axis=1, keepdims=True)

rets = W @ mu
vs = np.sqrt(np.einsum("ij,jk,ik->i", W, cov, W))
sh = (rets - 0.03) / vs

i = sh.argmax()
j = vs.argmin()

print(f"최대 샤프  비중 {np.round(W[i], 4)}  수익 {rets[i]:.2%}  "
      f"변동성 {vs[i]:.2%}  샤프 {sh[i]:.4f}")
print(f"최소분산  비중 {np.round(W[j], 4)}  수익 {rets[j]:.2%}  "
      f"변동성 {vs[j]:.2%}")

eq = np.ones(3) / 3
print(f"균등비중  비중 {np.round(eq, 4)}  수익 {eq @ mu:.2%}  "
      f"변동성 {np.sqrt(eq @ cov @ eq):.2%}")
```

**실행 결과** (seed 42, 20만 회 기준)

```
최대 샤프  비중 [0.2807 0.1689 0.5504]  수익 8.91%  변동성 15.76%  샤프 0.3751
최소분산  비중 [0.0848 0.1145 0.8007]  수익 7.77%  변동성 14.16%
균등비중  비중 [0.3333 0.3333 0.3333]  수익 9.67%  변동성 18.42%
```

균등 비중은 수익률이 가장 높지만 변동성도 가장 높아 샤프지수는 0.362로 최대 샤프 포트폴리오(0.375)보다 낮다. **수익률만 보면 균등 비중이 이기지만, 위험 대비 효율에서는 진다.**

---

## 오늘의 테스트

### Q1. 포트폴리오 변동성을 구하는 올바른 코드는?

1. `np.sqrt(w @ cov)`
2. `w @ cov @ w`
3. `np.sqrt(w @ cov @ w)`
4. `np.sqrt(w * cov * w)`

<details>
<summary>정답 보기</summary>

**정답: 3번**

$w^T\Sigma w$는 **분산**이므로, 변동성(표준편차)을 얻으려면 제곱근을 취해야 한다. 2번은 분산까지만 구한 것이다.
</details>

### Q2. 일간 공분산 행렬을 연율화할 때 곱하는 값은?

1. `252`
2. `√252`
3. `1/252`
4. 곱할 필요 없음

<details>
<summary>정답 보기</summary>

**정답: 1번 — `252`**

공분산은 분산과 같은 차원이므로 시간에 **비례**한다. 표준편차(변동성)를 연율화할 때만 √252를 곱한다. 실수하기 쉬운 지점이다.
</details>

### Q3. `.argmax()`가 반환하는 것은?

1. 최댓값
2. 최댓값의 위치(인덱스)
3. 최댓값의 개수
4. 정렬된 배열

<details>
<summary>정답 보기</summary>

**정답: 2번**

값이 아니라 **위치**를 돌려준다. 그래서 `W[sharpe.argmax()]`처럼 그 위치의 비중을 꺼낼 수 있다.
</details>

### Q4. 효율적 투자선에 대한 설명 중 **옳지 않은** 것은?

1. 각 위험 수준에서 기대수익률이 가장 높은 포트폴리오들의 집합이다
2. 곡선 아래의 포트폴리오는 지배당하므로 선택할 이유가 없다
3. 곡선의 가장 왼쪽 끝은 최소분산 포트폴리오다
4. 효율적 투자선 위의 모든 점은 샤프지수가 같다

<details>
<summary>정답 보기</summary>

**정답: 4번**

효율적 투자선 위에서도 샤프지수는 점마다 다르다. 그중 샤프지수가 가장 높은 단 하나의 점이 **접점 포트폴리오(최대 샤프)** 이며, 무위험수익률에서 그은 직선이 곡선에 닿는 지점이다.
</details>

### Q5. 다음 중 "포트폴리오 A가 B를 지배한다"에 해당하는 경우는?

| | 수익률 | 변동성 |
|---|---|---|
| A | 10% | 15% |
| B | 8% | 15% |

1. A가 B를 지배한다
2. B가 A를 지배한다
3. 서로 지배 관계가 없다
4. 판단할 수 없다

<details>
<summary>정답 보기</summary>

**정답: 1번**

위험이 같은데 A의 수익이 더 높으므로 A가 B를 지배한다. B를 선택할 합리적 이유가 없다. 효율적 투자선은 이렇게 지배당하는 점들을 전부 걸러내고 남은 것이다.
</details>

### Q6. 빈칸을 채워 무작위 비중 생성 함수를 완성하시오.

```python
import numpy as np

def random_weights(n_assets, n_samples, seed=None):
    """합이 1이고 모두 0 이상인 무작위 비중 행렬을 만든다."""
    rng = np.random.default_rng(seed)
    W = rng.______((n_samples, n_assets))
    return W / W.sum(axis=____, keepdims=True)
```

<details>
<summary>정답 보기</summary>

```python
def random_weights(n_assets, n_samples, seed=None):
    """합이 1이고 모두 0 이상인 무작위 비중 행렬을 만든다."""
    rng = np.random.default_rng(seed)
    W = rng.random((n_samples, n_assets))
    return W / W.sum(axis=1, keepdims=True)
```

`axis=1`은 각 행(포트폴리오 하나)의 합을 구한다는 뜻이다. `keepdims=True`로 모양을 유지해야 나눗셈이 행 단위로 올바르게 적용된다.
</details>

## 다음 주 예고

7주차에서는 이번 주에 구한 최적 비중으로 **실제 모의투자를 집행**한다. 지금까지 매주 따로 만들었던 함수들을 **하나의 모듈로 정리**하고, **csv 파일 입출력**으로 거래 내역을 기록하며, **클래스(class)** 를 사용해 계좌를 표현한다.

이번 주에 저장한 `optimal_weights.csv`를 다음 주에 그대로 사용하므로 지우지 않는다. 다음 주에는 지금까지 만든 함수들을 하나의 패키지로 다시 정리하므로, 지금까지의 `week3.py` ~ `week6.py`도 함께 보관해두면 좋다.
