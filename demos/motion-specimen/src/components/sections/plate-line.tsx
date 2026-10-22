"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { Container, PlateLabel } from "./plate";

// Closed, smooth blob through N points (Catmull-Rom → cubic Bézier). Every shape shares the
// exact same command structure, which is what lets Motion interpolate `d` between them.
function blob(radii: number[], cx = 200, cy = 200) {
  const n = radii.length;
  const pts = radii.map((r, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const p = (i: number) => pts[(i + n) % n];
  let d = `M${p(0)[0].toFixed(1)},${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}
const SHAPES = [
  blob([150, 120, 165, 110, 158, 128, 170, 115]),
  blob([120, 168, 118, 160, 112, 170, 124, 150]),
  blob([165, 140, 125, 172, 140, 118, 150, 160]),
];

// A ribbon that loops across the plate like a pen signature.
const RIBBON =
  "M-20,220 C120,60 260,60 300,180 S360,360 480,300 S620,60 760,140 S880,380 1000,300 S1160,80 1260,200 S1380,330 1460,240";

export function PlateLine() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const drawn = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 140, damping: 30 });
  const pathLength = reduce ? 1 : drawn;
  const dashOffset = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const counter = useTransform(scrollYProgress, (v) => `${String(Math.round(v * 100)).padStart(3, "0")}%`);

  return (
    <section ref={ref} id="line" className="section-pad relative overflow-hidden">
      <Container>
        <PlateLabel n="06" name="Line work" rule="SVG is cheap motion: draw a path with pathLength, morph shapes that share a structure." />
        <div className="mt-14 grid grid-cols-1 items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
              Your scroll is <span className="misreg">holding</span> the pen.
            </h2>
            <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-muted-foreground text-pretty">
              The ribbon below draws itself in step with the scrollbar: <code className="font-mono text-foreground">pathLength</code>{" "}
              on a spring, so it trails your hand a little. The blob morphs between three shapes built from the same eight-point
              curve.
            </p>
            <p className="mt-8 font-mono text-[clamp(2.5rem,6vw,4.5rem)] font-bold tabular-nums tracking-[-0.04em] text-brand">
              <motion.span>{counter}</motion.span>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">drawn · scroll-linked</p>
          </div>
          <div className="relative md:col-span-6">
            <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[460px]" aria-hidden>
              <motion.path
                d={SHAPES[0]}
                fill="var(--brand)"
                animate={reduce ? undefined : { d: [SHAPES[0], SHAPES[1], SHAPES[2], SHAPES[0]] }}
                transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
              />
              <motion.path
                d={SHAPES[1]}
                fill="none"
                stroke="var(--foreground)"
                strokeWidth={3}
                strokeDasharray="2 10"
                strokeLinecap="round"
                style={{ x: 10, y: 8 }}
                animate={reduce ? undefined : { d: [SHAPES[1], SHAPES[2], SHAPES[0], SHAPES[1]] }}
                transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
              />
            </svg>
          </div>
        </div>
      </Container>
      <svg viewBox="0 0 1440 420" preserveAspectRatio="none" className="mt-10 h-[min(32vw,420px)] w-full" aria-hidden>
        <motion.path d={RIBBON} fill="none" stroke="var(--foreground)" strokeOpacity={0.12} strokeWidth={34} strokeLinecap="round" />
        <motion.path d={RIBBON} fill="none" stroke="var(--brand)" strokeWidth={34} strokeLinecap="round" style={{ pathLength }} />
        <motion.path
          d={RIBBON}
          fill="none"
          stroke="var(--background)"
          strokeWidth={3}
          strokeDasharray="14 18"
          strokeLinecap="round"
          style={{ pathLength, strokeDashoffset: reduce ? 0 : dashOffset }}
        />
      </svg>
    </section>
  );
}
