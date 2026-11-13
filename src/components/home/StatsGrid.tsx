"use client";

import { animate, useInView } from "framer-motion";
import { Hourglass } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

interface Stat {
  value: string;
  label: string;
}

/** Splits "3,000+" into prefix / number / suffix so only the number counts up. */
function parse(value: string) {
  const m = value.match(/^(\D*)([\d\s.,]+)(.*)$/);
  if (!m) return null;
  const n = Number(m[2].replace(/[\s,]/g, ""));
  return Number.isFinite(n) ? { prefix: m[1], n, suffix: m[3], grouped: /[,\s]/.test(m[2]) } : null;
}

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const parsed = parse(value);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);

  useEffect(() => {
    if (!inView || !parsed) return;
    const controls = animate(0, parsed.n, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const r = Math.round(v);
        setDisplay(`${parsed.prefix}${parsed.grouped ? r.toLocaleString("en-US") : r}${parsed.suffix}`);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((s, i) => {
        const pending = !s.value.trim();
        return (
          <StaggerItem key={i}>
            <div
              className={`group relative h-full overflow-hidden rounded-[1.75rem] p-5 transition-transform duration-500 hover:-translate-y-1 sm:p-7 ${
                i === 0 ? "bg-brand-600 text-white" : "bg-sky text-ink"
              }`}
            >
              <p className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${pending ? "opacity-40" : ""}`}>
                {pending ? "—" : <CountUp value={s.value} />}
              </p>
              <p className={`mt-3 text-sm leading-snug font-semibold sm:text-base ${i === 0 ? "text-white/80" : "text-ink-soft"}`}>{s.label}</p>
              {pending && (
                <p
                  className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${
                    i === 0 ? "bg-white/15 text-white" : "bg-white text-brand-700"
                  }`}
                >
                  <Hourglass className="size-3" aria-hidden /> To be verified
                </p>
              )}
              <span
                className={`pointer-events-none absolute -right-8 -bottom-8 size-28 rounded-full transition-transform duration-700 group-hover:scale-150 ${
                  i === 0 ? "bg-white/10" : "bg-brand-200/40"
                }`}
                aria-hidden
              />
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
