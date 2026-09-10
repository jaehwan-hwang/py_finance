import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { weeks, isOpen } from "@/constants/weeks";
import { isMentor } from "@/lib/mentor";
import Locked from "./Locked";
import MdWeek from "@/components/MdWeek";
import Week1Content from "./weeks/Week1Content";
import { WEEK2_DOC } from "@/constants/week2Doc";
import { WEEK3_DOC } from "@/constants/week3Doc";
import { WEEK4_DOC } from "@/constants/week4Doc";
import { WEEK5_DOC } from "@/constants/week5Doc";
import { WEEK6_DOC } from "@/constants/week6Doc";
import { WEEK7_DOC } from "@/constants/week7Doc";
import { WEEK8_DOC } from "@/constants/week8Doc";
import type { WeekDoc } from "@/constants/weekDoc";

/* 2주차부터는 files/weekN-*.md 를 옮긴 데이터만 등록하면 됩니다.
   OS 탭처럼 특별한 화면이 필요한 주차만 전용 컴포넌트를 씁니다(1주차). */
const DOCS: Record<string, WeekDoc> = {
  "2": WEEK2_DOC,
  "3": WEEK3_DOC,
  "4": WEEK4_DOC,
  "5": WEEK5_DOC,
  "6": WEEK6_DOC,
  "7": WEEK7_DOC,
  "8": WEEK8_DOC,
};

const CUSTOM: Record<string, React.ComponentType> = {
  "1": Week1Content,
};

/* 요청 시각과 쿠키로 공개 여부를 판단하므로 정적으로 굳히지 않는다. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const week = weeks.find((w) => Number(w.num) === Number(id));
  if (!week) return {};
  return {
    title: `${Number(week.num)}주차 — ${week.title}`,
    description: week.desc,
  };
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const key = String(Number(id));
  const week = weeks.find((w) => Number(w.num) === Number(id));

  if (!week) notFound();

  // 수업 전 주차는 멘토만 볼 수 있다
  if (!isOpen(week) && !(await isMentor())) {
    return <Locked week={week} />;
  }

  const Custom = CUSTOM[key];
  if (Custom) {
    return (
      <main className="mx-auto max-w-[900px] px-0">
        <Custom />
      </main>
    );
  }

  const doc = DOCS[key];
  if (!doc) notFound();

  return (
    <main>
      <MdWeek weekNum={Number(id)} doc={doc} />
    </main>
  );
}
