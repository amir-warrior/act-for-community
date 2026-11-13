"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";

export interface TimelineYear {
  year: string;
  items: { slug: string; title: string; date: string }[];
}

/** Our story year by year — the line fills as you scroll. Built from the events in the CMS. */
export function Timeline({ years }: { years: TimelineYear[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative ml-3 sm:ml-0">
      <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded bg-brand-100 sm:left-[9.5rem]" aria-hidden />
      <motion.span style={{ scaleY }} className="absolute top-2 bottom-2 left-0 w-0.5 origin-top rounded bg-brand-600 sm:left-[9.5rem]" aria-hidden />
      {years.map((y) => (
        <li key={y.year} className="relative grid gap-3 pb-12 pl-8 last:pb-0 sm:grid-cols-[9.5rem_1fr] sm:gap-0 sm:pl-0">
          <Reveal className="sm:pr-10 sm:text-right">
            <span className="font-display text-3xl font-semibold text-brand-600 sm:text-4xl">{y.year}</span>
          </Reveal>
          <span className="absolute top-2.5 left-[-7px] size-4 rounded-full border-4 border-white bg-sun shadow ring-1 ring-sun-deep/40 sm:left-[calc(9.5rem-7px)]" aria-hidden />
          <ul className="space-y-2.5 sm:pl-10">
            {y.items.map((it, i) => (
              <Reveal as="li" key={it.slug} delay={i * 0.06}>
                <Link
                  href={`/events/${it.slug}`}
                  className="group flex flex-col gap-0.5 rounded-2xl bg-white px-5 py-4 ring-1 ring-ink/[0.07] transition-all duration-300 hover:translate-x-1 hover:ring-brand-300 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold text-ink group-hover:text-brand-700">{it.title}</span>
                  <span className="text-sm font-medium text-ink-soft">{it.date}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
