"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import { Container, PlateLabel } from "./plate";

const SCENES = [
  { k: "Inertia", d: "Lenis on Motion's frame loop: one clock, so useScroll reads this frame's position." },
  { k: "Pin", d: "This row. A tall section, a sticky frame, and x scrubbed from scroll progress." },
  { k: "Parallax", d: "The hero type drifts up and fades as you leave it. Two depths, never on body text." },
  { k: "Velocity", d: "The band below skews with scroll speed: on a wrapper, so it never fights the CSS marquee." },
  { k: "Release", d: "Pinned sections always let go. Reduced motion gets a plain grid instead." },
];

const WORDS = ["Arrive", "Settle", "Respond", "Breathe", "Release", "Print"];

function PinnedRow({ reduce }: { reduce: boolean }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const travel = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * travel.get());

  // Travel is measured from rendered geometry, never guessed. 0 on mobile (stacked column).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => travel.set(Math.max(0, el.scrollWidth - window.innerWidth + 48));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [travel]);

  const pinned = !reduce;
  return (
    <div ref={section} className={cn("relative", pinned && "md:h-[260vh]")}>
      <div className={cn(pinned && "md:sticky md:top-0 md:flex md:h-svh md:items-center md:overflow-hidden")}>
        <motion.div
          ref={track}
          style={{ x: pinned ? x : 0 }}
          className={cn(
            "flex flex-col gap-4 px-5 sm:px-8 lg:px-12",
            pinned ? "md:w-max md:flex-row" : "md:grid md:grid-cols-3"
          )}
        >
          {SCENES.map((s, i) => (
            <article
              key={s.k}
              className={cn(
                "min-w-0 rounded-3xl border border-border bg-card p-8",
                pinned && "md:w-[min(34rem,42vw)]",
                i === 1 && "bg-brand text-brand-foreground"
              )}
            >
              <p className={cn("font-mono text-[11px] uppercase tracking-[0.16em]", i === 1 ? "text-brand-foreground/80" : "text-muted-foreground")}>
                Scene {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-10 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em]">{s.k}</p>
              <p className={cn("mt-5 max-w-[34ch] leading-relaxed", i === 1 ? "text-brand-foreground/90" : "text-muted-foreground")}>{s.d}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function VelocityBand({ reduce }: { reduce: boolean }) {
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const skew = useSpring(useTransform(v, [-2500, 0, 2500], reduce ? [0, 0, 0] : [7, 0, -7]), {
    stiffness: 300,
    damping: 40,
  });
  const row = WORDS.map((w) => (
    <span key={w} className="flex items-center gap-8 pr-8">
      {w}
      <span aria-hidden className="text-brand">✺</span>
    </span>
  ));
  return (
    <div className="overflow-hidden border-y border-foreground bg-foreground py-6 text-background">
      {/* Skew on the wrapper; the CSS keyframe owns the inner element's transform. */}
      <motion.div style={{ skewX: skew }}>
        <div className="marquee-track flex w-max font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold uppercase leading-none tracking-[-0.03em]">
          {row}
          <span aria-hidden className="flex">{row}</span>
        </div>
      </motion.div>
    </div>
  );
}

export function PlateScroll() {
  const reduce = usePrefersReducedMotion();
  return (
    <section id="scroll" className="pt-[clamp(6rem,12vw,11rem)]">
      <Container>
        <PlateLabel n="08" name="Scroll, by flowy" rule="Time-based motion is this skill's. Scroll-linked motion is handed to flowy, on the same clock." />
        <h2 className="mt-14 max-w-[18ch] font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
          Scroll drives the <span className="misreg">scene</span>, not the other way round.
        </h2>
      </Container>
      <div className="mt-14">
        <PinnedRow reduce={reduce} />
      </div>
      <div className="mt-[clamp(4rem,8vw,7rem)]">
        <VelocityBand reduce={reduce} />
      </div>
    </section>
  );
}
