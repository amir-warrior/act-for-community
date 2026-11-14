"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";

/**
 * Headline that rises in word by word on page load.
 * Pass lines as arrays of segments; `{ text, accent: true }` renders in the
 * serif italic accent style.
 */
export type Segment = string | { text: string; accent?: boolean };

export function WordsReveal({
  lines,
  className = "",
  delay = 0.1,
  as: Tag = "h1",
}: {
  lines: Segment[][];
  className?: string;
  delay?: number;
  as?: "h1" | "h2";
}) {
  let i = 0;
  // Real spaces between words keep the heading readable for search engines
  // and screen readers ("Small acts. Together, …", not "Smallacts.Together,…").
  return (
    <Tag className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((seg, si) => {
            const text = typeof seg === "string" ? seg : seg.text;
            const accent = typeof seg !== "string" && seg.accent;
            return (
              <Fragment key={si}>
                {text.split(" ").filter(Boolean).map((word, wi) => {
                  const idx = i++;
                  return (
                    <Fragment key={wi}>
                    {idx > 0 && " "}
                    <span className="inline-block overflow-hidden pr-[0.06em] pb-[0.08em] align-bottom">
                      <motion.span
                        className={`inline-block ${accent ? "accent-serif text-brand-600" : ""}`}
                        initial={{ y: "110%", rotate: 4 }}
                        animate={{ y: "0%", rotate: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + idx * 0.07 }}
                      >
                        {word}
                      </motion.span>
                    </span>
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
