import type { WeekContent } from "./weekContent";

/* ── 4주차 — 위험을 재는 법 ──
   파이썬: numpy 배열 연산 / pandas 통계 메서드   ·   덤: 리스트 컴프리헨션 */

export const WEEK4: WeekContent = {
  cover: {
    lead: "numpy 배열 연산과 pandas 통계 메서드로 변동성·CAGR·샤프지수·MDD 를 계산해 성과표로 묶습니다.",
  },

  slides: [
    {
      title: "numpy — 배열을 통째로 계산",
      lead: "리스트는 하나씩 꺼내 계산하지만, numpy 배열은 <b>전부 한 번에</b> 계산합니다.",
      codes: [
        {
          code: `import numpy as np

prices = np.array([70000, 71500, 69800, 72300])

print(prices * 2)        # [140000 143000 139600 144600]  전부 두 배
print(prices / 1000)     # [70.  71.5 69.8 72.3]
print(prices.mean())     # 70900.0
print(prices.std())      # 표준편차`,
          caption: "리스트였다면 [70000, 71500] * 2 는 값이 두 배가 아니라 리스트가 두 번 반복됩니다.",
        },
      ],
    },

    {
      title: "pandas 통계 메서드",
      lead: "DataFrame 에도 같은 계산이 그대로 붙어 있습니다.",
      codes: [
        {
          code: `ret = df["Close"].pct_change().dropna()

ret.mean()      # 평균 일간수익률
ret.std()       # 일간 변동성
ret.min()       # 최악의 하루
ret.max()       # 최고의 하루
ret.describe()  # 위 전부를 한 번에`,
        },
      ],
    },

    {
      title: "위험을 왜 표준편차로 재는가",
      lead: "위험은 <b>평균에서 얼마나 흩어져 있는가</b>입니다. 흩어짐이 클수록 다음에 무슨 일이 일어날지 예측하기 어렵습니다.",
      codes: [
        {
          code: `# 정의대로 직접
mean = ret.mean()
var = ((ret - mean) ** 2).sum() / len(ret)
std = var ** 0.5

# 라이브러리로 검증
print(np.isclose(std, ret.std(ddof=0)))   # True`,
          caption: "이 스터디의 제1 원칙 — 직접 짠 다음 라이브러리로 확인합니다.",
        },
      ],
    },

    {
      title: "연율화 — 왜 √252 인가",
      lead: "일간 변동성을 연간으로 바꿀 때 252를 곱하지 않고 <b>√252</b> 를 곱합니다. 더해지는 건 표준편차가 아니라 <b>분산</b>이기 때문입니다.",
      codes: [
        {
          code: `TRADING_DAYS = 252     # 1년 영업일 수

vol_daily = ret.std()
vol_annual = vol_daily * np.sqrt(TRADING_DAYS)

print(f"일간 {vol_daily:.2%}  →  연간 {vol_annual:.2%}")`,
        },
      ],
      callout: {
        kind: "note",
        title: "한 줄 정리",
        body: "분산은 시간에 <b>비례</b>해서 커지고, 표준편차는 그 제곱근이라 <b>√시간</b> 에 비례합니다.",
      },
    },

    {
      title: "CAGR — 연평균 복리수익률",
      lead: "10년에 200% 올랐다면 연평균 몇 %일까요? 20%가 아닙니다. 수익률은 <b>더하는 게 아니라 곱하기</b> 때문입니다.",
      codes: [
        {
          code: `def cagr(ret):
    total = (1 + ret).prod()        # 누적 배수
    years = len(ret) / TRADING_DAYS
    return total ** (1 / years) - 1


print(f"CAGR {cagr(ret):.2%}")`,
        },
      ],
    },

    {
      title: "샤프지수 — 위험 1단위당 수익",
      lead: "수익률이 높아도 그만큼 흔들렸다면 좋은 투자가 아닙니다. <b>같은 위험을 졌을 때 얼마를 벌었나</b>로 줄을 세웁니다.",
      codes: [
        {
          code: `RISK_FREE = 0.035    # 무위험수익률 (국고채 수준)

def sharpe(ret, rf=RISK_FREE):
    excess = cagr(ret) - rf
    vol = ret.std() * np.sqrt(TRADING_DAYS)
    return excess / vol`,
        },
      ],
      callout: {
        kind: "tip",
        title: "읽는 법",
        body: "1을 넘으면 준수, 2를 넘으면 훌륭하다고들 합니다. 다만 <b>기간을 어떻게 잡느냐에 따라 크게 달라지므로</b> 절대적인 기준으로 쓰지 마세요.",
      },
    },

    {
      title: "MDD — 고점에서 얼마나 떨어졌나",
      lead: "실전에서 전략을 포기하게 만드는 건 수익률이 아니라 <b>낙폭</b>입니다. 반토막을 견딜 수 있는 사람은 많지 않습니다.",
      codes: [
        {
          code: `cum = (1 + ret).cumprod()            # 누적 자산 곡선
peak = np.maximum.accumulate(cum)    # 그때까지의 최고점
drawdown = cum / peak - 1            # 고점 대비 하락률

mdd = drawdown.min()
print(f"MDD {mdd:.2%}")`,
          caption: "np.maximum.accumulate 가 반복문 없이 '지금까지의 최고점'을 만들어 줍니다.",
        },
      ],
      callout: {
        kind: "warn",
        title: "회복은 하락보다 어렵습니다",
        body: "−50% 를 회복하려면 <b>+100%</b> 가 필요합니다. 1주차에 본 그 이야기입니다.",
      },
    },

    {
      title: "성과표로 묶기",
      lead: "지금까지 만든 지표를 한 표에 모읍니다. 5주차부터 계속 이걸 씁니다.",
      codes: [
        {
          code: `import pandas as pd

def summary(ret):
    return pd.Series({
        "CAGR":   cagr(ret),
        "Vol":    ret.std() * np.sqrt(TRADING_DAYS),
        "Sharpe": sharpe(ret),
        "MDD":    (lambda c: (c / np.maximum.accumulate(c) - 1).min())(
                      (1 + ret).cumprod()),
    })`,
        },
      ],
      callout: {
        kind: "tip",
        title: "확인할 것",
        body: "관심 종목 5개의 성과표를 나란히 놓으면 <b>수익률 1위·샤프 1위·MDD 1위가 전부 다른 종목</b>입니다.",
      },
    },

    {
      title: "덤 — 리스트 컴프리헨션",
      lead: "여러 종목에 같은 계산을 반복할 때, for 문을 <b>한 줄로</b> 줄일 수 있습니다.",
      codes: [
        {
          code: `# 지금까지 쓰던 방식
result = []
for t in tickers:
    result.append(summary(returns[t]))

# 같은 뜻, 한 줄
result = [summary(returns[t]) for t in tickers]`,
          caption: "for 문을 먼저 이해한 다음에 쓰세요. 익숙해지기 전에는 for 문이 더 안전합니다.",
        },
      ],
    },

    {
      title: "미션 4 — KOSPI 와 내 종목 비교",
      lead: "KOSPI 지수와 관심 종목 3개의 성과표를 만들어 비교합니다.",
      bullets: [
        "KOSPI 는 <b>fdr.DataReader('KS11')</b> 로 가져옵니다",
        "네 개의 CAGR·변동성·샤프·MDD 를 한 표에 나란히 놓습니다",
        "내 종목이 지수보다 나았는지, <b>어떤 지표에서</b> 나았는지 세 줄로 적습니다",
      ],
    },
  ],

  summary: [
    "위험은 평균에서의 흩어짐이고, 연율화할 때는 √252 를 곱한다.",
    "CAGR 은 복리로 환산한 연평균 수익률, 샤프는 위험 1단위당 초과수익이다.",
    "MDD 는 고점 대비 최대 하락률 — 실전에서 사람을 포기하게 만드는 숫자다.",
  ],

  nextPreview:
    "지금까지는 종목을 <b>하나씩</b> 봤습니다. 다음 주에는 <b>둘 이상을 같이</b> 봅니다. 두 종목이 서로 반대로 움직이면 위험이 줄어드는데, 그걸 재는 숫자가 공분산과 상관계수입니다.",
};
