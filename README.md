# PYTHON으로 알아보는 기초 금융공학 — 스터디 사이트

FORIF 2026-2 · 8주 과정. 강의 자료를 **웹페이지로 직접 제공**합니다.
멘티는 파일을 내려받지 않고 브라우저에서 바로 읽습니다.

```
https://py-finance.vercel.app   ← 배포 후 주소 (아래 3번 참고)
```

---

## 1. 로컬에서 띄우기

```bash
npm install
```

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속합니다.

---

## 2. 매주 자료 올리는 법

수업이 끝나면 **두 가지**만 하면 됩니다.

### ① 주차 콘텐츠 만들기

`src/constants/week1.ts` 를 복사해 `week2.ts` 를 만들고 내용을 채웁니다.
**글은 전부 여기 있습니다.** 레이아웃은 건드리지 않아도 됩니다.

```ts
export const PY_LOOP = `for price in prices:
    print(price)`;
```

이어서 `src/app/week/[id]/weeks/Week1Content.tsx` 를 복사해 `Week2Content.tsx` 를 만들고,
방금 만든 데이터를 import 해서 배치합니다. 쓸 수 있는 조각은 이렇습니다.

| 컴포넌트 | 쓰임 |
|---|---|
| `SectionTitle` | 섹션 제목 (영문 + 한글 부제) |
| `CodeBlock` | 코드 + 복사 버튼 |
| `Callout` | 강조 박스 — `kind="tip" \| "warn" \| "note"` |
| `Tabs` | OS 3종처럼 갈래가 나뉠 때 |
| `StepItem` | 번호가 붙은 설치·실행 순서 |
| `Card` | 흰 카드 (`soft` 를 주면 하늘색 그라디언트) |
| `Tag` | 문법 태그·배지 |
| `WeekHero` | 주차 페이지 상단 |

### ② 두 곳에 등록하기

**`src/constants/weeks.ts`** — 해당 주차의 `available` 을 `true` 로:

```ts
{
  num: "02",
  ...
  available: true,   // ← false 에서 바꿉니다
},
```

**`src/app/week/[id]/page.tsx`** — 콘텐츠를 연결:

```ts
import Week2Content from "./weeks/Week2Content";

const CONTENT: Record<string, React.ComponentType> = {
  "1": Week1Content,
  "2": Week2Content,   // ← 한 줄 추가
};
```

이게 전부입니다. `git push` 하면 Vercel이 알아서 다시 배포합니다.

> **다음 수업 D-day는 자동입니다.** `weeks.ts` 의 `date` 와 오늘 날짜를 비교해 스스로 계산하므로
> 손댈 필요가 없습니다.

---

## 3. 배포 (Vercel)

처음 한 번만 하면, 이후로는 `git push` 만으로 자동 배포됩니다.

1. GitHub에 `py_finance` 저장소를 만들고 푸시합니다
2. [vercel.com](https://vercel.com) 에 GitHub 계정으로 로그인
3. **Add New → Project** → `py_finance` 선택
4. 설정은 건드리지 않고 **Deploy** (Next.js는 자동 인식됩니다)
5. 1~2분 뒤 `https://py-finance.vercel.app` 이 열립니다

> ⚠️ Vercel 프로젝트 이름의 `_` 는 URL에서 `-` 로 바뀝니다. `py_finance` → `py-finance.vercel.app`

---

## 4. 폴더 구조

```
src/
├── app/
│   ├── layout.tsx           공통 레이아웃 (폰트·네비·푸터·OG태그)
│   ├── page.tsx             홈 (히어로·원칙·커리큘럼·환경설정·참고자료)
│   ├── globals.css          디자인 토큰 (색은 전부 여기서만 정의)
│   └── week/[id]/
│       ├── page.tsx         주차 라우팅
│       └── weeks/           주차별 콘텐츠 컴포넌트
├── components/              공용 조각 11개
└── constants/
    ├── site.ts              스터디 이름·기간·장소
    ├── weeks.ts             8주 메타데이터 + 날짜 계산
    └── week1.ts             1주차 본문 데이터
```

---

## 5. 디자인

디자인 레퍼런스(흰 바탕 + 크림·스카이 확산 그라디언트)를 따릅니다.

- **색**: `globals.css` 의 `:root` 토큰. 다크 모드는 같은 파일에서 토큰만 다시 정의합니다
- **폰트**: Outfit(라틴 디스플레이) · Noto Sans KR(본문) · JetBrains Mono(코드·날짜)
- 색을 바꾸려면 **토큰만** 고치세요. 컴포넌트에는 색 값을 직접 쓰지 않았습니다

---

## 기술

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript
