import Image from "next/image";
import { MENTOR } from "@/constants/week1";

/** 멘토 카드 — 왼쪽에 멘토 정보, 오른쪽에 캐릭터를 원형으로 넣는다. */
export default function MentorCard() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[18px] border border-(--border) bg-(--surface) p-6 sm:flex-row sm:gap-6">
      <div className="order-2 w-full min-w-0 flex-1 sm:order-1">
        <p className="text-[0.9rem] font-medium text-(--ink-3)">멘토</p>
        <p className="mt-1.5 text-[1.4rem] font-semibold tracking-[-0.02em] text-(--ink)">
          {MENTOR.name}
        </p>
        <p className="mt-1 text-[0.95rem] text-(--ink-3)">
          {MENTOR.team} · {MENTOR.semester}
          {MENTOR.belong && ` · ${MENTOR.belong}`}
        </p>
        {MENTOR.intro && (
          <p className="mt-3 text-[0.96rem] leading-[1.75] text-(--ink-2)">
            {MENTOR.intro}
          </p>
        )}
        {MENTOR.contact && (
          <p className="mt-3 font-mono text-[0.88rem] text-(--ink-3)">
            {MENTOR.contact}
          </p>
        )}
      </div>

      {/* 캐릭터 — 원형 */}
      <div
        className="order-1 h-28 w-28 flex-none overflow-hidden rounded-full border border-(--border) sm:order-2 sm:h-36 sm:w-36"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 112%, #dbe7f8, #f5f9fe)",
        }}
      >
        <Image
          src="/jaehwan_character.png"
          alt={`${MENTOR.name} 캐릭터`}
          width={288}
          height={288}
          className="h-full w-full scale-[1.2] object-contain"
          priority
        />
      </div>
    </div>
  );
}
