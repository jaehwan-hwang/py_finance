import type { WeekContent } from "./weekContent";

/* ── 6주차 — 포트폴리오 최적화 ──
   파이썬: 행렬연산 / 몬테카를로   ·   덤: %timeit, scipy.optimize */

export const WEEK6: WeekContent = {
  cover: {
    lead: "상관계수가 낮은 조합이 좋다는 건 알았습니다. 그럼 <b>비중을 정확히 얼마씩</b> 담아야 할까요? 오늘 그 답을 찾습니다.",
    goal: "비중 1만 세트를 뿌려 효율적 투자선을 직접 그린다.",
  },

  slides: [
    {
      title: "2차원 배열과 행렬 곱",
      lead: "종목이 여러 개면 공분산도 여러 개입니다. 그걸 담는 그릇이 <b>공분산행렬</b>입니다.",
      codes: [
        {
          code: `import numpy as np

Sigma = rets.cov().values      # 4x4 행렬
print(Sigma.shape)             # (4, 4)

w = np.array([0.25, 0.25, 0.25, 0.25])   # 비중
print(w.shape)                            # (4,)`,
        },
      ],
      callout: {
        kind: "tip",
        title: "먼저 2×2 로 손계산",
        body: "칠판에서 2×2 행렬 곱을 한 번 해본 뒤 코드로 넘어갑니다. 이 순서를 지키지 않으면 오늘이 무너집니다.",
      },
    },

    {
      title: "@ 연산자 — 포트폴리오 위험 한 줄",
      lead: "지난주 두 자산 공식을 n개로 늘리면 <b>행렬 곱</b>이 됩니다.",
      codes: [
        {
          code: `# σₚ = √(wᵀ Σ w)
port_var = w @ Sigma @ w
port_vol = np.sqrt(port_var) * np.sqrt(252)

mu = rets.mean().values * 252      # 연 기대수익률
port_ret = w @ mu

print(f"수익 {port_ret:.2%}  위험 {port_vol:.2%}")`,
          caption: "지난주 w₁²σ₁² + w₂²σ₂² + 2w₁w₂σ₁₂ 를 n개로 늘린 것이 w @ Sigma @ w 입니다.",
        },
      ],
    },

    {
      title: "비중 만들기 — 합이 1이어야 한다",
      lead: "비중은 <b>모두 더해 1</b>이 되어야 합니다. 난수를 뿌린 뒤 합으로 나누면 됩니다.",
      codes: [
        {
          code: `rng = np.random.default_rng(42)

w = rng.random(4)      # [0.77, 0.44, 0.86, 0.70] 같은 값
w = w / w.sum()        # 합을 1로

print(w, w.sum())      # 합 1.0`,
        },
      ],
      callout: {
        kind: "note",
        title: "시드를 고정하는 이유",
        body: "<b>default_rng(42)</b> 로 고정하면 매번 같은 결과가 나옵니다. 그래야 서로 비교하고 디버깅할 수 있습니다.",
      },
    },

    {
      title: "몬테카를로 — 1만 번 뿌려보기",
      lead: "수학으로 푸는 대신 <b>가능한 조합을 잔뜩 만들어 보고</b> 그중 제일 좋은 걸 고릅니다. 무식하지만 확실하고, 무엇보다 <b>눈에 보입니다</b>.",
      codes: [
        {
          code: `n_assets = len(rets.columns)
n_port = 10000

results = []
for _ in range(n_port):
    w = rng.random(n_assets)
    w = w / w.sum()
    r = w @ mu
    v = np.sqrt(w @ Sigma @ w) * np.sqrt(252)
    results.append((v, r, (r - 0.035) / v, w))

vols  = np.array([x[0] for x in results])
retss = np.array([x[1] for x in results])
sharpes = np.array([x[2] for x in results])`,
        },
      ],
    },

    {
      title: "효율적 투자선 — 우산 모양이 나온다",
      lead: "1만 개를 위험(가로)과 수익(세로)에 점으로 찍으면 <b>우산 모양</b>이 됩니다. 그 <b>왼쪽 위 테두리</b>가 효율적 투자선입니다.",
      codes: [
        {
          code: `import matplotlib.pyplot as plt
from finance.plotting import setup_korean_font
setup_korean_font()

fig, ax = plt.subplots(figsize=(8, 6))
sc = ax.scatter(vols, retss, c=sharpes, cmap="viridis", s=6, alpha=0.6)

best = sharpes.argmax()
ax.scatter(vols[best], retss[best], color="red", s=140, marker="*",
           label="최대 샤프")

ax.set_xlabel("연 변동성"); ax.set_ylabel("연 기대수익률")
ax.legend(); fig.colorbar(sc, label="샤프지수")
plt.show()`,
        },
      ],
      callout: {
        kind: "tip",
        title: "테두리가 의미하는 것",
        body: "같은 위험이라면 <b>더 높은 수익</b>, 같은 수익이라면 <b>더 낮은 위험</b>. 테두리 안쪽 점들은 굳이 고를 이유가 없는 조합입니다.",
      },
    },

    {
      title: "최적 비중 꺼내기",
      lead: "가장 샤프지수가 높은 조합의 <b>비중</b>이 오늘의 결과물입니다.",
      codes: [
        {
          code: `import pandas as pd

best_w = pd.Series(results[best][3], index=rets.columns)
print(best_w.round(3).sort_values(ascending=False))

print(f"기대수익 {retss[best]:.2%}")
print(f"변동성   {vols[best]:.2%}")
print(f"샤프     {sharpes[best]:.2f}")`,
          caption: "이 비중이 7주차 주문서가 됩니다.",
        },
      ],
    },

    {
      title: "동일가중과 비교하기",
      lead: "1/n 씩 똑같이 담는 <b>동일가중</b>은 의외로 강합니다. 최적화 결과와 꼭 비교해 보세요.",
      codes: [
        {
          code: `equal = np.repeat(1 / n_assets, n_assets)

for name, w in [("동일가중", equal), ("최대샤프", results[best][3])]:
    r = w @ mu
    v = np.sqrt(w @ Sigma @ w) * np.sqrt(252)
    print(f"{name}  수익 {r:.2%}  위험 {v:.2%}  샤프 {(r-0.035)/v:.2f}")`,
        },
      ],
      callout: {
        kind: "warn",
        title: "과거의 최적이 미래의 최적은 아닙니다",
        body: "기대수익률에 <b>±1%p 만 노이즈를 줘도</b> 최적 비중이 크게 흔들립니다. 직접 해보세요. 그래서 동일가중이 살아남습니다.",
      },
    },

    {
      title: "덤 — %timeit 과 scipy.optimize",
      lead: "1만 번 반복이 얼마나 걸리는지 재보고, 수학으로 바로 푸는 방법도 있다는 것만 알아둡니다.",
      codes: [
        {
          code: `%timeit -n 3 [rng.random(4) for _ in range(10000)]`,
          lang: "python",
        },
        {
          code: `from scipy.optimize import minimize

def neg_sharpe(w):
    r = w @ mu
    v = np.sqrt(w @ Sigma @ w) * np.sqrt(252)
    return -(r - 0.035) / v

res = minimize(neg_sharpe, equal, method="SLSQP",
               bounds=[(0, 0.4)] * n_assets,
               constraints={"type": "eq", "fun": lambda w: w.sum() - 1})
print(res.x.round(3))`,
          caption: "정규 과정은 몬테카를로로 갑니다. SLSQP 는 관심 있는 사람만.",
        },
      ],
    },

    {
      title: "미션 6 — 7주차에 주문할 비중 정하기",
      lead: "관심 종목 10개로 <b>동일가중</b>과 <b>최대샤프</b> 비중을 각각 구합니다.",
      bullets: [
        "종목당 상한을 <b>20%</b> 로 두세요. 안 그러면 한 종목에 몰립니다",
        "두 비중의 성과표(4주차 summary)를 나란히 비교합니다",
        "둘 중 <b>실제로 주문할 하나</b>를 고르고 이유를 세 줄로 적습니다",
      ],
      callout: {
        kind: "warn",
        title: "이 미션이 다음 주 준비물입니다",
        body: "7주차에는 이 비중으로 <b>모의계좌에 실제 주문</b>을 넣습니다. 안 해오면 그날 할 게 없습니다. 그리고 <b>모의투자 신청과 앱키 발급은 승인에 며칠 걸리니 이번 주에 미리</b> 해두세요.",
      },
    },
  ],

  summary: [
    "공분산행렬과 @ 연산자로 n개 자산의 포트폴리오 위험을 한 줄에 구한다.",
    "비중을 1만 번 뿌려 위험-수익 평면에 찍으면 효율적 투자선이 눈에 보인다.",
    "과거 데이터의 최적 비중은 입력이 조금만 바뀌어도 흔들린다 — 그래서 동일가중이 강하다.",
  ],

  nextPreview:
    "이제 비중이 정해졌습니다. 다음 주에는 이 비중대로 <b>모의계좌에 실제 주문</b>을 넣습니다. 6주간 만든 것을 조립하는 날입니다. <b>모의투자 신청과 앱키 발급을 미리</b> 마쳐 오세요.",
};
