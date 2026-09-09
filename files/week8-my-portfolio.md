# 8주차 — 나만의 포트폴리오

> 문법 총정리 · 코드 리팩토링 → 자율적 포트폴리오 구성

마지막 시간이다. 새 개념을 배우는 대신 **지금까지 배운 것을 정리하고, 각자의 기준으로 포트폴리오를 직접 설계**한다. 지난 7주가 도구를 만드는 시간이었다면, 오늘은 그 도구로 자기 것을 만드는 시간이다.

---

## 0. 7주차 복습 노트

| 개념 | 핵심 |
|---|---|
| **모듈** | 다른 파일에서 불러 쓰는 `.py` 파일, `from quantkit.metrics import cagr` |
| **패키지** | 모듈을 담은 폴더, 안에 `__init__.py` |
| **`__name__`** | 직접 실행 시 `"__main__"`, import 시에는 모듈 이름 |
| **CSV 입출력** | `to_csv` / `read_csv`, 인코딩은 `utf-8-sig` |
| **`with open`** | 모드 `"r"` 읽기 / `"w"` 덮어쓰기 / `"a"` 이어쓰기 |
| **클래스** | `__init__`, `self`, 인스턴스는 서로 독립 |

지난주에 개설한 모의계좌(`account.json`, `transactions.csv`)를 오늘 발표에 사용한다.

---

## 1. 8주 전체 총정리

### 파이썬 문법 지도

| 주차 | 문법 | 대표 코드 |
|---|---|---|
| 1 | 변수, 자료형, print/input, f-string, 주석 | `f"{total:,.0f}원"` |
| 2 | 조건문, 반복문, 함수 | `def npv(rate, cashflows):` |
| 3 | 리스트, 딕셔너리, import | `[p for p in prices if p > 0]` |
| 4 | pandas 통계 메서드, numpy 배열 | `returns.std() * np.sqrt(252)` |
| 5 | 다중 자산 관리, matplotlib | `returns.corr()`, `ax.scatter(...)` |
| 6 | numpy 행렬 연산, 난수 | `np.sqrt(w @ cov @ w)` |
| 7 | 모듈화, 파일 입출력, 클래스 | `class Account:` |
| 8 | 리팩토링, 종합 설계 | — |

### 금융 개념 지도

| 주차 | 질문 | 개념 |
|---|---|---|
| 2 | 오늘의 1원과 미래의 1원은 왜 다른가 | 복리, 연속복리, NPV, IRR |
| 3 | 얼마나 벌었는가 | 단순수익률, 로그수익률 |
| 4 | 얼마나 위험했는가 | 변동성, CAGR, 샤프지수, MDD |
| 5 | 자산들은 서로 어떤 관계인가 | 공분산, 상관계수, 베타, CAPM |
| 6 | 비중을 어떻게 나눠야 하는가 | 효율적 투자선, 최대샤프, 최소분산 |
| 7 | 실제로 어떻게 집행하는가 | 모의계좌, 수수료, 리밸런싱 |

### 한 문장으로 잇기

> 미래의 돈은 현재보다 가치가 낮고(2주), 그 변화를 수익률로 재며(3주), 수익률만으로는 부족해 위험을 함께 보고(4주), 자산들이 서로 다르게 움직이므로 섞으면 위험이 줄고(5주), 그 최적 배합을 찾아(6주), 실제로 집행한다(7주).

---

## 2. 리팩토링 (Refactoring)

### 정의

**리팩토링이란 프로그램의 동작을 바꾸지 않으면서 내부 구조를 개선하는 작업이다.** 결과는 같지만 읽기 쉽고, 고치기 쉽고, 재사용하기 쉬운 코드로 만드는 것이 목적이다.

### 비유

리팩토링은 **이사가 아니라 정리정돈**이다. 살림살이(기능)는 그대로 두고 배치만 바꾼다. 겉으로 보기엔 달라진 게 없지만, 물건을 찾는 시간이 극적으로 줄어든다.

### 원칙 1 — 매직 넘버를 상수로

```python
# ❌ 252가 무엇인지 코드만 봐서는 알 수 없다
vol = returns.std() * np.sqrt(252)
sharpe = (returns.mean() * 252 - 0.03) / vol

# ⭕ 이름이 곧 설명이 된다
TRADING_DAYS = 252
RISK_FREE = 0.03

vol = returns.std() * np.sqrt(TRADING_DAYS)
sharpe = (returns.mean() * TRADING_DAYS - RISK_FREE) / vol
```

숫자가 코드 곳곳에 박혀 있으면 값을 바꿀 때 모든 곳을 찾아 고쳐야 하고, 하나라도 빠뜨리면 조용히 잘못된 결과가 나온다. `config.py`에 모아두는 이유다.

### 원칙 2 — 반복되는 코드는 함수로

```python
# ❌ 같은 계산이 세 번
samsung_vol = samsung_returns.std() * np.sqrt(252)
hynix_vol = hynix_returns.std() * np.sqrt(252)
kodex_vol = kodex_returns.std() * np.sqrt(252)

# ⭕ 한 번 정의하고 세 번 호출
def volatility(returns, periods=TRADING_DAYS):
    return returns.std() * np.sqrt(periods)
```

**같은 코드를 세 번 쓰게 되면 함수로 만들 때다.** 종목이 늘어나도 코드는 늘지 않는다.

### 원칙 3 — 함수는 한 가지 일만

```python
# ❌ 계산과 출력이 섞여 있어 재사용할 수 없다
def analyze(prices):
    cagr = ...
    vol = ...
    print(f"CAGR {cagr:.2%}")
    print(f"변동성 {vol:.2%}")

# ⭕ 계산은 값을 반환하고, 출력은 따로
def summarize(prices):
    return {"CAGR": ..., "변동성": ...}


def print_summary(prices):
    result = summarize(prices)
    print(f"CAGR {result['CAGR']:.2%}")
```

계산 함수가 값을 반환하면 그 결과를 그래프에 쓰거나 CSV에 저장할 수 있다. `print()`만 하는 함수는 그 자리에서 끝난다.

### 원칙 4 — 이름이 주석을 대신하게

```python
# ❌
d = p / p.cummax() - 1        # 전고점 대비 하락률
m = d.min()                    # 최대낙폭

# ⭕
drawdown = prices / prices.cummax() - 1
max_drawdown = drawdown.min()
```

좋은 이름을 붙이면 주석이 필요 없어진다. 주석은 코드가 설명하지 못하는 **왜**를 위해 아껴둔다.

### 원칙 5 — 하드코딩된 종목명 제거

```python
# ❌ 종목이 바뀌면 코드를 고쳐야 한다
total = df["삼성전자"] * 0.4 + df["SK하이닉스"] * 0.3 + df["KODEX200"] * 0.3

# ⭕ 종목 수와 무관하게 동작한다
weights = pd.Series({"삼성전자": 0.4, "SK하이닉스": 0.3, "KODEX200": 0.3})
total = (df * weights).sum(axis=1)
```

이 원칙을 지키면 **자기 종목으로 갈아끼우기만 하면 전체 코드가 그대로 돈다.** 오늘 각자 다른 포트폴리오를 만들 수 있는 이유다.

### 리팩토링 체크리스트

- [ ] 같은 코드가 세 번 이상 반복되지 않는가
- [ ] 의미를 알 수 없는 숫자가 코드에 박혀 있지 않은가
- [ ] 함수 하나가 여러 일을 하고 있지 않은가
- [ ] 변수 이름만 봐도 무엇인지 알 수 있는가
- [ ] 종목을 바꿀 때 코드 여러 곳을 고쳐야 하지 않는가
- [ ] 모든 함수에 한 줄 docstring이 있는가

---

## 3. 전략 카탈로그

포트폴리오를 짜는 방식에는 정답이 없다. 대표적인 접근을 정리했다. **각자 하나를 고르거나 조합해서 자기 포트폴리오를 설계한다.**

### 3-1. 균등비중 (1/N, Equal Weight)

모든 자산에 같은 비중을 준다. 가장 단순하지만 무시할 수 없는 전략이다.

```python
def equal_weights(returns):
    n = len(returns.columns)
    return pd.Series(np.ones(n) / n, index=returns.columns)
```

**장점**: 추정 오차가 없다. 미래 수익률을 예측할 필요가 없다.
**단점**: 자산의 위험 차이를 전혀 반영하지 않는다.

과거 수익률로 추정한 최적 포트폴리오가 실제로는 1/N을 이기지 못하는 경우가 자주 보고된다. **단순한 것이 강한 이유**를 생각해볼 만한 지점이다.

### 3-2. 최소분산 (Minimum Variance)

변동성이 가장 낮은 조합을 고른다. 6주차에서 구현했다.

**장점**: 기대수익률을 추정하지 않아도 된다. 공분산은 수익률보다 추정이 안정적이다.
**단점**: 변동성이 낮은 자산에 비중이 쏠린다.

### 3-3. 최대 샤프 (Maximum Sharpe / Tangency)

위험 대비 수익이 최고인 지점이다. 이론적으로 가장 매력적이다.

**단점**: 기대수익률 추정에 극도로 민감하다. 과거 수익률을 미래 예측치로 쓰는 가정에 무리가 있고, 소수 종목에 비중이 몰리는 경향이 있다. 실무에서 그대로 쓰이지 않는 이유다.

### 3-4. 위험균형 (Risk Parity)

금액이 아니라 **위험 기여도**를 균등하게 나눈다. 변동성이 큰 자산에는 적은 금액을, 작은 자산에는 많은 금액을 배분한다.

```python
# 간이 버전: 변동성의 역수에 비례해 배분 (Inverse Volatility)
def inverse_vol_weights(returns, periods=252):
    vols = returns.std() * np.sqrt(periods)
    inv = 1 / vols
    return inv / inv.sum()
```

이것은 상관관계를 무시한 근사치다. 정식 위험균형은 최적화가 필요하며, `riskfolio-lib`의 `rp_optimization()`으로 계산할 수 있다.

### 3-5. 모멘텀 (Momentum)

최근에 잘 오른 종목이 당분간 더 오르는 경향을 이용한다.

```python
def momentum_weights(prices, lookback=120, top_n=3):
    """최근 lookback 거래일 수익률 상위 top_n 종목에 균등 배분."""
    past_return = prices.iloc[-1] / prices.iloc[-lookback] - 1
    winners = past_return.nlargest(top_n).index
    w = pd.Series(0.0, index=prices.columns)
    w[winners] = 1 / top_n
    return w
```

**주의**: 리밸런싱 주기와 룩백 기간에 따라 결과가 크게 달라진다. 이 두 값을 계속 바꿔가며 최고 성적을 찾는 순간 **과최적화**에 빠진다.

### 3-6. 60/40 · 올웨더 (자산배분)

주식과 채권처럼 성격이 다른 자산군을 섞는다. 상관계수가 낮은 자산을 조합해 변동성을 낮추는 5주차 아이디어의 실전판이다.

| 전략 | 구성 예시 |
|---|---|
| 60/40 | 주식 ETF 60% + 채권 ETF 40% |
| 영구 포트폴리오 | 주식·채권·금·현금 각 25% |
| 올웨더 (간이) | 주식 30% + 장기채 40% + 중기채 15% + 금 7.5% + 원자재 7.5% |

국내 ETF로 구성해볼 수 있는 예시다.

| 자산군 | ETF | 코드 |
|---|---|---|
| 국내 주식 | KODEX 200 | `069500` |
| 미국 주식 | TIGER 미국S&P500 | `360750` |
| 국내 채권 | KODEX 국고채30년액티브 | `439870` |
| 금 | KODEX 골드선물(H) | `132030` |

> ETF 종목코드와 구성은 상장·폐지·명칭 변경으로 달라질 수 있다. `fdr.StockListing("ETF/KR")`로 현재 목록을 직접 확인하는 편이 안전하다.

### 3-7. 전략 비교 표

| 전략 | 기대수익률 추정 필요 | 구현 난이도 | 특징 |
|---|---|---|---|
| 균등비중 | 불필요 | 매우 쉬움 | 견고하지만 위험 무시 |
| 최소분산 | 불필요 | 쉬움 | 안정적, 저변동 자산 쏠림 |
| 최대샤프 | **필요** | 쉬움 | 이론적 최적, 추정에 민감 |
| 위험균형 | 불필요 | 보통 | 위험 기여도 균등 |
| 모멘텀 | 간접적 | 보통 | 추세 추종, 과최적화 위험 |
| 자산배분 | 불필요 | 쉬움 | 자산군 분산, 장기 지향 |

---

## 4. 참고할 만한 코드와 자료

직접 구현해본 다음 단계는 **잘 만들어진 도구를 쓰는 것**이다. 우리가 7주간 손으로 짠 계산들은 대부분 이미 라이브러리에 들어 있다. 원리를 알고 나서 쓰는 것과 모르고 쓰는 것은 전혀 다르다.

### 4-1. 포트폴리오 최적화

**PyPortfolioOpt**

고전적 평균-분산 최적화, 블랙-리터만 배분, 축소추정(shrinkage), 계층적 위험 균형(HRP) 등의 포트폴리오 최적화 기법을 구현한 라이브러리다. scikit-learn에서 영감을 받아 설계되어 확장하기 쉽고, 가벼운 투자자부터 빠른 프로토타이핑이 필요한 전문가까지 쓸 수 있다. 기대수익률 추정(CAPM, 과거 수익률 기반), 위험 모형(표본 공분산, 세미공분산, Ledoit-Wolf 축소추정), 그리고 `EfficientFrontier` 클래스를 통한 최대 샤프·최소 변동성 목적함수를 제공한다.

```bash
pip install PyPortfolioOpt
```

```python
from pypfopt import EfficientFrontier, risk_models, expected_returns

mu = expected_returns.mean_historical_return(prices)
S = risk_models.sample_cov(prices)

ef = EfficientFrontier(mu, S)
weights = ef.max_sharpe()
print(ef.clean_weights())
ef.portfolio_performance(verbose=True)
```

우리가 6주차에 몬테카를로로 근사했던 최대 샤프 포트폴리오를 정확한 최적화로 구해준다. **두 결과를 비교해보면 시뮬레이션의 한계를 실감할 수 있다.**

- GitHub: `https://github.com/robertmartin8/PyPortfolioOpt`
- PyPI: `https://pypi.org/project/pyportfolioopt/`

**Riskfolio-Lib**

CVXPY 위에 만들어졌고 pandas와 긴밀히 통합되어 있다. 최소 위험·최대 수익·최대 효용·최대 위험조정수익률의 네 가지 목적함수와 26가지 볼록 위험척도를 지원한다. 분산 기반 모형에 집중하는 다른 라이브러리와 달리, 조건부 위험가치(CVaR), 엔트로피 위험가치(EVaR), 조건부 낙폭위험(CDaR) 등 여러 위험척도로 포트폴리오를 구성할 수 있다.

우리가 4주차에 배운 MDD를 **위험척도 자체로 삼아 최적화**할 수 있다는 뜻이다. 위험균형 포트폴리오는 `port.rp_optimization()` 함수로 계산할 수 있다.

```bash
pip install riskfolio-lib
```

- GitHub: `https://github.com/dcajasn/Riskfolio-Lib`
- 문서: `https://riskfolio-lib.readthedocs.io/`

### 4-2. 데이터 수집

**FinanceDataReader** — 3주차부터 계속 써온 라이브러리다. 거래소별 종목 목록(ETF/KR, NASDAQ, NYSE, AMEX, S&P 500), 국내외 주식 가격, 환율, 암호화폐 가격을 제공한다. 국내장에 대해서는 Yahoo Finance보다 이쪽이 낫다고 알려져 있다.

```python
import FinanceDataReader as fdr

etf = fdr.StockListing("ETF/KR")     # 국내 ETF 목록
sp500 = fdr.StockListing("S&P500")   # S&P 500 구성 종목
nasdaq = fdr.StockListing("NASDAQ")  # 나스닥 상장 종목
```

`StockListing()`으로 전체 목록을 받아 종목을 스크리닝하는 것이 자기 포트폴리오를 만드는 첫걸음이다. 국내 ETF로 자산배분을 짤 것이므로 `"ETF/KR"`이 가장 쓸모 있다.

```python
etf = fdr.StockListing("ETF/KR")

# 이름으로 걸러 원하는 자산군을 찾는다
print(etf[etf["Name"].str.contains("국고채")][["Symbol", "Name"]].head())
print(etf[etf["Name"].str.contains("골드")][["Symbol", "Name"]].head())
```

**함께 알아둘 만한 것**

| 라이브러리 | 용도 |
|---|---|
| `pykrx` | 한국거래소 데이터 (시가총액, PER/PBR, 공매도 등) |
| `yfinance` | 해외 주식 + 재무제표, 배당 |
| `OpenDartReader` | 금융감독원 전자공시(DART) — 재무제표 원본 |
| `marcap` | 국내 시가총액 데이터셋 |

yfinance는 주가 외에 재무제표·주주 정보 등 다양한 데이터를 제공하고, FinanceDataReader는 한국거래소에서 직접 데이터를 가져와 국내 주식의 정확성이 높다. 두 라이브러리를 함께 쓰면 서로를 보완할 수 있다.

### 4-3. 백테스트

우리가 7주차에 만든 `backtest()` 함수는 "사서 들고 있기"만 계산한다. 매매 규칙이 있는 전략을 검증하려면 전용 라이브러리가 필요하다.

| 라이브러리 | 성격 |
|---|---|
| `backtesting.py` | 가장 가볍다. 처음 써보기에 적합 |
| `backtrader` | 예제와 자료가 가장 많다 |
| `vectorbt` | 벡터화로 매우 빠르다. 파라미터 대량 탐색용 |

성숙한 생태계와 풍부한 예제, 이벤트 기반 코드 스타일을 원하면 backtrader가, 빠른 파라미터 탐색과 시각적 포트폴리오 분석, 주피터 친화적 워크플로를 원하면 VectorBT가 적합하다. VectorBT는 NumPy·pandas·Numba를 기반으로 완전 벡터화된 백테스트를 수행해 파이썬 반복문 없이 빠르게 돌아간다.

**스터디 수준에서는 `backtesting.py`를 권한다.** 설치가 간단하고 코드가 짧다.

```bash
pip install backtesting
```

### 4-4. 한국어 학습 자료

**파이썬을 이용한 퀀트 투자 포트폴리오 만들기 (이현열)** — 데이터 수집부터 종목 선정, 포트폴리오 구성, 증권사 API 자동매매까지 다룬다. 책의 코드는 깃허브에 공개되어 있으며 질문도 남길 수 있다. 14장에서는 riskfolio-lib으로 최대샤프지수·최소분산·위험균형 포트폴리오를 구현한다.

- GitHub: `https://github.com/hyunyulhenry/quant_py`

**퀀트 투자 쿡북 (wikidocs)** — FinanceDataReader, PyKrx, marcap의 데이터 특성을 비교하는 등 실무적인 세부 사항을 다룬다. 수정주가와 비수정주가의 차이처럼 우리가 3주차에 잠깐 언급했던 주제를 깊게 볼 수 있다.

- `https://wikidocs.net/book/11302`

**pandas / numpy 공식 문서** — 결국 가장 정확한 자료다. `pandas` 공식 사이트의 "10 minutes to pandas"는 한 번 정독할 가치가 있다.

### 4-5. 라이브러리를 쓸 때의 태도

라이브러리는 계산을 대신해줄 뿐 **판단을 대신해주지 않는다.** `ef.max_sharpe()` 한 줄로 나온 비중이 왜 그렇게 나왔는지 설명할 수 없다면, 그 포트폴리오는 자기 것이 아니다.

우리가 7주 동안 손으로 짠 이유가 여기에 있다. 이제 라이브러리가 내놓은 숫자가 이상할 때 **"이상하다"고 알아챌 수 있다.**

---

## 5. 흔한 함정

자기 포트폴리오를 설계할 때 반드시 피해야 할 것들이다. 발표에서도 이 부분을 점검한다.

### 5-1. 과최적화 (Overfitting)

파라미터를 계속 바꿔가며 과거 성적이 가장 좋은 조합을 찾는 행위다. 그렇게 찾은 값은 **과거의 우연에 맞춰진 것**이지 미래에 통하는 규칙이 아니다.

```python
# ❌ 이런 짓을 하고 있다면 과최적화 중이다
for lookback in range(20, 250, 5):
    for top_n in range(1, 10):
        # ... 46 × 9 = 414개 조합 중 최고 성적을 고른다
```

414개를 시도하면 그중 하나는 운으로도 좋은 성적이 나온다.

**대응**: 기간을 둘로 나눠, 앞 기간에서 정한 규칙을 뒤 기간에서 검증한다(out-of-sample 검증). 파라미터는 최소한으로 유지한다.

### 5-2. 룩어헤드 바이어스 (Look-ahead Bias)

의사결정 시점에 알 수 없었던 정보를 사용하는 오류다.

```python
# ❌ 오늘 종가를 알아야 계산되는 값으로 오늘 매수 결정을 내린다
signal = prices > prices.rolling(20).mean()
position = signal            # 같은 날에 바로 매수

# ⭕ 신호는 어제까지의 정보로, 매매는 오늘
position = signal.shift(1)
```

`.shift(1)` 하나가 빠져서 백테스트 성적이 비현실적으로 좋아지는 일이 흔하다.

### 5-3. 생존 편향 (Survivorship Bias)

현재 상장된 종목만으로 과거를 검증하면, **상장폐지된 종목이 통째로 빠진다.** 망한 회사를 제외하고 계산한 수익률은 당연히 높다.

**대응**: 완전히 피하기는 어렵다. 최소한 "내 검증에는 생존 편향이 있다"는 것을 인지하고 성적을 할인해서 해석한다.

### 5-4. 거래비용 무시

7주차 `Account` 클래스에 수수료와 세금을 넣은 이유다. 리밸런싱을 자주 할수록 비용이 성과를 갉아먹는다.

```
매수 0.015% + 매도 0.015% + 세금 0.15% ≈ 왕복 0.18%
월 1회 리밸런싱 시 연 약 2.2%의 비용
```

연 2%는 결코 작은 숫자가 아니다. **"리밸런싱을 자주 하면 좋다"는 직관은 대체로 틀렸다.**

### 5-5. 짧은 기간으로 판단하기

4주간의 수익률로는 실력과 운을 구분할 수 없다. 오늘 발표에서 **수익률 순위는 평가 기준이 아니다.**

---

## 오늘의 코드 — 나만의 전략 템플릿

`my_strategy.py`로 저장한다. **`build_weights()` 함수 하나만 자기 방식으로 바꾸면** 나머지는 그대로 동작한다.

```python
"""
나만의 포트폴리오 — 전략 템플릿

바꿀 곳은 두 군데뿐이다.
  1) MY_TICKERS : 투자할 종목
  2) build_weights() : 비중을 정하는 규칙

실행:  python my_strategy.py
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from quantkit import data, metrics, portfolio
from quantkit.config import TRADING_DAYS, RISK_FREE

plt.rcParams["font.family"] = "Malgun Gothic"     # Windows
# plt.rcParams["font.family"] = "AppleGothic"     # macOS
# plt.rcParams["font.family"] = "NanumGothic"     # Linux
plt.rcParams["axes.unicode_minus"] = False


# ══════════════════════════════════════════════════════
# ① 여기를 바꾼다 — 투자할 종목
# ══════════════════════════════════════════════════════

# 아래는 3~7주차에 쓴 스터디 공통 종목에서 삼성전자를 뺀 것이다.
# 여기를 자기가 고른 종목으로 바꾸는 것이 이번 주 과제의 절반이다.
MY_TICKERS = {
    "KODEX200": "069500",
    "미국S&P500": "360750",
    "국고채30년": "439870",
    "금": "132030",
}

# quantkit.config 의 START_DATE 를 쓰지 않고 여기서 따로 잡는다.
# 자기 종목의 상장일에 맞춰 바꿔야 하기 때문이다.
MY_START = "2022-09-01"
SPLIT_RATIO = 0.7          # 앞 70%로 규칙을 정하고, 뒤 30%로 검증


# ══════════════════════════════════════════════════════
# ② 여기를 바꾼다 — 비중을 정하는 규칙
# ══════════════════════════════════════════════════════

def build_weights(returns):
    """
    수익률 DataFrame을 받아 비중 Series를 반환한다.

    아래 중 하나를 고르거나, 직접 규칙을 작성한다.
    반드시 지켜야 할 것: 비중의 합은 1, 모두 0 이상.
    """

    # --- 선택지 A: 균등비중 -------------------------------
    # return portfolio.equal_weights(returns)

    # --- 선택지 B: 최소분산 -------------------------------
    # return portfolio.min_variance_weights(returns)

    # --- 선택지 C: 최대샤프 -------------------------------
    # return portfolio.max_sharpe_weights(returns)

    # --- 선택지 D: 변동성 역수 배분 (간이 위험균형) --------
    vols = returns.std() * np.sqrt(TRADING_DAYS)
    inv = 1 / vols
    return inv / inv.sum()

    # --- 선택지 E: 직접 지정 ------------------------------
    # return pd.Series({
    #     "KODEX200":   0.30,
    #     "미국S&P500": 0.30,
    #     "국고채30년": 0.30,
    #     "금":         0.10,
    # })


STRATEGY_NAME = "변동성 역수 배분"      # 발표용 전략 이름


# ══════════════════════════════════════════════════════
# 아래는 바꾸지 않아도 된다
# ══════════════════════════════════════════════════════

def split_periods(prices, ratio=SPLIT_RATIO):
    """데이터를 학습 구간과 검증 구간으로 나눈다."""
    cut = int(len(prices) * ratio)
    return prices.iloc[:cut], prices.iloc[cut:]


def evaluate(curve, label):
    """자산가치 곡선의 성과 지표를 딕셔너리로 반환한다."""
    returns = curve.pct_change().dropna()
    return {
        "구간": label,
        "수익률": metrics.total_return(curve),
        "CAGR": metrics.cagr(curve),
        "변동성": metrics.volatility(returns),
        "샤프": metrics.sharpe_ratio(returns),
        "MDD": metrics.max_drawdown(curve),
    }


def print_row(r):
    print(f"{r['구간']:<12}{r['수익률']:>12.2%}{r['CAGR']:>10.2%}"
          f"{r['변동성']:>10.2%}{r['샤프']:>8.2f}{r['MDD']:>10.2%}")


def main():
    # ── 1) 데이터 ──────────────────────────────────────
    print("데이터 수집 중...")
    prices = data.download_prices(MY_TICKERS, start=MY_START)
    train, test = split_periods(prices)

    print(f"\n전체 {len(prices)}일 "
          f"(학습 {len(train)}일 / 검증 {len(test)}일)")

    # ── 2) 학습 구간에서만 비중 결정 ───────────────────
    #     검증 구간 데이터를 쓰면 룩어헤드 바이어스가 된다
    train_returns = metrics.to_returns(train)
    weights = build_weights(train_returns)
    weights = weights.reindex(prices.columns).fillna(0)
    portfolio.validate_weights(weights.values)

    print()
    print("=" * 62)
    print(f"전략: {STRATEGY_NAME}")
    print("=" * 62)
    for name, w in weights.items():
        bar = "█" * int(w * 40)
        print(f"  {name:<14}{w:>7.2%}  {bar}")

    # ── 3) 개별 자산 성과 ──────────────────────────────
    print()
    print("=" * 62)
    print("개별 자산 (전체 기간)")
    print("=" * 62)
    metrics.print_summary(prices)

    print()
    print("상관계수 행렬")
    print(metrics.to_returns(prices).corr().round(3))

    # ── 4) 학습 vs 검증 성과 ───────────────────────────
    curve_train = portfolio.backtest(train, weights)
    curve_test = portfolio.backtest(test, weights)
    curve_all = portfolio.backtest(prices, weights)
    curve_equal = portfolio.backtest(prices, portfolio.equal_weights(prices))

    print()
    print("=" * 62)
    print("성과 비교")
    print("=" * 62)
    print(f"{'구간':<12}{'수익률':>12}{'CAGR':>10}"
          f"{'변동성':>10}{'샤프':>8}{'MDD':>10}")
    print("-" * 62)
    print_row(evaluate(curve_train, "학습구간"))
    print_row(evaluate(curve_test, "검증구간"))
    print_row(evaluate(curve_all, "전체기간"))
    print_row(evaluate(curve_equal, "균등비중"))
    print("=" * 62)

    train_sharpe = evaluate(curve_train, "")["샤프"]
    test_sharpe = evaluate(curve_test, "")["샤프"]

    print()
    if test_sharpe < train_sharpe * 0.5:
        print("⚠️  검증구간 샤프가 학습구간의 절반 미만이다.")
        print("    과최적화를 의심해볼 것.")
    else:
        print("✓  학습구간과 검증구간의 성과가 크게 어긋나지 않는다.")

    # ── 5) 그래프 ──────────────────────────────────────
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8),
                                   gridspec_kw={"height_ratios": [2, 1]},
                                   sharex=True)

    ax1.plot(curve_all.index, curve_all, label=STRATEGY_NAME, linewidth=2)
    ax1.plot(curve_equal.index, curve_equal, label="균등비중",
             linewidth=1.2, alpha=0.7)
    ax1.axvline(test.index[0], color="gray", linestyle="--", alpha=0.6)
    ax1.text(test.index[0], curve_all.max(), " 검증구간 시작",
             va="top", fontsize=9, color="gray")
    ax1.set_ylabel("자산가치 (시작=1)")
    ax1.set_title(f"{STRATEGY_NAME} — 누적 성과")
    ax1.legend()
    ax1.grid(alpha=0.3)

    dd = metrics.drawdown_series(curve_all)
    ax2.fill_between(dd.index, dd, 0, alpha=0.35, color="crimson")
    ax2.set_ylabel("낙폭")
    ax2.set_xlabel("날짜")
    ax2.grid(alpha=0.3)

    plt.tight_layout()
    plt.savefig("my_strategy.png", dpi=120)
    print("\n그래프를 my_strategy.png로 저장했다.")
    plt.show()

    # ── 6) 비중 저장 ───────────────────────────────────
    portfolio.save_weights(weights, "my_weights.csv")


if __name__ == "__main__":
    main()
```

### 이 템플릿의 설계 의도

**학습 구간과 검증 구간을 나눈 것**이 핵심이다. `build_weights()`는 `train`만 보고 비중을 정하고, 그 비중을 한 번도 보지 않은 `test` 구간에 적용해 성과를 잰다. 5-1과 5-2에서 말한 과최적화와 룩어헤드를 구조적으로 막는 장치다.

검증구간 성적이 학습구간보다 크게 나쁘면 그 전략은 **과거에만 맞춰진 것**이다. 이 사실을 발견하는 것이 좋은 성적표보다 훨씬 값진 결과다.

---

## 최종 과제

### 제출물

1. **`my_strategy.py`** — 자기 종목과 규칙으로 수정한 코드
2. **`my_strategy.png`** — 성과 그래프
3. **발표 자료** — 5분 분량 (슬라이드 또는 코드 시연)

### 발표에 반드시 포함할 내용

| 항목 | 질문 |
|---|---|
| **종목 선택** | 왜 이 자산들을 골랐는가? 상관계수는 어땠는가? |
| **비중 규칙** | 왜 이 방식으로 비중을 정했는가? |
| **성과** | 학습구간과 검증구간의 차이는? 균등비중과 비교하면? |
| **한계** | 이 전략이 실패할 수 있는 상황은 무엇인가? |
| **배운 점** | 처음 예상과 실제가 달랐던 지점은? |

### 평가 기준

**수익률은 평가하지 않는다.** 4주는 운을 걸러내기에 너무 짧다. 대신 다음을 본다.

- 자기 선택을 근거를 들어 설명할 수 있는가
- 자기 전략의 한계를 스스로 짚어냈는가
- 코드가 읽을 수 있게 정리되어 있는가
- 학습/검증 구분을 지켰는가

### 제출 전 체크리스트

- [ ] 비중의 합이 정확히 1인가 (`validate_weights` 통과)
- [ ] `build_weights()`에서 검증구간 데이터를 쓰지 않았는가
- [ ] 균등비중과 비교했는가
- [ ] 매직 넘버가 `config.py`나 상수로 빠져 있는가
- [ ] 함수마다 한 줄 docstring이 있는가
- [ ] 지난주 모의계좌의 매매 기록을 첨부했는가

---

## 오늘의 테스트

### Q1. 리팩토링의 정의로 옳은 것은?

1. 프로그램에 새 기능을 추가하는 작업
2. 동작을 바꾸지 않으면서 내부 구조를 개선하는 작업
3. 버그를 찾아 수정하는 작업
4. 코드를 더 짧게 압축하는 작업

<details>
<summary>정답 보기</summary>

**정답: 2번**

리팩토링 전후로 결과는 같아야 한다. 결과가 달라졌다면 그것은 리팩토링이 아니라 기능 변경이거나 버그다.
</details>

### Q2. 다음 코드의 문제점은?

```python
vol = returns.std() * np.sqrt(252)
annual = returns.mean() * 252
sharpe = (annual - 0.03) / vol
```

1. 계산식이 틀렸다
2. `252`와 `0.03`이 매직 넘버로 박혀 있다
3. 변수 이름이 너무 길다
4. 문제없다

<details>
<summary>정답 보기</summary>

**정답: 2번**

계산 자체는 맞다. 다만 무위험수익률을 3%에서 3.5%로 바꾸려면 코드를 뒤져야 하고, `252`가 여러 곳에 흩어져 있으면 하나를 빠뜨리기 쉽다. 상수로 빼야 한다.
</details>

### Q3. 룩어헤드 바이어스를 막기 위해 필요한 코드는?

```python
signal = prices > prices.rolling(20).mean()
position = signal
```

1. `signal.shift(1)`
2. `signal.dropna()`
3. `signal.cumsum()`
4. `signal * 2`

<details>
<summary>정답 보기</summary>

**정답: 1번 — `position = signal.shift(1)`**

오늘 종가로 계산한 신호로 오늘 매수할 수는 없다. 신호를 하루 밀어서 "어제까지의 정보로 오늘 매매"하게 만들어야 한다.
</details>

### Q4. 다음 중 **기대수익률 추정이 필요 없는** 전략을 모두 고르시오.

1. 균등비중
2. 최소분산
3. 최대샤프
4. 위험균형

<details>
<summary>정답 보기</summary>

**정답: 1번, 2번, 4번**

최대샤프만 기대수익률 벡터가 필요하다. 기대수익률은 공분산보다 추정이 훨씬 어렵기 때문에, 실무에서 최대샤프가 그대로 쓰이지 않는 주된 이유가 된다.
</details>

### Q5. 생존 편향(survivorship bias)에 해당하는 상황은?

1. 수수료를 계산에 넣지 않았다
2. 현재 상장된 종목만으로 10년치 백테스트를 했다
3. 오늘 종가로 오늘 매수했다
4. 파라미터를 400개 조합 시도했다

<details>
<summary>정답 보기</summary>

**정답: 2번**

그 10년 사이 상장폐지된 종목이 표본에서 통째로 빠졌으므로 성적이 과대평가된다. (1번은 거래비용 무시, 3번은 룩어헤드, 4번은 과최적화다.)
</details>

### Q6. 왕복 거래비용이 0.18%일 때, 월 1회 리밸런싱의 연간 비용은 대략 얼마인가?

1. 약 0.18%
2. 약 1.0%
3. 약 2.2%
4. 약 5.0%

<details>
<summary>정답 보기</summary>

**정답: 3번 — 약 2.2%**

`0.18% × 12 ≈ 2.16%`다. 리밸런싱 빈도를 늘리면 이 비용이 그대로 성과에서 차감된다.
</details>

### Q7. 다음 코드를 종목 수와 무관하게 동작하도록 고치시오.

```python
total = df["삼성전자"] * 0.4 + df["SK하이닉스"] * 0.3 + df["KODEX200"] * 0.3
```

<details>
<summary>정답 보기</summary>

```python
weights = pd.Series({"삼성전자": 0.4, "SK하이닉스": 0.3, "KODEX200": 0.3})
total = (df * weights).sum(axis=1)
```

이렇게 두면 종목이 3개든 30개든 이 줄은 바뀌지 않는다. `axis=1`은 가로 방향(행 단위) 합계다.
</details>

### Q8. `my_strategy.py`에서 `build_weights()`에 `train_returns`만 넘기는 이유는?

1. 계산 속도를 높이기 위해
2. 검증구간 데이터로 비중을 정하면 룩어헤드 바이어스가 되기 때문
3. 데이터 용량을 줄이기 위해
4. `test`에는 결측치가 많기 때문

<details>
<summary>정답 보기</summary>

**정답: 2번**

검증구간을 보고 비중을 정한 뒤 그 구간에서 성과를 재면, 답을 보고 시험을 치는 것과 같다. 검증의 의미가 사라진다.
</details>

### Q9. (심화) 검증구간 샤프지수가 학습구간의 1/5로 떨어졌다. 가장 합리적인 해석은?

<details>
<summary>정답 보기</summary>

**학습구간의 성과가 과거 데이터에 과도하게 맞춰졌을(과최적화) 가능성이 높다.**

대응 방향은 다음과 같다.

- 파라미터 개수를 줄인다 (룩백 기간, 종목 수 등)
- 기대수익률 추정에 의존하는 전략에서 의존하지 않는 전략(균등비중, 최소분산)으로 옮긴다
- 분할 지점을 바꿔가며 결과가 안정적인지 확인한다

다만 검증구간이 특수한 시장 국면(급락장 등)이었을 수도 있으므로, 구간을 여러 개로 나눠 반복 확인하는 것이 좋다. **한 번의 검증 결과로 단정하지 않는 태도**가 중요하다.
</details>

---

## 마무리

8주 전 첫 시간에 우리는 `print("안녕하세요")`부터 시작했다. 지금은 실제 시장 데이터를 받아 위험을 측정하고, 자산 간 관계를 분석하고, 최적 비중을 계산해 모의계좌로 집행하는 코드를 갖고 있다.

여기서 배운 것 중 가장 오래 남을 것은 아마 특정 공식이 아니라 다음 두 가지일 것이다.

**첫째, 숫자를 만들어내는 것보다 그 숫자를 의심하는 일이 어렵다.** 샤프지수 2.0이 나왔을 때 기뻐하기 전에 룩어헤드는 없었는지, 표본이 너무 짧지는 않은지 묻는 습관이 실력이다.

**둘째, 좋은 코드는 다시 쓸 수 있는 코드다.** `quantkit`은 오늘로 끝나지 않는다. 다른 데이터, 다른 전략, 다른 프로젝트에 그대로 가져다 쓸 수 있다.

### 여기서 더 나아가려면

| 방향 | 다음 단계 |
|---|---|
| 최적화 심화 | PyPortfolioOpt, Riskfolio-Lib으로 블랙-리터만·HRP |
| 백테스트 심화 | `backtesting.py` → `backtrader` → `vectorbt` |
| 데이터 확장 | OpenDartReader로 재무제표, pykrx로 시가총액·PBR |
| 팩터 투자 | 밸류·모멘텀·퀄리티·저변동성 팩터 조합 |
| 자동화 | 증권사 API 연동, 정기 실행 스케줄링 |

8주간 수고 많으셨습니다.
