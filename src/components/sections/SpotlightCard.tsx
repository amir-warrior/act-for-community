"use client";

import {
  Award, Building2, CalendarCheck, Camera, ClipboardList, Flag, Gift, GraduationCap, HandHeart, Heart, House, Megaphone,
  MessagesSquare, Music, Network, Puzzle, Rocket, Scale, ShieldCheck, Sprout, Stethoscope, TrendingUp, Trophy, Users,
} from "lucide-react";
import type { MouseEvent } from "react";

/** Icons are referenced by name so server pages can pass them as plain strings. */
export const ICONS = {
  award: Award, building: Building2, calendar: CalendarCheck, camera: Camera, clipboard: ClipboardList, flag: Flag, gift: Gift,
  graduation: GraduationCap, handHeart: HandHeart, heart: Heart, house: House, megaphone: Megaphone, messages: MessagesSquare,
  music: Music, network: Network, puzzle: Puzzle, rocket: Rocket, scale: Scale, shield: ShieldCheck, sprout: Sprout,
  stethoscope: Stethoscope, trending: TrendingUp, trophy: Trophy, users: Users,
} as const;
export type IconName = keyof typeof ICONS;

/** Card with a soft light that follows the cursor + icon that tilts on hover. */
export function SpotlightCard({ index, icon, title, text, tone = "white" }: { index?: number; icon: IconName; title: string; text: string; tone?: "white" | "sky" }) {
  const Icon = ICONS[icon];
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <article
      onMouseMove={onMove}
      className={`spotlight group relative h-full overflow-hidden rounded-[1.75rem] p-6 ring-1 ring-ink/[0.07] transition-[transform,box-shadow] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(12_26_63/0.35)] sm:p-8 ${
        tone === "sky" ? "bg-sky/60" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-rotate-12 group-hover:scale-110">
          <Icon className="size-6" strokeWidth={1.8} aria-hidden />
        </span>
        {index !== undefined && <span className="font-display text-sm font-semibold text-ink/25 tabular-nums">{String(index + 1).padStart(2, "0")}</span>}
      </div>
      <h3 className="mt-7 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
      <p className="mt-3 leading-relaxed text-ink-soft">{text}</p>
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-sun transition-all duration-700 ease-[var(--ease-soft)] group-hover:w-full" aria-hidden />
    </article>
  );
}
