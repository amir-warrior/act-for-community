"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Heart } from "lucide-react";
import { useRef } from "react";
import { WordsReveal } from "@/components/motion/WordsReveal";
import { Photo } from "@/components/ui/Photo";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/BrandIcons";

interface HeroPhoto {
  src?: string;
  alt?: string;
  label: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroHome({ photos, eventsCount, instagram }: { photos: HeroPhoto[]; eventsCount: number; instagram: { label: string; href: string } | null }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Each photo drifts at its own speed → depth.
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [a, b, c] = photos;

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-sky via-white to-white pt-28 pb-16 sm:pt-36 lg:pb-28">
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_20%,black_20%,transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute top-[-12rem] right-[-8rem] size-[38rem] rounded-full bg-brand-300/35 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-[-10rem] size-[26rem] rounded-full bg-sun/20 blur-3xl" aria-hidden />

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Copy */}
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full bg-white/80 py-1.5 pr-4 pl-2 text-[13px] font-semibold text-ink shadow-sm ring-1 ring-ink/5 backdrop-blur"
          >
            <span className="relative grid size-5 place-items-center">
              <span className="absolute size-2.5 animate-ping-soft rounded-full bg-sun" />
              <span className="relative size-2.5 rounded-full bg-sun-deep" />
            </span>
            Student-led charity · Bishkek, Kyrgyzstan
          </motion.p>

          <WordsReveal
            lines={[["Small acts."], [{ text: "Together,", accent: true }], ["they change lives."]]}
            className="mt-6 text-[2.75rem] leading-[1.02] font-semibold tracking-tight text-ink sm:text-7xl lg:text-[4.4rem] xl:text-[5.4rem]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl"
          >
            Act for Community is a group of students who organise charity tournaments, concerts, fairs and drives — and turn them into real support for
            people and causes in our city.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/help" className={buttonClasses("sun", "lg")}>
              <Heart className="size-[1.1em]" aria-hidden />
              Ask for help
              <ButtonArrow />
            </Link>
            <Link href="/volunteer" className={buttonClasses("brand", "lg")}>
              Become a volunteer
              <ButtonArrow />
            </Link>
          </motion.div>

          {instagram && (
            <motion.a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-brand-600"
            >
              <InstagramIcon className="size-5" />
              Follow our events on <span className="underline decoration-sun decoration-2 underline-offset-4 group-hover:decoration-brand-600">{instagram.label}</span>
            </motion.a>
          )}
        </div>

        {/* Photo collage */}
        <div className="relative h-[26rem] sm:h-[32rem] lg:col-span-5 lg:h-[36rem]">
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -4 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="absolute top-0 left-0 w-[64%]"
          >
            <Photo src={a?.src} alt={a?.alt} label={a?.label} priority sizes="(min-width:1024px) 26vw, 60vw" className="aspect-[4/5] rounded-[2rem] shadow-2xl shadow-brand-900/15 ring-8 ring-white" />
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.9, rotate: 8 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            transition={{ duration: 1, ease: EASE, delay: 0.5 }}
            className="absolute right-0 bottom-6 w-[56%]"
          >
            <Photo src={b?.src} alt={b?.alt} label={b?.label} sizes="(min-width:1024px) 22vw, 55vw" className="aspect-square rounded-[2rem] shadow-2xl shadow-brand-900/15 ring-8 ring-white" />
          </motion.div>

          <motion.div
            style={{ y: y3 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="absolute top-[8%] right-[2%] hidden w-[34%] sm:block"
          >
            <Photo src={c?.src} alt={c?.alt} label={c?.label} sizes="15vw" className="aspect-[3/4] rounded-[1.5rem] shadow-xl shadow-brand-900/10 ring-[6px] ring-white" />
          </motion.div>

          {/* Rotating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1 }}
            className="absolute bottom-[-0.5rem] left-[4%] grid size-28 place-items-center rounded-full bg-brand-600 text-white shadow-xl sm:size-32"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow" aria-hidden>
              <defs>
                <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <text className="fill-white font-sans text-[9.4px] font-bold tracking-[0.2em] uppercase">
                <textPath href="#badge-circle">Act for community · Bishkek · </textPath>
              </text>
            </svg>
            <Heart className="size-7 fill-sun text-sun" aria-hidden />
          </motion.div>

          {/* Floating fact chip — the number is counted from the CMS, not invented */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.15 }}
            className="absolute top-[46%] left-[46%] hidden sm:block"
          >
            <div className="animate-float rounded-2xl bg-white/90 px-4 py-3 shadow-xl ring-1 ring-ink/5 backdrop-blur">
              <p className="font-display text-2xl font-semibold text-brand-600">{eventsCount}</p>
              <p className="text-xs font-semibold text-ink-soft">events in our archive</p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#who-we-are"
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold text-ink-soft lg:flex"
        aria-label="Scroll to learn more"
      >
        Scroll
        <span className="grid size-9 place-items-center rounded-full ring-1 ring-ink/15">
          <ArrowDown className="size-4 animate-bounce" />
        </span>
      </motion.a>
    </section>
  );
}
