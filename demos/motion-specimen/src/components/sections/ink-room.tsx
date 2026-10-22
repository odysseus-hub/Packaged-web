"use client";

import { motion, type MotionValue, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ScrambleText, ScrollWords } from "@/components/fx/text";
import { Depth, TiltCard } from "@/components/fx/tilt";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { Container, PlateLabel } from "./plate";
import { PinnedRow, VelocityBand } from "./plate-scroll";

/** Entry: the page floods with ink through a growing circular clip, scrubbed by scroll. */
function Flood({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const r = useTransform(scrollYProgress, [0, 1], reduce ? [100, 100] : [0, 100]);
  const clip = useMotionTemplate`circle(${r}% at 50% 100%)`;
  const titleY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, 0]);
  return (
    <div ref={ref} className="relative h-[90svh]">
      <motion.div aria-hidden className="absolute inset-0 bg-background" style={{ clipPath: clip }} />
      <div className="relative flex h-full items-end">
        <Container className="pb-16">
          <PlateLabel n="07" name="The ink room" rule="Section-to-section continuity: the page doesn't cut to dark, it floods." />
          <motion.h2
            style={{ y: titleY }}
            className="mt-10 font-display text-[clamp(4rem,15vw,15rem)] font-extrabold leading-[0.82] tracking-[-0.045em] text-brand"
          >
            Ink room.
          </motion.h2>
        </Container>
      </div>
    </div>
  );
}

const TILES = [
  { k: "Springs", glyph: "∿", d: "Anything the pointer touches: stiffness 400, damping 28. Interruptible mid-flight." },
  { k: "Shaders", glyph: "◍", d: "The hero field is a fragment shader on Motion's frame loop: one clock for the page." },
  { k: "Layout", glyph: "⧉", d: "layoutId keeps identity across states. The swatch becomes the panel." },
];

const LAWS = [
  { n: "01", t: "One concept, pushed far.", d: "A sentence a designer could say out loud. Every section answers to it.", bg: "var(--brand)", fg: "var(--brand-foreground)" },
  { n: "02", t: "Timing is a token.", d: "Expo-out, 24px travel, 80ms stagger. Tuned once, used everywhere.", bg: "#ffe800", fg: "#1b1e29" },
  { n: "03", t: "Springs for touch.", d: "Tweens are for arrivals. Anything a hand moves gets physics.", bg: "#0078bf", fg: "#fff" },
  { n: "04", t: "Reduce, never remove.", d: "Reduced motion keeps every word and drops the travel.", bg: "var(--paper)", fg: "var(--ink)" },
];

function Law({ i, law, progress, reduce }: { i: number; law: (typeof LAWS)[number]; progress: MotionValue<number>; reduce: boolean }) {
  const scale = useTransform(progress, [i / LAWS.length, 1], reduce ? [1, 1] : [1, 1 - (LAWS.length - i) * 0.045]);
  const rotate = useTransform(progress, [i / LAWS.length, 1], reduce ? [0, 0] : [0, (i % 2 ? 1 : -1) * 1.5]);
  return (
    <div className="sticky flex h-[78svh] items-start" style={{ top: `calc(12svh + ${i * 26}px)` }}>
      <motion.article
        style={{ scale, rotate, backgroundColor: law.bg, color: law.fg, transformOrigin: "50% 0%" }}
        className="flex h-[62svh] w-full flex-col justify-between rounded-[40px] p-8 shadow-[0_-20px_60px_-30px_rgb(0_0_0/0.6)] sm:p-12"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] opacity-70">Law {law.n}</p>
        <div>
          <h3 className="max-w-[14ch] font-display text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">{law.t}</h3>
          <p className="mt-6 max-w-[46ch] text-lg opacity-80">{law.d}</p>
        </div>
      </motion.article>
    </div>
  );
}

function Laws({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref}>
      {LAWS.map((law, i) => (
        <Law key={law.n} i={i} law={law} progress={scrollYProgress} reduce={reduce} />
      ))}
    </div>
  );
}

export function InkRoom() {
  const reduce = usePrefersReducedMotion();
  return (
    <section id="ink" className="ink-room relative">
      <Flood reduce={reduce} />
      <div className="relative overflow-clip rounded-b-[48px] bg-background">
        {/* Read */}
        <Container className="pt-[clamp(4rem,8vw,7rem)]">
          <PlateLabel n="07a" name="Scroll-lit words" rule="Reading pace, set by the reader. Each word inks in as it reaches the eye line." />
          <ScrollWords
            className="mt-12 max-w-[22ch] font-display text-[clamp(2.25rem,5.6vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]"
            accent={["few", "still", "expensive"]}
            text="Most websites animate everything a little. This one animates a few things a lot, and leaves the rest still. Restraint is what makes motion read as expensive."
          />
        </Container>

        {/* 3D */}
        <Container className="section-pad">
          <PlateLabel n="07b" name="Depth" rule="3D tilt on springs, layers at different depths, a glare that follows the light." />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TILES.map((t, i) => (
              <TiltCard key={t.k} className="aspect-[4/5] border border-border bg-card">
                <div className="flex h-full flex-col justify-between p-8 [transform-style:preserve-3d]">
                  <Depth z={20}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      <ScrambleText text={`Tile 0${i + 1}`} />
                    </p>
                  </Depth>
                  <Depth z={80} className="text-center font-display text-[clamp(6rem,12vw,10rem)] leading-none text-brand">
                    {t.glyph}
                  </Depth>
                  <Depth z={40}>
                    <h3 className="font-display text-4xl font-extrabold tracking-[-0.03em]">{t.k}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.d}</p>
                  </Depth>
                </div>
              </TiltCard>
            ))}
          </div>
        </Container>

        {/* Stack */}
        <Container>
          <PlateLabel n="07c" name="Stacking" rule="Sticky cards that recede as the next one lands. Pure scroll, no timers." />
        </Container>
        <Container className="mt-6">
          <Laws reduce={reduce} />
        </Container>

        {/* Pin + velocity (flowy layer) */}
        <Container className="pt-[clamp(4rem,8vw,7rem)]">
          <PlateLabel n="07d" name="Pin & velocity" rule="Scroll-linked motion is flowy's, on the same Motion clock: Lenis, a pinned horizontal scrub, a velocity skew." />
          <h2 className="mt-10 max-w-[18ch] font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
            Scroll drives the <span className="misreg">scene</span>, not the other way round.
          </h2>
        </Container>
        <div className="mt-12">
          <PinnedRow reduce={reduce} />
        </div>
        <div className="pb-[clamp(4rem,8vw,7rem)] pt-[clamp(3rem,6vw,5rem)]">
          <VelocityBand reduce={reduce} />
        </div>
      </div>
    </section>
  );
}
