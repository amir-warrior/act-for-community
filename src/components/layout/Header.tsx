"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { InstagramIcon, TelegramIcon } from "@/components/ui/BrandIcons";
import { NAV } from "@/lib/links";

const DESKTOP_NAV = NAV.filter((n) => n.href !== "/what-you-gain");
const EASE = [0.22, 1, 0.36, 1] as const;

interface HeaderProps {
  instagram: { label: string; href: string } | null;
  telegram: { label: string; href: string } | null;
}

export function Header({ instagram, telegram }: HeaderProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Glass background after a little scroll; hide on scroll down, show on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 16);
    setHidden(y > 240 && y > prev && !open);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <div
          className={`container-x flex h-16 items-center justify-between gap-4 rounded-full transition-all duration-500 ${
            scrolled || open ? "bg-white/85 shadow-[0_8px_30px_-12px_rgb(12_26_63/0.18)] ring-1 ring-ink/5 backdrop-blur-xl" : "bg-transparent"
          }`}
          style={{ maxWidth: "78rem" }}
        >
          <Logo onClick={() => setOpen(false)} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {DESKTOP_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                      isActive(item.href) ? "text-brand-700" : "text-ink/75 hover:text-ink"
                    }`}
                  >
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-sky"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Link href="/help" className={buttonClasses("sun", "md")}>
                <Heart className="size-4" aria-hidden /> Ask for help
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full bg-ink text-white transition-transform active:scale-95 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white px-6 pt-28 pb-8 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
            <nav aria-label="Mobile" className="relative">
              <ul className="space-y-1">
                {[{ href: "/", label: "Home" }, ...NAV].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-baseline gap-4 py-2 font-display text-[2rem] leading-tight font-semibold tracking-tight ${
                        pathname === item.href ? "text-brand-600" : "text-ink"
                      }`}
                    >
                      <span className="font-sans text-xs font-bold text-ink/30 tabular-nums">0{i + 1}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="relative mt-auto grid gap-3 pt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link href="/help" onClick={() => setOpen(false)} className={buttonClasses("sun", "lg", "w-full")}>
                <Heart className="size-4" aria-hidden /> Ask for help
              </Link>
              <Link href="/volunteer" onClick={() => setOpen(false)} className={buttonClasses("brand", "lg", "w-full")}>
                Become a volunteer
              </Link>
              <div className="mt-4 flex items-center justify-center gap-5 text-sm font-semibold text-ink-soft">
                {instagram && (
                  <a href={instagram.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-600">
                    <InstagramIcon className="size-5" /> {instagram.label}
                  </a>
                )}
                {telegram && (
                  <a href={telegram.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-600">
                    <TelegramIcon className="size-5" /> Telegram
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
