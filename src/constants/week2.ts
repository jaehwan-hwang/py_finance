import type { WeekContent } from "./weekContent";

/* ── 2주차 — 화폐의 시간가치 ──
   파이썬: if / for·while / def   ·   덤: f-string */

export const WEEK2: WeekContent = {
  cover: {
    lead: "조건문·반복문·함수를 배우고, 그 문법으로 단리·복리·연속복리·현재가치(NPV)를 계산합니다.",
  },

  slides: [
    {
      title: "조건문 — 상황에 따라 다르게",
      lead: "<b>if</b> 는 조건이 참일 때만 아래 줄을 실행합니다. 들여쓰기가 곧 범위입니다.",
      codes: [
        {
          code: `rate = 0.05

if rate > 0.03:
    print("높은 편입니다")
elif rate > 0.01:
    print("보통입니다")
else:
    print("낮습니다")`,
        },
      ],
      callout: {
        kind: "warn",
        title: "들여쓰기가 문법입니다",
        body: "파이썬은 중괄호 대신 <b>들여쓰기</b>로 코드 범위를 정합니다. 스페이스 4칸으로 통일하세요. 섞이면 IndentationError 가 납니다.",
      },
    },

    {
      title: "반복문 — 같은 일을 여러 번",
      lead: "복리는 <b>같은 곱셈을 여러 번</b> 하는 것입니다. 반복문이 딱 맞습니다.",
      codes: [
        {
          code: `money = 1000000

for year in range(1, 11):        # 1년부터 10년까지
    money = money * (1 + 0.05)
    print(year, round(money))`,
          caption: "range(1, 11) 은 1부터 10까지입니다. 끝 숫자는 포함되지 않습니다.",
        },
      ],
      bullets: [
        "<b>for</b> — 몇 번 반복할지 아는 경우",
        "<b>while</b> — 조건이 만족될 때까지 반복하는 경우",
      ],
    },

    {
      title: "while — 목표에 닿을 때까지",
      lead: "원금이 두 배가 되는 데 몇 년이 걸릴까요? 몇 번 반복할지 <b>미리 모를 때</b> while 을 씁니다.",
      codes: [
        {
          code: `money = 1000000
years = 0

while money < 2000000:
    money = money * (1 + 0.05)
    years = years + 1

print(f"{years}년 걸립니다")     # 15년 걸립니다`,
        },
      ],
      callout: {
        kind: "warn",
        title: "조건이 절대 거짓이 안 되면 멈추지 않습니다",
        body: "무한루프에 빠지면 노트북에서 <b>정지 버튼</b>을 누르세요. while 안에서 조건에 쓰인 값이 실제로 변하는지 항상 확인합니다.",
      },
    },

    {
      title: "함수 — 계산에 이름 붙이기",
      lead: "같은 계산을 여러 번 쓸 거라면 <b>함수</b>로 묶습니다. 이름을 붙이면 그 자체가 설명이 됩니다.",
      codes: [
        {
          code: `def future_value(pv: float, rate: float, n: int) -> float:
    """원금 pv를 연이율 rate로 n년 굴렸을 때의 금액."""
    return pv * (1 + rate) ** n


print(future_value(1000000, 0.05, 10))   # 1628894.6267774416`,
        },
      ],
      bullets: [
        "<b>def 이름(인자):</b> 로 시작하고 <b>return</b> 으로 결과를 돌려줍니다",
        "<b>pv: float</b> 는 타입힌트 — 무엇을 넣어야 하는지 알려줍니다",
        "따옴표 세 개는 docstring — 이 함수가 무엇을 하는지 한 줄로 적습니다",
      ],
    },

    {
      title: "단리와 복리",
      lead: "단리는 <b>원금에만</b> 이자가 붙고, 복리는 <b>이자에도</b> 이자가 붙습니다. 같은 연 5%인데 30년 뒤에는 크게 벌어집니다.",
      table: {
        head: ["기간", "단리", "복리", "차이"],
        rows: [
          ["10년", "1,500,000", "1,628,895", "+12.9만"],
          ["20년", "2,000,000", "2,653,298", "+65.3만"],
          ["30년", "2,500,000", "4,321,942", "+182.2만"],
        ],
      },
      codes: [
        {
          code: `def simple_interest(pv, rate, n):
    return pv * (1 + rate * n)          # 원금에만

def compound_interest(pv, rate, n):
    return pv * (1 + rate) ** n         # 이자에도`,
          caption: "원금 100만원, 연 5% 기준",
        },
      ],
    },

    {
      title: "복리 횟수를 늘리면 — 연속복리",
      lead: "1년에 한 번이 아니라 <b>매달</b>, <b>매일</b>, <b>매 순간</b> 이자를 붙이면 어떻게 될까요? 무한히 늘려도 값은 어딘가로 수렴합니다.",
      codes: [
        {
          code: `for m in [1, 12, 365, 100000]:
    fv = 1000000 * (1 + 0.05 / m) ** (m * 1)
    print(m, round(fv, 2))

# 1       1050000.00
# 12      1051161.90
# 365     1051267.50
# 100000  1051271.09   ← 더 이상 늘지 않는다`,
        },
      ],
      callout: {
        kind: "note",
        title: "여기서 자연상수 e 가 나옵니다",
        body: "이 수렴값이 <b>e</b> 입니다. 연속복리는 FV = PV × e^(rn) 로 씁니다. 이게 3주차 <b>로그수익률</b>의 정체입니다.",
      },
    },

    {
      title: "현재가치와 NPV",
      lead: "미래의 돈을 <b>지금 가치로 되돌리는 것</b>을 할인이라고 합니다. 복리의 반대 방향입니다.",
      codes: [
        {
          code: `def present_value(fv, rate, n):
    return fv / (1 + rate) ** n


def npv(rate, cashflows):
    """cashflows[0]은 지금(0년차), [1]은 1년 뒤 ..."""
    total = 0
    for n, cf in enumerate(cashflows):
        total = total + present_value(cf, rate, n)
    return total


print(npv(0.05, [-1000, 400, 400, 400]))   # 89.30`,
        },
      ],
      callout: {
        kind: "tip",
        title: "NPV 를 읽는 법",
        body: "0보다 크면 <b>들인 돈보다 받는 돈이 크다</b>는 뜻입니다. 위 예시는 지금 1000을 넣고 3년간 400씩 받는 투자인데, 연 5% 기준으로 89만큼 이득입니다.",
      },
    },

    {
      title: "덤 — f-string 으로 결과 다듬기",
      lead: "계산 결과를 그냥 출력하면 읽기 어렵습니다. 1주차에 배운 f-string 을 여기서 씁니다.",
      codes: [
        {
          code: `money = 1628894.6267774416

print(money)                    # 1628894.6267774416
print(f"{money:,.0f}원")         # 1,628,895원
print(f"수익률 {0.6289:+.1%}")   # 수익률 +62.9%`,
        },
      ],
    },

    {
      title: "미션 2 — 적금과 목돈, 어느 쪽이 클까",
      lead: "월 30만원씩 5년 적금 vs 지금 1800만원을 한 번에 예치. 연 4% 복리로 5년 뒤 어느 쪽이 클까요?",
      bullets: [
        "적금은 <b>반복문</b>으로 매달 넣은 돈이 각각 몇 달 굴러가는지 계산합니다",
        "목돈은 2주차에 만든 <b>future_value()</b> 한 줄이면 됩니다",
        "결과를 f-string 으로 보기 좋게 출력하고, 왜 그런 차이가 나는지 세 줄로 적습니다",
      ],
      callout: {
        kind: "tip",
        title: "접근 방법",
        body: "먼저 <b>1년치만</b> 손으로 계산한 뒤, 그 계산을 반복문으로 옮기면 됩니다.",
      },
    },
  ],

  summary: [
    "if 는 조건, for·while 은 반복, def 는 계산에 이름 붙이기 — 파이썬의 뼈대다.",
    "복리는 같은 곱셈의 반복이고, 그 반복을 무한히 쪼개면 연속복리(e)가 된다.",
    "미래의 돈을 지금 가치로 되돌리는 것이 할인이고, 그 합이 NPV다.",
  ],

  nextPreview:
    "오늘은 숫자 몇 개를 다뤘습니다. 다음 주에는 <b>10년치 주가 수천 개</b>를 한꺼번에 다룹니다. 리스트와 딕셔너리를 배우고, pandas 로 실제 주가를 가져옵니다.",
};
