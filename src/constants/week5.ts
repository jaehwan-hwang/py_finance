import type { WeekContent } from "./weekContent";

/* ── 5주차 — 자산 간의 관계 ──
   파이썬: 다중 자산 딕셔너리 / matplotlib   ·   덤: zip() */

export const WEEK5: WeekContent = {
  cover: {
    lead: "지금까지는 종목을 하나씩 봤습니다. 오늘부터는 <b>둘 이상을 같이</b> 봅니다. 서로 반대로 움직이는 두 종목을 섞으면 위험이 줄어듭니다.",
    goal: "상관계수를 계산하고, 분산투자로 위험이 줄어드는 것을 눈으로 확인한다.",
  },

  slides: [
    {
      title: "여러 종목을 한 표에",
      lead: "종목마다 따로 DataFrame 을 두면 관리가 안 됩니다. <b>열이 종목인 하나의 표</b>로 합칩니다.",
      codes: [
        {
          code: `import pandas as pd
import FinanceDataReader as fdr

tickers = {"005930": "삼성전자", "000660": "SK하이닉스",
           "005380": "현대차",   "055550": "신한지주"}

closes = pd.DataFrame()
for code, name in tickers.items():
    closes[name] = fdr.DataReader(code, "2019-01-01")["Close"]

rets = closes.pct_change().dropna()
print(rets.shape)     # (날짜 수, 4)`,
        },
      ],
      callout: {
        kind: "note",
        title: "이 표가 오늘의 재료입니다",
        body: "<b>행이 날짜, 열이 종목</b>인 수익률 표. 6주차 포트폴리오도 이 표에서 시작합니다.",
      },
    },

    {
      title: "덤 — zip() 으로 두 리스트 함께 돌기",
      lead: "종목코드와 종목명처럼 <b>짝을 이룬 두 리스트</b>를 동시에 순회할 때 씁니다.",
      codes: [
        {
          code: `codes = ["005930", "000660", "005380"]
names = ["삼성전자", "SK하이닉스", "현대차"]

for code, name in zip(codes, names):
    print(f"{name}({code})")`,
        },
      ],
    },

    {
      title: "공분산 — 같이 움직이는 정도",
      lead: "한 종목이 오를 때 다른 종목도 오르면 공분산이 <b>양수</b>, 반대로 움직이면 <b>음수</b>입니다.",
      codes: [
        {
          code: `# 정의대로 직접
a = rets["삼성전자"]
b = rets["SK하이닉스"]
cov = ((a - a.mean()) * (b - b.mean())).sum() / len(a)

# 라이브러리로 검증
print(cov, rets.cov().loc["삼성전자", "SK하이닉스"])`,
        },
      ],
      callout: {
        kind: "warn",
        title: "공분산은 크기를 비교할 수 없습니다",
        body: "단위가 수익률의 제곱이라 값 자체로는 강한지 약한지 알 수 없습니다. 그래서 <b>상관계수</b>가 필요합니다.",
      },
    },

    {
      title: "상관계수 — −1에서 +1 사이로",
      lead: "공분산을 각자의 표준편차로 나누면 <b>−1 ~ +1</b> 로 정리됩니다. 이제 비교할 수 있습니다.",
      table: {
        head: ["상관계수", "뜻", "분산투자 효과"],
        rows: [
          ["+1", "완전히 같이 움직임", "없음"],
          ["0", "서로 무관", "있음"],
          ["−1", "완전히 반대로 움직임", "가장 큼"],
        ],
      },
      codes: [
        {
          code: `corr = rets.corr()
print(corr.round(2))

# 히트맵으로 한눈에
import matplotlib.pyplot as plt
from finance.plotting import setup_korean_font
setup_korean_font()

fig, ax = plt.subplots(figsize=(6, 5))
im = ax.imshow(corr, cmap="Blues", vmin=0, vmax=1)
ax.set_xticks(range(len(corr)), corr.columns, rotation=45)
ax.set_yticks(range(len(corr)), corr.columns)
fig.colorbar(im)
plt.show()`,
        },
      ],
    },

    {
      title: "두 자산 포트폴리오의 위험",
      lead: "두 종목을 반반 섞었을 때 위험은 각각의 평균이 <b>아닙니다</b>. 마지막 항이 그 이유입니다.",
      bullets: [
        "σₚ² = w₁²σ₁² + w₂²σ₂² + <b>2w₁w₂σ₁₂</b>",
        "마지막 항의 σ₁₂ 가 <b>음수면 전체 위험이 줄어듭니다</b>",
        "이 항 하나가 포트폴리오 이론의 전부입니다",
      ],
      codes: [
        {
          code: `w1, w2 = 0.5, 0.5
v1, v2 = a.var(), b.var()
cov12 = a.cov(b)

port_var = w1**2 * v1 + w2**2 * v2 + 2 * w1 * w2 * cov12
print(f"섞은 위험 {port_var ** 0.5:.4f}")
print(f"각자 위험 {a.std():.4f}, {b.std():.4f}")`,
        },
      ],
    },

    {
      title: "분산투자 효과를 눈으로",
      lead: "종목 수를 늘리면 위험이 어디까지 줄어들까요? <b>끝까지 줄지는 않습니다.</b>",
      codes: [
        {
          code: `rng = np.random.default_rng(42)
xs, ys = [], []

for n in range(1, 21):
    picks = rng.choice(rets.columns, size=min(n, len(rets.columns)),
                       replace=False)
    port = rets[picks].mean(axis=1)          # 동일가중
    xs.append(n)
    ys.append(port.std() * np.sqrt(252))

plt.plot(xs, ys, marker="o")
plt.xlabel("종목 수"); plt.ylabel("연 변동성")
plt.show()`,
          caption: "곡선이 어느 지점부터 평평해집니다. 그 아래가 없앨 수 없는 위험입니다.",
        },
      ],
      callout: {
        kind: "note",
        title: "체계적 위험과 비체계적 위험",
        body: "분산투자로 없앨 수 있는 건 <b>개별 종목 고유의 위험</b>뿐입니다. 시장 전체가 빠지는 위험은 몇 종목을 담아도 남습니다.",
      },
    },

    {
      title: "베타 — 시장에 얼마나 민감한가",
      lead: "시장이 1% 움직일 때 이 종목은 몇 % 움직이는지. 회귀직선의 <b>기울기</b>입니다.",
      codes: [
        {
          code: `market = fdr.DataReader("KS11", "2019-01-01")["Close"]
mkt_ret = market.pct_change().dropna()

aligned = pd.concat([a, mkt_ret], axis=1).dropna()
beta = aligned.cov().iloc[0, 1] / aligned.iloc[:, 1].var()
print(f"베타 {beta:.2f}")`,
        },
      ],
      table: {
        head: ["베타", "뜻"],
        rows: [
          ["> 1", "시장보다 크게 흔들린다"],
          ["= 1", "시장과 비슷하게 움직인다"],
          ["< 1", "시장보다 덜 흔들린다"],
        ],
      },
    },

    {
      title: "CAPM — 위험을 진 대가",
      lead: "감수한 위험만큼 수익을 기대할 수 있다는 관점입니다. 기대수익률을 <b>베타 하나로</b> 설명합니다.",
      bullets: [
        "E(R) = 무위험수익률 + 베타 × (시장수익률 − 무위험수익률)",
        "베타가 클수록 기대수익률도 크다 — <b>위험을 진 대가</b>",
        "실제 수익률이 이보다 높으면 초과성과, 낮으면 부진",
      ],
      codes: [
        {
          code: `RISK_FREE = 0.035
mkt_annual = 0.08          # 시장 기대수익률 가정

expected = RISK_FREE + beta * (mkt_annual - RISK_FREE)
print(f"CAPM 기대수익률 {expected:.2%}")`,
        },
      ],
      callout: {
        kind: "warn",
        title: "가정이 많은 모형입니다",
        body: "시장 기대수익률을 얼마로 잡느냐에 따라 결과가 크게 달라집니다. <b>참고 지표로만</b> 쓰세요.",
      },
    },

    {
      title: "미션 5 — 상관계수가 낮은 조합 찾기",
      lead: "상관계수가 <b>낮은 2종목</b> 조합과 <b>높은 2종목</b> 조합을 각각 만들어 위험을 비교합니다.",
      bullets: [
        "종목 8~10개의 상관행렬을 구합니다",
        "가장 낮은 짝과 가장 높은 짝을 찾습니다",
        "각각 반반 섞었을 때의 연 변동성을 계산해 비교합니다",
        "<b>왜 차이가 나는지</b> 세 줄로 적습니다 — 다음 주 최적화가 필요한 이유가 여기 있습니다",
      ],
    },
  ],

  summary: [
    "공분산은 같이 움직이는 정도, 상관계수는 그걸 −1~+1로 정리한 값이다.",
    "두 자산을 섞은 위험식의 마지막 항이 음수면 위험이 줄어든다 — 분산투자의 원리다.",
    "베타는 시장에 대한 민감도이고, CAPM은 위험을 진 대가로 기대수익률을 설명한다.",
  ],

  nextPreview:
    "상관계수가 낮은 조합이 좋다는 건 알았습니다. 그럼 <b>비중을 정확히 얼마씩</b> 담아야 할까요? 다음 주에는 비중을 1만 가지로 뿌려보고 가장 좋은 조합을 찾습니다.",
};
