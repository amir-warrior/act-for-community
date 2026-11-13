import { Sparkle } from "lucide-react";

/** Endless strip of words. Pure CSS animation, paused on hover, off for reduced motion. */
export function Marquee({ items, tone = "brand" }: { items: string[]; tone?: "brand" | "sun" }) {
  const row = [...items, ...items];
  const styles = tone === "brand" ? "bg-brand-600 text-white" : "bg-sun text-ink";
  return (
    <div className={`group relative flex overflow-hidden py-4 sm:py-5 ${styles}`} aria-hidden>
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
          {row.map((item, i) => (
            <span key={`${k}-${i}`} className="flex items-center gap-6 pr-6 font-display text-lg font-medium whitespace-nowrap sm:gap-8 sm:pr-8 sm:text-2xl">
              {item}
              <Sparkle className={`size-5 ${tone === "brand" ? "fill-sun text-sun" : "fill-brand-600 text-brand-600"}`} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
