import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { weeks } from "@/constants/weeks";
import Week1Content from "./weeks/Week1Content";

/* 주차 번호 → 콘텐츠 컴포넌트.
   새 주차를 만들면 WeekNContent 를 import 해서 여기에 한 줄 추가하면 된다. */
const CONTENT: Record<string, React.ComponentType> = {
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
  return { title: `${Number(week.num)}주차 — ${week.title}`, description: week.desc };
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const week = weeks.find((w) => Number(w.num) === Number(id));
  const Content = CONTENT[String(Number(id))];

  if (!week || !week.available || !Content) notFound();

  return (
    <main className="mx-auto max-w-[860px] px-5 sm:px-10">
      <Content />
    </main>
  );
}
