import type { WeekDoc } from "./weekDoc";

/** 4주차 — 위험을 재는 법.
 *  files/week4-measuring-risk.md 를 옮긴 것. */

export const WEEK4_DOC: WeekDoc = {
  sub: "pandas 통계 메서드 · numpy 배열 연산 → 변동성 · CAGR · 샤프지수 · MDD",
  lead: "수익률만 보고 투자하면 절반만 보는 것이다. 연 20%를 벌었더라도 중간에 반토막이 났다면 같은 20%가 아니다. 이번 주는 <b>\"얼마나 벌었나\"에 \"얼마나 위험했나\"를 나란히 놓는 법</b>을 배운다.",

  slides: [
    /* ── 0. 복습 ── */
    {
      title: "0. 3주차 복습 노트",
      blocks: [
        { t: "p", text: "3주간의 공백이 있었으므로 지난 내용을 조금 넉넉히 복습한다." },
        { t: "h", text: "파이썬 문법" },
        {
          t: "table",
          head: ["개념", "핵심"],
          rows: [
            ["<b>리스트</b>", "<code>[ ]</code>, 인덱스 0부터, <code>prices[-1]</code>은 마지막, <code>prices[1:3]</code>은 3 미포함"],
            ["<b>딕셔너리</b>", "<code>{ }</code>, <code>portfolio[\"삼성전자\"]</code>, <code>.items()</code>로 키·값 동시 순회"],
            ["<b>임포트</b>", "<code>import pandas as pd</code>, 외부 라이브러리는 가상환경에 설치"],
            ["<b>Series</b>", "pandas 1차원 데이터, 반복문 없이 벡터 연산"],
            ["<b>DataFrame</b>", "2차원 표, <code>df[\"열이름\"]</code>으로 열 선택"],
            ["<b><code>.shift(1)</code></b>", "데이터를 한 칸 밀어 전날 값을 옆에 놓는다"],
          ],
        },
        { t: "h", text: "금융 개념" },
        {
          t: "table",
          head: ["개념", "공식", "코드"],
          rows: [
            ["단순수익률", "$P_t/P_{t-1}-1$", "<code>prices.pct_change()</code>"],
            ["로그수익률", "$\\ln(P_t/P_{t-1})$", "<code>np.log(prices / prices.shift(1))</code>"],
          ],
        },
        {
          t: "p",
          text: "기억할 것: <b>시간축으로 더할 때는 로그수익률, 자산 간 합칠 때는 단순수익률.</b>",
        },
      ],
    },
    {
      title: "코드로 보는 3주차 · 이번 주 준비",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `import numpy as np
import pandas as pd

prices = pd.Series([70000, 71400, 70700, 72100, 71000])

simple = prices.pct_change().dropna()
log_ret = np.log(prices / prices.shift(1)).dropna()

print(f"평균 일간 수익률: {simple.mean():.4%}")`,
        },
        { t: "h", text: "이번 주 준비" },
        {
          t: "p",
          text: "가상환경을 활성화하고, 지난주에 저장한 <code>prices.csv</code>가 프로젝트 폴더에 있는지 확인한다. 없다면 3주차 코드를 다시 한 번 실행하면 된다.",
        },
        { t: "code", lang: "bash", code: `pip install matplotlib      # 이번 주에 간단한 그래프를 그린다` },
        { t: "p", text: "<code>week4.py</code> 파일을 새로 만든다." },
      ],
    },

    /* ── 1. pandas 통계 메서드 ── */
    {
      title: "1. pandas 통계 메서드",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>통계 메서드란 Series나 DataFrame에 담긴 값들의 대표적인 특성(평균, 산포, 극값 등)을 계산해 돌려주는 내장 기능이다.</b>",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "pandas의 통계 메서드는 <b>계산기의 전용 버튼</b>이다. 평균을 구하려고 값을 다 더하고 개수로 나누는 과정을 직접 짜는 대신, <code>.mean()</code> 버튼 하나를 누르는 것이다. 수천 개의 값에도 똑같이 한 번만 누르면 된다.",
        },
        { t: "h", text: "기본 메서드" },
        {
          t: "code",
          lang: "python",
          code: `import pandas as pd

returns = pd.Series([0.020, -0.010, 0.020, -0.015, 0.021, 0.010, -0.016, 0.028, 0.014])

print(f"개수     {returns.count()}")
print(f"평균     {returns.mean():.6f}")
print(f"표준편차 {returns.std():.6f}")
print(f"최댓값   {returns.max():.6f}")
print(f"최솟값   {returns.min():.6f}")
print(f"중앙값   {returns.median():.6f}")
print(f"합계     {returns.sum():.6f}")`,
        },
        { t: "p", text: "한 번에 보려면 <code>.describe()</code>를 쓴다." },
        { t: "code", lang: "python", code: `print(returns.describe())` },
      ],
    },
    {
      title: "누적 계산 메서드",
      blocks: [
        { t: "p", text: "시계열 분석에서 특히 중요한 메서드들이다." },
        {
          t: "table",
          head: ["메서드", "의미"],
          rows: [
            ["<code>.cumsum()</code>", "누적 합"],
            ["<code>.cumprod()</code>", "누적 곱"],
            ["<code>.cummax()</code>", "지금까지의 최댓값"],
            ["<code>.cummin()</code>", "지금까지의 최솟값"],
          ],
        },
        {
          t: "code",
          lang: "python",
          code: `prices = pd.Series([100, 120, 90, 110, 80, 95, 130])

print(prices.cummax())
# 0    100
# 1    120
# 2    120   ← 90으로 떨어졌지만 최고 기록은 120
# 3    120
# 4    120
# 5    120
# 6    130   ← 신고가 경신`,
        },
        {
          t: "p",
          text: "<code>.cummax()</code>는 <b>\"지금까지의 최고점\"</b> 을 추적한다. MDD 계산의 핵심이 되므로 이 동작을 확실히 이해하고 넘어간다.",
        },
      ],
    },
    {
      title: "이동 계산: .rolling()",
      blocks: [
        {
          t: "p",
          text: "<b>정의: <code>.rolling(n)</code>은 연속된 n개의 값으로 이루어진 창(window)을 데이터 위에서 한 칸씩 밀어가며 계산하는 기능이다.</b>",
        },
        {
          t: "p",
          text: "<b>비유:</b> 창문 하나를 데이터 위에 올려놓고 오른쪽으로 한 칸씩 밀면서, 그때그때 창문 안에 보이는 값들만으로 계산하는 것이다. 이렇게 하면 \"최근 20일 평균\"처럼 시점마다 달라지는 지표를 만들 수 있다.",
        },
        {
          t: "code",
          lang: "python",
          code: `prices = pd.Series([100, 102, 101, 105, 104, 108, 107])

print(prices.rolling(3).mean())
# 0           NaN   ← 3개가 안 모임
# 1           NaN
# 2    101.000000   ← (100+102+101)/3
# 3    102.666667   ← (102+101+105)/3
# 4    103.333333
# 5    105.666667
# 6    106.333333`,
        },
        { t: "p", text: "앞의 n-1개는 창을 채울 데이터가 부족해 <code>NaN</code>이 된다." },
        { t: "p", text: "<code>.rolling()</code> 뒤에는 어떤 통계 메서드든 붙일 수 있다." },
        {
          t: "code",
          lang: "python",
          code: `prices.rolling(20).mean()   # 20일 이동평균 (주가 차트의 그 이동평균선)
prices.rolling(20).std()    # 20일 이동 표준편차 (변동성 추이)
prices.rolling(20).max()    # 20일 최고가`,
        },
      ],
    },

    /* ── 2. numpy ── */
    {
      title: "2. numpy 배열 연산",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>numpy는 다차원 배열(ndarray)과 그 위에서의 고속 수치 연산을 제공하는 파이썬 라이브러리다.</b> pandas는 내부적으로 numpy 위에 만들어져 있다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "파이썬 리스트가 <b>아무 물건이나 담을 수 있는 종이봉투</b>라면, numpy 배열은 <b>같은 규격의 부품만 담는 전용 트레이</b>다. 규격이 통일되어 있어 기계가 한꺼번에 처리할 수 있고, 그만큼 훨씬 빠르다.",
        },
        { t: "h", text: "배열 만들기와 연산" },
        {
          t: "code",
          lang: "python",
          code: `import numpy as np

arr = np.array([70000, 71400, 70700, 72100, 71000])

print(arr)              # [70000 71400 70700 72100 71000]
print(arr / 1000)       # [70.  71.4 70.7 72.1 71. ]
print(arr * 2)          # 전체에 2를 곱함
print(arr.mean())       # 71040.0
print(arr.std())        # 725.0...`,
        },
        {
          t: "p",
          text: "리스트와 결정적으로 다른 점은 <b>원소별 연산(element-wise operation)</b> 이다.",
        },
        {
          t: "code",
          lang: "python",
          code: `a = [1, 2, 3]
b = [4, 5, 6]
print(a + b)                # [1, 2, 3, 4, 5, 6]  ← 리스트는 이어붙이기

na = np.array([1, 2, 3])
nb = np.array([4, 5, 6])
print(na + nb)              # [5 7 9]              ← 배열은 원소별 덧셈
print(na * nb)              # [ 4 10 18]           ← 원소별 곱셈`,
        },
      ],
    },
    {
      title: "자주 쓰는 numpy 함수",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `import numpy as np

print(np.sqrt(252))              # 15.8745   제곱근 — 변동성 연율화에 사용
print(np.log(1.02))              # 0.019803  자연로그 — 로그수익률
print(np.exp(0.02))              # 1.020201  지수 — 로그수익률 복원
print(np.dot([1, 2], [3, 4]))    # 11        내적 — 6주차 포트폴리오 계산

print(np.zeros(3))               # [0. 0. 0.]
print(np.ones(3))                # [1. 1. 1.]
print(np.arange(0, 1, 0.25))     # [0.   0.25 0.5  0.75]
print(np.linspace(0, 1, 5))      # [0.   0.25 0.5  0.75 1.  ]`,
        },
        {
          t: "p",
          text: "<code>np.sqrt()</code>는 이번 주 변동성 연율화에서, <code>np.dot()</code>은 6주차 포트폴리오 계산에서 핵심적으로 쓰인다.",
        },
        { t: "h", text: "pandas와 numpy의 관계" },
        {
          t: "code",
          lang: "python",
          code: `import numpy as np
import pandas as pd

s = pd.Series([1, 2, 3])

print(np.log(s))       # numpy 함수를 Series에 그대로 적용 가능
print(s.values)        # Series → numpy 배열로 변환
print(type(s.values))  # <class 'numpy.ndarray'>`,
        },
        {
          t: "p",
          text: "<b>pandas Series에 numpy 함수를 그대로 쓸 수 있다.</b> 3주차에 <code>np.log(prices / prices.shift(1))</code>이 동작했던 이유가 이것이다.",
        },
      ],
    },

    /* ── 3. 변동성 ── */
    {
      title: "3. 변동성 (Volatility)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>변동성이란 수익률이 평균으로부터 흩어져 있는 정도이며, 통상 수익률의 표준편차로 측정한다.</b> 금융에서 가장 널리 쓰이는 위험 지표다.",
        },
        {
          t: "math",
          tex: "\\sigma = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n}(r_i - \\bar{r})^2}",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "변동성은 <b>길의 울퉁불퉁함</b>이다. 두 길의 도착지가 같아도, 한쪽은 평탄하고 다른 쪽은 오르내림이 심하다면 후자가 더 위험하다. 변동성은 \"이 자산의 가격이 평소 얼마나 요동치는가\"를 하나의 숫자로 요약한다.",
        },
        {
          t: "p",
          text: "주의할 점은 <b>변동성은 방향을 구분하지 않는다</b>는 것이다. 크게 오르는 것도, 크게 내리는 것도 똑같이 변동성을 키운다.",
        },
      ],
    },
    {
      title: "연율화 (Annualization)",
      blocks: [
        {
          t: "p",
          text: "일간 수익률로 계산한 표준편차는 \"하루치 변동성\"이다. 서로 다른 기간의 데이터를 비교하려면 <b>연 단위로 환산</b>해야 한다.",
        },
        { t: "math", tex: "\\sigma_{\\text{연}} = \\sigma_{\\text{일}} \\times \\sqrt{252}" },
        {
          t: "p",
          text: "252는 1년의 대략적인 거래일 수다(주말·공휴일 제외). 제곱근이 붙는 이유는 분산이 시간에 비례하고, 표준편차는 그 제곱근이기 때문이다.",
        },
        {
          t: "table",
          head: ["데이터 주기", "곱하는 값"],
          rows: [
            ["일간", "$\\sqrt{252}$ ≈ 15.87"],
            ["주간", "$\\sqrt{52}$ ≈ 7.21"],
            ["월간", "$\\sqrt{12}$ ≈ 3.46"],
          ],
        },
        { t: "h", text: "코드" },
        {
          t: "code",
          lang: "python",
          code: `import numpy as np
import pandas as pd

TRADING_DAYS = 252


def volatility(returns, periods=TRADING_DAYS):
    """일간 수익률 Series를 받아 연율화 변동성을 반환한다."""
    return returns.std() * np.sqrt(periods)


prices = pd.Series([70000, 71400, 70700, 72100, 71000, 72500, 73200, 72000, 74000, 75000])
returns = prices.pct_change().dropna()

print(f"일간 표준편차 : {returns.std():.4%}")        # 1.7075%
print(f"연율화 변동성 : {volatility(returns):.2%}")  # 27.11%`,
        },
        { t: "h", text: "변동성의 추이 보기" },
        {
          t: "p",
          text: "<code>.rolling()</code>을 쓰면 변동성이 시간에 따라 어떻게 변했는지 볼 수 있다.",
        },
        {
          t: "code",
          lang: "python",
          code: `rolling_vol = returns.rolling(20).std() * np.sqrt(252)
print(rolling_vol.tail())`,
        },
        {
          t: "p",
          text: "시장이 불안할 때 변동성이 치솟는 현상(변동성 군집, volatility clustering)을 눈으로 확인할 수 있다.",
        },
      ],
    },

    /* ── 4. CAGR ── */
    {
      title: "4. CAGR — 연평균 복리 수익률",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>CAGR(Compound Annual Growth Rate)이란 투자 기간 전체의 성과를, 매년 일정한 비율로 복리 성장했다고 가정했을 때의 연간 수익률로 환산한 값이다.</b>",
        },
        {
          t: "math",
          tex: "CAGR = \\left(\\frac{V_{\\text{end}}}{V_{\\text{start}}}\\right)^{1/n} - 1",
        },
        { t: "ul", items: ["$n$: 투자 기간(년)"] },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "CAGR은 <b>울퉁불퉁한 등산로를 같은 높이의 일정한 경사로로 바꾸는 것</b>이다. 실제로는 오르락내리락했지만 \"결국 매년 몇 %씩 꾸준히 오른 것과 같은가\"를 묻는다. 서로 기간이 다른 투자를 공정하게 비교하려면 이 환산이 필요하다.",
        },
        { t: "h", text: "왜 산술평균이 아닌가" },
        {
          t: "code",
          lang: "python",
          code: `# 1년차 +100%, 2년차 -50%
# 산술평균: (100 - 50) / 2 = +25%  ← 매년 25%씩 벌었다고?
# 실제:     1 × 2 × 0.5 = 1.0      ← 2년 후 원금 그대로, 즉 0%

print((1 * 2 * 0.5) ** (1/2) - 1)   # 0.0  ← CAGR은 정확히 0%`,
        },
        {
          t: "p",
          text: "수익률은 곱셈으로 누적되므로 산술평균이 아니라 <b>기하평균</b>으로 계산해야 한다. CAGR이 바로 그 기하평균이다.",
        },
        { t: "h", text: "코드" },
        {
          t: "code",
          lang: "python",
          code: `def cagr(prices, periods=TRADING_DAYS):
    """가격 Series를 받아 연평균 복리 수익률을 반환한다."""
    total_return = prices.iloc[-1] / prices.iloc[0]
    years = len(prices) / periods
    return total_return ** (1 / years) - 1


# 3년간 1000만원 → 1500만원
print(f"{(15000000/10000000) ** (1/3) - 1:.2%}")   # 14.47%`,
        },
        {
          t: "p",
          text: "3년 만에 50%를 벌었지만, 연 단위로 환산하면 14.47%다. 단순히 50 ÷ 3 = 16.7%로 계산하면 복리 효과를 중복 계산해 과대평가하게 된다.",
        },
      ],
    },

    /* ── 5. 샤프지수 ── */
    {
      title: "5. 샤프지수 (Sharpe Ratio)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>샤프지수란 무위험수익률을 초과한 수익을 그 수익을 얻기 위해 감수한 위험(변동성)으로 나눈 값이다.</b> 위험 한 단위당 얼마의 초과수익을 얻었는지를 나타낸다.",
        },
        { t: "math", tex: "S = \\frac{R_p - R_f}{\\sigma_p}" },
        {
          t: "ul",
          items: ["$R_p$: 포트폴리오 연수익률, $R_f$: 무위험수익률, $\\sigma_p$: 연율화 변동성"],
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "샤프지수는 <b>연비</b>다. 자동차를 평가할 때 \"얼마나 멀리 갔나\"만 보지 않고 \"연료를 얼마나 썼나\"를 함께 본다. 같은 거리를 갔어도 연료를 적게 쓴 차가 더 좋다. 마찬가지로 같은 수익이라면 변동성을 덜 겪은 쪽이 더 나은 투자다.",
        },
        {
          t: "p",
          text: "무위험수익률을 빼는 이유는, <b>아무 위험 없이도 얻을 수 있었던 수익은 실력이 아니기 때문</b>이다. 국고채에 넣어두기만 해도 3%를 벌 수 있었다면, 12%를 번 것 중 실제 성과는 9%다.",
        },
        { t: "h", text: "해석 기준" },
        {
          t: "table",
          head: ["샤프지수", "통상적 평가"],
          rows: [
            ["&lt; 0", "무위험자산보다 못함"],
            ["0 ~ 1", "보통"],
            ["1 ~ 2", "양호"],
            ["&gt; 2", "우수"],
          ],
        },
        { t: "p", text: "절대적 기준은 아니며, 자산군과 기간에 따라 달라진다." },
      ],
    },
    {
      title: "샤프지수 — 코드와 한계",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `def sharpe_ratio(returns, risk_free=0.03, periods=TRADING_DAYS):
    """
    일간 수익률 Series를 받아 연율화 샤프지수를 반환한다.
    risk_free : 연 무위험수익률 (기본 3%)
    """
    annual_return = returns.mean() * periods
    annual_vol = returns.std() * np.sqrt(periods)
    return (annual_return - risk_free) / annual_vol


# 연수익률 12%, 연변동성 18%, 무위험 3%
print(f"{(0.12 - 0.03) / 0.18:.2f}")   # 0.50`,
        },
        { t: "h", text: "샤프지수의 한계" },
        {
          t: "ul",
          items: [
            "<b>정규분포를 가정한다.</b> 실제 수익률은 극단적 사건이 이론보다 자주 일어난다(팻테일).",
            "<b>상승 변동성도 위험으로 센다.</b> 크게 오르는 것도 분모를 키운다. 이를 보완해 하방 변동성만 쓰는 지표가 소르티노 지수(Sortino Ratio)다.",
            "<b>기간에 민감하다.</b> 어느 구간을 잘라 재느냐에 따라 값이 크게 달라진다.",
          ],
        },
      ],
    },

    /* ── 6. MDD ── */
    {
      title: "6. MDD — 최대낙폭 (Maximum Drawdown)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>MDD란 관측 기간 중 자산 가치가 이전 최고점 대비 가장 크게 하락한 폭이다.</b>",
        },
        {
          t: "math",
          tex: "MDD = \\min_t \\left( \\frac{V_t}{\\max_{s \\le t} V_s} - 1 \\right)",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "MDD는 <b>\"최악의 순간에 얼마나 아팠는가\"</b> 를 재는 지표다. 변동성이 여정 전체의 울퉁불퉁함을 평균 낸 값이라면, MDD는 <b>가장 깊었던 계곡 하나의 깊이</b>다.",
        },
        {
          t: "p",
          text: "이 지표가 중요한 이유는 심리적인 것이다. 최종 수익률이 아무리 좋아도, 중간에 -50%를 겪으면 대부분의 투자자는 그 지점에서 팔아버린다. <b>버틸 수 있는 손실의 크기</b>가 실제 투자를 결정한다.",
        },
      ],
    },
    {
      title: "MDD 계산 과정",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `import pandas as pd

prices = pd.Series([100, 120, 90, 110, 80, 95, 130])

cummax = prices.cummax()          # 지금까지의 최고점
drawdown = prices / cummax - 1    # 최고점 대비 하락률

print(pd.DataFrame({"가격": prices, "최고점": cummax, "낙폭": drawdown}))
#    가격  최고점       낙폭
# 0   100    100  0.000000
# 1   120    120  0.000000
# 2    90    120 -0.250000   ← 120에서 90으로, -25%
# 3   110    120 -0.083333
# 4    80    120 -0.333333   ← 최악의 순간, -33.3%
# 5    95    120 -0.208333
# 6   130    130  0.000000   ← 신고가

print(f"MDD: {drawdown.min():.2%}")   # MDD: -33.33%`,
        },
        {
          t: "p",
          text: "핵심은 <b><code>.cummax()</code>로 \"그 시점까지의 최고점\"을 만든 뒤, 현재 가격을 그것으로 나누는 것</b>이다. 낙폭은 항상 0 이하이며, MDD는 그중 가장 작은 값이다.",
        },
        {
          t: "code",
          lang: "python",
          code: `def max_drawdown(prices):
    """가격 Series를 받아 최대낙폭(음수)을 반환한다."""
    cummax = prices.cummax()
    drawdown = prices / cummax - 1
    return drawdown.min()


def drawdown_series(prices):
    """낙폭 추이 전체를 Series로 반환한다. 그래프용."""
    return prices / prices.cummax() - 1`,
        },
      ],
    },
    {
      title: "회복에 필요한 수익률",
      blocks: [
        { t: "p", text: "낙폭과 회복률은 대칭이 아니다." },
        {
          t: "code",
          lang: "python",
          code: `for dd in [-0.10, -0.20, -0.30, -0.50, -0.70, -0.90]:
    recovery = 1 / (1 + dd) - 1
    print(f"낙폭 {dd:>7.0%} → 회복에 필요한 수익률 {recovery:>8.1%}")

# 낙폭    -10% → 회복에 필요한 수익률    11.1%
# 낙폭    -20% → 회복에 필요한 수익률    25.0%
# 낙폭    -30% → 회복에 필요한 수익률    42.9%
# 낙폭    -50% → 회복에 필요한 수익률   100.0%
# 낙폭    -70% → 회복에 필요한 수익률   233.3%
# 낙폭    -90% → 회복에 필요한 수익률   900.0%`,
        },
        {
          t: "p",
          text: "<b>-50%를 회복하려면 +100%가 필요하다.</b> 손실을 줄이는 것이 수익을 늘리는 것보다 중요한 이유이며, MDD를 별도로 관리하는 이유다.",
        },
      ],
    },

    /* ── 7. 네 지표 ── */
    {
      title: "7. 네 지표를 함께 보기",
      blocks: [
        {
          t: "table",
          head: ["지표", "답하는 질문", "좋은 방향"],
          rows: [
            ["<b>CAGR</b>", "결국 연 몇 %로 불어났나", "높을수록"],
            ["<b>변동성</b>", "평소 얼마나 요동쳤나", "낮을수록"],
            ["<b>샤프지수</b>", "위험 대비 얼마나 효율적이었나", "높을수록"],
            ["<b>MDD</b>", "최악의 순간 얼마나 잃었나", "0에 가까울수록"],
          ],
        },
        { t: "p", text: "어느 하나만으로는 부족하다." },
        {
          t: "ul",
          items: [
            "CAGR만 보면 <b>중간의 고통</b>을 놓친다.",
            "변동성만 보면 <b>방향</b>을 놓친다(오르는 변동도 위험으로 센다).",
            "샤프지수만 보면 <b>극단적 사건</b>을 놓친다.",
            "MDD만 보면 <b>평소의 성과</b>를 놓친다.",
          ],
        },
        {
          t: "p",
          text: "그래서 실무에서는 이 네 가지를 한 장의 표로 함께 본다. 오늘의 코드가 그 표를 만든다.",
        },
      ],
    },

    /* ── 정리 ── */
    {
      title: "오늘 배운 것 정리",
      blocks: [
        { t: "h", text: "파이썬 문법" },
        {
          t: "table",
          head: ["개념", "한 줄 정의", "핵심"],
          rows: [
            ["<b>통계 메서드</b>", "Series의 대표 특성을 계산하는 내장 기능", "<code>.mean()</code>, <code>.std()</code>, <code>.describe()</code>"],
            ["<b>누적 메서드</b>", "처음부터 현재까지를 누적 계산", "<code>.cummax()</code>는 MDD의 핵심"],
            ["<b><code>.rolling(n)</code></b>", "n개짜리 창을 밀며 계산", "이동평균, 이동 변동성"],
            ["<b>numpy 배열</b>", "같은 종류 값의 고속 연산용 자료구조", "원소별 연산, <code>np.sqrt()</code>, <code>np.dot()</code>"],
          ],
        },
        { t: "h", text: "금융 지표" },
        {
          t: "table",
          head: ["지표", "공식", "코드"],
          rows: [
            ["변동성", "$\\sigma_{일} \\times \\sqrt{252}$", "<code>returns.std() * np.sqrt(252)</code>"],
            ["CAGR", "$(V_{end}/V_{start})^{1/n} - 1$", "<code>(p[-1]/p[0]) ** (1/years) - 1</code>"],
            ["샤프지수", "$(R_p - R_f)/\\sigma_p$", "<code>(ann_ret - rf) / ann_vol</code>"],
            ["MDD", "$\\min(V_t / \\max V_s - 1)$", "<code>(p / p.cummax() - 1).min()</code>"],
          ],
        },
        {
          t: "p",
          text: "기억할 것: <b>연율화할 때 수익률은 × 252, 변동성은 × √252.</b>",
        },
      ],
    },

    /* ── 오늘의 코드 ── */
    {
      title: "오늘의 코드",
      blocks: [
        { t: "p", text: "<code>week4.py</code> 파일에 붙여넣고 실행한다." },
        {
          t: "code",
          lang: "python",
          code: `"""
4주차 실습 — 위험 지표 계산기
CAGR, 변동성, 샤프지수, MDD를 함수로 구현하고 종목별로 비교한다.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

TRADING_DAYS = 252
RISK_FREE = 0.03


# ── 성과·위험 지표 함수 ──────────────────────────────────

def cagr(prices, periods=TRADING_DAYS):
    """연평균 복리 수익률(CAGR)을 반환한다."""
    years = len(prices) / periods
    return (prices.iloc[-1] / prices.iloc[0]) ** (1 / years) - 1


def volatility(returns, periods=TRADING_DAYS):
    """연율화 변동성(수익률의 표준편차)을 반환한다."""
    return returns.std() * np.sqrt(periods)


def sharpe_ratio(returns, risk_free=RISK_FREE, periods=TRADING_DAYS):
    """연율화 샤프지수를 반환한다."""
    annual_return = returns.mean() * periods
    annual_vol = returns.std() * np.sqrt(periods)
    if annual_vol == 0:
        return 0
    return (annual_return - risk_free) / annual_vol


def drawdown_series(prices):
    """최고점 대비 낙폭 추이를 Series로 반환한다."""
    return prices / prices.cummax() - 1


def max_drawdown(prices):
    """최대낙폭(MDD)을 반환한다. 항상 0 이하의 값."""
    return drawdown_series(prices).min()


def summarize(prices, name="자산"):
    """가격 Series 하나에 대한 성과 요약을 딕셔너리로 반환한다."""
    returns = prices.pct_change().dropna()
    return {
        "종목": name,
        "총수익률": prices.iloc[-1] / prices.iloc[0] - 1,
        "CAGR": cagr(prices),
        "변동성": volatility(returns),
        "샤프": sharpe_ratio(returns),
        "MDD": max_drawdown(prices),
    }


# ── 1) 데이터 불러오기 ───────────────────────────────────

prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)

print("데이터 기간:", prices.index[0].date(), "~", prices.index[-1].date())
print("종목:", list(prices.columns))


# ── 2) 종목별 지표 계산 ──────────────────────────────────

results = []
for name in prices.columns:
    results.append(summarize(prices[name], name))

summary = pd.DataFrame(results).set_index("종목")

print()
print("=" * 70)
print(f"{'종목':<12}{'총수익률':>12}{'CAGR':>10}{'변동성':>10}{'샤프':>8}{'MDD':>10}")
print("=" * 70)

for name, row in summary.iterrows():
    print(f"{name:<12}"
          f"{row['총수익률']:>12.2%}"
          f"{row['CAGR']:>10.2%}"
          f"{row['변동성']:>10.2%}"
          f"{row['샤프']:>8.2f}"
          f"{row['MDD']:>10.2%}")

print("=" * 70)


# ── 3) 낙폭 추이 확인 ────────────────────────────────────

print()
print("종목별 최악의 순간")
print("-" * 70)

for name in prices.columns:
    dd = drawdown_series(prices[name])
    worst_date = dd.idxmin()
    print(f"{name:<12}{worst_date.date()}   {dd.min():>8.2%}")


# ── 4) 20일 이동 변동성 ──────────────────────────────────

returns = prices.pct_change().dropna()
rolling_vol = returns.rolling(20).std() * np.sqrt(TRADING_DAYS)

print()
print("최근 20일 기준 연율화 변동성")
print("-" * 70)
for name in prices.columns:
    print(f"{name:<12}{rolling_vol[name].iloc[-1]:>10.2%}")


# ── 5) 그래프 (누적 수익률 + 낙폭) ───────────────────────

plt.rcParams["font.family"] = "Malgun Gothic"   # Windows
# plt.rcParams["font.family"] = "AppleGothic"   # macOS
# plt.rcParams["font.family"] = "NanumGothic"   # Linux
plt.rcParams["axes.unicode_minus"] = False

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8), sharex=True)

# 위: 시작점을 1로 맞춘 누적 성과
normalized = prices / prices.iloc[0]
for name in prices.columns:
    ax1.plot(normalized.index, normalized[name], label=name)
ax1.set_title("누적 성과 (시작=1)")
ax1.legend()
ax1.grid(alpha=0.3)

# 아래: 낙폭
for name in prices.columns:
    ax2.plot(prices.index, drawdown_series(prices[name]), label=name)
ax2.set_title("최고점 대비 낙폭 (Drawdown)")
ax2.legend()
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig("week4_risk.png", dpi=120)
print()
print("그래프를 week4_risk.png로 저장했다.")
plt.show()`,
        },
        {
          t: "note",
          text: "<b>한글 폰트가 깨진다면</b> 위 <code>plt.rcParams[\"font.family\"]</code> 줄에서 본인 OS에 맞는 줄만 남기고 나머지는 주석 처리한다. Linux에서 나눔고딕이 없다면 <code>sudo apt install fonts-nanum</code>으로 설치한 뒤 사용한다.",
        },
      ],
    },
    {
      title: "오프라인 연습용",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""데이터를 못 받을 때 — 하드코딩한 가격으로 동일한 지표 계산"""
import numpy as np
import pandas as pd

prices = pd.Series([100, 120, 90, 110, 80, 95, 130])
returns = prices.pct_change().dropna()

cummax = prices.cummax()
drawdown = prices / cummax - 1

print(pd.DataFrame({"가격": prices, "최고점": cummax, "낙폭": drawdown}))
print(f"\\nMDD          {drawdown.min():.2%}")        # -33.33%
print(f"총수익률     {prices.iloc[-1]/prices.iloc[0]-1:.2%}")   # 30.00%
print(f"일간 표준편차 {returns.std():.4f}")`,
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
          q: "다음 코드의 출력 결과는?",
          code: `import pandas as pd
prices = pd.Series([100, 120, 90, 110])
print(list(prices.cummax()))`,
          options: [
            "<code>[100, 120, 90, 110]</code>",
            "<code>[100, 120, 120, 120]</code>",
            "<code>[100, 220, 310, 420]</code>",
            "<code>[120, 120, 120, 120]</code>",
          ],
          correct: [2],
          explain:
            "<code>.cummax()</code>는 각 시점까지의 최댓값을 기록한다. 90과 110은 이전 최고점 120을 넘지 못했으므로 120이 유지된다.",
        },
        {
          t: "quiz",
          no: "Q2",
          q: "일간 수익률의 표준편차가 1.5%일 때, 연율화 변동성은?",
          options: [
            "<code>1.5% × 252 = 378%</code>",
            "<code>1.5% × √252 ≈ 23.8%</code>",
            "<code>1.5% ÷ 252 ≈ 0.006%</code>",
            "<code>1.5%</code> (환산 불필요)",
          ],
          correct: [2],
          explain:
            "분산이 시간에 비례하므로 표준편차는 시간의 제곱근에 비례한다. 따라서 √252 ≈ 15.87을 곱한다. <b>수익률은 × 252, 변동성은 × √252</b>로 구분해서 기억한다.",
        },
        {
          t: "quiz",
          no: "Q3",
          q: "1년차 +100%, 2년차 -50%를 기록한 자산의 CAGR은?",
          options: ["<code>+25%</code>", "<code>+50%</code>", "<code>0%</code>", "<code>-25%</code>"],
          correct: [3],
          explain:
            "<code>1 × 2 × 0.5 = 1.0</code>이므로 2년 후 원금 그대로다. <code>(1.0)^(1/2) - 1 = 0</code>. 산술평균 +25%는 잘못된 계산이며, 수익률은 곱셈으로 누적되므로 기하평균(CAGR)을 써야 한다.",
        },
      ],
    },
    {
      title: "오늘의 테스트 (2)",
      blocks: [
        {
          t: "quiz",
          no: "Q4",
          q: "어떤 자산이 -50%의 낙폭을 겪었다. 원래 가격으로 회복하려면 몇 %가 올라야 하는가?",
          options: ["<code>50%</code>", "<code>75%</code>", "<code>100%</code>", "<code>200%</code>"],
          correct: [3],
          explain:
            "100 → 50으로 떨어졌으므로, 다시 100이 되려면 50에서 50만큼(= 100%) 올라야 한다. <code>1/(1-0.5) - 1 = 1.0</code>. 손실 방어가 중요한 이유다.",
        },
        {
          t: "quiz",
          no: "Q5",
          q: "샤프지수 계산에서 무위험수익률을 빼는 이유로 가장 적절한 것은?",
          options: [
            "계산을 단순하게 만들기 위해",
            "위험 없이도 얻을 수 있었던 수익은 성과로 인정할 수 없기 때문",
            "무위험수익률이 항상 음수이기 때문",
            "변동성을 낮추기 위해",
          ],
          correct: [2],
          explain:
            "국고채에 넣어두기만 해도 얻을 수 있었던 수익은 위험을 감수한 대가가 아니다. 샤프지수는 <b>초과수익</b>만을 성과로 본다.",
        },
        {
          t: "quiz",
          no: "Q6",
          q: "<code>.rolling(20).mean()</code>에서 앞의 19개 값이 <code>NaN</code>인 이유는?",
          options: [
            "데이터에 오류가 있어서",
            "창을 채울 20개의 값이 아직 모이지 않아서",
            "<code>.mean()</code>이 앞부분을 계산하지 못해서",
            "<code>.dropna()</code>를 호출하지 않아서",
          ],
          correct: [2],
          explain:
            "<code>.rolling(20)</code>은 연속된 20개의 값이 있어야 계산할 수 있다. 1번째~19번째 시점에는 데이터가 부족하므로 <code>NaN</code>이 된다.",
        },
      ],
    },
    {
      title: "오늘의 테스트 (3)",
      blocks: [
        {
          t: "table",
          head: ["", "CAGR", "변동성", "MDD"],
          rows: [
            ["A", "20%", "40%", "-55%"],
            ["B", "12%", "15%", "-18%"],
          ],
        },
        {
          t: "quiz",
          no: "Q7",
          q: "위 표와 같을 때, 위험 대비 효율이 더 좋은 쪽은? (무위험수익률 3% 가정)",
          options: ["A", "B"],
          correct: [2],
          explain:
            "A의 샤프지수: (0.20 - 0.03) / 0.40 = <b>0.425</b><br>B의 샤프지수: (0.12 - 0.03) / 0.15 = <b>0.600</b><br><br>A가 수익률은 높지만 위험 대비 효율은 B가 낫다. MDD도 B가 훨씬 얕아, 실제로 끝까지 보유하기도 B가 쉽다. <b>수익률만 비교하면 잘못된 결론에 이른다</b>는 것이 이 문제의 요점이다.",
        },
        {
          t: "quiz",
          no: "Q8",
          q: "빈칸을 채워 MDD 함수를 완성하시오.",
          code: `def max_drawdown(prices):
    """가격 Series를 받아 최대낙폭을 반환한다."""
    peak = prices.________()          # 지금까지의 최고점
    drawdown = prices ____ peak - 1   # 최고점 대비 하락률
    return drawdown.________()        # 가장 큰 하락`,
          blanks: [
            { label: "첫 번째 빈칸", accept: ["cummax", "cummax()"] },
            { label: "두 번째 빈칸", accept: ["/"] },
            { label: "세 번째 빈칸", accept: ["min", "min()"] },
          ],
          explain:
            "<code>.cummax()</code>로 최고점을 추적하고, 현재가를 최고점으로 <b>나눠서</b> 하락률을 구한 뒤, 그중 <b>최솟값</b>을 취한다.",
          explainCode: `def max_drawdown(prices):
    """가격 Series를 받아 최대낙폭을 반환한다."""
    peak = prices.cummax()
    drawdown = prices / peak - 1
    return drawdown.min()`,
        },
        {
          t: "quiz",
          no: "Q9",
          q: "(심화) 다음 코드의 출력 결과를 예상하시오.",
          code: `import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print(a + b)
print(a * b)
print(np.dot(a, b))`,
          input: {
            label: "출력 결과 (세 줄)",
            accept: ["[5 7 9]\n[ 4 10 18]\n32", "[5 7 9]\n[4 10 18]\n32"],
            multiline: true,
            placeholder: "한 줄에 하나씩",
          },
          explain:
            "<code>a + b</code>: 원소별 덧셈<br><code>a * b</code>: 원소별 곱셈<br><code>np.dot(a, b)</code>: 내적 = 1×4 + 2×5 + 3×6 = 32<br><br>내적은 6주차에서 포트폴리오 수익률(비중 × 수익률의 합)을 계산할 때 그대로 쓰인다.",
        },
      ],
    },
  ],

  outroTitle: "다음 주 예고",
  outro: [
    {
      t: "p",
      text: "5주차에서는 <b>자산 간의 관계</b>를 다룬다. 지금까지는 자산을 하나씩 따로 봤지만, 포트폴리오를 만들려면 <b>자산들이 서로 어떻게 움직이는지</b>를 알아야 한다. <b>공분산, 상관계수, 베타, CAPM</b>을 배우고 <code>matplotlib</code>으로 본격적인 시각화를 시작한다.",
    },
    {
      t: "p",
      text: "이번 주에 만든 지표 함수(<code>cagr</code>, <code>volatility</code>, <code>sharpe_ratio</code>, <code>max_drawdown</code>)는 7주차 모의투자 코드에서 그대로 재사용하므로 <code>week4.py</code>를 보관해둔다.",
    },
  ],
};
