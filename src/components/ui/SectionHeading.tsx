import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.18em] uppercase ${
        light ? "text-sun" : "text-brand-600"
      }`}
    >
      <span className={`h-px w-6 ${light ? "bg-sun" : "bg-brand-600"}`} aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = "left", light = false, className = "" }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-4 text-[1.9rem] leading-[1.08] font-semibold tracking-tight sm:text-5xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${light ? "text-white/75" : "text-ink-soft"} ${centered ? "mx-auto" : ""} max-w-2xl`}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
