"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Heart } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ActScene, Pose } from "./scene";

export interface V2Event {
  slug: string;
  title: string;
  date: string;
  recurrence?: string;
  venue?: string;
  impact?: string;
}

const VALUES = [
  { name: "Compassion", text: "We care about people and their well-being." },
  { name: "Community", text: "We believe positive change starts when people come together." },
  { name: "Equality", text: "Everyone deserves support, respect, and opportunities." },
  { name: "Initiative", text: "We encourage young people to take action." },
  { name: "Responsibility", text: "We believe every contribution matters." },
  { name: "Impact", text: "We focus on creating meaningful and lasting change." },
];

/** Where the ball is in each section. Interpolated as you scroll. */
function keyframes(portrait: boolean): Pose[] {
  return [
    portrait ? { x: 0.95, y: 1.55, scale: 0.62, values: 0, podium: 0, sides: 0 } : { x: 1.75, y: 0.15, scale: 0.95, values: 0, podium: 0, sides: 0 },
    { x: 0, y: portrait ? -0.1 : -0.22, scale: portrait ? 0.85 : 1.05, values: 1, podium: 0, sides: 0 },
    { x: 0, y: 0, scale: 0.45, values: 0, podium: 1, sides: 1 },
    { x: 0, y: 0, scale: 0.45, values: 0, podium: 1, sides: 0 },
  ];
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mixPose = (a: Pose, b: Pose, t: number): Pose =>
  Object.fromEntries(Object.keys(a).map((k) => [k, a[k as keyof Pose] + (b[k as keyof Pose] - a[k as keyof Pose]) * t])) as unknown as Pose;

export function V2Experience({ annual, stories, instagram }: { annual: V2Event[]; stories: V2Event[]; instagram: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const pills = useRef<(HTMLDivElement | null)[]>([]);
  const lines = useRef<(SVGLineElement | null)[]>([]);
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let scene: ActScene | null = null;
    let raf = 0;
    let last = performance.now();
    let disposed = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => scene?.setSize(window.innerWidth, window.innerHeight);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!scene) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const K = keyframes(vw / vh < 0.9);

      // Which stage are we in? Hold each pose for the first 55% of its section, then blend to the next.
      const mid = vh / 2;
      let stage = 0;
      let blend = 0;
      const els = sections.current;
      for (let i = 0; i < els.length; i++) {
        const r = els[i]?.getBoundingClientRect();
        if (!r) continue;
        if (r.top <= mid) {
          stage = i;
          blend = i < els.length - 1 ? smooth(0.55, 1, (mid - r.top) / r.height) : 0;
        }
      }
      const pose = mixPose(K[stage], K[Math.min(stage + 1, K.length - 1)], blend);
      scene.render(pose, dt, reduce);

      // Dark header text while the light "values" section is under it.
      const light = els[1]?.getBoundingClientRect();
      if (headerRef.current && light) headerRef.current.dataset.tone = light.top <= 40 && light.bottom > 40 ? "dark" : "light";

      // Fade the whole 3D layer out after the finale.
      const lastRect = els[els.length - 1]?.getBoundingClientRect();
      if (stageWrapRef.current && lastRect) stageWrapRef.current.style.opacity = String(smooth(0, vh * 0.45, lastRect.bottom));

      // Labels that stick to the ball.
      const show = smooth(0.6, 0.95, pose.values);
      const wrap = labelsRef.current;
      if (!wrap) return;
      wrap.style.visibility = show > 0.01 ? "visible" : "hidden";
      if (show <= 0.01) return;
      const ball = scene.ballScreen(vw, vh);
      const gap = Math.max(18, ball.r * 0.32);
      const placed: { i: number; x: number; y: number; w: number; h: number; left: boolean; px: number; py: number; f: number }[] = [];
      scene.anchors.forEach((a, i) => {
        const pill = pills.current[i];
        if (!pill) return;
        const pt = scene!.project(a, vw, vh);
        const left = i < 3;
        const w = pill.offsetWidth;
        const h = pill.offsetHeight;
        let x = left ? ball.cx - ball.r - gap - w : ball.cx + ball.r + gap;
        x = Math.min(vw - w - 10, Math.max(10, x));
        placed.push({ i, x, y: pt.y - h / 2, w, h, left, px: pt.x, py: pt.y, f: smooth(0.02, 0.3, pt.facing) * show });
      });
      // keep pills on each side from overlapping
      for (const side of [true, false]) {
        const col = placed.filter((p) => p.left === side).sort((a, b) => a.y - b.y);
        for (let k = 1; k < col.length; k++) col[k].y = Math.max(col[k].y, col[k - 1].y + col[k - 1].h + 10);
      }
      for (const p of placed) {
        const pill = pills.current[p.i]!;
        pill.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        pill.style.opacity = String(p.f);
        const line = lines.current[p.i];
        const dot = dots.current[p.i];
        if (line && dot) {
          line.setAttribute("x1", String(p.left ? p.x + p.w : p.x));
          line.setAttribute("y1", String(p.y + p.h / 2));
          line.setAttribute("x2", String(p.px));
          line.setAttribute("y2", String(p.py));
          line.style.opacity = String(p.f);
          dot.setAttribute("cx", String(p.px));
          dot.setAttribute("cy", String(p.py));
          dot.style.opacity = String(p.f);
        }
      }
    };

    import("./scene")
      .then(({ ActScene }) => {
        if (disposed) return;
        try {
          scene = new ActScene(canvas);
          resize();
        } catch {
          canvas.style.display = "none"; // no WebGL — the page still works without the 3D layer
        }
      })
      .catch(() => {});
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      scene?.dispose();
    };
  }, []);

  // Hero parallax for the giant word and the mountains.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const ridgeBackY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const ridgeFrontY = useTransform(scrollYProgress, [0, 1], ["0%", "4%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const setSection = (i: number) => (el: HTMLElement | null) => {
    sections.current[i] = el;
  };

  return (
    <div className="bg-[#070d1f] font-sans text-white antialiased selection:bg-sun selection:text-ink">
      {/* Fixed 3D layer: sits above section backgrounds, below section text. */}
      <div ref={stageWrapRef} className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      {/* Value labels pinned to the ball */}
      <div ref={labelsRef} className="pointer-events-none fixed inset-0 z-[3]" style={{ visibility: "hidden" }} aria-hidden>
        <svg className="absolute inset-0 h-full w-full">
          {VALUES.map((v, i) => (
            <g key={v.name}>
              <line ref={(el) => void (lines.current[i] = el)} stroke="#0c1a3f" strokeOpacity="0.45" strokeWidth="1" style={{ opacity: 0 }} />
              <circle ref={(el) => void (dots.current[i] = el)} r="3.5" fill="#1f52d8" stroke="white" strokeWidth="2" style={{ opacity: 0 }} />
            </g>
          ))}
        </svg>
        {VALUES.map((v, i) => (
          <div
            key={v.name}
            ref={(el) => void (pills.current[i] = el)}
            className="absolute top-0 left-0 flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 py-1.5 pr-3.5 pl-1.5 text-[11px] font-semibold whitespace-nowrap text-ink shadow-[0_8px_24px_-12px_rgb(12_26_63/0.45)] backdrop-blur sm:py-2 sm:pr-4 sm:pl-2 sm:text-[13px]"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[9px] font-bold text-white tabular-nums sm:size-6 sm:text-[10px]">0{i + 1}</span>
            {v.name}
          </div>
        ))}
      </div>

      {/* Minimal top bar */}
      <header
        ref={headerRef}
        data-tone="light"
        className="group/h fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 text-white transition-colors duration-300 data-[tone=dark]:text-ink sm:px-8 sm:py-6"
      >
        <Link href="/v2" className="text-[11px] font-bold tracking-[0.28em] sm:text-xs">
          ACT FOR COMMUNITY
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-6">
          <div className="hidden items-center gap-6 text-[11px] font-semibold tracking-[0.18em] uppercase md:flex">
            <Link href="/about" className="hover:opacity-60">About</Link>
            <Link href="/events" className="hover:opacity-60">Events</Link>
            <Link href="/team" className="hover:opacity-60">Team</Link>
            <Link href="/volunteer" className="hover:opacity-60">Volunteer</Link>
          </div>
          <Link href="/help" className="flex h-9 items-center gap-1.5 rounded-full bg-sun px-4 text-xs font-bold text-ink transition-transform hover:-translate-y-0.5">
            <Heart className="size-3.5" aria-hidden /> Ask for help
          </Link>
        </nav>
      </header>

      <main id="main">
        {/* 01 — Hero */}
        <section ref={(el) => { heroRef.current = el; setSection(0)(el); }} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#1a3a8a_0%,#0c1a3f_45%,#070d1f_80%)]">
          <motion.p
            style={{ y: wordY }}
            className="pointer-events-none absolute inset-x-0 top-[13vh] z-0 text-center font-poster text-[46vw] leading-[0.8] tracking-[-0.02em] text-transparent select-none sm:top-[8vh] sm:text-[34vw]"
            aria-hidden
          >
            <span className="bg-gradient-to-b from-[#3b5fc4] via-[#1d3478] to-[#0c1a3f] bg-clip-text">ACT</span>
          </motion.p>

          {/* Ala-Too ridges in front of the word */}
          <motion.svg style={{ y: ridgeBackY }} className="absolute inset-x-0 bottom-0 z-0 h-[52vh] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="ridge-back" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1b2d63" />
                <stop offset="1" stopColor="#0a1330" />
              </linearGradient>
            </defs>
            <path d="M0 400 L0 190 L120 128 L200 156 L320 64 L420 116 L560 34 L660 96 L780 54 L900 124 L1040 74 L1160 144 L1300 94 L1440 156 L1440 400 Z" fill="url(#ridge-back)" />
          </motion.svg>
          <motion.svg style={{ y: ridgeFrontY }} className="absolute inset-x-0 bottom-0 z-0 h-[40vh] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="ridge-front" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0d1838" />
                <stop offset="0.5" stopColor="#060b1b" />
              </linearGradient>
            </defs>
            <path d="M0 400 L0 252 L90 212 L150 232 L230 162 L300 192 L380 122 L430 152 L520 92 L600 142 L690 112 L760 172 L840 132 L930 192 L1010 152 L1100 212 L1190 172 L1280 232 L1360 202 L1440 242 L1440 400 Z" fill="url(#ridge-front)" />
            <path d="M0 252 L90 212 L150 232 L230 162 L300 192 L380 122 L430 152 L520 92 L600 142 L690 112 L760 172 L840 132 L930 192 L1010 152 L1100 212 L1190 172 L1280 232 L1360 202 L1440 242" fill="none" stroke="#8fb3ff" strokeOpacity="0.25" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </motion.svg>

          <motion.div style={{ opacity: heroFade }} className="absolute inset-x-0 bottom-0 z-[2] px-5 pb-10 sm:px-8 sm:pb-12">
            <div className="flex items-end justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-[11px] font-bold tracking-[0.24em] text-sun uppercase">Student-led charity · Bishkek</p>
                <h1 className="mt-4 text-[2.4rem] leading-[1.02] font-semibold tracking-tight sm:text-6xl">
                  Small acts.
                  <br />
                  Real change.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
                  Students organising tournaments, concerts, fairs and drives — and turning them into support for people and causes in our city.
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Link href="/help" className="flex h-11 items-center gap-2 rounded-full bg-sun px-5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5">
                    <Heart className="size-4" aria-hidden /> Ask for help
                  </Link>
                  <Link href="/volunteer" className="flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10">
                    Become a volunteer
                  </Link>
                </div>
              </div>
              <a href="#values" className="hidden flex-col items-center gap-2 text-[10px] font-bold tracking-[0.24em] text-white/50 uppercase sm:flex">
                Scroll
                <span className="grid size-10 place-items-center rounded-full border border-white/20">
                  <ArrowDown className="size-4 animate-bounce" />
                </span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* 02 — Values: light studio, labels pinned to the ball */}
        <section id="values" ref={setSection(1)} className="relative h-[230vh] bg-[radial-gradient(ellipse_at_50%_45%,#ffffff_0%,#eef3fb_55%,#dfe8f7_100%)] text-ink">
          <div className="sticky top-0 z-[2] flex h-[100svh] flex-col justify-between px-5 pt-24 pb-10 sm:px-8 sm:pt-28">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] font-bold tracking-[0.24em] text-brand-600 uppercase">02 — Our values</p>
                <h2 className="mt-3 max-w-md text-3xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
                  Six values. <span className="accent-serif text-brand-600">One team.</span>
                </h2>
              </div>
              <p className="hidden max-w-[16rem] text-right text-sm leading-relaxed text-ink-soft md:block">
                Every point on the ball is something we act on — at every tournament, fair and drive.
              </p>
            </div>
            <div className="flex items-end justify-between text-[10px] font-bold tracking-[0.24em] text-ink/40 uppercase">
              <span>Act for Community</span>
              <Link href="/about" className="pointer-events-auto inline-flex items-center gap-1 text-ink/60 hover:text-brand-600">
                Goals & beliefs <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <ul className="sr-only">
              {VALUES.map((v) => (
                <li key={v.name}>
                  {v.name} — {v.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 03 — Podium: annual tournaments */}
        <section ref={setSection(2)} className="relative h-[200vh] bg-[radial-gradient(ellipse_at_50%_20%,#13244f_0%,#0a1330_45%,#060b1b_85%)]">
          <div className="sticky top-0 z-[2] flex h-[100svh] flex-col justify-between px-5 pt-24 pb-8 sm:px-8 sm:pt-28 sm:pb-10">
            <div className="max-w-md">
              <p className="text-[11px] font-bold tracking-[0.24em] text-sun uppercase">03 — Annual tournaments</p>
              <h2 className="mt-3 text-3xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">Played for a reason.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">Prizes for the top three teams. The proceeds go to people and causes that need support.</p>
            </div>
            <ul className="ml-auto w-full max-w-sm divide-y divide-white/10 border-y border-white/10">
              {annual.map((e) => (
                <li key={e.slug}>
                  <Link href={`/events/${e.slug}`} className="group flex items-center justify-between gap-4 py-3.5">
                    <span>
                      <span className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">{e.recurrence}</span>
                      <span className="mt-0.5 block font-semibold">{e.title}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sun" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 04 — Finale */}
        <section ref={setSection(3)} className="relative h-[170vh] bg-[#060b1b]">
          {/* Layer 1 (behind the ball): giant word */}
          <div className="sticky top-0 h-[100svh] overflow-hidden" aria-hidden>
            <p className="pointer-events-none absolute inset-x-0 top-[16vh] text-center font-poster text-[19vw] leading-[0.85] tracking-[-0.01em] whitespace-nowrap uppercase select-none sm:top-[12vh] sm:text-[15vw]">
              <span className="bg-gradient-to-b from-white/90 via-white/35 to-white/0 bg-clip-text text-transparent">Keep acting</span>
            </p>
          </div>
          {/* Layer 2 (in front of the ball): name + actions */}
          <div className="sticky top-0 z-[2] -mt-[100svh] flex h-[100svh] flex-col items-center px-5">
            <div className="mt-auto mb-[6vh] flex flex-col items-center text-center">
              <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                <span className="h-px w-8 bg-white/50" aria-hidden /> Act for Community
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/60">Need support, or ready to help? Both start with one step.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <Link href="/help" className="flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5">
                  <Heart className="size-4" aria-hidden /> Ask for help
                </Link>
                <Link href="/volunteer" className="flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-bold transition-colors hover:bg-white/10">
                  Become a volunteer
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 05 — Stories */}
        <section className="relative z-[2] bg-[#070d1f] px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-bold tracking-[0.24em] text-sun uppercase">05 — Stories</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Every event, one cause.</h2>
              </div>
              <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white">
                All events <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <ul className="mt-12 border-t border-white/10">
              {stories.map((e) => (
                <li key={e.slug} className="border-b border-white/10">
                  <Link href={`/events/${e.slug}`} className="group grid gap-1 py-5 transition-colors hover:bg-white/[0.03] sm:grid-cols-[10rem_1fr_1.3fr_2rem] sm:items-center sm:gap-6 sm:px-3">
                    <span className="text-xs font-semibold tracking-wide text-white/40">{e.date}</span>
                    <span className="text-lg font-semibold transition-colors group-hover:text-sun">{e.title}</span>
                    <span className="text-sm leading-snug text-white/55">{e.impact}</span>
                    <ArrowUpRight className="hidden size-5 text-white/30 transition-all group-hover:rotate-45 group-hover:text-sun sm:block" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="relative z-[2] border-t border-white/10 bg-[#070d1f] px-5 py-10 text-sm text-white/50 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Act for Community · Bishkek, Kyrgyzstan</p>
          <div className="flex gap-6">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram
              </a>
            )}
            <Link href="/" className="hover:text-white">
              ← Version 1
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
