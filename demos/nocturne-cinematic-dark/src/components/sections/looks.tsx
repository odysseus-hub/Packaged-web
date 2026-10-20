"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useId, useRef, useState } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { duration, easeInOutQuart, easeOutExpo, spring } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./section-heading";

type Look = {
  id: string;
  name: string;
  note: string;
  wheels: string;
  /** CSS filter applied to the still: the "grade". */
  filter: string;
  /** Optional colour wash composited over the still. */
  wash?: { color: string; blend: "soft-light" | "color" | "overlay" | "multiply" | "screen"; opacity: number };
  swatch: [string, string, string];
};

const LOOKS: Look[] = [
  {
    id: "log",
    name: "Camera original",
    note: "Flat LOG straight off the card. Every look starts here.",
    wheels: "S-Log3 · S-Gamut3.Cine · ungraded",
    filter: "saturate(0.4) contrast(0.7) brightness(1.18)",
    swatch: ["oklch(0.55 0.02 250)", "oklch(0.62 0.03 60)", "oklch(0.7 0.02 80)"],
  },
  {
    id: "sodium",
    name: "Sodium Night",
    note: "Tungsten practicals, cold shadows, skin kept warm.",
    wheels: "Lift −0.03 · Gamma +0.02 · Gain 1.06 · Sat 118",
    filter: "saturate(1.35) contrast(1.18) brightness(0.96)",
    wash: { color: "oklch(0.72 0.16 65)", blend: "soft-light", opacity: 0.55 },
    swatch: ["oklch(0.3 0.06 240)", "oklch(0.62 0.15 60)", "oklch(0.82 0.13 80)"],
  },
  {
    id: "bleach",
    name: "Bleach Bypass",
    note: "Silver retained. Hard contrast, drained colour, war-film grit.",
    wheels: "Lift −0.05 · Gamma −0.04 · Gain 1.12 · Sat 42",
    filter: "saturate(0.38) contrast(1.5) brightness(0.92)",
    swatch: ["oklch(0.2 0.01 250)", "oklch(0.55 0.02 80)", "oklch(0.88 0.01 80)"],
  },
  {
    id: "teal",
    name: "Blue Hour",
    note: "Teal midtones against amber light — the festival-poster look.",
    wheels: "Lift −0.02 · Gamma −0.01 · Gain 1.04 · Sat 110",
    filter: "saturate(1.2) contrast(1.12) hue-rotate(-12deg)",
    wash: { color: "oklch(0.55 0.1 210)", blend: "soft-light", opacity: 0.6 },
    swatch: ["oklch(0.3 0.07 220)", "oklch(0.55 0.08 200)", "oklch(0.78 0.12 70)"],
  },
  {
    id: "k74",
    name: "Kodachrome ’74",
    note: "Dense reds, creamy highlights, a little faded at the toe.",
    wheels: "Lift +0.03 · Gamma +0.03 · Gain 0.98 · Sat 126",
    filter: "saturate(1.45) contrast(1.08) sepia(0.18) brightness(1.02)",
    wash: { color: "oklch(0.7 0.12 40)", blend: "overlay", opacity: 0.25 },
    swatch: ["oklch(0.35 0.08 30)", "oklch(0.6 0.14 40)", "oklch(0.86 0.06 85)"],
  },
  {
    id: "moon",
    name: "Day for Night",
    note: "Shot at dusk, finished as moonlight. Silver-blue and quiet.",
    wheels: "Lift −0.06 · Gamma −0.08 · Gain 0.82 · Sat 55",
    filter: "saturate(0.55) contrast(1.15) brightness(0.72)",
    wash: { color: "oklch(0.5 0.12 255)", blend: "color", opacity: 0.45 },
    swatch: ["oklch(0.18 0.03 260)", "oklch(0.42 0.06 255)", "oklch(0.78 0.03 240)"],
  },
];

/** A composed night street, drawn in SVG so every grade is applied to the same "negative". */
function Still() {
  const uid = useId().replace(/:/g, "");
  const sky = `sky-${uid}`;
  const glow = `glow-${uid}`;
  const haze = `haze-${uid}`;
  return (
    <svg viewBox="0 0 1200 502" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "oklch(0.26 0.06 255)" }} />
          <stop offset="0.55" style={{ stopColor: "oklch(0.45 0.07 300)" }} />
          <stop offset="0.82" style={{ stopColor: "oklch(0.68 0.12 50)" }} />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "oklch(0.92 0.12 80)", stopOpacity: 0.95 }} />
          <stop offset="0.35" style={{ stopColor: "oklch(0.78 0.15 65)", stopOpacity: 0.45 }} />
          <stop offset="1" style={{ stopColor: "oklch(0.7 0.15 60)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={haze} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "oklch(0.2 0.02 260)", stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: "oklch(0.12 0.02 260)", stopOpacity: 0.85 }} />
        </linearGradient>
      </defs>
      <rect width="1200" height="502" fill={`url(#${sky})`} />
      <circle cx="935" cy="96" r="30" style={{ fill: "oklch(0.95 0.03 90)" }} opacity="0.9" />
      {/* far hills */}
      <path d="M0 330 C 160 270 300 300 430 280 S 720 240 860 275 S 1080 250 1200 270 V 502 H 0Z" style={{ fill: "oklch(0.32 0.05 270)" }} />
      {/* skyline */}
      <path
        d="M0 352 H70 V300 H120 V332 H170 V270 H215 V318 H260 V352 H760 V292 H800 V262 H842 V310 H890 V282 H940 V330 H1010 V300 H1060 V352 H1200 V502 H0Z"
        style={{ fill: "oklch(0.2 0.03 265)" }}
      />
      {/* lit windows */}
      {[
        [180, 285], [192, 300], [784, 300], [812, 276], [826, 292], [904, 296], [1030, 316],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="6" height="8" style={{ fill: "oklch(0.85 0.13 80)" }} opacity="0.85" />
      ))}
      {/* road */}
      <path d="M0 400 H1200 V502 H0Z" style={{ fill: "oklch(0.16 0.015 260)" }} />
      <path d="M0 400 H1200" style={{ stroke: "oklch(0.5 0.08 60)" }} strokeWidth="1.5" opacity="0.5" />
      {/* streetlight + pool of light */}
      <ellipse cx="318" cy="430" rx="230" ry="40" style={{ fill: "oklch(0.75 0.14 65)" }} opacity="0.28" />
      <rect x="312" y="170" width="6" height="235" style={{ fill: "oklch(0.12 0.01 260)" }} />
      <path d="M315 172 Q 330 150 360 160" style={{ stroke: "oklch(0.12 0.01 260)" }} strokeWidth="5" fill="none" />
      <circle cx="362" cy="168" r="120" fill={`url(#${glow})`} />
      {/* figure in a long coat */}
      <path
        d="M640 300 c-10 0 -16 8 -16 18 c0 9 5 15 10 17 l-16 10 c-6 4 -9 10 -10 18 l-8 60 h12 l8 -40 l4 0 l-2 40 h40 l-2 -40 l4 0 l8 40 h12 l-8 -60 c-1 -8 -4 -14 -10 -18 l-16 -10 c5 -2 10 -8 10 -17 c0 -10 -6 -18 -16 -18z"
        style={{ fill: "oklch(0.1 0.01 260)" }}
      />
      {/* tail-lights */}
      <rect x="960" y="390" width="160" height="26" rx="8" style={{ fill: "oklch(0.13 0.01 260)" }} />
      <rect x="966" y="396" width="12" height="6" rx="2" style={{ fill: "oklch(0.62 0.22 28)" }} />
      <rect x="1102" y="396" width="12" height="6" rx="2" style={{ fill: "oklch(0.62 0.22 28)" }} />
      <rect width="1200" height="502" fill={`url(#${haze})`} />
    </svg>
  );
}

export function Looks() {
  const [active, setActive] = useState(LOOKS[1].id);
  const look = LOOKS.find((l) => l.id === active) ?? LOOKS[0];
  const index = LOOKS.indexOf(look);

  // flowy layer: the frame "racks in" — scale 0.92→1 scrubbed to scroll, lightly smoothed.
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "center center"] });
  const frameScale = useSpring(useTransform(scrollYProgress, [0, 1], [0.92, 1]), { stiffness: 120, damping: 30 });

  return (
    <section id="looks" className="section-pad relative overflow-hidden border-t border-hairline bg-surface/40">
      <div className="container-x">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow reel="03">The looks</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.95] tracking-[-0.03em] text-balance">
              One negative. <em className="text-brand">Six</em> films.
            </h2>
          </div>
          <p className="max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground lg:col-span-5">
            Same shot, same camera original. Pick a grade and watch Nocturne
            re-light the scene — each look ships as an editable node tree, not
            a baked filter.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* The frame */}
          <Reveal y={48} className="lg:col-span-8" data-flowy="product">
            <motion.figure ref={frameRef} style={reduce ? undefined : { scale: frameScale }}>
              <div className="relative aspect-[2.39/1] overflow-hidden rounded-sm bg-black ring-1 ring-hairline">
                {LOOKS.map((l) => (
                  <motion.div
                    key={l.id}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: l.id === active ? 1 : 0 }}
                    transition={{ duration: duration.base, ease: easeInOutQuart }}
                    style={{ filter: l.filter }}
                  >
                    <Still />
                    {l.wash ? (
                      <div
                        className="absolute inset-0"
                        style={{ background: l.wash.color, mixBlendMode: l.wash.blend, opacity: l.wash.opacity }}
                      />
                    ) : null}
                  </motion.div>
                ))}
                {/* frame furniture */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-3 sm:inset-5">
                  {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
                    <span key={c} className={cn("absolute size-4 border-white/50 sm:size-6", c)} />
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 font-mono text-[0.6rem] tracking-[0.18em] text-white/75 uppercase sm:p-7 sm:text-[0.68rem]">
                  <span>A001_C007 · 23.976</span>
                  <span className="tabular-nums">Look {String(index + 1).padStart(2, "0")}/06</span>
                </div>
              </div>
              <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={look.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: duration.micro * 1.5, ease: easeOutExpo }}
                  >
                    {look.wheels}
                  </motion.span>
                </AnimatePresence>
                <span>Still: illustrative scene</span>
              </figcaption>
            </motion.figure>
          </Reveal>

          {/* The index of looks */}
          <Stagger gap={0.06} className="lg:col-span-4">
            <div role="group" aria-label="Choose a look" className="border-t border-hairline">
              {LOOKS.map((l, i) => {
                const on = l.id === active;
                return (
                  <StaggerItem key={l.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(l.id)}
                      className={cn(
                        "group relative flex w-full items-center gap-4 border-b border-hairline py-4 pl-5 text-left outline-none transition-colors focus-visible:bg-foreground/5",
                        on ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {on ? (
                        <motion.span
                          layoutId="look-marker"
                          transition={spring.layout}
                          aria-hidden="true"
                          className="absolute top-3 bottom-3 left-0 w-0.5 rounded-full bg-brand"
                        />
                      ) : null}
                      <span className="font-mono text-[0.68rem] tracking-[0.16em] text-muted-foreground tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="block font-display text-[1.65rem] leading-tight">{l.name}</span>
                        <span className="mt-1 block text-sm leading-snug text-muted-foreground">{l.note}</span>
                      </span>
                      <span aria-hidden="true" className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-hairline">
                        {l.swatch.map((c) => (
                          <span key={c} className="h-5 w-2.5" style={{ background: c }} />
                        ))}
                      </span>
                    </button>
                  </StaggerItem>
                );
              })}
            </div>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
