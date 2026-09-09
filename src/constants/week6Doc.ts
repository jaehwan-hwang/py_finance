import type { WeekDoc } from "./weekDoc";

/** 6주차 — 포트폴리오 최적화.
 *  files/week6-portfolio-optimization.md 를 옮긴 것. */

export const WEEK6_DOC: WeekDoc = {
  sub: "numpy 행렬 연산 · 몬테카를로 시뮬레이션 → 효율적 투자선",
  lead: "지난주에 <b>자산 간 상관관계가 낮으면 포트폴리오 위험이 개별 위험보다 낮아진다</b>는 것을 확인했다. 그렇다면 자연스러운 질문이 따라온다. <b>비중을 어떻게 나눠야 가장 좋은가?</b> 이번 주는 그 질문에 답한다. 이번 주는 8주 중 수학적으로 가장 무거운 주차다. 다만 실제로 쓰는 도구는 지금까지 배운 것의 조합이며, 새로 배우는 것은 <b>행렬 곱셈 기호 하나</b>와 <b>난수 생성</b> 정도다.",

  slides: [
    /* ── 0. 복습 ── */
    {
      title: "0. 5주차 복습 노트",
      blocks: [
        { t: "h", text: "파이썬 문법" },
        {
          t: "table",
          head: ["개념", "핵심"],
          rows: [
            ["<b>다중 자산 관리</b>", "딕셔너리 + DataFrame, 종목 수와 무관한 코드"],
            ["<b><code>axis=1</code></b>", "가로(행 단위) 연산 — 포트폴리오 수익률 합산"],
            ["<b>matplotlib</b>", "<code>plot</code>, <code>scatter</code>, <code>hist</code>, <code>bar</code>, 한글 폰트 설정 필요"],
          ],
        },
        { t: "h", text: "금융 개념" },
        {
          t: "table",
          head: ["개념", "공식", "의미"],
          rows: [
            ["공분산", "$\\text{Cov}(X,Y)$", "함께 움직이는 정도"],
            ["상관계수", "$\\text{Cov}/(\\sigma_X\\sigma_Y)$", "-1~1로 표준화한 관계"],
            ["베타", "$\\text{Cov}(R_i,R_m)/\\text{Var}(R_m)$", "시장에 대한 민감도"],
            ["CAPM", "$R_f + \\beta(E(R_m)-R_f)$", "위험만큼 보상받는다"],
          ],
        },
      ],
    },
    {
      title: "이번 주의 출발점",
      blocks: [
        {
          t: "p",
          text: "지난주 마지막에 확인한 두 자산 포트폴리오의 분산 공식이 이번 주의 시작이다.",
        },
        {
          t: "math",
          tex: "\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2w_1w_2\\rho_{12}\\sigma_1\\sigma_2",
        },
        {
          t: "p",
          text: "변동성 30%와 25%인 두 자산을 상관계수 -0.5로 반씩 섞으면 포트폴리오 변동성은 <b>13.92%</b> 였다. 어느 개별 자산보다도 낮다.",
        },
        {
          t: "p",
          text: "여기서 생기는 질문: <b>50:50이 최선이었을까?</b> 60:40이나 30:70이 더 나았을 수도 있다. 게다가 자산이 3개, 10개로 늘어나면 위 공식은 항이 폭발적으로 늘어나 손으로 쓸 수 없게 된다.",
        },
        {
          t: "p",
          text: "두 문제를 한 번에 해결하는 도구가 <b>행렬 연산</b>과 <b>몬테카를로 시뮬레이션</b>이다.",
        },
        {
          t: "p",
          text: "이번 주 준비 — 가상환경을 활성화하고 <code>prices.csv</code>가 있는지 확인한 뒤 <code>week6.py</code>를 만든다.",
        },
      ],
    },

    /* ── 1. 행렬 연산 ── */
    {
      title: "1. numpy 행렬 연산",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>행렬이란 수를 직사각형 격자 형태로 배열한 것이며, 행렬 연산은 이 격자 단위로 정의된 덧셈·곱셈 등의 계산 규칙이다.</b> numpy는 2차원 배열로 행렬을 표현하고 연산을 제공한다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "행렬 연산은 <b>여러 계산을 한 번에 처리하는 압축 표기법</b>이다. 자산이 10개인 포트폴리오의 분산을 풀어 쓰면 항이 100개나 되지만, 행렬로 쓰면 $w^T \\Sigma w$ 라는 다섯 글자로 끝난다. 계산이 쉬워지는 게 아니라 <b>표기와 코드가 짧아지고, 자산 개수가 바뀌어도 식이 그대로</b>인 것이 핵심이다.",
        },
        { t: "h", text: "2차원 배열 만들기" },
        {
          t: "code",
          lang: "python",
          code: `import numpy as np

matrix = np.array([[1, 2],
                   [3, 4]])

print(matrix)
print(matrix.shape)    # (2, 2)   행 2개, 열 2개
print(matrix[0, 1])    # 2        0행 1열
print(matrix[0])       # [1 2]    0행 전체`,
        },
      ],
    },
    {
      title: "원소별 곱셈 vs 행렬 곱셈",
      blocks: [
        { t: "p", text: "<b>이 둘의 차이가 이번 주의 가장 중요한 문법이다.</b>" },
        {
          t: "code",
          lang: "python",
          code: `A = np.array([[1, 2],
              [3, 4]])
B = np.array([[5, 6],
              [7, 8]])

print(A * B)      # 원소별 곱셈
# [[ 5 12]
#  [21 32]]

print(A @ B)      # 행렬 곱셈
# [[19 22]
#  [43 50]]`,
        },
        {
          t: "p",
          text: "<code>*</code>는 같은 위치끼리 곱하고, <code>@</code>는 행렬 곱셈 규칙(행 × 열의 내적)을 적용한다. <code>@</code> 대신 <code>np.dot(A, B)</code>를 써도 같다.",
        },
        { t: "h", text: "포트폴리오 수익률 = 벡터 내적" },
        { t: "math", tex: "R_p = \\sum_i w_i \\mu_i = w^T \\mu" },
        {
          t: "code",
          lang: "python",
          code: `weights = np.array([0.4, 0.3, 0.3])
mean_returns = np.array([0.12, 0.10, 0.07])

print(weights @ mean_returns)    # 0.099
# 0.4×0.12 + 0.3×0.10 + 0.3×0.07 = 0.048 + 0.03 + 0.021`,
        },
        { t: "p", text: "반복문 없이 한 줄이다. 자산이 100개여도 코드는 똑같다." },
      ],
    },
    {
      title: "포트폴리오 분산 = 이차형식",
      blocks: [
        { t: "math", tex: "\\sigma_p^2 = w^T \\Sigma w" },
        {
          t: "p",
          text: "$\\Sigma$는 공분산 행렬이다. 5주차에서 <code>returns.cov()</code>로 구했던 그 표다.",
        },
        {
          t: "code",
          lang: "python",
          code: `# 두 자산: 변동성 30%, 25%, 상관계수 -0.5
cov = np.array([[0.0900, -0.0375],
                [-0.0375, 0.0625]])
w = np.array([0.5, 0.5])

variance = w @ cov @ w
print(variance)              # 0.019375
print(np.sqrt(variance))     # 0.139194  → 13.92%`,
        },
        {
          t: "p",
          text: "지난주에 공식으로 손으로 풀었던 13.92%가 <b>행렬 곱 두 번</b>으로 나온다.",
        },
        { t: "h", text: "왜 이 형태가 맞는가" },
        {
          t: "p",
          text: "$w^T \\Sigma w$를 2자산으로 풀어 쓰면 지난주 공식과 정확히 같아진다.",
        },
        {
          t: "math",
          tex: "\\begin{pmatrix} w_1 & w_2 \\end{pmatrix}\\begin{pmatrix} \\sigma_1^2 & \\sigma_{12} \\\\ \\sigma_{12} & \\sigma_2^2 \\end{pmatrix}\\begin{pmatrix} w_1 \\\\ w_2 \\end{pmatrix} = w_1^2\\sigma_1^2 + 2w_1w_2\\sigma_{12} + w_2^2\\sigma_2^2",
        },
        {
          t: "p",
          text: "<b>행렬 표기는 새로운 이론이 아니라, 이미 아는 공식을 자산 개수와 무관하게 쓰는 방법</b>이다.",
        },
      ],
    },
    {
      title: "공분산 행렬 만들기",
      blocks: [
        { t: "p", text: "실제 데이터에서는 pandas가 만들어준다." },
        {
          t: "code",
          lang: "python",
          code: `import pandas as pd

returns = prices.pct_change().dropna()

cov_daily = returns.cov()                # 일간 공분산 행렬
cov_annual = cov_daily * 252             # 연율화 (분산은 × 252)

print(cov_annual)
print(cov_annual.values)                 # numpy 배열로 변환`,
        },
        {
          t: "p",
          text: "<b>분산은 시간에 비례하므로 × 252, 표준편차는 × √252</b>임을 다시 확인한다.",
        },
        { t: "p", text: "상관계수 행렬로부터 공분산 행렬을 만들 수도 있다." },
        {
          t: "code",
          lang: "python",
          code: `vols = np.array([0.30, 0.25, 0.15])
corr = np.array([[1.0, 0.6, 0.2],
                 [0.6, 1.0, 0.3],
                 [0.2, 0.3, 1.0]])

cov = np.outer(vols, vols) * corr
print(np.round(cov, 5))
# [[0.09    0.045   0.009  ]
#  [0.045   0.0625  0.01125]
#  [0.009   0.01125 0.0225 ]]`,
        },
        {
          t: "p",
          text: "$\\text{Cov}(i,j) = \\rho_{ij} \\sigma_i \\sigma_j$ 를 행렬 단위로 적용한 것이다.",
        },
        { t: "h", text: "정리: 포트폴리오 함수 두 개" },
        { t: "p", text: "이번 주에 쓸 도구는 사실 이 두 함수가 전부다." },
        {
          t: "code",
          lang: "python",
          code: `def portfolio_return(weights, mean_returns):
    """연율화 기대수익률을 반환한다."""
    return weights @ mean_returns


def portfolio_volatility(weights, cov_matrix):
    """연율화 변동성을 반환한다."""
    return np.sqrt(weights @ cov_matrix @ weights)`,
        },
      ],
    },

    /* ── 2. 몬테카를로 ── */
    {
      title: "2. 몬테카를로 시뮬레이션",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>몬테카를로 시뮬레이션이란 난수를 반복적으로 생성해 그 결과를 관찰함으로써, 해석적으로 풀기 어려운 문제의 답을 근사하는 수치적 방법이다.</b>",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "몬테카를로는 <b>수학으로 안 풀리면 그냥 던져보는 방법</b>이다. 이상한 모양의 연못 넓이를 재고 싶다고 하자. 적분으로 풀려면 연못 경계의 방정식이 필요하지만, 대신 연못을 포함하는 사각형에 돌멩이 10만 개를 무작위로 던진 뒤 물에 빠진 비율을 세면 넓이를 꽤 정확히 알 수 있다.",
        },
        {
          t: "p",
          text: "포트폴리오도 마찬가지다. \"최적 비중\"을 미분해서 푸는 방법도 있지만, <b>비중 조합 수만 개를 무작위로 만들어서 전부 계산해보고 그중 제일 좋은 것을 고르는 것</b>이 훨씬 이해하기 쉽고 코드도 짧다.",
        },
        {
          t: "p",
          text: "2주차의 IRR 이분법과 같은 계열이다. <b>식으로 못 풀면 컴퓨터의 반복 능력으로 푼다.</b>",
        },
      ],
    },
    {
      title: "난수와 무작위 비중",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `import numpy as np

rng = np.random.default_rng(42)   # 42는 씨앗(seed). 아무 정수나 된다

print(rng.random(3))              # 0~1 사이 난수 3개
print(rng.random((4, 3)))         # 4행 3열의 난수 배열`,
        },
        {
          t: "p",
          text: "<code>default_rng(42)</code>처럼 씨앗을 지정하면 실행할 때마다 같은 난수가 나온다. <b>결과를 남과 비교하거나 재현해야 할 때 반드시 넣는다.</b> 예전 방식인 <code>np.random.seed()</code>도 아직 동작하지만 지금은 <code>default_rng()</code>로 생성기를 따로 만들어 쓰는 쪽이 권장된다. <b>같은 42를 넣어도 두 방식의 난수는 서로 다르므로 하나로 통일해야 한다.</b>",
        },
        { t: "h", text: "무작위 비중 만들기" },
        {
          t: "p",
          text: "비중에는 조건이 있다. <b>합이 1이어야 하고, (공매도를 금지한다면) 모두 0 이상이어야 한다.</b> 난수를 만든 뒤 합으로 나누면 두 조건이 동시에 만족된다.",
        },
        {
          t: "code",
          lang: "python",
          code: `rng = np.random.default_rng(42)

w = rng.random(3)
print(w)              # [0.77395605 0.43887844 0.85859792]

w = w / w.sum()
print(w)              # [0.37363326 0.21187196 0.41449478]
print(w.sum())        # 1.0`,
        },
        { t: "h", text: "한꺼번에 수만 개 만들기" },
        {
          t: "p",
          text: "반복문으로 하나씩 만들 수도 있지만, numpy는 한 번에 처리할 수 있다.",
        },
        {
          t: "code",
          lang: "python",
          code: `N = 20000
n_assets = 3

W = rng.random((N, n_assets))
W = W / W.sum(axis=1, keepdims=True)    # 각 행의 합을 1로

print(W.shape)              # (20000, 3)
print(W[:3])                # 앞의 3개 포트폴리오
print(W.sum(axis=1)[:3])    # [1. 1. 1.]`,
        },
        {
          t: "p",
          text: "<code>keepdims=True</code>는 나눗셈이 행 방향으로 올바르게 적용되도록 모양을 유지해준다.",
        },
      ],
    },
    {
      title: "모든 포트폴리오를 한 번에 계산하기",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `mean_returns = np.array([0.12, 0.10, 0.07])
cov = np.array([[0.0900, 0.0450, 0.0090],
                [0.0450, 0.0625, 0.01125],
                [0.0090, 0.01125, 0.0225]])

returns_arr = W @ mean_returns                              # (20000,)
vols_arr = np.sqrt(np.einsum("ij,jk,ik->i", W, cov, W))     # (20000,)
sharpe_arr = (returns_arr - 0.03) / vols_arr`,
        },
        {
          t: "p",
          text: "<code>np.einsum(\"ij,jk,ik-&gt;i\", W, cov, W)</code>는 각 행 $w$에 대해 $w^T \\Sigma w$를 한꺼번에 계산하는 표기다. 처음 보면 낯설지만, <b>\"2만 개 포트폴리오 각각의 분산을 반복문 없이 한 번에 구한다\"</b> 는 의미로 이해하면 충분하다.",
        },
        {
          t: "p",
          text: "반복문으로 쓰면 이렇게 된다. 결과는 같고, 훨씬 느리지만 이해하기 쉽다.",
        },
        {
          t: "code",
          lang: "python",
          code: `vols_list = []
for i in range(N):
    w = W[i]
    vols_list.append(np.sqrt(w @ cov @ w))
vols_arr = np.array(vols_list)`,
        },
      ],
    },
    {
      title: "최적 포트폴리오 찾기",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `best_sharpe_idx = sharpe_arr.argmax()    # 샤프지수가 최대인 위치
min_vol_idx = vols_arr.argmin()          # 변동성이 최소인 위치

print("최대 샤프 포트폴리오")
print(f"  비중 {np.round(W[best_sharpe_idx], 4)}")
print(f"  수익 {returns_arr[best_sharpe_idx]:.2%}")
print(f"  변동성 {vols_arr[best_sharpe_idx]:.2%}")
print(f"  샤프 {sharpe_arr[best_sharpe_idx]:.4f}")`,
        },
        {
          t: "p",
          text: "<code>.argmax()</code>는 최댓값 자체가 아니라 <b>최댓값이 있는 위치(인덱스)</b> 를 돌려준다. 그 위치로 <code>W</code>에서 비중을 꺼내는 것이 핵심이다.",
        },
        {
          t: "table",
          head: ["메서드", "반환값"],
          rows: [
            ["<code>.max()</code>", "최댓값"],
            ["<code>.argmax()</code>", "최댓값의 위치"],
            ["<code>.min()</code>", "최솟값"],
            ["<code>.argmin()</code>", "최솟값의 위치"],
          ],
        },
      ],
    },

    /* ── 3. 효율적 투자선 ── */
    {
      title: "3. 효율적 투자선 (Efficient Frontier)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>효율적 투자선이란 주어진 자산군으로 만들 수 있는 모든 포트폴리오 중, 각 위험 수준에서 기대수익률이 가장 높은 포트폴리오들을 이은 곡선이다.</b> 해리 마코위츠(Harry Markowitz)의 현대 포트폴리오 이론(1952)에서 제시되었다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "가로축을 위험, 세로축을 수익률로 놓고 가능한 모든 포트폴리오를 점으로 찍으면 <b>우산 모양의 구름</b>이 만들어진다. 효율적 투자선은 그 구름의 <b>위쪽 테두리</b>다.",
        },
        {
          t: "p",
          text: "테두리 아래의 점들은 전부 열등하다. 그 아래 어떤 점을 골라도, <b>같은 위험에서 더 높은 수익을 주는 점이 바로 위에 있기 때문이다.</b> 합리적인 투자자라면 테두리 위의 점만 고려하면 된다.",
        },
        { t: "h", text: "지배 관계" },
        {
          t: "p",
          text: "포트폴리오 A가 B를 <b>지배(dominate)</b> 한다는 것은 다음을 뜻한다.",
        },
        {
          t: "ul",
          items: ["A의 위험 ≤ B의 위험 <b>그리고</b> A의 수익 ≥ B의 수익"],
        },
        {
          t: "p",
          text: "지배당하는 포트폴리오는 선택할 이유가 없다. <b>효율적 투자선은 아무에게도 지배당하지 않는 포트폴리오들의 집합</b>이다.",
        },
      ],
    },
    {
      title: "곡선 위의 특별한 점 두 개",
      blocks: [
        {
          t: "table",
          head: ["이름", "정의", "의미"],
          rows: [
            ["<b>최소분산 포트폴리오 (GMV)</b>", "변동성이 가장 낮은 점", "곡선의 가장 왼쪽 끝"],
            ["<b>최대 샤프 포트폴리오</b>", "샤프지수가 가장 높은 점", "위험 대비 효율이 최고"],
          ],
        },
        {
          t: "p",
          text: "<b>최대 샤프 포트폴리오</b>는 기하학적으로도 의미가 있다. 세로축의 무위험수익률 지점에서 그은 직선이 곡선에 처음 닿는 접점이다. 이 직선을 <b>자본시장선(CML)</b> 이라 하고, 접점 포트폴리오를 <b>접점 포트폴리오(Tangency Portfolio)</b> 라고 부른다.",
        },
        { t: "h", text: "구름의 아래쪽 테두리" },
        {
          t: "p",
          text: "곡선의 아래쪽 절반(최소분산점 아래)은 <b>비효율적 투자선</b>이다. 같은 위험에서 수익이 더 낮으므로 아무도 선택하지 않는다. 그래서 \"효율적\" 투자선이라는 이름이 붙었다.",
        },
      ],
    },
    {
      title: "현대 포트폴리오 이론의 핵심 주장과 한계",
      blocks: [
        {
          t: "ol",
          items: [
            { text: "투자자는 수익률뿐 아니라 <b>위험도 함께 고려</b>한다." },
            { text: "자산을 개별로 평가하지 말고 <b>포트폴리오 전체의 기여도</b>로 평가해야 한다." },
            { text: "상관관계가 낮은 자산을 섞으면 <b>수익을 포기하지 않고도 위험을 줄일 수 있다.</b>" },
            { text: "합리적 투자자는 효율적 투자선 위에서만 선택한다." },
          ],
        },
        {
          t: "p",
          text: "3번이 \"분산투자는 금융의 유일한 공짜 점심\"이라는 말의 근거다.",
        },
        { t: "h", text: "이론의 한계" },
        {
          t: "ul",
          items: [
            "<b>과거가 미래를 알려준다고 가정한다.</b> 기대수익률과 공분산을 과거 데이터로 추정하는데, 특히 기대수익률 추정은 오차가 매우 크다.",
            "<b>추정 오차에 민감하다.</b> 입력값이 조금만 바뀌어도 최적 비중이 크게 흔들린다. 그래서 실무에서는 극단적 비중을 막기 위해 종목별 상한(예: 40%)을 두거나, 아예 균등 비중(1/N)을 쓰기도 한다.",
            "<b>정규분포와 변동성을 위험의 척도로 삼는다.</b> 실제 수익률은 극단값이 이론보다 자주 나타난다.",
          ],
        },
        {
          t: "p",
          text: "이런 한계를 알고도 배우는 이유는, <b>위험과 수익을 함께 놓고 최적을 찾는다는 사고방식</b>이 이후 모든 자산배분 이론의 뼈대이기 때문이다.",
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
            ["<b>2차원 배열</b>", "행렬을 표현하는 numpy 자료구조", "<code>.shape</code>로 크기 확인"],
            ["<b><code>*</code> vs <code>@</code></b>", "원소별 곱 vs 행렬 곱", "포트폴리오 계산은 <code>@</code>"],
            ["<b><code>np.random.default_rng(seed)</code></b>", "씨앗을 넣어 난수 생성기를 만든다", "재현 가능한 결과"],
            ["<b><code>.argmax()</code> / <code>.argmin()</code></b>", "극값의 <b>위치</b> 반환", "최적 비중을 꺼내는 열쇠"],
            ["<b><code>axis</code>, <code>keepdims</code></b>", "연산 방향과 모양 유지", "비중 정규화에 사용"],
          ],
        },
        { t: "h", text: "금융 개념" },
        {
          t: "table",
          head: ["개념", "공식", "코드"],
          rows: [
            ["포트폴리오 수익률", "$w^T\\mu$", "<code>w @ mu</code>"],
            ["포트폴리오 분산", "$w^T\\Sigma w$", "<code>w @ cov @ w</code>"],
            ["포트폴리오 변동성", "$\\sqrt{w^T\\Sigma w}$", "<code>np.sqrt(w @ cov @ w)</code>"],
            ["공분산 연율화", "$\\Sigma_{일} \\times 252$", "<code>returns.cov() * 252</code>"],
            ["효율적 투자선", "각 위험 수준의 최고 수익 조합", "몬테카를로 구름의 위쪽 테두리"],
          ],
        },
        {
          t: "p",
          text: "한 문장으로: <b>모든 비중 조합을 무작위로 만들어 수익률과 위험을 계산한 뒤, 그중 지배당하지 않는 것들만 남긴 것이 효율적 투자선이다.</b>",
        },
      ],
    },

    /* ── 오늘의 코드 ── */
    {
      title: "오늘의 코드",
      blocks: [
        { t: "p", text: "<code>week6.py</code> 파일에 붙여넣고 실행한다." },
        {
          t: "code",
          lang: "python",
          code: `"""
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

    print(f"\\n[{label}]")
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


# ── 2) 몬테카를로 시뮬레이션 ─────────────────────────────

print()
print(f"{N_SIMULATIONS:,}개 포트폴리오 시뮬레이션 중...")

W = random_weights(n_assets, N_SIMULATIONS, SEED)

sim_returns = W @ mean_returns
sim_vols = np.sqrt(np.einsum("ij,jk,ik->i", W, cov_matrix, W))
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
print(optimal.map(lambda x: f"{x:.2%}"))`,
        },
      ],
    },
    {
      title: "오프라인 연습용",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""데이터를 못 받을 때 — 가정한 3자산으로 최적화 실습"""
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
      f"변동성 {np.sqrt(eq @ cov @ eq):.2%}")`,
        },
        { t: "p", text: "<b>실행 결과</b> (seed 42, 20만 회 기준)" },
        {
          t: "out",
          text: `최대 샤프  비중 [0.2807 0.1689 0.5504]  수익 8.91%  변동성 15.76%  샤프 0.3751
최소분산  비중 [0.0848 0.1145 0.8007]  수익 7.77%  변동성 14.16%
균등비중  비중 [0.3333 0.3333 0.3333]  수익 9.67%  변동성 18.42%`,
        },
        {
          t: "p",
          text: "균등 비중은 수익률이 가장 높지만 변동성도 가장 높아 샤프지수는 0.362로 최대 샤프 포트폴리오(0.375)보다 낮다. <b>수익률만 보면 균등 비중이 이기지만, 위험 대비 효율에서는 진다.</b>",
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
          q: "numpy에서 <code>A * B</code>와 <code>A @ B</code>의 차이는?",
          options: [
            "둘 다 같다",
            "<code>*</code>는 원소별 곱셈, <code>@</code>는 행렬 곱셈",
            "<code>*</code>는 행렬 곱셈, <code>@</code>는 원소별 곱셈",
            "<code>@</code>는 파이썬에서 사용할 수 없다",
          ],
          correct: [2],
          explain:
            "<code>*</code>는 같은 위치의 원소끼리 곱하고, <code>@</code>는 행렬 곱셈 규칙을 적용한다. 포트폴리오 계산에는 <code>@</code>를 쓴다.",
        },
        {
          t: "quiz",
          no: "Q2",
          q: "포트폴리오 변동성을 구하는 올바른 코드는?",
          options: [
            "<code>np.sqrt(w @ cov)</code>",
            "<code>w @ cov @ w</code>",
            "<code>np.sqrt(w @ cov @ w)</code>",
            "<code>np.sqrt(w * cov * w)</code>",
          ],
          correct: [3],
          explain:
            "$w^T\\Sigma w$는 <b>분산</b>이므로, 변동성(표준편차)을 얻으려면 제곱근을 취해야 한다. 2번은 분산까지만 구한 것이다.",
        },
        {
          t: "quiz",
          no: "Q3",
          q: "일간 공분산 행렬을 연율화할 때 곱하는 값은?",
          options: ["<code>252</code>", "<code>√252</code>", "<code>1/252</code>", "곱할 필요 없음"],
          correct: [1],
          explain:
            "공분산은 분산과 같은 차원이므로 시간에 <b>비례</b>한다. 표준편차(변동성)를 연율화할 때만 √252를 곱한다. 실수하기 쉬운 지점이다.",
        },
      ],
    },
    {
      title: "오늘의 테스트 (2)",
      blocks: [
        {
          t: "quiz",
          no: "Q4",
          q: "<code>.argmax()</code>가 반환하는 것은?",
          options: ["최댓값", "최댓값의 위치(인덱스)", "최댓값의 개수", "정렬된 배열"],
          correct: [2],
          explain:
            "값이 아니라 <b>위치</b>를 돌려준다. 그래서 <code>W[sharpe.argmax()]</code>처럼 그 위치의 비중을 꺼낼 수 있다.",
        },
        {
          t: "quiz",
          no: "Q5",
          q: "무작위 비중을 만들 때 <code>w / w.sum()</code>을 하는 이유는?",
          options: [
            "계산 속도를 높이려고",
            "비중의 합이 1이 되도록 만들려고",
            "음수를 제거하려고",
            "소수점을 없애려고",
          ],
          correct: [2],
          explain:
            "비중은 합이 1이어야 한다. 0~1 난수를 합으로 나누면 합이 1이면서 모두 0 이상인 조건이 동시에 충족된다.",
        },
        {
          t: "quiz",
          no: "Q6",
          q: "효율적 투자선에 대한 설명 중 <b>옳지 않은</b> 것은?",
          options: [
            "각 위험 수준에서 기대수익률이 가장 높은 포트폴리오들의 집합이다",
            "곡선 아래의 포트폴리오는 지배당하므로 선택할 이유가 없다",
            "곡선의 가장 왼쪽 끝은 최소분산 포트폴리오다",
            "효율적 투자선 위의 모든 점은 샤프지수가 같다",
          ],
          correct: [4],
          explain:
            "효율적 투자선 위에서도 샤프지수는 점마다 다르다. 그중 샤프지수가 가장 높은 단 하나의 점이 <b>접점 포트폴리오(최대 샤프)</b> 이며, 무위험수익률에서 그은 직선이 곡선에 닿는 지점이다.",
        },
      ],
    },
    {
      title: "오늘의 테스트 (3)",
      blocks: [
        {
          t: "table",
          head: ["", "수익률", "변동성"],
          rows: [
            ["A", "10%", "15%"],
            ["B", "8%", "15%"],
          ],
        },
        {
          t: "quiz",
          no: "Q7",
          q: "위 표에서 \"포트폴리오 A가 B를 지배한다\"에 해당하는 경우는?",
          options: [
            "A가 B를 지배한다",
            "B가 A를 지배한다",
            "서로 지배 관계가 없다",
            "판단할 수 없다",
          ],
          correct: [1],
          explain:
            "위험이 같은데 A의 수익이 더 높으므로 A가 B를 지배한다. B를 선택할 합리적 이유가 없다. 효율적 투자선은 이렇게 지배당하는 점들을 전부 걸러내고 남은 것이다.",
        },
        {
          t: "quiz",
          no: "Q8",
          q: "빈칸을 채워 무작위 비중 생성 함수를 완성하시오.",
          code: `import numpy as np

def random_weights(n_assets, n_samples, seed=None):
    """합이 1이고 모두 0 이상인 무작위 비중 행렬을 만든다."""
    rng = np.random.default_rng(seed)
    W = rng.______((n_samples, n_assets))
    return W / W.sum(axis=____, keepdims=True)`,
          blanks: [
            { label: "첫 번째 빈칸", accept: ["random"] },
            { label: "두 번째 빈칸", accept: ["1"] },
          ],
          explain:
            "<code>axis=1</code>은 각 행(포트폴리오 하나)의 합을 구한다는 뜻이다. <code>keepdims=True</code>로 모양을 유지해야 나눗셈이 행 단위로 올바르게 적용된다.",
          explainCode: `def random_weights(n_assets, n_samples, seed=None):
    """합이 1이고 모두 0 이상인 무작위 비중 행렬을 만든다."""
    rng = np.random.default_rng(seed)
    W = rng.random((n_samples, n_assets))
    return W / W.sum(axis=1, keepdims=True)`,
        },
        {
          t: "quiz",
          no: "Q9",
          q: "(심화) 몬테카를로 시뮬레이션으로 최적 포트폴리오를 찾는 방식의 한계로 적절하지 <b>않은</b> 것은?",
          options: [
            "시뮬레이션 횟수가 적으면 진짜 최적점을 놓칠 수 있다",
            "자산 수가 많아질수록 필요한 시뮬레이션 횟수가 급격히 늘어난다",
            "과거 데이터로 추정한 기대수익률에 오차가 크면 최적 비중도 신뢰하기 어렵다",
            "무작위 비중은 합이 1이 되지 않아 결과가 틀린다",
          ],
          correct: [4],
          explain:
            "<code>w / w.sum()</code>으로 정규화하면 합은 항상 정확히 1이 된다. 1~3번은 실제 한계다. 특히 3번은 가장 근본적인 문제로, 이 때문에 실무에서는 종목별 비중 상한을 두거나 균등 비중(1/N)을 쓰기도 한다.",
        },
      ],
    },
  ],

  outroTitle: "다음 주 예고",
  outro: [
    {
      t: "p",
      text: "7주차에서는 이번 주에 구한 최적 비중으로 <b>실제 모의투자를 집행</b>한다. 지금까지 매주 따로 만들었던 함수들을 <b>하나의 모듈로 정리</b>하고, <b>csv 파일 입출력</b>으로 거래 내역을 기록하며, <b>클래스(class)</b> 를 사용해 계좌를 표현한다.",
    },
    {
      t: "p",
      text: "이번 주에 저장한 <code>optimal_weights.csv</code>를 다음 주에 그대로 사용하므로 지우지 않는다. 완성된 퀀트 투자 코드를 배포할 예정이니, 지금까지의 <code>week3.py</code> ~ <code>week6.py</code>도 함께 보관해두면 좋다.",
    },
  ],
};
