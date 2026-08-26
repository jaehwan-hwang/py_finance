import type { WeekContent } from "./weekContent";

/* ── 7주차 — 모의계좌로 포트폴리오 집행 ──
   파이썬: 함수 모듈화 / csv 입출력   ·   덤: 클래스 맛보기 */

export const WEEK7: WeekContent = {
  cover: {
    lead: "오늘은 새 이론이 거의 없습니다. <b>6주간 만든 것을 조립해</b> 모의계좌에 실제 주문을 넣습니다.",
    goal: "내 포트폴리오 비중대로 모의계좌에 주문을 집행한다.",
  },

  slides: [
    {
      title: "시작 전 — 준비물 확인",
      lead: "아래 세 가지가 안 되어 있으면 오늘 주문을 넣을 수 없습니다. 지금 확인하세요.",
      bullets: [
        "한국투자증권 계좌 개설 + <b>모의투자 신청</b> 완료",
        "KIS Developers 에서 <b>앱키·앱시크릿</b> 발급 완료",
        "6주차 미션에서 정한 <b>종목과 비중</b>",
      ],
      callout: {
        kind: "warn",
        title: "이 스터디는 모의투자까지만 다룹니다",
        body: "실계좌 전환과 자동매매는 자료로 만들지 않습니다. 모든 예제는 <b>모의투자 도메인</b>만 사용합니다.",
      },
    },

    {
      title: "API 키는 코드에 쓰지 않습니다",
      lead: "앱키를 코드에 적으면 GitHub 에 올라가는 순간 <b>수 분 내에</b> 자동 스캐너에 걸립니다.",
      codes: [
        {
          code: `# .env  ← 이 파일은 절대 커밋하지 않는다
KIS_ENV=paper
KIS_APP_KEY=여기에_발급받은_키
KIS_APP_SECRET=여기에_시크릿
KIS_ACCOUNT=계좌번호`,
          lang: "bash",
        },
        {
          code: `import os
from dotenv import load_dotenv

load_dotenv()
APP_KEY = os.getenv("KIS_APP_KEY")     # 코드에는 이름만 남는다`,
        },
      ],
      callout: {
        kind: "warn",
        title: "커밋 전에 확인",
        body: "<b>.gitignore</b> 에 .env 가 들어 있는지 반드시 확인하세요. 저장소에는 <b>.env.example</b> 만 둡니다.",
      },
    },

    {
      title: "함수로 나누기 — 모듈화",
      lead: "한 파일에 전부 쓰면 고치기 어렵습니다. <b>하는 일 단위로</b> 함수를 나누고 파일로 분리합니다.",
      codes: [
        {
          code: `# finance/broker.py
def get_token() -> str: ...          # 접근 토큰 발급·캐싱
def get_price(ticker) -> dict: ...   # 현재가 조회
def get_balance(): ...               # 잔고 조회
def order(ticker, qty, side,
          price=None, dry_run=True): ...`,
        },
        {
          code: `# 노트북에서는 불러다 쓰기만 한다
from finance.broker import get_price, order

print(get_price("005930"))`,
        },
      ],
    },

    {
      title: "주문의 흐름",
      lead: "증권사 API 는 네 단계로 움직입니다. 순서를 지키면 어렵지 않습니다.",
      table: {
        head: ["단계", "하는 일"],
        rows: [
          ["1. 토큰", "앱키로 접근 토큰을 받는다 (하루 유효)"],
          ["2. 시세", "현재가를 조회해 주문 가격을 정한다"],
          ["3. 잔고", "예수금과 보유 종목을 확인한다"],
          ["4. 주문", "수량과 가격을 실어 보낸다"],
        ],
      },
      codes: [
        {
          code: `import requests

res = requests.post(f"{BASE_URL}/oauth2/tokenP",
                    json={"grant_type": "client_credentials",
                          "appkey": APP_KEY, "appsecret": APP_SECRET})
token = res.json()["access_token"]`,
          caption: "응답은 JSON — 3주차에 배운 딕셔너리입니다.",
        },
      ],
    },

    {
      title: "비중을 수량으로 바꾸기",
      lead: "0.3 이라는 비중으로는 주문할 수 없습니다. <b>몇 주</b>인지로 바꿔야 합니다. 소수점 주식은 없습니다.",
      codes: [
        {
          code: `cash = 10_000_000        # 예수금 1천만원

orders = []
for ticker, weight in portfolio.items():
    price = get_price(ticker)["price"]
    qty = int(cash * weight // price)     # 버림 — 남는 돈은 현금으로
    if qty > 0:
        orders.append({"ticker": ticker, "weight": weight,
                       "price": price, "qty": qty})

for o in orders:
    print(o)`,
        },
      ],
      callout: {
        kind: "note",
        title: "버림으로 계산하는 이유",
        body: "올림하면 예수금이 모자라 주문이 거부됩니다. 남는 돈은 현금으로 두는 편이 안전합니다.",
      },
    },

    {
      title: "csv 로 주문서 남기기",
      lead: "무엇을 왜 샀는지 <b>기록으로 남깁니다</b>. 8주차 리포트에서 이 파일을 씁니다.",
      codes: [
        {
          code: `import pandas as pd
from datetime import date

df = pd.DataFrame(orders)
df.to_csv(f"orders_{date.today()}.csv", index=False,
          encoding="utf-8-sig")

# 다시 읽을 때
saved = pd.read_csv("orders_2026-11-04.csv", dtype={"ticker": str})`,
          caption: "dtype={'ticker': str} — 안 그러면 005930 이 5930 이 됩니다. 1주차의 그 이야기입니다.",
        },
      ],
    },

    {
      title: "안전장치 — dry_run",
      lead: "주문 함수의 기본값은 <b>항상 dry_run=True</b> 입니다. 진짜 주문은 명시적으로 꺼야만 나갑니다.",
      codes: [
        {
          code: `def order(ticker, qty, side, price=None, dry_run=True):
    payload = {...}

    if dry_run:
        print(f"[모의출력] {side} {ticker} {qty}주 @ {price}")
        return {"dry_run": True, "payload": payload}

    return requests.post(ORDER_URL, json=payload).json()`,
        },
      ],
      callout: {
        kind: "warn",
        title: "오늘의 규칙",
        body: "<b>전원이 dry_run 출력을 먼저 확인한 뒤</b> 실행합니다. 출력에 이상한 수량이나 종목이 보이면 그 자리에서 멈추세요.",
      },
    },

    {
      title: "함께 실행 — 7단계",
      lead: "여기부터는 다 같이 순서대로 진행합니다. 한 단계씩 확인하고 넘어갑니다.",
      bullets: [
        "1. <b>.env 확인</b> — KIS_ENV 가 paper 인지",
        "2. <b>토큰 발급</b> — 성공 메시지 확인",
        "3. <b>6주차 비중 불러오기</b>",
        "4. <b>리스크 체크</b> — 종목당 20% 이하, 예수금 초과 아닌지",
        "5. <b>주문서 생성</b> — orders.csv 로 저장",
        "6. <b>dry_run=True 로 전원 출력 확인</b>",
        "7. <b>집행</b> → 잔고 조회로 체결 확인",
      ],
    },

    {
      title: "덤 — 클래스 맛보기",
      lead: "함수가 많아지면 <b>관련된 것끼리 묶고</b> 싶어집니다. 그게 클래스입니다. 오늘은 이런 게 있다는 것만.",
      codes: [
        {
          code: `class Portfolio:
    def __init__(self, weights, cash):
        self.weights = weights
        self.cash = cash

    def to_orders(self, prices):
        return {t: int(self.cash * w // prices[t])
                for t, w in self.weights.items()}


p = Portfolio({"005930": 0.5, "000660": 0.5}, 10_000_000)
print(p.to_orders({"005930": 70000, "000660": 180000}))`,
          caption: "self 는 자기 자신입니다. 지금은 몰라도 됩니다 — 8주차 심화 주제입니다.",
        },
      ],
    },

    {
      title: "미션 7 — 잔고 기록하고 8주차 준비",
      lead: "다음 주까지 <b>모의계좌 잔고를 매일 기록</b>합니다.",
      bullets: [
        "매일 같은 시각에 get_balance() 를 실행해 평가금액을 적습니다",
        "KOSPI 와 같이 그려서 비교합니다",
        "8주차에 만들 <b>나만의 포트폴리오 주제</b>를 한 문단으로 정리합니다",
      ],
      callout: {
        kind: "note",
        title: "고지",
        body: "과거 성과는 미래를 보장하지 않습니다. 실제 자금 집행은 전적으로 <b>개인의 판단과 책임</b>이며, 이 스터디의 어떤 내용도 투자 권유가 아닙니다.",
      },
    },
  ],

  summary: [
    "API 키는 .env 에만 두고, 코드에는 이름만 남긴다.",
    "비중은 현재가로 나눠 주(株) 수로 바꾼다 — 버림으로 계산하고 기록을 csv 로 남긴다.",
    "주문 함수의 기본값은 dry_run=True — 출력을 확인한 뒤에만 실제로 나간다.",
  ],

  nextPreview:
    "마지막 주에는 가르치지 않습니다. <b>각자 조사하고, 만들고, 설명합니다.</b> 내 포트폴리오가 실패할 조건 3가지를 말할 수 있으면 8주를 제대로 보낸 것입니다.",
};
