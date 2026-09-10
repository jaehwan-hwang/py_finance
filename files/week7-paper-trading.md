# 7주차 — 모의계좌로 포트폴리오 집행하기

> 함수 모듈화 · csv 파일 입출력 · 클래스(class) 맛보기 → 완성된 퀀트 투자 코드

지난 6주 동안 매주 새 파일을 만들어 계산했다. 그 결과 같은 함수가 `week4.py`, `week5.py`, `week6.py`에 중복해서 들어 있다. 이번 주에는 흩어진 코드를 **하나의 도구 상자로 정리**하고, 그 도구로 실제 모의투자를 집행한다.

이번 주가 끝나면 여러분은 **매주 반복해서 돌릴 수 있는 자기만의 퀀트 투자 코드**를 갖게 된다.

---

## 0. 6주차 복습 노트

### 파이썬 문법

| 개념 | 핵심 |
|---|---|
| **numpy 행렬 연산** | `@`는 행렬 곱, `w @ cov @ w`가 포트폴리오 분산 |
| **난수 생성** | `rng = np.random.default_rng(42)` 로 생성기를 만들고 `rng.random()` |
| **정규화** | `W / W.sum(axis=1, keepdims=True)` — 비중 합을 1로 |
| **argmax / argmin** | 최댓값·최솟값이 있는 **위치(인덱스)** 를 반환 |

### 금융 개념

| 개념 | 정의 |
|---|---|
| 포트폴리오 기대수익률 | $\mu_p = \mathbf{w}^\top \boldsymbol{\mu}$ |
| 포트폴리오 변동성 | $\sigma_p = \sqrt{\mathbf{w}^\top \Sigma \mathbf{w}}$ |
| 몬테카를로 시뮬레이션 | 무작위 비중을 대량 생성해 가능한 조합의 분포를 탐색 |
| 효율적 투자선 | 같은 위험에서 가장 높은 수익률을 주는 포트폴리오들의 경계 |
| 최대 샤프 / 최소분산 | 위험 대비 수익이 최고인 점 / 위험이 최저인 점 |

### 이번 주 준비

가상환경을 활성화하고, 프로젝트 폴더에 아래 두 파일이 있는지 확인한다.

- `prices.csv` — 3주차에 저장한 종가 데이터
- `optimal_weights.csv` — 6주차에 저장한 최적 비중

**둘 다 없어도 된다.** `run_optimize.py`가 `prices.csv`가 없으면 새로 받고 `optimal_weights.csv`도 다시 만든다. 이미 있으면 그대로 재사용하므로 매주 같은 데이터를 다시 내려받지 않는다.

---

## 1. 함수 모듈화 (Module)

### 정의

**모듈이란 함수·변수·클래스를 담아 다른 파일에서 불러 쓸 수 있게 만든 `.py` 파일이다.** 여러 모듈을 폴더로 묶은 것을 **패키지(package)** 라고 한다.

### 비유

지금까지의 코드는 **작업할 때마다 공구를 새로 만들어 쓰고 버린 것**과 같다. 모듈화는 만든 공구를 **공구함에 정리해 넣는 일**이다. 다음에 필요할 때 꺼내 쓰면 되고, 공구가 고장 나면 공구함 안의 그것 하나만 고치면 모든 작업에 반영된다.

### 우리가 이미 쓰고 있었다

```python
import numpy as np
import pandas as pd
```

`numpy`와 `pandas`도 남이 만든 모듈이다. 이제 내가 만든 파일을 같은 방식으로 불러온다.

### 가장 간단한 예

`mytools.py` 파일을 만들고 함수를 넣는다.

```python
# mytools.py

def greet(name):
    return f"안녕하세요, {name}님"
```

같은 폴더의 다른 파일에서 불러 쓴다.

```python
# main.py

import mytools

print(mytools.greet("황재환"))

# 또는
from mytools import greet
print(greet("황재환"))
```

**핵심 규칙**: `import`할 파일은 같은 폴더에 있거나, 패키지 폴더 안에 있어야 한다.

### 패키지로 묶기

파일이 여러 개가 되면 폴더로 묶는다. 폴더 안에 `__init__.py`라는 빈 파일을 하나 만들면 파이썬이 그 폴더를 패키지로 인식한다.

```
pyfinance-study/
├─ quantkit/
│  ├─ __init__.py       ← 빈 파일이어도 됨
│  ├─ metrics.py
│  └─ portfolio.py
└─ main.py
```

```python
# main.py
from quantkit.metrics import cagr, sharpe_ratio
from quantkit.portfolio import portfolio_return
```

### `if __name__ == "__main__":`

모듈 파일에는 함수 정의만 있는 것이 아니라 테스트용 코드가 섞이기 쉽다. 그런데 `import`만 해도 파일 전체가 한 번 실행되므로, 테스트 코드까지 함께 실행되어 버린다.

```python
# metrics.py
def cagr(prices):
    ...

print("테스트 실행")     # ← import만 해도 출력된다
```

이를 막는 관용구가 `if __name__ == "__main__":`이다.

```python
# metrics.py
def cagr(prices):
    ...


if __name__ == "__main__":
    # 이 파일을 직접 실행했을 때만 동작한다.
    # 다른 파일에서 import할 때는 실행되지 않는다.
    print("테스트 실행")
```

`__name__`은 파이썬이 자동으로 채워주는 변수로, **직접 실행한 파일에서는 `"__main__"`, import된 파일에서는 그 모듈 이름**이 들어간다.

### 모듈화의 이점

1. **중복 제거** — `sharpe_ratio()`를 한 곳에만 두면 된다.
2. **수정 지점의 단일화** — 계산식이 바뀌면 한 파일만 고친다.
3. **가독성** — 실행 스크립트가 짧아져 흐름이 한눈에 보인다.
4. **재사용** — 다음 프로젝트에 폴더째 복사해 쓸 수 있다.

---

## 2. csv 파일 입출력

### 정의

**CSV(Comma-Separated Values)란 값을 쉼표로 구분해 표 형태의 데이터를 저장하는 텍스트 파일 형식이다.** 프로그램 종류를 가리지 않고 읽을 수 있어 데이터 교환의 사실상 표준으로 쓰인다.

### 비유

CSV는 **가장 단순한 형태의 엑셀 파일**이다. 서식도 수식도 없이 값만 쉼표로 나열한다. 특별한 프로그램 없이 메모장으로도 열어볼 수 있다는 것이 최대 장점이다.

```csv
date,name,price,quantity
2026-11-04,삼성전자,71000,10
2026-11-04,SK하이닉스,185000,3
```

### 프로그램이 기억을 갖게 하는 일

지금까지 만든 프로그램은 실행이 끝나면 모든 변수가 사라졌다. 매주 모의투자를 이어가려면 **지난주 잔고와 보유 종목을 어딘가에 적어둬야 한다.** 파일 입출력은 프로그램에 기억을 부여하는 작업이다.

### pandas로 읽고 쓰기 (권장)

표 형태 데이터는 pandas가 가장 편하다.

```python
import pandas as pd

# 저장
prices.to_csv("prices.csv")
prices.to_csv("prices.csv", encoding="utf-8-sig")   # 한글 깨짐 방지

# 불러오기
prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)
```

| 옵션 | 의미 |
|---|---|
| `index_col=0` | 첫 열을 인덱스로 사용 |
| `parse_dates=True` | 인덱스를 날짜형으로 변환 |
| `encoding="utf-8-sig"` | 엑셀에서 한글이 깨지지 않게 저장 |
| `index=False` | 인덱스를 저장하지 않음 |

`utf-8-sig`를 쓰지 않으면 저장한 CSV를 윈도우 엑셀에서 열었을 때 한글이 깨진다. 실습에서 자주 만나는 문제다.

### 표준 라이브러리 csv 모듈

행 단위로 한 줄씩 기록할 때는 표준 `csv` 모듈이 가볍다. 거래 내역을 한 건씩 덧붙이는 용도에 적합하다.

```python
import csv

# 새로 쓰기 ("w") — 기존 내용을 지운다
with open("log.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(["date", "name", "price"])
    writer.writerow(["2026-11-04", "삼성전자", 71000])

# 이어 쓰기 ("a") — 기존 내용 뒤에 덧붙인다
with open("log.csv", "a", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(["2026-11-11", "삼성전자", 72000])

# 읽기
with open("log.csv", "r", encoding="utf-8-sig") as f:
    for row in csv.reader(f):
        print(row)
```

`with open(...) as f:` 구문은 블록이 끝나면 파일을 자동으로 닫아준다. 파일을 열고 닫지 않으면 내용이 저장되지 않을 수 있으므로 항상 이 형태로 쓴다.

| 모드 | 의미 |
|---|---|
| `"r"` | 읽기 (기본값) |
| `"w"` | 쓰기 — **기존 내용을 모두 지운다** |
| `"a"` | 이어 쓰기 (append) |

`newline=""`은 윈도우에서 빈 줄이 하나씩 끼는 현상을 막는 옵션이다.

### 파일이 있는지 확인하기

첫 실행에는 파일이 없고, 두 번째부터는 있어야 한다. 이런 분기는 `os.path.exists()`로 처리한다.

```python
import os

if os.path.exists("account.csv"):
    account = load_account("account.csv")     # 기존 계좌 이어받기
else:
    account = Account(initial_cash=10_000_000)   # 새 계좌 개설
```

파이썬에서는 큰 숫자에 언더스코어를 넣어 `10_000_000`처럼 쓸 수 있다. 값은 `10000000`과 같고 읽기만 편해진다.

---

## 3. 클래스 (Class) 맛보기

### 정의

**클래스란 관련된 데이터(속성)와 그 데이터를 다루는 함수(메서드)를 하나로 묶어 정의한 설계도다.** 이 설계도로 실제로 만들어낸 개체를 **인스턴스(instance)** 또는 객체라고 한다.

### 비유

클래스는 **붕어빵 틀**, 인스턴스는 **그 틀로 구운 붕어빵**이다. 틀 하나로 붕어빵을 여러 개 만들 수 있고, 각 붕어빵은 서로 독립적이다. 계좌 클래스를 한 번 정의해두면 내 계좌, 친구 계좌, 벤치마크 계좌를 각각 만들어 따로 관리할 수 있다.

### 왜 계좌에 클래스가 어울리는가

모의투자 계좌를 함수와 변수만으로 관리하면 이렇게 된다.

```python
cash = 10000000
holdings = {}
avg_price = {}
transactions = []

cash, holdings, avg_price, transactions = buy(cash, holdings, avg_price,
                                              transactions, "삼성전자", 71000, 10)
```

관련된 네 개의 값이 항상 함께 다녀야 하고, 함수 호출이 지저분해진다. 클래스로 묶으면 이렇게 된다.

```python
account = Account(10_000_000)
account.buy("삼성전자", 71000, 10)
```

**데이터와 그 데이터를 다루는 동작이 한 덩어리로 묶이는 것**이 클래스의 핵심 가치다.

### 기본 구조

```python
class Account:
    """모의투자 계좌."""

    def __init__(self, initial_cash, name="모의계좌"):
        self.name = name
        self.cash = initial_cash
        self.holdings = {}

    def deposit(self, amount):
        """현금을 입금한다."""
        self.cash += amount

    def summary(self):
        """계좌 요약 문자열을 반환한다."""
        return f"{self.name}: 현금 {self.cash:,.0f}원, 보유 {len(self.holdings)}종목"
```

```python
account = Account(10_000_000, name="황재환 계좌")
account.deposit(500_000)
print(account.summary())
# 황재환 계좌: 현금 10,500,000원, 보유 0종목
```

### `__init__`과 `self`

| 요소 | 의미 |
|---|---|
| `class` | 클래스를 정의하는 키워드 |
| `__init__` | 인스턴스를 만들 때 자동으로 호출되는 초기화 메서드 (생성자) |
| `self` | 인스턴스 자기 자신. 모든 메서드의 첫 매개변수로 반드시 쓴다 |
| `self.cash` | 그 인스턴스에 속한 값 (속성, attribute) |

`self`는 "이 붕어빵"을 가리키는 말이다. `self.cash`라고 쓰면 다른 계좌가 아니라 **이 계좌의 현금**을 뜻한다.

호출할 때는 `self`를 넘기지 않는다. `account.deposit(500_000)`이라고만 쓰면 파이썬이 `account`를 `self` 자리에 자동으로 넣어준다.

### 인스턴스는 서로 독립적이다

```python
a = Account(10_000_000, "내 계좌")
b = Account(5_000_000, "벤치마크")

a.deposit(1_000_000)

print(a.cash)   # 11000000
print(b.cash)   # 5000000   ← 영향 없음
```

### `__str__` — 출력 형태 지정하기

`print(account)`를 했을 때 보기 좋게 나오도록 하려면 `__str__` 메서드를 정의한다.

```python
class Account:
    def __init__(self, initial_cash):
        self.cash = initial_cash

    def __str__(self):
        return f"[계좌] 현금 {self.cash:,.0f}원"


account = Account(10_000_000)
print(account)   # [계좌] 현금 10,000,000원
```

`__init__`, `__str__`처럼 앞뒤에 언더스코어 두 개가 붙은 메서드를 **매직 메서드**라 한다. 파이썬이 특정 상황에서 자동으로 불러주는 약속된 이름이다.

---

## 4. 완성 코드 — `quantkit`

지금까지 배운 모든 것을 하나의 패키지로 정리한다. 아래 구조 그대로 폴더와 파일을 만든다.

```
pyfinance-study/
├─ venv/
├─ quantkit/
│  ├─ __init__.py
│  ├─ config.py        설정값 모음
│  ├─ text.py          출력 정렬 (한글 폭 보정)
│  ├─ data.py          데이터 수집·저장
│  ├─ metrics.py       성과·위험 지표 (4주차)
│  ├─ portfolio.py     포트폴리오 최적화 (5·6주차)
│  └─ account.py       모의계좌 클래스 (7주차)
├─ run_optimize.py     ① 최적 비중 산출
├─ run_invest.py       ② 모의투자 집행
├─ run_report.py       ③ 성과 리포트
├─ run_rebalance.py    ④ 리밸런싱
├─ prices.csv
├─ optimal_weights.csv
├─ account.json
└─ transactions.csv
```

---

### `quantkit/__init__.py`

```python
"""quantkit — 기초 퀀트 투자 도구 모음 (py.finance 스터디)."""

__version__ = "1.0.0"
```

---

### `quantkit/config.py`

```python
"""프로젝트 전역 설정값.

여기에 모아두면 값을 바꿀 때 이 파일 하나만 수정하면 된다.
"""

# ── 데이터 ──────────────────────────────────────────────
TICKERS = {
    "삼성전자": "005930",       # 개별 주식
    "KODEX200": "069500",      # 국내 주식
    "미국S&P500": "360750",    # 해외 주식
    "국고채30년": "439870",     # 채권
    "금": "132030",            # 원자재
}

BENCHMARK = ("KOSPI", "KS11")     # 비교 기준 지수
START_DATE = "2022-09-01"         # 국고채30년 ETF 상장 이후

# ── 계산 ────────────────────────────────────────────────
TRADING_DAYS = 252        # 연간 거래일 수
RISK_FREE = 0.03          # 무위험수익률 (연 3% 가정)

# ── 모의투자 ────────────────────────────────────────────
INITIAL_CASH = 10_000_000     # 초기 자본 1천만원

# 수수료·세금 (예시값 — 실제 증권사 요율은 각자 확인할 것)
BUY_FEE_RATE = 0.00015        # 매수 수수료 0.015%
SELL_FEE_RATE = 0.00015       # 매도 수수료 0.015%
SELL_TAX_RATE = 0.0015        # 증권거래세 0.15%

# ── 파일 경로 ───────────────────────────────────────────
PRICES_FILE = "prices.csv"
WEIGHTS_FILE = "optimal_weights.csv"
ACCOUNT_FILE = "account.json"
TRANSACTIONS_FILE = "transactions.csv"

ENCODING = "utf-8-sig"        # 엑셀에서 한글이 깨지지 않게
```

---

### `quantkit/text.py`

한글은 터미널에서 두 칸을 차지하는데 `f"{name:<12}"`는 한 칸으로 세기 때문에, 종목 이름이 섞이면 표가 어긋난다. 3~6주차 출력이 삐뚤빼뚤했던 이유다.

```python
"""터미널 출력 정렬 (한글 폭 보정)."""

import unicodedata


def width(text):
    """터미널에서 차지하는 칸 수를 센다. 한글·한자는 두 칸이다."""
    return sum(2 if unicodedata.east_asian_width(ch) in ("W", "F") else 1
               for ch in str(text))


def pad(text, size, align="<"):
    """
    터미널 폭 기준으로 size 칸에 맞춰 채운다.

    f"{name:<12}" 는 글자 수로 세기 때문에 한글이 섞이면 어긋난다.
    넓은 글자 개수만큼 목표 폭을 줄여서 넘긴다.
    """
    text = str(text)
    extra = width(text) - len(text)
    return f"{text:{align}{max(size - extra, 0)}}"


if __name__ == "__main__":
    for name in ["삼성전자", "KODEX200", "미국S&P500", "금"]:
        print(f"|{pad(name, 12)}|{'f-string':>10}|")
        print(f"|{name:<12}|{'(어긋남)':>10}|")
```

`unicodedata.east_asian_width()`가 `"W"`(Wide) 또는 `"F"`(Fullwidth)를 돌려주는 글자가 두 칸짜리다. 앞으로 표를 출력할 때는 `f"{name:<12}"` 대신 `pad(name, 12)`를 쓴다.

---

### `quantkit/data.py`

```python
"""주가 데이터 수집과 저장."""

import os

import pandas as pd
import FinanceDataReader as fdr

from quantkit.config import TICKERS, START_DATE, PRICES_FILE, ENCODING


def get_close(ticker, start=START_DATE, end=None):
    """종목코드를 받아 종가 Series를 반환한다."""
    df = fdr.DataReader(ticker, start, end)
    return df["Close"]


def download_prices(tickers=TICKERS, start=START_DATE, end=None, verbose=True):
    """여러 종목의 종가를 하나의 DataFrame으로 모아 반환한다."""
    close_data = {}

    for name, ticker in tickers.items():
        close_data[name] = get_close(ticker, start, end)
        if verbose:
            print(f"  {name}({ticker}) {len(close_data[name])}일치 수집")

    prices = pd.DataFrame(close_data)
    return prices.dropna()      # 한 종목이라도 값이 없는 날은 제외


def save_prices(prices, path=PRICES_FILE):
    """종가 DataFrame을 CSV로 저장한다."""
    prices.to_csv(path, encoding=ENCODING)
    print(f"저장 완료: {path} ({len(prices)}행)")


def load_prices(path=PRICES_FILE):
    """저장된 종가 CSV를 DataFrame으로 불러온다."""
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"{path}가 없다. download_prices()로 먼저 데이터를 받아야 한다."
        )
    return pd.read_csv(path, index_col=0, parse_dates=True)


def load_or_download(tickers=TICKERS, start=START_DATE,
                     path=PRICES_FILE, refresh=False):
    """
    저장된 종가가 있으면 그대로 쓰고, 없거나 refresh=True면 새로 받는다.

    3주차에 만든 prices.csv를 매주 다시 내려받지 않기 위한 장치다.
    위에서 배운 os.path.exists() 분기를 그대로 쓴다.
    """
    if refresh or not os.path.exists(path):
        prices = download_prices(tickers, start)
        save_prices(prices, path)
        return prices

    prices = load_prices(path)
    print(f"{path}를 그대로 쓴다 ({len(prices)}행). "
          f"새로 받으려면 --refresh 를 붙여 실행한다.")
    return prices


def latest_prices(tickers=TICKERS):
    """각 종목의 가장 최근 종가를 딕셔너리로 반환한다."""
    result = {}
    for name, ticker in tickers.items():
        close = get_close(ticker, start=None)
        result[name] = float(close.iloc[-1])
    return result


if __name__ == "__main__":
    prices = download_prices()
    save_prices(prices)
    print(prices.tail())
```

---

### `quantkit/metrics.py`

```python
"""성과와 위험을 재는 지표들 (4주차 내용)."""

import numpy as np
import pandas as pd

from quantkit.config import TRADING_DAYS, RISK_FREE
from quantkit.text import pad


def to_returns(prices):
    """가격 Series/DataFrame을 단순수익률로 변환한다."""
    return prices.pct_change().dropna()


def to_log_returns(prices):
    """가격을 로그수익률로 변환한다."""
    return np.log(prices / prices.shift(1)).dropna()


def total_return(prices):
    """기간 전체 수익률을 반환한다."""
    return prices.iloc[-1] / prices.iloc[0] - 1


def cagr(prices, periods=TRADING_DAYS):
    """연평균 복리 수익률(CAGR)을 반환한다."""
    years = len(prices) / periods
    if years <= 0:
        return 0.0
    return (prices.iloc[-1] / prices.iloc[0]) ** (1 / years) - 1


def volatility(returns, periods=TRADING_DAYS):
    """연율화 변동성(표준편차)을 반환한다."""
    return returns.std() * np.sqrt(periods)


def sharpe_ratio(returns, risk_free=RISK_FREE, periods=TRADING_DAYS):
    """샤프지수를 반환한다."""
    annual_return = returns.mean() * periods
    annual_vol = volatility(returns, periods)
    if annual_vol == 0:
        return 0.0
    return (annual_return - risk_free) / annual_vol


def drawdown_series(prices):
    """전고점 대비 하락률 시계열을 반환한다."""
    return prices / prices.cummax() - 1


def max_drawdown(prices):
    """최대낙폭(MDD)을 반환한다. 음수로 나온다."""
    return drawdown_series(prices).min()


def summarize(prices, name="자산"):
    """한 자산의 주요 지표를 딕셔너리로 반환한다."""
    returns = to_returns(prices)
    return {
        "종목": name,
        "기간수익률": total_return(prices),
        "CAGR": cagr(prices),
        "변동성": volatility(returns),
        "샤프지수": sharpe_ratio(returns),
        "MDD": max_drawdown(prices),
    }


def summary_table(prices_df):
    """DataFrame의 모든 열에 대해 지표를 계산해 표로 반환한다."""
    rows = [summarize(prices_df[name], name) for name in prices_df.columns]
    return pd.DataFrame(rows).set_index("종목")


def print_summary(prices_df):
    """지표 표를 보기 좋게 출력한다."""
    table = summary_table(prices_df)

    print(f"{pad('종목', 12)}{pad('기간수익률', 12, '>')}{'CAGR':>10}"
          f"{pad('변동성', 10, '>')}{pad('샤프', 8, '>')}{'MDD':>10}")
    print("-" * 62)
    for name, row in table.iterrows():
        print(f"{pad(name, 12)}{row['기간수익률']:>12.2%}{row['CAGR']:>10.2%}"
              f"{row['변동성']:>10.2%}{row['샤프지수']:>8.2f}{row['MDD']:>10.2%}")
```

---

### `quantkit/portfolio.py`

```python
"""포트폴리오 구성과 최적화 (5·6주차 내용)."""

import numpy as np
import pandas as pd

from quantkit.config import TRADING_DAYS, RISK_FREE, WEIGHTS_FILE, ENCODING


# ── 포트폴리오 기본 계산 ────────────────────────────────

def annualized_stats(returns, periods=TRADING_DAYS):
    """연율화된 기대수익률 벡터와 공분산 행렬을 반환한다."""
    mean_returns = returns.mean().values * periods
    cov_matrix = returns.cov().values * periods
    return mean_returns, cov_matrix


def portfolio_return(weights, mean_returns):
    """포트폴리오 기대수익률을 반환한다."""
    return weights @ mean_returns


def portfolio_volatility(weights, cov_matrix):
    """포트폴리오 변동성을 반환한다."""
    return np.sqrt(weights @ cov_matrix @ weights)


def portfolio_sharpe(weights, mean_returns, cov_matrix, risk_free=RISK_FREE):
    """포트폴리오 샤프지수를 반환한다."""
    ret = portfolio_return(weights, mean_returns)
    vol = portfolio_volatility(weights, cov_matrix)
    if vol == 0:
        return 0.0
    return (ret - risk_free) / vol


def validate_weights(weights, tolerance=1e-6):
    """비중의 합이 1인지 확인한다. 아니면 에러를 낸다."""
    total = float(np.sum(weights))
    if abs(total - 1) > tolerance:
        raise ValueError(f"비중의 합이 1이 아니다: {total:.6f}")
    if np.any(np.asarray(weights) < -tolerance):
        raise ValueError("음수 비중이 있다(공매도는 다루지 않는다).")
    return True


# ── 최적화 ──────────────────────────────────────────────

def random_weights(n_assets, n_samples, seed=None):
    """합이 1이고 모두 0 이상인 무작위 비중 행렬을 만든다."""
    rng = np.random.default_rng(seed)
    W = rng.random((n_samples, n_assets))
    return W / W.sum(axis=1, keepdims=True)


def simulate(returns, n_samples=20000, seed=42, risk_free=RISK_FREE):
    """
    몬테카를로 시뮬레이션을 수행한다.

    반환: (비중 행렬 W, 수익률 배열, 변동성 배열, 샤프 배열)
    """
    mean_returns, cov_matrix = annualized_stats(returns)
    n_assets = len(mean_returns)

    W = random_weights(n_assets, n_samples, seed)
    rets = W @ mean_returns
    vols = np.sqrt(np.einsum("ij,jk,ik->i", W, cov_matrix, W))
    sharpe = (rets - risk_free) / vols

    return W, rets, vols, sharpe


def max_sharpe_weights(returns, n_samples=20000, seed=42):
    """샤프지수가 가장 높은 비중을 Series로 반환한다."""
    W, _, _, sharpe = simulate(returns, n_samples, seed)
    return pd.Series(W[sharpe.argmax()], index=returns.columns, name="weight")


def min_variance_weights(returns, n_samples=20000, seed=42):
    """변동성이 가장 낮은 비중을 Series로 반환한다."""
    W, _, vols, _ = simulate(returns, n_samples, seed)
    return pd.Series(W[vols.argmin()], index=returns.columns, name="weight")


def equal_weights(returns):
    """균등 비중(1/N)을 Series로 반환한다."""
    n = len(returns.columns)
    return pd.Series(np.ones(n) / n, index=returns.columns, name="weight")


# ── 저장·불러오기 ───────────────────────────────────────

def save_weights(weights, path=WEIGHTS_FILE):
    """비중 Series를 CSV로 저장한다."""
    weights.to_csv(path, encoding=ENCODING)
    print(f"저장 완료: {path}")


def load_weights(path=WEIGHTS_FILE):
    """저장된 비중 CSV를 Series로 불러온다."""
    df = pd.read_csv(path, index_col=0)
    return df.iloc[:, 0]


# ── 백테스트 ────────────────────────────────────────────

def backtest(prices, weights, rebalance=False):
    """
    주어진 비중으로 매수 후 보유했을 때의 자산가치 시계열을 반환한다.
    시작 시점의 가치를 1로 정규화한다.
    """
    validate_weights(weights.values)

    normalized = prices / prices.iloc[0]          # 각 자산을 1에서 시작
    aligned = weights.reindex(prices.columns)     # 열 순서 맞추기

    if rebalance:
        returns = prices.pct_change().fillna(0)
        port_returns = (returns * aligned).sum(axis=1)
        return (1 + port_returns).cumprod()

    return (normalized * aligned).sum(axis=1)
```

---

### `quantkit/account.py`

```python
"""모의투자 계좌 (7주차 내용)."""

import csv
import json
import os
from datetime import date

from quantkit.config import (
    INITIAL_CASH, BUY_FEE_RATE, SELL_FEE_RATE, SELL_TAX_RATE,
    ACCOUNT_FILE, TRANSACTIONS_FILE, ENCODING,
)
from quantkit.text import pad


class Account:
    """
    모의투자 계좌.

    현금과 보유 종목을 관리하고, 매수·매도 시 수수료와 세금을 반영한다.
    거래 내역은 CSV에, 계좌 상태는 JSON에 저장한다.
    """

    def __init__(self, initial_cash=INITIAL_CASH, name="모의계좌", started=None):
        self.name = name
        self.initial_cash = initial_cash
        self.cash = initial_cash
        self.holdings = {}        # {종목명: 수량}
        self.avg_price = {}       # {종목명: 평균매입단가}
        self.transactions = []    # 거래 내역

        # 첫 매매가 일어난 날. 벤치마크와 같은 구간을 비교하려면 반드시 필요하다.
        # 현금만 들고 있던 기간까지 성과에 넣으면 비교가 어긋난다.
        self.started = started

    # ── 거래 ────────────────────────────────────────────

    def buy(self, name, price, quantity, when=None, memo=""):
        """지정 수량을 매수한다. 현금이 부족하면 에러를 낸다."""
        if quantity <= 0:
            raise ValueError("수량은 1주 이상이어야 한다.")

        amount = price * quantity
        fee = amount * BUY_FEE_RATE
        total_cost = amount + fee

        if total_cost > self.cash:
            raise ValueError(
                f"현금 부족: 필요 {total_cost:,.0f}원 / 보유 {self.cash:,.0f}원"
            )

        prev_qty = self.holdings.get(name, 0)
        prev_avg = self.avg_price.get(name, 0)
        new_qty = prev_qty + quantity

        self.avg_price[name] = (prev_avg * prev_qty + amount) / new_qty
        self.holdings[name] = new_qty
        self.cash -= total_cost

        self._log("매수", name, price, quantity, fee, 0, when, memo)
        return total_cost

    def sell(self, name, price, quantity, when=None, memo=""):
        """지정 수량을 매도한다. 보유 수량이 부족하면 에러를 낸다."""
        held = self.holdings.get(name, 0)
        if quantity <= 0:
            raise ValueError("수량은 1주 이상이어야 한다.")
        if quantity > held:
            raise ValueError(f"보유 수량 부족: 보유 {held}주 / 매도 {quantity}주")

        amount = price * quantity
        fee = amount * SELL_FEE_RATE
        tax = amount * SELL_TAX_RATE
        proceeds = amount - fee - tax

        self.holdings[name] = held - quantity
        if self.holdings[name] == 0:
            del self.holdings[name]
            self.avg_price.pop(name, None)

        self.cash += proceeds

        self._log("매도", name, price, quantity, fee, tax, when, memo)
        return proceeds

    def _log(self, action, name, price, quantity, fee, tax, when=None, memo=""):
        """거래 내역을 기록한다. 앞의 언더스코어는 내부용이라는 표시다."""
        day = str(when or date.today())

        if self.started is None:
            self.started = day       # 첫 거래일부터 운용 시작으로 본다

        self.transactions.append({
            "날짜": day,
            "구분": action,
            "종목": name,
            "단가": round(price, 2),
            "수량": quantity,
            "거래대금": round(price * quantity, 2),
            "수수료": round(fee, 2),
            "세금": round(tax, 2),
            "거래후현금": round(self.cash, 2),
            "메모": memo,          # 왜 이 매매를 했는지 한 줄
        })

    # ── 평가 ────────────────────────────────────────────

    def market_value(self, prices):
        """보유 종목의 평가금액 합계를 반환한다."""
        total = 0.0
        for name, qty in self.holdings.items():
            total += prices.get(name, self.avg_price.get(name, 0)) * qty
        return total

    def total_value(self, prices):
        """현금을 포함한 총 자산가치를 반환한다."""
        return self.cash + self.market_value(prices)

    def profit(self, prices):
        """초기 자본 대비 손익 금액을 반환한다."""
        return self.total_value(prices) - self.initial_cash

    def profit_rate(self, prices):
        """초기 자본 대비 수익률을 반환한다."""
        return self.total_value(prices) / self.initial_cash - 1

    def position_table(self, prices):
        """종목별 보유 현황을 리스트로 반환한다."""
        rows = []
        for name, qty in self.holdings.items():
            now = prices.get(name, self.avg_price[name])
            avg = self.avg_price[name]
            value = now * qty
            rows.append({
                "종목": name,
                "수량": qty,
                "평균단가": avg,
                "현재가": now,
                "평가금액": value,
                "평가손익": (now - avg) * qty,
                "수익률": now / avg - 1,
            })
        return rows

    # ── 출력 ────────────────────────────────────────────

    def __str__(self):
        return (f"[{self.name}] 현금 {self.cash:,.0f}원 / "
                f"보유 {len(self.holdings)}종목")

    def report(self, prices):
        """계좌 현황을 표로 출력한다."""
        total = self.total_value(prices)

        print("=" * 72)
        period = f"{self.started} 이후" if self.started else "매매 전"
        print(f"{self.name} 현황  ({period} · {date.today()} 기준)")
        print("=" * 72)

        rows = self.position_table(prices)
        if rows:
            print(f"{pad('종목', 12)}{pad('수량', 6, '>')}{pad('평균단가', 12, '>')}"
                  f"{pad('현재가', 12, '>')}{pad('평가금액', 14, '>')}"
                  f"{pad('수익률', 10, '>')}")
            print("-" * 72)
            for r in rows:
                print(f"{pad(r['종목'], 12)}{r['수량']:>6}{r['평균단가']:>12,.0f}"
                      f"{r['현재가']:>12,.0f}{r['평가금액']:>14,.0f}"
                      f"{r['수익률']:>10.2%}")
            print("-" * 72)
        else:
            print("보유 종목 없음")

        print(f"{pad('현금', 12)}{self.cash:>56,.0f}원")
        print(f"{pad('평가금액', 12)}{self.market_value(prices):>56,.0f}원")
        print(f"{pad('총자산', 12)}{total:>56,.0f}원")
        print(f"{pad('손익', 12)}{self.profit(prices):>56,.0f}원"
              f"  ({self.profit_rate(prices):+.2%})")
        print("=" * 72)

    # ── 저장·불러오기 ───────────────────────────────────

    def save(self, path=ACCOUNT_FILE, tx_path=TRANSACTIONS_FILE):
        """계좌 상태를 JSON에, 거래 내역을 CSV에 저장한다."""
        state = {
            "name": self.name,
            "started": self.started,
            "initial_cash": self.initial_cash,
            "cash": self.cash,
            "holdings": self.holdings,
            "avg_price": self.avg_price,
        }
        with open(path, "w", encoding=ENCODING) as f:
            json.dump(state, f, ensure_ascii=False, indent=2)

        if self.transactions:
            self._append_transactions(tx_path)

        print(f"저장 완료: {path}, {tx_path}")

    def _append_transactions(self, path):
        """거래 내역을 CSV에 이어서 기록한다."""
        is_new = not os.path.exists(path)
        fields = list(self.transactions[0].keys())

        with open(path, "a", newline="", encoding=ENCODING) as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            if is_new:
                writer.writeheader()
            writer.writerows(self.transactions)

        self.transactions = []      # 저장했으므로 비운다

    @classmethod
    def load(cls, path=ACCOUNT_FILE):
        """저장된 계좌를 불러온다. 파일이 없으면 새 계좌를 만든다."""
        if not os.path.exists(path):
            print(f"{path}가 없어 새 계좌를 만든다.")
            return cls()

        with open(path, "r", encoding=ENCODING) as f:
            state = json.load(f)

        account = cls(state["initial_cash"], state["name"], state.get("started"))
        account.cash = state["cash"]
        account.holdings = state["holdings"]
        account.avg_price = state["avg_price"]
        return account
```

> `@classmethod`는 인스턴스가 아니라 클래스 자체에 붙는 메서드다. `Account.load()`처럼 계좌를 만들기 전에 호출해야 하는 경우에 사용한다. 지금은 "이런 것도 있다" 정도로만 알아두면 된다.

---

### `run_optimize.py` — ① 최적 비중 산출

```python
"""
① 데이터를 준비해 최적 포트폴리오 비중을 계산하고 저장한다.

실행:  python run_optimize.py
       python run_optimize.py --refresh    ← 주가를 새로 내려받는다
"""

import sys

from quantkit import data, metrics, portfolio
from quantkit.config import TICKERS
from quantkit.text import pad


def main(refresh=False):
    print("=" * 72)
    print("1단계 · 데이터 준비")
    print("=" * 72)
    prices = data.load_or_download(TICKERS, refresh=refresh)

    print()
    print("=" * 72)
    print("2단계 · 개별 자산 성과")
    print("=" * 72)
    metrics.print_summary(prices)

    returns = metrics.to_returns(prices)

    print()
    print("상관계수 행렬")
    print(returns.corr().round(3))

    print()
    print("=" * 72)
    print("3단계 · 포트폴리오 최적화")
    print("=" * 72)

    candidates = {
        "최대샤프": portfolio.max_sharpe_weights(returns),
        "최소분산": portfolio.min_variance_weights(returns),
        "균등비중": portfolio.equal_weights(returns),
    }

    mean_returns, cov_matrix = portfolio.annualized_stats(returns)

    for label, w in candidates.items():
        ret = portfolio.portfolio_return(w.values, mean_returns)
        vol = portfolio.portfolio_volatility(w.values, cov_matrix)
        sharpe = portfolio.portfolio_sharpe(w.values, mean_returns, cov_matrix)

        print(f"\n[{label}]  수익률 {ret:.2%}  변동성 {vol:.2%}  샤프 {sharpe:.3f}")
        for name, weight in w.items():
            bar = "█" * int(weight * 40)
            print(f"  {pad(name, 12)}{weight:>7.2%}  {bar}")

    # 선택: 여기서 원하는 전략을 고른다
    chosen = candidates["최대샤프"]
    print()
    portfolio.save_weights(chosen)


if __name__ == "__main__":
    main(refresh="--refresh" in sys.argv)
```

---

### `run_invest.py` — ② 모의투자 집행

```python
"""
② 저장된 비중대로 모의계좌에서 실제 매수를 집행한다.

실행:  python run_invest.py
"""

import math

from quantkit import data, portfolio
from quantkit.account import Account
from quantkit.config import TICKERS
from quantkit.text import pad


def plan_orders(weights, prices, budget):
    """
    비중과 현재가를 받아 실제 매수 계획을 만든다.
    주식은 1주 단위로만 살 수 있으므로 내림 처리한다.
    """
    orders = []
    for name, weight in weights.items():
        price = prices[name]
        target_amount = budget * weight
        quantity = math.floor(target_amount / price)

        if quantity > 0:
            orders.append({
                "종목": name,
                "목표비중": weight,
                "현재가": price,
                "수량": quantity,
                "예상금액": price * quantity,
            })
    return orders


def main():
    account = Account.load()
    print(account)

    weights = portfolio.load_weights()
    prices = data.latest_prices(TICKERS)

    # 수수료를 감안해 현금의 99.5%만 사용한다
    budget = account.cash * 0.995
    orders = plan_orders(weights, prices, budget)

    print()
    print("=" * 72)
    print("매수 계획")
    print("=" * 72)
    print(f"{pad('종목', 12)}{pad('목표비중', 10, '>')}{pad('현재가', 12, '>')}"
          f"{pad('수량', 8, '>')}{pad('예상금액', 16, '>')}")
    print("-" * 72)

    for o in orders:
        print(f"{pad(o['종목'], 12)}{o['목표비중']:>10.2%}{o['현재가']:>12,.0f}"
              f"{o['수량']:>8}{o['예상금액']:>16,.0f}")

    planned = sum(o["예상금액"] for o in orders)
    print("-" * 72)
    print(f"{pad('합계', 12)}{planned:>58,.0f}원")
    print(f"{pad('잔여현금(예상)', 16)}{account.cash - planned:>54,.0f}원")
    print("=" * 72)

    answer = input("\n이대로 집행하시겠습니까? (y/n): ")
    if answer.strip().lower() != "y":
        print("집행을 취소했다.")
        return

    # 8주차 발표의 재료가 되므로 반드시 남긴다
    reason = input("이번 매수를 결정한 이유를 한 줄로 적는다: ").strip()

    for o in orders:
        cost = account.buy(o["종목"], o["현재가"], o["수량"], memo=reason)
        print(f"  매수 체결: {o['종목']} {o['수량']}주 ({cost:,.0f}원)")

    print()
    account.report(prices)
    account.save()


if __name__ == "__main__":
    main()
```

---


> **현금이 조금 남는다.** 주식은 1주 단위로만 살 수 있어 `math.floor`로 내림하기 때문이다. 값이 비싼 종목이 섞이면 남는 돈이 커진다. 이 자료의 다섯 종목으로 1,000만 원을 집행하면 4% 안팎이 현금으로 남는다. 목표 비중과 실제 비중이 조금 어긋나는 것도 같은 이유이며, `run_rebalance.py`로 주기적으로 맞춰준다.

---

### `run_report.py` — ③ 성과 리포트

```python
"""
③ 현재 계좌 상태를 조회하고 벤치마크와 비교한다.
매주 이 파일만 실행하면 성과를 추적할 수 있다.

실행:  python run_report.py
"""

import pandas as pd

from quantkit import data, metrics
from quantkit.account import Account
from quantkit.config import TICKERS, BENCHMARK, TRANSACTIONS_FILE


def main():
    account = Account.load()
    prices = data.latest_prices(TICKERS)

    account.report(prices)

    # ── 벤치마크 비교 ───────────────────────────────────
    # 첫 거래일부터 재야 한다. 기간이 다르면 비교 자체가 성립하지 않는다.
    bench_name, bench_code = BENCHMARK

    period = f"{account.started} 이후" if account.started else "매매 전"

    print()
    print("=" * 72)
    print(f"벤치마크 비교 · {bench_name} · {period}")
    print("=" * 72)

    if account.started is None:
        print("  아직 매매가 없다. run_invest.py로 먼저 집행한다.")
    else:
        bench = data.get_close(bench_code, start=account.started)

        if len(bench) < 2:
            print("  아직 지난 거래일이 없다. 다음 거래일에 다시 실행한다.")
        else:
            bench_return = metrics.total_return(bench)
            my_return = account.profit_rate(prices)
            gap = my_return - bench_return
            verdict = "초과 성과" if gap > 0 else "미달 성과"

            print(f"  {bench_name} 수익률   {bench_return:>10.2%}   ({len(bench)}거래일)")
            print(f"  내 포트폴리오        {my_return:>10.2%}")
            print(f"  차이                 {gap:>10.2%}  ({verdict})")
    print("=" * 72)

    # ── 거래 내역 ───────────────────────────────────────
    try:
        tx = pd.read_csv(TRANSACTIONS_FILE)
        print()
        print("최근 거래 내역")
        print(tx.tail(10).to_string(index=False))
    except FileNotFoundError:
        print("\n거래 내역이 아직 없다.")


if __name__ == "__main__":
    main()
```

> **벤치마크는 반드시 같은 구간으로 비교한다.** 내 계좌는 개설일 이후의 수익률인데 코스피는 최근 60거래일로 재면, 두 숫자를 빼는 것 자체가 성립하지 않는다. 오늘 막 매수한 계좌(0%)를 60거래일간 -13% 빠진 코스피와 비교해 "13% 초과 성과"라는 결론이 나오는 식이다. 그래서 `account.json`에 **첫 거래일**(`started`)을 남기고, 벤치마크도 그 날부터 받아온다. 계좌를 연 날이 아니라 첫 매매일을 기준으로 잡는 이유는, 현금만 들고 있던 기간까지 성과에 넣으면 또 어긋나기 때문이다. 성과 비교에서 가장 흔한 실수다.

---

### `run_rebalance.py` — ④ 리밸런싱

시간이 지나면 잘 오른 자산의 비중이 저절로 커진다. 목표 비중으로 되돌리는 것이 리밸런싱이다. 여기서 처음으로 `Account.sell()`을 쓴다.

```python
"""
④ 현재 보유 비중을 목표 비중에 맞춰 다시 맞춘다.

실행:  python run_rebalance.py
"""

import math

from quantkit import data, portfolio
from quantkit.account import Account
from quantkit.config import TICKERS
from quantkit.text import pad


def current_weights(account, prices):
    """평가금액 기준 현재 비중을 딕셔너리로 반환한다."""
    total = account.market_value(prices)
    if total == 0:
        return {}

    return {name: prices[name] * qty / total
            for name, qty in account.holdings.items()}


def plan_rebalance(account, weights, prices):
    """목표 비중에 맞추기 위한 매도·매수 계획을 만든다."""
    total = account.total_value(prices) * 0.995    # 수수료 여유
    orders = []

    for name in weights.index:
        price = prices[name]
        target_qty = math.floor(total * weights[name] / price)
        diff = target_qty - account.holdings.get(name, 0)

        if diff != 0:
            orders.append({
                "종목": name,
                "구분": "매수" if diff > 0 else "매도",
                "수량": abs(diff),
                "현재가": price,
                "금액": abs(diff) * price,
            })

    return orders


def main():
    account = Account.load()

    if not account.holdings:
        print("보유 종목이 없다. run_invest.py로 먼저 집행한다.")
        return

    weights = portfolio.load_weights()
    prices = data.latest_prices(TICKERS)
    current = current_weights(account, prices)

    print(account)
    print()
    print("=" * 72)
    print("현재 비중 → 목표 비중")
    print("=" * 72)
    for name in weights.index:
        print(f"{pad(name, 12)}{current.get(name, 0):>10.2%}  →  {weights[name]:>8.2%}")

    orders = plan_rebalance(account, weights, prices)

    if not orders:
        print()
        print("이미 목표 비중에 맞다. 할 일이 없다.")
        return

    print()
    print("=" * 72)
    print("리밸런싱 계획")
    print("=" * 72)
    print(f"{pad('종목', 12)}{pad('구분', 6, '>')}{pad('수량', 8, '>')}"
          f"{pad('현재가', 12, '>')}{pad('금액', 16, '>')}")
    print("-" * 72)
    for o in orders:
        print(f"{pad(o['종목'], 12)}{pad(o['구분'], 6, '>')}{o['수량']:>8}"
              f"{o['현재가']:>12,.0f}{o['금액']:>16,.0f}")
    print("=" * 72)

    answer = input("이대로 집행하시겠습니까? (y/n): ")
    if answer.strip().lower() != "y":
        print("집행을 취소했다.")
        return

    reason = input("리밸런싱을 결정한 이유를 한 줄로 적는다: ").strip()

    # 현금을 먼저 확보해야 하므로 매도부터 처리한다
    for o in sorted(orders, key=lambda x: x["구분"] != "매도"):
        try:
            if o["구분"] == "매도":
                account.sell(o["종목"], o["현재가"], o["수량"], memo=reason)
            else:
                account.buy(o["종목"], o["현재가"], o["수량"], memo=reason)
            print(f"  {o['구분']} 체결: {o['종목']} {o['수량']}주")
        except ValueError as e:
            print(f"  {o['종목']} 건너뜀 — {e}")

    print()
    account.report(prices)
    account.save()


if __name__ == "__main__":
    main()
```

`sorted(orders, key=lambda x: x["구분"] != "매도")`는 **매도를 먼저 처리하기 위한 정렬**이다. 현금이 들어와야 매수가 가능하기 때문이다. `False`가 `0`, `True`가 `1`로 취급되는 성질을 이용했다.

`try` / `except ValueError`는 현금이 모자라 한 종목이 실패해도 나머지는 계속 진행하게 한다. `Account.buy()`가 잘못된 상태를 막으려고 `raise ValueError`를 던진 것이 여기서 쓰인다.

---

## 5. 모의투자 진행 방법

### 실행 순서

```bash
# 처음 한 번
python run_optimize.py     # 데이터 준비 + 최적 비중 산출
python run_invest.py       # 매수 집행

# 매주 반복
python run_report.py       # 성과 확인

# 비중이 목표에서 벗어났을 때 (스터디 기간 중 최대 1회)
python run_optimize.py --refresh   # 최신 데이터로 목표 비중 갱신
python run_rebalance.py            # 목표 비중으로 되돌리기
```

### 운용 규칙

스터디 기간 동안 아래 규칙으로 운용한다. 정답이 있는 것은 아니므로 각자 조정해도 좋다.

| 항목 | 규칙 |
|---|---|
| 초기 자본 | 1,000만원 (가상) |
| 종목 수 | 3~10개 |
| 최소 보유 기간 | 1주 |
| 리밸런싱 | 8주차 발표 전까지 최대 1회 |
| 기록 | 매매할 때마다 이유를 한 줄로 남긴다 (`transactions.csv`의 `메모` 칸에 자동 저장) |
| 벤치마크 | KOSPI 지수 |

### 기록이 성과보다 중요하다

4주 남짓한 기간의 수익률은 사실상 운이다. 짧은 기간에 시장을 이겼는지 여부는 실력을 거의 알려주지 못한다. 그러므로 이 실습의 목적은 수익이 아니라 **자신의 판단 과정을 기록으로 남기는 것**이다.

매매할 때마다 다음을 적어둔다.

- 왜 이 비중을 선택했는가
- 예상과 실제가 달랐다면 무엇이 달랐는가
- 다시 한다면 무엇을 바꾸겠는가

8주차 발표에서 이 기록이 가장 중요한 재료가 된다.

### 실제 투자와의 차이

이 코드가 다루지 않는 것들이 있다. 실제 투자에 그대로 쓰면 안 되는 이유이기도 하다.

- **슬리피지** — 원하는 가격에 체결되지 않는 차이
- **거래량 제약** — 소형주는 원하는 수량만큼 살 수 없을 수 있다
- **배당** — 배당금과 배당락이 반영되지 않았다
- **호가 단위** — 실제로는 가격대별 호가 단위가 정해져 있다
- **세금 상세** — 양도소득세, 배당소득세 등은 고려하지 않았다

---

## 오늘 배운 것 정리

| 개념 | 한 줄 정의 | 핵심 |
|---|---|---|
| **모듈** | 다른 파일에서 불러 쓸 수 있는 `.py` 파일 | `from quantkit.metrics import cagr` |
| **패키지** | 모듈을 담은 폴더 | 안에 `__init__.py`를 둔다 |
| **`__name__`** | 실행 방식을 알려주는 변수 | 직접 실행 시 `"__main__"` |
| **CSV 입출력** | 데이터를 파일로 저장·복원 | `to_csv` / `read_csv`, 인코딩은 `utf-8-sig` |
| **`with open`** | 파일을 열고 자동으로 닫는 구문 | 모드 `"r"`, `"w"`, `"a"` |
| **클래스** | 데이터와 동작을 묶은 설계도 | `__init__`, `self`, 인스턴스는 독립적 |

**이번 주의 큰 그림**: 코드는 한 번 쓰고 버리는 것이 아니라 **쌓아 올리는 것**이다. `quantkit`은 8주차 이후에도 계속 쓸 수 있는 여러분의 자산이다.

---

## 오늘의 테스트

### Q1. `if __name__ == "__main__":` 블록 안의 코드는 언제 실행되는가?

1. 항상 실행된다
2. 이 파일을 직접 실행했을 때만 실행된다
3. 다른 파일에서 import했을 때만 실행된다
4. 에러가 발생했을 때 실행된다

<details>
<summary>정답 보기</summary>

**정답: 2번**

직접 실행하면 `__name__`에 `"__main__"`이 들어가고, import되면 모듈 이름이 들어간다. 테스트 코드가 import 시 함께 실행되는 것을 막는 관용구다.
</details>

### Q2. 파일을 `"w"` 모드로 열면 어떻게 되는가?

1. 기존 내용 뒤에 이어서 쓴다
2. 기존 내용을 모두 지우고 새로 쓴다
3. 읽기만 가능하다
4. 파일이 없으면 에러가 난다

<details>
<summary>정답 보기</summary>

**정답: 2번**

`"w"`는 덮어쓰기다. 이어 쓰려면 `"a"`(append)를 사용한다. 거래 내역처럼 계속 쌓아야 하는 데이터에 `"w"`를 쓰면 지난 기록이 전부 사라진다.
</details>

### Q3. 다음 코드의 출력 결과는?

```python
class Account:
    def __init__(self, cash):
        self.cash = cash


a = Account(1000)
b = Account(2000)
a.cash += 500

print(a.cash, b.cash)
```

<details>
<summary>정답 보기</summary>

**정답: `1500 2000`**

인스턴스는 각자 독립적인 속성을 갖는다. `a`를 바꿔도 `b`에는 영향이 없다.
</details>

### Q4. 메서드의 첫 매개변수 `self`에 대한 설명으로 옳은 것은?

1. 호출할 때 반드시 직접 넘겨줘야 한다
2. 인스턴스 자기 자신을 가리키며, 호출 시에는 자동으로 전달된다
3. 클래스 이름을 담는 변수다
4. 생략해도 무방하다

<details>
<summary>정답 보기</summary>

**정답: 2번**

`account.deposit(500)`이라고 쓰면 파이썬이 `account`를 `self` 자리에 자동으로 넣는다. 정의할 때는 반드시 써야 하고, 호출할 때는 쓰지 않는다.
</details>

### Q5. 저장한 CSV를 윈도우 엑셀에서 열었더니 한글이 깨졌다. 해결 방법은?

1. `index=False`를 추가한다
2. `encoding="utf-8-sig"`로 저장한다
3. `parse_dates=True`를 추가한다
4. 파일 확장자를 `.xlsx`로 바꾼다

<details>
<summary>정답 보기</summary>

**정답: 2번**

`utf-8-sig`는 파일 앞에 BOM을 붙여 엑셀이 인코딩을 올바로 인식하게 한다.
</details>

### Q6. `Account.buy()`에서 현금이 부족할 때 `raise ValueError(...)`를 쓰는 이유는?

1. 프로그램을 빠르게 종료시키기 위해
2. 잘못된 상태로 계좌가 진행되는 것을 막고, 문제를 즉시 드러내기 위해
3. 실행 속도를 높이기 위해
4. 파일 저장을 강제하기 위해

<details>
<summary>정답 보기</summary>

**정답: 2번**

현금이 마이너스가 된 채로 계산이 계속되면 이후 모든 결과가 잘못된다. 잘못된 입력은 조용히 넘기지 말고 그 자리에서 멈추게 하는 편이 안전하다.
</details>

### Q7. `run_invest.py`에서 `math.floor(target_amount / price)`를 쓴 이유는?

1. 계산 속도를 높이려고
2. 주식은 1주 단위로만 살 수 있어 소수점을 버려야 하므로
3. 반올림하면 오차가 커지므로
4. 수수료를 반영하려고

<details>
<summary>정답 보기</summary>

**정답: 2번**

`round()`로 올림이 되면 예산을 초과해 현금 부족 에러가 날 수 있다. 내림(`floor`)을 써야 안전하다.
</details>

### Q8. 빈칸을 채워 `Account`의 총자산 계산 메서드를 완성하시오.

```python
def market_value(self, prices):
    """보유 종목의 평가금액 합계를 반환한다."""
    total = 0.0
    for name, qty in ______.holdings.items():
        total += prices[name] * qty
    return total


def total_value(self, prices):
    """현금을 포함한 총 자산가치를 반환한다."""
    return ______.cash + ______.market_value(prices)
```

<details>
<summary>정답 보기</summary>

세 빈칸 모두 `self`다.

```python
def total_value(self, prices):
    return self.cash + self.market_value(prices)
```

메서드 안에서 다른 메서드를 호출할 때도 `self.`를 붙인다.
</details>

### Q9. (심화) 아래 코드에서 `avg_price`가 갱신되는 방식을 설명하시오.

```python
prev_qty = self.holdings.get(name, 0)
prev_avg = self.avg_price.get(name, 0)
new_qty = prev_qty + quantity

self.avg_price[name] = (prev_avg * prev_qty + amount) / new_qty
```

<details>
<summary>정답 보기</summary>

**이동평균 방식의 평균단가 계산이다.**

`prev_avg * prev_qty`는 기존 보유분의 총 매입금액, `amount`는 이번에 새로 산 금액이다. 두 금액을 더해 전체 수량으로 나누면 갱신된 평균단가가 된다.

예: 70,000원에 10주 보유 중 72,000원에 10주 추가 매수
→ `(70000×10 + 72000×10) / 20 = 71,000원`

`.get(name, 0)`을 쓴 이유는 처음 사는 종목일 때 키가 없어 `KeyError`가 나는 것을 막기 위해서다.
</details>

---

## 다음 주 예고

8주차는 **나만의 포트폴리오**를 만드는 마지막 시간이다. 8주 동안 배운 문법을 총정리하고, `quantkit` 코드를 리팩토링한 뒤, **각자 자기 기준으로 종목과 비중을 직접 설계해 발표**한다.

이번 주에 집행한 모의계좌는 다음 주까지 그대로 운용한다. `account.json`과 `transactions.csv`를 지우지 말고, 매매할 때마다 **그 판단의 이유를 한 줄씩 기록**해두면 발표 준비가 훨씬 수월해진다.
