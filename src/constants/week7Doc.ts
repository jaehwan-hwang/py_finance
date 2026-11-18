import type { WeekDoc } from "./weekDoc";

/** 7주차 — AI와 함께 만드는 나만의 포트폴리오.
 *  files/week7-paper-trading.md 를 옮긴 것. */

export const WEEK7_DOC: WeekDoc = {
  sub: "프롬프트와 템플릿으로 내 규칙을 코드로 만들고, 분석하고, 공유하고, 실제로 굴려본다",
  lead: "6주차까지 배운 것으로 포트폴리오를 계산할 수 있게 됐다. 그런데 지금까지 쓴 비중은 전부 <b>남이 정해준 규칙</b>(균등비중, 최대샤프, 최소분산)이었다. 이번 주에는 <b>자기 규칙으로 포트폴리오를 만들고, 그것이 어떻게 투자되는지 설명할 수 있는 상태</b>까지 간다. 규칙을 코드로 옮기는 일은 AI에게 맡긴다. 대신 <b>규칙을 정하고, 코드를 검증하고, 결과를 해석하는 일</b>은 직접 한다.",

  slides: [
    {
      title: "0. 오늘 하는 일",
      blocks: [
        { t: "p", text: "오늘은 설명을 듣는 시간이 아니라 <b>만드는 시간</b>이다. 세 단계로 간다." },
        {
          t: "table",
          head: ["단계", "하는 일", "결과물"],
          rows: [
            ["<b>① 만들기</b>", "내 규칙을 한 문장으로 쓰고, AI에게 코드로 옮겨 받아 템플릿에 넣는다", "고른 종목과 성적표"],
            ["<b>② 분석하기</b>", "그 규칙이 실제로 어떤 종목을 사게 되는지 뜯어본다", "내 전략 설명 5줄"],
            ["<b>③ 공유하기</b>", "단톡방에 규칙과 결과를 올린다", "공유 메시지"],
          ],
        },
        { t: "h", text: "퀀트 투자가 뭔가" },
        { t: "p", text: "<b>주관적인 감정이나 직관을 배제하고, 수학·통계·데이터·프로그래밍에 기반해 정해진 규칙대로 사고파는 투자 방식</b>이다." },
        { t: "p", text: "여기서 중요한 것은 <b>무엇을 살지도 규칙이 정한다</b>는 점이다. \"삼성전자가 좋아 보여서\"가 아니라, 100개 종목을 전부 놓고 <b>\"변동성이 가장 낮은 10종목\"</b> 처럼 기계가 판단할 수 있는 기준으로 고른다." },
        { t: "p", text: "사람이 하는 일은 셋뿐이다." },
        {
          t: "ul",
          items: [
            "<b>규칙을 만든다</b> — 무엇을 기준으로 고를지 정한다",
            "<b>검증한다</b> — 그 규칙이 과거에 어땠는지 확인한다",
            "<b>해석한다</b> — 왜 그런 결과가 나왔는지 설명한다",
          ],
        },
        { t: "p", text: "규칙을 코드로 옮기는 일은 AI에게 맡긴다. 위 세 가지는 직접 한다." },
      ],
    },
    {
      title: "준비 — 오늘의 후보 96종목",
      blocks: [
        {
          t: "code",
          lang: "bash",
          code: `pip install finance-datareader`,
        },
        { t: "p", text: "아래 코드를 <code>make_universe.py</code> 로 저장하고 <b>한 번만</b> 실행한다. 1분쯤 걸린다." },
        {
          t: "code",
          lang: "python",
          code: `"""오늘 쓸 종목 목록과 주가를 받아 universe.csv 로 저장한다.

한 번만 실행하면 된다. 1분쯤 걸린다.
    python make_universe.py
"""

import FinanceDataReader as fdr
import pandas as pd

N_STOCKS = 100          # 시가총액 상위 몇 종목을 볼 것인가
START = "2023-01-01"    # 언제부터의 주가를 받을 것인가


def main():
    print(f"코스피 종목 목록을 받는 중...")
    listing = fdr.StockListing("KOSPI")

    # 우선주와 스팩은 뺀다
    keep = ~listing["Name"].str.contains("우$|우B$|스팩", regex=True, na=False)
    top = listing[keep].nlargest(N_STOCKS, "Marcap")[["Code", "Name"]]
    print(f"시가총액 상위 {N_STOCKS}종목을 고름")

    prices = {}
    for i, (code, name) in enumerate(top.values, 1):
        try:
            prices[name] = fdr.DataReader(code, START)["Close"]
        except Exception:
            print(f"  건너뜀: {name}")
        if i % 20 == 0:
            print(f"  {i}/{N_STOCKS} 수집")

    df = pd.DataFrame(prices)

    # 상장한 지 얼마 안 된 종목은 뺀다 (기간이 짧으면 비교가 안 된다)
    enough = df.notna().sum() >= len(df) * 0.95
    df = df.loc[:, enough].dropna()
    df.to_csv("universe.csv", encoding="utf-8-sig")

    print()
    print(f"universe.csv 저장 완료 — {df.shape[1]}종목 × {df.shape[0]}일")
    print(f"기간 {df.index[0].date()} ~ {df.index[-1].date()}")


if __name__ == "__main__":
    main()`,
        },
        {
          t: "out",
          text: `코스피 종목 목록을 받는 중...
시가총액 상위 100종목을 고름
  20/100 수집
  40/100 수집
  60/100 수집
  80/100 수집
  100/100 수집

universe.csv 저장 완료 — 96종목 × 946일
기간 2023-01-02 ~ 2026-11-18`,
        },
        { t: "p", text: "상장한 지 얼마 안 된 종목은 빠져서 96종목이 남았다. <b>이 96종목이 오늘의 후보</b>다. 이 중에서 무엇을 살지는 규칙이 정한다." },
      ],
    },
    {
      title: "1단계 — 내 규칙을 한 문장으로",
      blocks: [
        { t: "p", text: "좋은 규칙에는 조건이 있다." },
        {
          t: "table",
          head: ["조건", "나쁜 예", "좋은 예"],
          rows: [
            ["<b>숫자로 판단할 수 있어야</b>", "\"좋아 보이는 종목\"", "\"변동성이 가장 낮은 10종목\""],
            ["<b>데이터 안에서 끝나야</b>", "\"뉴스가 좋은 종목\"", "\"최근 1년 수익률 상위 10종목\""],
            ["<b>종목 이름이 들어가면 안 됨</b>", "\"삼성전자와 하이닉스\"", "\"시가총액 상위 10종목\""],
          ],
        },
        { t: "p", text: "세 번째가 핵심이다. <b>종목 이름을 적는 순간 그것은 규칙이 아니라 내 취향이다.</b> 규칙은 데이터만 보고 종목을 골라야 한다." },
        { t: "p", text: "막히면 아래에서 골라 쓰고, 숫자만 바꿔도 된다." },
        {
          t: "table",
          head: ["규칙", "어떤 전략이 되나"],
          rows: [
            ["변동성이 가장 낮은 10종목을 골라 똑같이 담는다", "저변동성"],
            ["최근 1년 수익률이 가장 높은 10종목을 골라 똑같이 담는다", "모멘텀"],
            ["최근 1개월 수익률이 가장 낮은 10종목을 담는다", "평균회귀"],
            ["최근 1년 수익률 상위 30종목 중 변동성이 낮은 10종목을 담는다", "모멘텀 + 저변동성"],
            ["변동성이 낮은 10종목을 고르되, 변동성이 낮을수록 더 많이 담는다", "저변동성 + 역변동성 가중"],
          ],
        },
      ],
    },
    {
      title: "2단계 — AI에게 코드 받기",
      blocks: [
        { t: "p", text: "아래를 <b>그대로 복사</b>해 ChatGPT나 Claude에 붙여넣고, <b>[내 규칙]</b> 칸만 바꾼다." },
        {
          t: "code",
          lang: "text",
          code: `너는 파이썬 코드를 작성하는 조수다. 아래 규격에 맞는 함수 하나만 만들어라.

[데이터]
- returns : pandas DataFrame, 일간 단순수익률
- 열      : 코스피 시가총액 상위 96개 종목의 이름
- 행      : 날짜 인덱스, 약 660행

[내 규칙]
변동성이 가장 낮은 10종목을 골라 똑같이 나눠 담는다.

[함수 규격]
def build_weights(returns):
    # 종목을 고르고 비중을 정한다
    return pd.Series(비중, index=고른_종목들)

[지켜야 할 것]
- 고른 종목만 담아서 돌려줄 것 (고르지 않은 종목은 넣지 않는다)
- 비중의 합은 정확히 1
- 음수 비중 금지 (공매도는 다루지 않는다)
- 3~20종목 사이로 고를 것
- numpy 와 pandas 외의 라이브러리를 쓰지 말 것
- 종목 이름을 코드에 직접 쓰지 말 것 (유니버스가 바뀌어도 돌아가야 한다)
- returns 안에 있는 데이터만 쓸 것

[출력]
- 함수 코드 하나
- 그 아래에 규칙을 한 줄로 설명`,
        },
        { t: "p", text: "규격을 못 박는 것이 요령이다. \"퀀트 전략 짜줘\"라고 열어두면 매번 다른 모양이 나와서 템플릿에 넣을 수 없다." },
        { t: "note", text: "<b>AI에게 묻지 말아야 할 것</b> — \"어떤 종목이 오를까?\", \"수익률 예측해줘\". AI는 최신 시세를 모르고 그럴듯하게 지어낸다. 무엇보다 <b>그 답은 검증할 수 없다.</b> 종목을 고르는 것은 AI가 아니라 <b>내 규칙</b>이다." },
      ],
    },
    {
      title: "3단계 — 템플릿에 붙여넣기",
      blocks: [
        { t: "p", text: "아래 전체를 <code>my_portfolio.py</code> 로 저장한다. <b>AI에게 받은 함수는 ① 칸의 <code>build_weights</code> 를 지우고 그 자리에 붙여넣는다.</b> 규칙 문장도 <code>MY_RULE</code> 에 적는다. 나머지는 손대지 않는다." },
        {
          t: "code",
          lang: "python",
          code: `"""나만의 퀀트 전략 — 규칙으로 종목을 고르고 비중을 정한다.

universe.csv 와 같은 폴더에 두고 실행한다.
    python my_portfolio.py
"""

import numpy as np
import pandas as pd

RISK_FREE = 0.03        # 무위험수익률 3%
TRADING_DAYS = 252


# ══════════════════════════════════════════════════════════
# ① 여기만 바꾼다 — AI가 만들어준 코드를 붙여넣는다
# ══════════════════════════════════════════════════════════

MY_RULE = "변동성이 가장 낮은 10종목을 골라 똑같이 나눠 담는다"


def build_weights(returns):
    """내 규칙으로 살 종목과 비중을 정한다.

    returns : 일간 수익률 DataFrame (열 = 종목)
    반환    : 고른 종목만 담은 pd.Series, 합이 1
    """
    vol = returns.std()
    picked = vol.nsmallest(10).index
    return pd.Series(1 / len(picked), index=picked)


# ══════════════════════════════════════════════════════════
# ② 아래는 손대지 않아도 된다
# ══════════════════════════════════════════════════════════

def check_weights(w, universe):
    """비중이 쓸 수 있는 모양인지 확인한다."""
    problems = []
    if len(w) == 0:
        return ["고른 종목이 하나도 없다"]
    if abs(w.sum() - 1) > 1e-6:
        problems.append(f"비중의 합이 1이 아니다 ({w.sum():.4f})")
    if (w < -1e-9).any():
        problems.append("음수 비중이 있다 (공매도는 다루지 않는다)")
    if not (3 <= len(w) <= 20):
        problems.append(f"고른 종목이 {len(w)}개다 (3~20개로 맞추자)")
    unknown = [c for c in w.index if c not in universe]
    if unknown:
        problems.append(f"유니버스에 없는 종목: {unknown}")
    return problems


def stats(returns, w):
    """연 수익률, 변동성, 샤프지수를 돌려준다."""
    cols = list(w.index)
    mu = returns[cols].mean() * TRADING_DAYS
    cov = returns[cols].cov() * TRADING_DAYS
    ret = float(w @ mu)
    vol = float(np.sqrt(w @ cov @ w))
    return ret, vol, (ret - RISK_FREE) / vol


def main():
    prices = pd.read_csv("universe.csv", index_col=0, parse_dates=True)
    returns = prices.pct_change().dropna()

    # 앞 70%로 종목과 비중을 정하고, 뒤 30%로 성적을 매긴다
    split = int(len(returns) * 0.7)
    train, test = returns.iloc[:split], returns.iloc[split:]

    w = build_weights(train)
    market = pd.Series(1 / returns.shape[1], index=returns.columns)

    print("=" * 64)
    print(f"내 규칙 : {MY_RULE}")
    print(f"유니버스 : 코스피 시가총액 상위 {returns.shape[1]}종목")
    print("=" * 64)

    problems = check_weights(w, set(returns.columns))
    if problems:
        print("\\n[검증 실패]")
        for p in problems:
            print(f"  - {p}")
        print("\\nAI에게 이 메시지를 그대로 보여주고 코드를 고쳐 받자.")
        return

    print(f"\\n[고른 종목]  {len(w)}개")
    for name, x in w.sort_values(ascending=False).items():
        print(f"  {name:<14}{x:>7.1%}  {'█' * int(round(x * 60))}")

    print("\\n[성적표]  앞 70%로 고르고, 뒤 30%로 평가했다")
    print(f"  {'구간':<8}{'전략':<14}{'수익률':>10}{'위험':>10}{'샤프':>8}")
    print("  " + "-" * 50)
    for label, part in [("학습", train), ("검증", test)]:
        for tag, ww in [("내 전략", w), ("유니버스 전체", market)]:
            r, v, s = stats(part, ww)
            print(f"  {label:<8}{tag:<14}{r:>10.2%}{v:>10.2%}{s:>8.2f}")

    w.sort_values(ascending=False).to_csv("my_weights.csv", encoding="utf-8-sig")
    print("\\nmy_weights.csv 저장 완료")


if __name__ == "__main__":
    main()`,
        },
        {
          t: "out",
          text: `================================================================
내 규칙 : 변동성이 가장 낮은 10종목을 골라 똑같이 나눠 담는다
유니버스 : 코스피 시가총액 상위 96종목
================================================================

[고른 종목]  10개
  맥쿼리인프라          10.0%  ██████
  SK텔레콤           10.0%  ██████
  LG유플러스          10.0%  ██████
  기업은행            10.0%  ██████
  KT              10.0%  ██████
  에스원             10.0%  ██████
  삼성카드            10.0%  ██████
  대한항공            10.0%  ██████
  KT&G            10.0%  ██████
  NH투자증권          10.0%  ██████

[성적표]  앞 70%로 고르고, 뒤 30%로 평가했다
  구간      전략                   수익률        위험      샤프
  --------------------------------------------------
  학습      내 전략              17.87%    12.41%    1.20
  학습      유니버스 전체           36.15%    18.06%    1.83
  검증      내 전략              15.27%    22.94%    0.53
  검증      유니버스 전체           29.90%    37.77%    0.71

my_weights.csv 저장 완료`,
        },
        { t: "p", text: "규칙이 고른 종목이 통신·금융·인프라에 몰려 있다. <b>내가 고른 것이 아니라 \"변동성이 낮다\"는 기준이 데려온 종목들</b>이다." },
      ],
    },
    {
      title: "4단계 — 검증하기",
      blocks: [
        { t: "p", text: "<b>AI가 준 코드가 돌아간다고 맞는 것은 아니다.</b> 템플릿이 네 가지를 자동으로 잡아준다." },
        {
          t: "table",
          head: ["확인", "왜"],
          rows: [
            ["비중의 합이 1인가", "합이 1이 아니면 투자금이 맞지 않는다"],
            ["음수 비중이 없는가", "공매도는 이 수업에서 다루지 않는다"],
            ["3~20종목을 골랐는가", "1종목은 몰빵, 50종목은 사실상 전체 매수다"],
            ["유니버스 안의 종목인가", "AI가 없는 종목 이름을 지어낼 수 있다"],
          ],
        },
        { t: "p", text: "AI가 <b>합으로 나누는 것을 빠뜨리는 실수</b>를 자주 한다. 그때는 이렇게 멈춘다." },
        {
          t: "out",
          text: `================================================================
내 규칙 : 변동성이 가장 낮은 10종목을 골라 똑같이 나눠 담는다
유니버스 : 코스피 시가총액 상위 96종목
================================================================

[검증 실패]
  - 비중의 합이 1이 아니다 (768.7653)

AI에게 이 메시지를 그대로 보여주고 코드를 고쳐 받자.`,
        },
        { t: "p", text: "이럴 때는 AI에게 <b>에러 메시지를 그대로 보여주고</b> 고쳐 달라고 하면 된다." },
      ],
    },
    {
      title: "5단계 — 기준선과 비교하기",
      blocks: [
        { t: "p", text: "템플릿은 데이터를 <b>앞 70%(학습)와 뒤 30%(검증)로 나눈다.</b> 종목은 앞 70%만 보고 고르고, 성적은 한 번도 보지 않은 뒤 30%에서 매긴다. 이렇게 하지 않으면 \"답을 보고 푼 시험\"이 된다." },
        { t: "p", text: "비교 대상은 <b>유니버스 전체를 똑같이 사는 것</b>이다. 아무 규칙도 쓰지 않은 상태다. <b>내 규칙이 이것보다 나은가</b>가 유일한 질문이다." },
        { t: "p", text: "모멘텀 규칙으로 돌려보자." },
        {
          t: "out",
          text: `================================================================
내 규칙 : 최근 1년 수익률이 가장 높은 10종목을 골라 똑같이 나눠 담는다
유니버스 : 코스피 시가총액 상위 96종목
================================================================

[고른 종목]  10개
  효성중공업           10.0%  ██████
  두산              10.0%  ██████
  현대로템            10.0%  ██████
  한화에어로스페이스       10.0%  ██████
  두산에너빌리티         10.0%  ██████
  한화오션            10.0%  ██████
  한화시스템           10.0%  ██████
  삼양식품            10.0%  ██████
  LIG디펜스앤에어로스페이스  10.0%  ██████
  미래에셋증권          10.0%  ██████

[성적표]  앞 70%로 고르고, 뒤 30%로 평가했다
  구간      전략                   수익률        위험      샤프
  --------------------------------------------------
  학습      내 전략              93.84%    32.43%    2.80
  학습      유니버스 전체           36.15%    18.06%    1.83
  검증      내 전략              -4.00%    56.70%   -0.12
  검증      유니버스 전체           29.90%    37.77%    0.71

my_weights.csv 저장 완료`,
        },
        { t: "p", text: "<b>학습 구간에서는 수익률 93.84%, 샤프 2.80으로 유니버스 전체(36.15%, 1.83)를 압도했다. 그런데 검증 구간에서는 수익률 −4.00%, 샤프 −0.12로 무너졌다.</b> 같은 구간에 유니버스 전체는 +29.90%였다." },
        { t: "p", text: "고른 종목을 보면 이유가 보인다. 방산과 중공업이 몰려 있다. <b>그 기간에 많이 오른 종목을 샀더니, 다음 구간에서는 그 상승이 이어지지 않은 것</b>이다." },
        { t: "p", text: "이것이 퀀트에서 가장 많이 겪는 일이고, 이름이 있다. <b>과최적화(overfitting)</b> 다. 과거에 가장 잘 맞는 규칙을 고르면 미래에는 오히려 나빠지기 쉽다. <b>그래서 반드시 검증 구간에서, 반드시 기준선과 비교한다.</b>" },
        { t: "p", text: "이기지 못했다고 실패가 아니다. <b>이겼는지 졌는지 알게 된 것이 성과다.</b>" },
      ],
    },
    {
      title: "2. 분석하기 — 코드 분석 프롬프트",
      blocks: [
        { t: "p", text: "코드를 받아서 돌리는 것까지는 누구나 한다. <b>그 규칙이 어떤 종목을 사게 되는지 설명할 수 있어야 내 전략이다.</b>" },
        { t: "p", text: "AI에게 받은 <code>build_weights</code> 를 그대로 복사해 아래와 함께 보낸다." },
        {
          t: "code",
          lang: "text",
          code: `아래는 내 퀀트 전략이 종목을 고르는 코드다. 파이썬을 막 배운 사람도
이해할 수 있게 설명해줘. 전문용어를 쓰면 바로 풀어서 써줘.

1. 이 코드는 무엇을 기준으로 종목을 고르는가? (한 문장으로)
2. 어떤 성격의 종목이 주로 뽑히게 되는가?
3. 어떤 시장 상황에서 유리하고, 어떤 상황에서 불리한가?
4. 이 규칙의 약점은 무엇인가?
5. 비슷한 실제 투자 전략의 이름이 있는가?

[코드]
(여기에 build_weights 함수를 붙여넣는다)`,
        },
      ],
    },
    {
      title: "스스로 답해보기",
      blocks: [
        { t: "p", text: "AI 설명을 읽었으면 <b>보지 않고 자기 말로</b> 다섯 줄을 적는다." },
        {
          t: "out",
          label: "적어보기",
          text: `내 규칙      :
고르는 기준   :
주로 뽑히는 종목 :
유리한 상황 / 불리한 상황 :
이 규칙의 약점 :`,
        },
        { t: "h", text: "예시 — 저변동성 전략은 이렇게 투자한다" },
        {
          t: "table",
          head: ["질문", "답"],
          rows: [
            ["고르는 기준", "지난 기간 동안 주가가 덜 출렁인 종목 10개"],
            ["주로 뽑히는 종목", "통신(SK텔레콤·KT·LG유플러스), 금융(기업은행·삼성카드), 인프라(맥쿼리인프라)"],
            ["유리한 상황", "하락장·횡보장. 덜 빠져서 버티기 쉽다"],
            ["불리한 상황", "급등장. 많이 오르는 성장주가 애초에 안 뽑힌다"],
            ["이 규칙의 약점", "과거에 조용했던 종목이 앞으로도 조용하리라는 보장이 없다"],
            ["전략 이름", "저변동성(Low Volatility). 실제로 널리 쓰이는 팩터 전략"],
          ],
        },
        { t: "p", text: "여기까지 답할 수 있으면 <b>그 전략은 이제 내 것</b>이다." },
      ],
    },
    {
      title: "3. 공유하기",
      blocks: [
        { t: "p", text: "아래 네 줄을 채워 단톡방에 올린다. <code>my_portfolio.py</code> 출력에서 그대로 옮기면 된다." },
        {
          t: "out",
          label: "공유 양식",
          text: `[이름]
규칙      : 변동성이 가장 낮은 10종목을 골라 똑같이 담는다
고른 종목 : 맥쿼리인프라, SK텔레콤, LG유플러스, 기업은행, KT, 에스원 ...
성적표    : 검증 샤프 0.53 (유니버스 전체 0.71)
한 줄 평  : 덜 흔들렸지만 상승장에서는 뒤처졌다`,
        },
        { t: "h", text: "남의 전략에서 배우기" },
        { t: "p", text: "올라온 전략을 보면서 두 가지만 확인한다." },
        {
          t: "ul",
          items: [
            "<b>나와 겹치는 종목이 하나도 없는 사람은 누구인가?</b> 같은 96종목에서 골랐는데 왜 그렇게 갈렸는지 규칙을 비교해본다",
            "<b>검증 구간에서 유니버스 전체를 이긴 규칙이 있는가?</b> 있다면 그 규칙이 무엇을 기준으로 고르는지 본다",
          ],
        },
        { t: "p", text: "같은 데이터, 같은 96종목인데 규칙 한 문장으로 전혀 다른 포트폴리오가 나온다. <b>그 차이를 보는 것이 오늘의 공부다.</b>" },
      ],
    },
    {
      title: "참고 — quantkit 도구 상자",
      blocks: [
        { t: "p", text: "여기부터는 <b>오늘 실습에 꼭 필요하지는 않은 참고 자료</b>다. 위의 템플릿은 그 자체로 완결되어 있다." },
        { t: "p", text: "더 깊이 보고 싶은 사람을 위해, 같은 일을 패키지로 정리하면 어떤 모습이 되는지 담아두었다. 함수 모듈화, csv 입출력, 클래스, 그리고 <code>quantkit</code> 전체 코드다. 8주차 리팩토링에서 다시 다룬다." },
      ],
    },
    {
      title: "참고 1. 함수 모듈화 (Module)",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>모듈이란 함수·변수·클래스를 담아 다른 파일에서 불러 쓸 수 있게 만든 <code>.py</code> 파일이다.</b> 여러 모듈을 폴더로 묶은 것을 <b>패키지(package)</b> 라고 한다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "지금까지의 코드는 <b>작업할 때마다 공구를 새로 만들어 쓰고 버린 것</b>과 같다. 모듈화는 만든 공구를 <b>공구함에 정리해 넣는 일</b>이다. 다음에 필요할 때 꺼내 쓰면 되고, 공구가 고장 나면 공구함 안의 그것 하나만 고치면 모든 작업에 반영된다.",
        },
        { t: "h", text: "우리가 이미 쓰고 있었다" },
        { t: "code", lang: "python", code: `import numpy as np\nimport pandas as pd` },
        {
          t: "p",
          text: "<code>numpy</code>와 <code>pandas</code>도 남이 만든 모듈이다. 이제 내가 만든 파일을 같은 방식으로 불러온다.",
        },
        { t: "h", text: "가장 간단한 예" },
        { t: "p", text: "<code>mytools.py</code> 파일을 만들고 함수를 넣는다." },
        {
          t: "code",
          lang: "python",
          code: `# mytools.py

def greet(name):
    return f"안녕하세요, {name}님"`,
        },
        { t: "p", text: "같은 폴더의 다른 파일에서 불러 쓴다." },
        {
          t: "code",
          lang: "python",
          code: `# main.py

import mytools

print(mytools.greet("황재환"))

# 또는
from mytools import greet
print(greet("황재환"))`,
        },
        {
          t: "p",
          text: "<b>핵심 규칙</b>: <code>import</code>할 파일은 같은 폴더에 있거나, 패키지 폴더 안에 있어야 한다.",
        },
      ],
    },
    {
      title: "패키지로 묶기",
      blocks: [
        {
          t: "p",
          text: "파일이 여러 개가 되면 폴더로 묶는다. 폴더 안에 <code>__init__.py</code>라는 빈 파일을 하나 만들면 파이썬이 그 폴더를 패키지로 인식한다.",
        },
        {
          t: "out",
          text: `pyfinance-study/
├─ quantkit/
│  ├─ __init__.py       ← 빈 파일이어도 됨
│  ├─ metrics.py
│  └─ portfolio.py
└─ main.py`,
        },
        {
          t: "code",
          lang: "python",
          code: `# main.py
from quantkit.metrics import cagr, sharpe_ratio
from quantkit.portfolio import portfolio_return`,
        },
      ],
    },
    {
      title: 'if __name__ == "__main__":',
      blocks: [
        {
          t: "p",
          text: "모듈 파일에는 함수 정의만 있는 것이 아니라 테스트용 코드가 섞이기 쉽다. 그런데 <code>import</code>만 해도 파일 전체가 한 번 실행되므로, 테스트 코드까지 함께 실행되어 버린다.",
        },
        {
          t: "code",
          lang: "python",
          code: `# metrics.py
def cagr(prices):
    ...

print("테스트 실행")     # ← import만 해도 출력된다`,
        },
        {
          t: "p",
          text: "이를 막는 관용구가 <code>if __name__ == \"__main__\":</code>이다.",
        },
        {
          t: "code",
          lang: "python",
          code: `# metrics.py
def cagr(prices):
    ...


if __name__ == "__main__":
    # 이 파일을 직접 실행했을 때만 동작한다.
    # 다른 파일에서 import할 때는 실행되지 않는다.
    print("테스트 실행")`,
        },
        {
          t: "p",
          text: "<code>__name__</code>은 파이썬이 자동으로 채워주는 변수로, <b>직접 실행한 파일에서는 <code>\"__main__\"</code>, import된 파일에서는 그 모듈 이름</b>이 들어간다.",
        },
        { t: "h", text: "모듈화의 이점" },
        {
          t: "ol",
          items: [
            { text: "<b>중복 제거</b> — <code>sharpe_ratio()</code>를 한 곳에만 두면 된다." },
            { text: "<b>수정 지점의 단일화</b> — 계산식이 바뀌면 한 파일만 고친다." },
            { text: "<b>가독성</b> — 실행 스크립트가 짧아져 흐름이 한눈에 보인다." },
            { text: "<b>재사용</b> — 다음 프로젝트에 폴더째 복사해 쓸 수 있다." },
          ],
        },
      ],
    },

    /* ── 2. csv ── */
    {
      title: "참고 2. csv 파일 입출력",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>CSV(Comma-Separated Values)란 값을 쉼표로 구분해 표 형태의 데이터를 저장하는 텍스트 파일 형식이다.</b> 프로그램 종류를 가리지 않고 읽을 수 있어 데이터 교환의 사실상 표준으로 쓰인다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "CSV는 <b>가장 단순한 형태의 엑셀 파일</b>이다. 서식도 수식도 없이 값만 쉼표로 나열한다. 특별한 프로그램 없이 메모장으로도 열어볼 수 있다는 것이 최대 장점이다.",
        },
        {
          t: "code",
          lang: "csv",
          code: `date,name,price,quantity
2026-11-04,삼성전자,71000,10
2026-11-04,SK하이닉스,185000,3`,
        },
        { t: "h", text: "프로그램이 기억을 갖게 하는 일" },
        {
          t: "p",
          text: "지금까지 만든 프로그램은 실행이 끝나면 모든 변수가 사라졌다. 매주 모의투자를 이어가려면 <b>지난주 잔고와 보유 종목을 어딘가에 적어둬야 한다.</b> 파일 입출력은 프로그램에 기억을 부여하는 작업이다.",
        },
      ],
    },
    {
      title: "pandas로 읽고 쓰기 (권장)",
      blocks: [
        { t: "p", text: "표 형태 데이터는 pandas가 가장 편하다." },
        {
          t: "code",
          lang: "python",
          code: `import pandas as pd

# 저장
prices.to_csv("prices.csv")
prices.to_csv("prices.csv", encoding="utf-8-sig")   # 한글 깨짐 방지

# 불러오기
prices = pd.read_csv("prices.csv", index_col=0, parse_dates=True)`,
        },
        {
          t: "table",
          head: ["옵션", "의미"],
          rows: [
            ["<code>index_col=0</code>", "첫 열을 인덱스로 사용"],
            ["<code>parse_dates=True</code>", "인덱스를 날짜형으로 변환"],
            ["<code>encoding=\"utf-8-sig\"</code>", "엑셀에서 한글이 깨지지 않게 저장"],
            ["<code>index=False</code>", "인덱스를 저장하지 않음"],
          ],
        },
        {
          t: "p",
          text: "<code>utf-8-sig</code>를 쓰지 않으면 저장한 CSV를 윈도우 엑셀에서 열었을 때 한글이 깨진다. 실습에서 자주 만나는 문제다.",
        },
      ],
    },
    {
      title: "표준 라이브러리 csv 모듈",
      blocks: [
        {
          t: "p",
          text: "행 단위로 한 줄씩 기록할 때는 표준 <code>csv</code> 모듈이 가볍다. 거래 내역을 한 건씩 덧붙이는 용도에 적합하다.",
        },
        {
          t: "code",
          lang: "python",
          code: `import csv

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
        print(row)`,
        },
        {
          t: "p",
          text: "<code>with open(...) as f:</code> 구문은 블록이 끝나면 파일을 자동으로 닫아준다. 파일을 열고 닫지 않으면 내용이 저장되지 않을 수 있으므로 항상 이 형태로 쓴다.",
        },
        {
          t: "table",
          head: ["모드", "의미"],
          rows: [
            ["<code>\"r\"</code>", "읽기 (기본값)"],
            ["<code>\"w\"</code>", "쓰기 — <b>기존 내용을 모두 지운다</b>"],
            ["<code>\"a\"</code>", "이어 쓰기 (append)"],
          ],
        },
        {
          t: "p",
          text: "<code>newline=\"\"</code>은 윈도우에서 빈 줄이 하나씩 끼는 현상을 막는 옵션이다.",
        },
        { t: "h", text: "파일이 있는지 확인하기" },
        {
          t: "p",
          text: "첫 실행에는 파일이 없고, 두 번째부터는 있어야 한다. 이런 분기는 <code>os.path.exists()</code>로 처리한다.",
        },
        {
          t: "code",
          lang: "python",
          code: `import os

if os.path.exists("account.csv"):
    account = load_account("account.csv")     # 기존 계좌 이어받기
else:
    account = Account(initial_cash=10_000_000)   # 새 계좌 개설`,
        },
        {
          t: "p",
          text: "파이썬에서는 큰 숫자에 언더스코어를 넣어 <code>10_000_000</code>처럼 쓸 수 있다. 값은 <code>10000000</code>과 같고 읽기만 편해진다.",
        },
      ],
    },

    /* ── 3. 클래스 ── */
    {
      title: "참고 3. 클래스 (Class) 맛보기",
      blocks: [
        { t: "h", text: "정의" },
        {
          t: "p",
          text: "<b>클래스란 관련된 데이터(속성)와 그 데이터를 다루는 함수(메서드)를 하나로 묶어 정의한 설계도다.</b> 이 설계도로 실제로 만들어낸 개체를 <b>인스턴스(instance)</b> 또는 객체라고 한다.",
        },
        { t: "h", text: "비유" },
        {
          t: "p",
          text: "클래스는 <b>붕어빵 틀</b>, 인스턴스는 <b>그 틀로 구운 붕어빵</b>이다. 틀 하나로 붕어빵을 여러 개 만들 수 있고, 각 붕어빵은 서로 독립적이다. 계좌 클래스를 한 번 정의해두면 내 계좌, 친구 계좌, 벤치마크 계좌를 각각 만들어 따로 관리할 수 있다.",
        },
        { t: "h", text: "왜 계좌에 클래스가 어울리는가" },
        { t: "p", text: "모의투자 계좌를 함수와 변수만으로 관리하면 이렇게 된다." },
        {
          t: "code",
          lang: "python",
          code: `cash = 10000000
holdings = {}
avg_price = {}
transactions = []

cash, holdings, avg_price, transactions = buy(cash, holdings, avg_price,
                                              transactions, "삼성전자", 71000, 10)`,
        },
        {
          t: "p",
          text: "관련된 네 개의 값이 항상 함께 다녀야 하고, 함수 호출이 지저분해진다. 클래스로 묶으면 이렇게 된다.",
        },
        {
          t: "code",
          lang: "python",
          code: `account = Account(10_000_000)
account.buy("삼성전자", 71000, 10)`,
        },
        {
          t: "p",
          text: "<b>데이터와 그 데이터를 다루는 동작이 한 덩어리로 묶이는 것</b>이 클래스의 핵심 가치다.",
        },
      ],
    },
    {
      title: "기본 구조 · __init__과 self",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `class Account:
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
        return f"{self.name}: 현금 {self.cash:,.0f}원, 보유 {len(self.holdings)}종목"`,
        },
        {
          t: "code",
          lang: "python",
          code: `account = Account(10_000_000, name="황재환 계좌")
account.deposit(500_000)
print(account.summary())
# 황재환 계좌: 현금 10,500,000원, 보유 0종목`,
        },
        {
          t: "table",
          head: ["요소", "의미"],
          rows: [
            ["<code>class</code>", "클래스를 정의하는 키워드"],
            ["<code>__init__</code>", "인스턴스를 만들 때 자동으로 호출되는 초기화 메서드 (생성자)"],
            ["<code>self</code>", "인스턴스 자기 자신. 모든 메서드의 첫 매개변수로 반드시 쓴다"],
            ["<code>self.cash</code>", "그 인스턴스에 속한 값 (속성, attribute)"],
          ],
        },
        {
          t: "p",
          text: "<code>self</code>는 \"이 붕어빵\"을 가리키는 말이다. <code>self.cash</code>라고 쓰면 다른 계좌가 아니라 <b>이 계좌의 현금</b>을 뜻한다.",
        },
        {
          t: "p",
          text: "호출할 때는 <code>self</code>를 넘기지 않는다. <code>account.deposit(500_000)</code>이라고만 쓰면 파이썬이 <code>account</code>를 <code>self</code> 자리에 자동으로 넣어준다.",
        },
      ],
    },
    {
      title: "인스턴스는 서로 독립적이다 · __str__",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `a = Account(10_000_000, "내 계좌")
b = Account(5_000_000, "벤치마크")

a.deposit(1_000_000)

print(a.cash)   # 11000000
print(b.cash)   # 5000000   ← 영향 없음`,
        },
        { t: "h", text: "__str__ — 출력 형태 지정하기" },
        {
          t: "p",
          text: "<code>print(account)</code>를 했을 때 보기 좋게 나오도록 하려면 <code>__str__</code> 메서드를 정의한다.",
        },
        {
          t: "code",
          lang: "python",
          code: `class Account:
    def __init__(self, initial_cash):
        self.cash = initial_cash

    def __str__(self):
        return f"[계좌] 현금 {self.cash:,.0f}원"


account = Account(10_000_000)
print(account)   # [계좌] 현금 10,000,000원`,
        },
        {
          t: "p",
          text: "<code>__init__</code>, <code>__str__</code>처럼 앞뒤에 언더스코어 두 개가 붙은 메서드를 <b>매직 메서드</b>라 한다. 파이썬이 특정 상황에서 자동으로 불러주는 약속된 이름이다.",
        },
      ],
    },

    /* ── 4. quantkit ── */
    {
      title: "참고 4. 완성 코드 — quantkit",
      blocks: [
        {
          t: "p",
          text: "지금까지 배운 모든 것을 하나의 패키지로 정리한다. 아래 구조 그대로 폴더와 파일을 만든다.",
        },
        {
          t: "out",
          text: `pyfinance-study/
├─ venv/
├─ quantkit/
│  ├─ __init__.py
│  ├─ config.py        설정값 모음
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
└─ transactions.csv`,
        },
      ],
    },
    {
      title: "quantkit/__init__.py · config.py",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""quantkit — 기초 퀀트 투자 도구 모음 (py.finance 스터디)."""

__version__ = "1.0.0"`,
        },
        { t: "h", text: "quantkit/config.py" },
        {
          t: "code",
          lang: "python",
          code: `"""프로젝트 전역 설정값.

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

ENCODING = "utf-8-sig"        # 엑셀에서 한글이 깨지지 않게`,
        },
      ],
    },
    {
      title: "quantkit/data.py",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""주가 데이터 수집과 저장."""

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
    print(prices.tail())`,
        },
      ],
    },
    {
      title: "quantkit/metrics.py",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""성과와 위험을 재는 지표들 (4주차 내용)."""

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
              f"{row['변동성']:>10.2%}{row['샤프지수']:>8.2f}{row['MDD']:>10.2%}")`,
        },
      ],
    },
    {
      title: "quantkit/portfolio.py",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""포트폴리오 구성과 최적화 (5·6주차 내용)."""

import os

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
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"{path}가 없다. run_optimize.py 를 먼저 실행해야 한다."
        )
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

    return (normalized * aligned).sum(axis=1)`,
        },
      ],
    },
    {
      title: "quantkit/account.py — 거래",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""모의투자 계좌 (7주차 내용)."""

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
        })`,
        },
      ],
    },
    {
      title: "quantkit/account.py — 평가와 출력",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `    # ── 평가 ────────────────────────────────────────────

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
        print("=" * 72)`,
        },
      ],
    },
    {
      title: "quantkit/account.py — 저장과 불러오기",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `    # ── 저장·불러오기 ───────────────────────────────────

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
        return account`,
        },
        {
          t: "note",
          text: "<code>@classmethod</code>는 인스턴스가 아니라 클래스 자체에 붙는 메서드다. <code>Account.load()</code>처럼 계좌를 만들기 전에 호출해야 하는 경우에 사용한다. 지금은 \"이런 것도 있다\" 정도로만 알아두면 된다.",
        },
      ],
    },
    {
      title: "run_optimize.py — ① 최적 비중 산출",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""
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

        print(f"\\n[{label}]  수익률 {ret:.2%}  변동성 {vol:.2%}  샤프 {sharpe:.3f}")
        for name, weight in w.items():
            bar = "█" * int(weight * 40)
            print(f"  {pad(name, 12)}{weight:>7.2%}  {bar}")

    # 선택: 여기서 원하는 전략을 고른다
    chosen = candidates["최대샤프"]
    print()
    portfolio.save_weights(chosen)


if __name__ == "__main__":
    main(refresh="--refresh" in sys.argv)`,
        },
      ],
    },
    {
      title: "run_invest.py — ② 모의투자 집행",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""
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

    answer = input("\\n이대로 집행하시겠습니까? (y/n): ")
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
    main()`,
        },
      ],
    },
    {
      title: "매수 계획의 두 가지 한계",
      blocks: [
        {
          t: "note",
          text: "<b>현금이 조금 남는다.</b> 주식은 1주 단위로만 살 수 있어 <code>math.floor</code>로 내림하기 때문이다. 값이 비싼 종목이 섞이면 남는 돈이 커진다. 이 자료의 다섯 종목으로 1,000만 원을 집행하면 4% 안팎이 현금으로 남는다. 목표 비중과 실제 비중이 조금 어긋나는 것도 같은 이유이며, <code>run_rebalance.py</code>로 주기적으로 맞춰준다.",
        },
      ],
    },
    {
      title: "run_report.py — ③ 성과 리포트",
      blocks: [
        {
          t: "code",
          lang: "python",
          code: `"""
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
        print("\\n거래 내역이 아직 없다.")


if __name__ == "__main__":
    main()`,
        },
        {
          t: "note",
          text: "<b>벤치마크는 반드시 같은 구간으로 비교한다.</b> 내 계좌는 개설일 이후의 수익률인데 코스피는 최근 60거래일로 재면, 두 숫자를 빼는 것 자체가 성립하지 않는다. 오늘 막 매수한 계좌(0%)를 60거래일간 -13% 빠진 코스피와 비교해 \"13% 초과 성과\"라는 결론이 나오는 식이다. 그래서 <code>account.json</code>에 <b>첫 거래일</b>(<code>started</code>)을 남기고, 벤치마크도 그 날부터 받아온다. 계좌를 연 날이 아니라 첫 매매일을 기준으로 잡는 이유는, 현금만 들고 있던 기간까지 성과에 넣으면 또 어긋나기 때문이다. 성과 비교에서 가장 흔한 실수다.",
        },
      ],
    },

    {
      title: "run_rebalance.py — ④ 리밸런싱",
      blocks: [
        {
          t: "p",
          text: "시간이 지나면 잘 오른 자산의 비중이 저절로 커진다. 목표 비중으로 되돌리는 것이 리밸런싱이다. 여기서 처음으로 <code>Account.sell()</code>을 쓴다.",
        },
        {
          t: "code",
          lang: "python",
          code: `"""
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
    main()`,
        },
        {
          t: "p",
          text: "<code>sorted(orders, key=lambda x: x[&quot;구분&quot;] != &quot;매도&quot;)</code>는 <b>매도를 먼저 처리하기 위한 정렬</b>이다. 현금이 들어와야 매수가 가능하기 때문이다. <code>False</code>가 <code>0</code>, <code>True</code>가 <code>1</code>로 취급되는 성질을 이용했다.",
        },
        {
          t: "p",
          text: "<code>try</code> / <code>except ValueError</code>는 현금이 모자라 한 종목이 실패해도 나머지는 계속 진행하게 한다. <code>Account.buy()</code>가 잘못된 상태를 막으려고 <code>raise ValueError</code>를 던진 것이 여기서 쓰인다.",
        },
      ],
    },

    /* ── 5. 진행 방법 ── */
    /* ── 5. AI와 함께 내 전략 만들기 ── */
  ],

  outroTitle: "다음 주 예고",
  outro: [
    {
      t: "p",
      text: "8주차는 <b>나만의 포트폴리오</b>를 만드는 마지막 시간이다. 8주 동안 배운 문법을 총정리하고, <code>quantkit</code> 코드를 리팩토링한 뒤, <b>각자 자기 기준으로 종목과 비중을 직접 설계해 발표</b>한다.",
    },
    {
      t: "p",
      text: "이번 주에 집행한 모의계좌는 다음 주까지 그대로 운용한다. <code>account.json</code>과 <code>transactions.csv</code>를 지우지 말고, 매매할 때마다 <b>그 판단의 이유를 한 줄씩 기록</b>해두면 발표 준비가 훨씬 수월해진다.",
    },
  ],
};
