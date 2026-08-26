import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { weeks } from "@/constants/weeks";
import WeekSlides from "@/components/WeekSlides";
import Week1Content from "./weeks/Week1Content";
import { WEEK2 } from "@/constants/week2";
import { WEEK3 } from "@/constants/week3";
import { WEEK4 } from "@/constants/week4";
import { WEEK5 } from "@/constants/week5";
import { WEEK6 } from "@/constants/week6";
import { WEEK7 } from "@/constants/week7";
import type { WeekContent } from "@/constants/weekContent";

/* 2주차부터는 데이터만 등록하면 됩니다.
   OS 탭처럼 특별한 화면이 필요한 주차만 전용 컴포넌트를 씁니다(1주차). */
const CONTENT: Record<string, WeekContent> = {
  "2": WEEK2,
  "3": WEEK3,
  "4": WEEK4,
  "5": WEEK5,
  "6": WEEK6,
  "7": WEEK7,
};

const CUSTOM: Record<string, React.ComponentType> = {
  "1": Week1Content,
};

export function generateStaticParams() {
  return weeks
    .filter((w) => w.available)
    .map((w) => ({ id: String(Number(w.num)) }));
}

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

  if (!week || !week.available) notFound();

  const Custom = CUSTOM[key];
  if (Custom) {
    return (
      <main className="mx-auto max-w-[900px] px-0">
        <Custom />
      </main>
    );
  }

  const content = CONTENT[key];
  if (!content) notFound();

  return (
    <main>
      <WeekSlides weekNum={Number(id)} content={content} />
    </main>
  );
}
