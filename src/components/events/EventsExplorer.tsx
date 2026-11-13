"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { EventItem } from "@/lib/content";
import { EventCard, type CardSize } from "./EventCard";

type Filter = "all" | "annual" | "one-time";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "annual", label: "Annual" },
  { id: "one-time", label: "One-time" },
];

/** Card shape: annual + featured events get the bigger "wide" layout. */
function sizeFor(e: EventItem): CardSize {
  return e.category === "annual" || e.featured ? "wide" : "std";
}

export function EventsExplorer({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({ all: events.length, annual: events.filter((e) => e.category === "annual").length, "one-time": events.filter((e) => e.category === "one-time").length }),
    [events],
  );

  // In "All", annual traditions come first, then the one-time stories newest → oldest.
  const visible = useMemo(() => {
    const list = filter === "all" ? events : events.filter((e) => e.category === filter);
    return filter === "all" ? [...list.filter((e) => e.category === "annual"), ...list.filter((e) => e.category !== "annual")] : list;
  }, [events, filter]);

  return (
    <div>
      <div className="sticky top-[5.5rem] z-20 -mx-4 mb-10 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <LayoutGroup id="event-filters">
          <div role="tablist" aria-label="Filter events" className="inline-flex gap-1 rounded-full bg-white/90 p-1.5 shadow-[0_10px_30px_-15px_rgb(12_26_63/0.3)] ring-1 ring-ink/5 backdrop-blur-xl">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={active}
                  aria-controls="events-grid"
                  onClick={() => setFilter(f.id)}
                  className={`relative flex h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-bold whitespace-nowrap transition-colors sm:gap-2 sm:px-5 sm:text-[15px] ${
                    active ? "text-white" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-brand-600" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                  )}
                  <span className="relative">{f.label}</span>
                  <span className={`relative rounded-full px-2 py-0.5 text-xs tabular-nums ${active ? "bg-white/20" : "bg-sky text-brand-700"}`}>{counts[f.id]}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} events
      </p>

      <motion.ul id="events-grid" layout className="grid grid-flow-dense grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((event) => {
            const size = sizeFor(event);
            return (
              <motion.li
                key={event.slug}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={size === "wide" ? "sm:col-span-2" : ""}
              >
                <EventCard event={event} size={size} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
