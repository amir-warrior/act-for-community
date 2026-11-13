"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";

/**
 * Most visitors arrive from Instagram on a phone — keep the two main actions
 * one thumb away. Appears after the hero, hidden on the two application pages.
 */
export function MobileCtaBar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 520));

  if (pathname === "/help" || pathname === "/volunteer") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3 pt-3 md:hidden"
        >
          <div className="flex gap-2 rounded-full bg-ink/90 p-1.5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            <Link href="/help" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-sun text-[15px] font-bold text-ink active:scale-95">
              <Heart className="size-4" aria-hidden /> Ask for help
            </Link>
            <Link href="/volunteer" className="flex h-12 flex-1 items-center justify-center rounded-full bg-brand-600 text-[15px] font-bold text-white active:scale-95">
              Volunteer
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
