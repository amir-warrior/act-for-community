"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Big statement whose words "light up" one by one as the visitor scrolls.
 * Words wrapped in *asterisks* get the brand colour.
 */
export function ScrollHighlightText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      {words.map((raw, i) => {
        const accent = raw.startsWith("*");
        const word = raw.replace(/\*/g, "");
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <Word key={i} progress={scrollYProgress} range={[start, end]} accent={accent}>{word}</Word>;
      })}
    </p>
  );
}

function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span aria-hidden className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }} className={accent ? "accent-serif text-brand-600" : ""}>
        {children}
      </motion.span>
    </span>
  );
}
