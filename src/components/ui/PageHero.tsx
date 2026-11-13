import type { ReactNode } from "react";
import { WordsReveal, type Segment } from "@/components/motion/WordsReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "./SectionHeading";

interface PageHeroProps {
  eyebrow: string;
  title: Segment[][];
  intro?: ReactNode;
  children?: ReactNode;
  tone?: "white" | "sky" | "brand";
}

/** Shared hero for inner pages: eyebrow, word-reveal headline, intro, optional actions. */
export function PageHero({ eyebrow, title, intro, children, tone = "white" }: PageHeroProps) {
  const dark = tone === "brand";
  const bg = {
    white: "bg-white",
    sky: "bg-gradient-to-b from-sky to-white",
    brand: "bg-brand-700 text-white",
  }[tone];

  return (
    <section className={`relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24 ${bg}`}>
      <div className={`pointer-events-none absolute inset-0 ${dark ? "opacity-20" : "opacity-70"} bg-dots [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]`} aria-hidden />
      <div
        className={`pointer-events-none absolute -top-40 right-[-10%] size-[34rem] rounded-full blur-3xl ${dark ? "bg-brand-400/40" : "bg-brand-200/50"}`}
        aria-hidden
      />
      <div className="container-x relative">
        <Reveal y={12}>
          <Eyebrow light={dark}>{eyebrow}</Eyebrow>
        </Reveal>
        <WordsReveal
          lines={title}
          className={`mt-5 max-w-4xl text-[2.3rem] leading-[1.04] font-semibold tracking-tight sm:text-6xl lg:text-7xl ${
            dark ? "text-white [&_.accent-serif]:text-sun" : "text-ink"
          }`}
        />
        {intro && (
          <Reveal delay={0.35}>
            <p className={`mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl ${dark ? "text-white/80" : "text-ink-soft"}`}>{intro}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.5} className="mt-9">{children}</Reveal>}
      </div>
    </section>
  );
}
