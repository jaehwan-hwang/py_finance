import type { WeekContent } from "./weekContent";

/* ── 3주차 — 수익률과 금융 데이터 ──
   파이썬: 리스트·딕셔너리 / import / pandas DataFrame   ·   덤: try·except */

export const WEEK3: WeekContent = {
  cover: {
    lead: "리스트·딕셔너리·pandas DataFrame 을 배우고, 실제 주가를 가져와 단순수익률과 로그수익률로 바꿉니다.",
  },

  slides: [
    {
      title: "리스트 — 여러 값을 순서대로",
      lead: "주가는 하나가 아니라 <b>날짜 순으로 늘어선 값들</b>입니다. 그 그릇이 리스트입니다.",
      codes: [
        {
          code: `prices = [70000, 71500, 69800, 72300, 73100]

print(prices[0])      # 70000   첫 번째 (0부터 센다)
print(prices[-1])     # 73100   마지막
print(prices[1:3])    # [71500, 69800]  잘라내기
print(len(prices))    # 5       개수`,
        },
        {
          code: `# 리스트를 반복문에 넣으면 하나씩 꺼내진다
for price in prices:
    print(price)`,
        },
      ],
    },

    {
      title: "딕셔너리 — 이름표를 붙여 담기",
      lead: "종목코드처럼 <b>짝을 이루는 값</b>은 딕셔너리에 담습니다.",
      codes: [
        {
          code: `portfolio = {
    "005930": 0.30,   # 삼성전자
    "000660": 0.25,   # SK하이닉스
    "005380": 0.45,   # 현대차
}

print(portfolio["005930"])        # 0.3
print(sum(portfolio.values()))    # 1.0  비중 합은 항상 1

for code, weight in portfolio.items():
    print(f"{code} {weight:.0%}")`,
        },
      ],
      callout: {
        kind: "note",
        title: "이 모양이 8주차까지 갑니다",
        body: "종목코드 → 비중 딕셔너리는 6주차 포트폴리오, 7주차 주문서에서 그대로 다시 나옵니다.",
      },
    },

    {
      title: "import — 남이 만든 도구 가져오기",
      lead: "주가를 가져오는 코드는 이미 누가 만들어 뒀습니다. 우리는 <b>불러다 쓰기만</b> 하면 됩니다.",
      codes: [
        {
          code: `import pandas as pd                 # 표를 다루는 도구
import FinanceDataReader as fdr    # 주가를 가져오는 도구

df = fdr.DataReader("005930", "2015-01-01")
print(df.shape)     # (2700, 6) 정도 — 행 2700개, 열 6개`,
        },
      ],
      bullets: [
        "<b>as</b> 는 별명입니다. 이름이 길면 짧게 줄여 씁니다",
        "설치는 1주차에 <b>pip install -r requirements.txt</b> 로 이미 끝났습니다",
      ],
    },

    {
      title: "DataFrame — 엑셀 표라고 생각하세요",
      lead: "pandas 의 <b>DataFrame</b> 은 행과 열이 있는 표입니다. 금융 데이터는 <b>행이 날짜, 열이 항목</b>입니다.",
      codes: [
        {
          code: `df.head()        # 처음 5줄
df.tail()        # 마지막 5줄

df["Close"]              # 종가 열만
df["Close"].iloc[0]      # 첫 날 종가
df["Close"].iloc[-1]     # 마지막 날 종가
df.loc["2024-01-02"]     # 특정 날짜의 행`,
        },
      ],
      table: {
        head: ["열 이름", "뜻"],
        rows: [
          ["Open", "시가 — 그날 처음 거래된 가격"],
          ["High / Low", "고가 / 저가"],
          ["Close", "종가 — 우리가 주로 쓰는 값"],
          ["Volume", "거래량"],
        ],
      },
    },

    {
      title: "수익률 — 한 줄이면 끝납니다",
      lead: "1주차에 손으로 한 계산을 pandas 는 <b>한 줄</b>로 합니다.",
      codes: [
        {
          code: `ret = df["Close"].pct_change()    # 전일 대비 변화율
ret = ret.dropna()                # 첫 행은 비교할 전날이 없어 NaN

print(ret.head())
print(f"누적수익률 {(1 + ret).prod() - 1:+.2%}")`,
          caption: "pct_change() 가 2주차에 반복문으로 하던 일을 대신합니다.",
        },
      ],
      callout: {
        kind: "warn",
        title: "첫 줄의 NaN 을 그냥 두지 마세요",
        body: "NaN 은 값이 없다는 뜻입니다. 안 버리면 이후 계산이 전부 NaN 이 됩니다. <b>.dropna()</b> 로 버립니다.",
      },
    },

    {
      title: "단순수익률과 로그수익률",
      lead: "수익률을 적는 방법이 두 가지입니다. 로그수익률은 <b>더할 수 있다</b>는 성질 때문에 씁니다.",
      table: {
        head: ["", "단순수익률", "로그수익률"],
        rows: [
          ["식", "(P₂ − P₁) / P₁", "ln(P₂ / P₁)"],
          ["여러 날 합치기", "곱한다", "더한다"],
          ["쓰는 곳", "실제 손익", "통계·모형"],
        ],
      },
      codes: [
        {
          code: `import numpy as np

ret_simple = df["Close"].pct_change().dropna()
ret_log = np.log(df["Close"] / df["Close"].shift(1)).dropna()

# 로그수익률의 합 == 단순 누적수익률
print(np.exp(ret_log.sum()) - 1)
print((1 + ret_simple).prod() - 1)   # 같은 값`,
        },
      ],
      callout: {
        kind: "note",
        title: "지난주 연속복리가 여기 있습니다",
        body: "로그수익률이 더해지는 이유는 2주차에 본 <b>연속복리</b> 때문입니다. e 의 지수는 더하면 곱셈이 됩니다.",
      },
    },

    {
      title: "수정주가를 써야 하는 이유",
      lead: "액면분할이 일어나면 주가가 하루아침에 1/50이 됩니다. 조정하지 않은 가격을 쓰면 <b>하루 수익률 −98%</b> 라는 없던 사건이 데이터에 생깁니다.",
      bullets: [
        "삼성전자는 2018년에 <b>50:1 액면분할</b>을 했습니다",
        "<b>FinanceDataReader</b> 가 주는 가격은 이미 조정되어 있습니다",
        "다른 데이터를 쓸 때는 수정주가인지 반드시 확인하세요",
      ],
    },

    {
      title: "덤 — try / except",
      lead: "인터넷에서 데이터를 가져오는 코드는 <b>실패할 수 있습니다</b>. 종목코드가 틀렸거나, 네트워크가 끊겼거나.",
      codes: [
        {
          code: `for ticker in ["005930", "잘못된코드", "000660"]:
    try:
        df = fdr.DataReader(ticker, "2020-01-01")
        print(f"{ticker} 성공 — {len(df)}일")
    except Exception as e:
        print(f"{ticker} 실패 — {e}")
        continue     # 다음 종목으로 넘어간다`,
          caption: "하나가 실패해도 전체가 멈추지 않습니다.",
        },
      ],
    },

    {
      title: "미션 3 — 관심 종목 5개의 월별 수익률",
      lead: "종목 5개를 딕셔너리에 담고, 각각의 <b>월별 수익률 표</b>를 만듭니다.",
      bullets: [
        "종목코드 → 종목명 딕셔너리를 만듭니다",
        "반복문으로 5개를 차례로 가져옵니다 (실패에 대비해 try/except)",
        "<b>resample('ME').last()</b> 로 월말 종가만 뽑아 수익률을 계산합니다",
        "가장 좋았던 달과 나빴던 달을 찾아 세 줄로 적습니다",
      ],
    },
  ],

  summary: [
    "리스트는 순서대로, 딕셔너리는 짝을 지어 담는다. 종목코드 → 비중이 8주차까지 간다.",
    "pandas DataFrame 은 행이 날짜, 열이 항목인 표다. pct_change() 한 줄이 수익률이다.",
    "로그수익률은 더할 수 있어서 쓴다. 그 이유는 지난주 연속복리에 있다.",
  ],

  nextPreview:
    "수익률을 구했으니 이제 <b>얼마나 위험한지</b>를 재야 합니다. 다음 주에는 변동성·CAGR·샤프지수·MDD 를 배우고, 수익률 1위와 위험 1위가 전혀 다른 종목이라는 것을 눈으로 확인합니다.",
};
