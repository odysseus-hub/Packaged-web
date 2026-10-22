"use client";

// Kinetic variable type: each glyph's weight and width swell toward the pointer, on springs,
// through the font's own variable axes (here Bricolage Grotesque: wght 200–800, wdth 75–100).
// With no pointer, a slow "scanner" sweeps the line so it reads on touch screens too.
//
// Note the one rule bend: font-variation-settings changes glyph advances, i.e. layout. It's
// contained to a single line (`contain: layout paint`), never applied to body copy, and off
// under reduced motion.
import {
  animate,
  type MotionValue,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const RADIUS = 300;

function Glyph({ ch, px, py, centers, i }: { ch: string; px: MotionValue<number>; py: MotionValue<number>; centers: { current: { x: number; y: number }[] }; i: number }) {
  const t = useTransform(() => {
    const c = centers.current[i];
    if (!c) return 0;
    const d = Math.hypot(px.get() - c.x, py.get() - c.y);
    return Math.max(0, 1 - d / RADIUS);
  });
  const s = useSpring(t, { stiffness: 220, damping: 24, mass: 0.5 });
  const wght = useTransform(s, [0, 1], [320, 800]);
  const wdth = useTransform(s, [0, 1], [78, 100]);
  const settings = useMotionTemplate`"wght" ${wght}, "wdth" ${wdth}`;
  return (
    <motion.span aria-hidden className="inline-block whitespace-pre" style={{ fontVariationSettings: settings }}>
      {ch}
    </motion.span>
  );
}

export function ProximityType({ lines, className }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { amount: 0.4 });
  const [hovering, setHovering] = useState(false);
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);
  const centers = useRef<{ x: number; y: number }[]>([]);

  // Glyph centers, relative to the block. Re-measured on resize and once fonts are ready.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      centers.current = [...el.querySelectorAll<HTMLElement>("[data-g]")].map((g) => {
        const r = g.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
      });
    };
    measure();
    document.fonts.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Idle scanner: a virtual pointer weaves across both lines while nobody is hovering.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || hovering || !inView) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const c = animate(0, 1, {
      duration: 4.2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
      onUpdate: (p) => {
        px.set(-RADIUS / 3 + p * (w * 0.75 + RADIUS / 1.5));
        py.set(h * (0.25 + 0.5 * (0.5 - 0.5 * Math.cos(p * Math.PI * 3))));
      },
    });
    return () => c.stop();
  }, [reduce, hovering, inView, px, py]);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const box = e.currentTarget.getBoundingClientRect();
    px.set(e.clientX - box.left);
    py.set(e.clientY - box.top);
  }

  const label = lines.join(" ");
  let n = 0;
  return (
    <div
      ref={ref}
      aria-label={label}
      role="img"
      data-cursor="Lean"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onPointerMove={onMove}
      className={cn("touch-pan-y select-none [contain:layout_paint]", className)}
    >
      {lines.map((line, li) => (
        <div key={li} className="whitespace-nowrap">
          {[...line].map((ch) => {
            const i = n++;
            return (
              <span key={i} data-g className="inline-block">
                {reduce ? (
                  <span className="inline-block whitespace-pre" style={{ fontVariationSettings: '"wght" 700, "wdth" 92' }}>
                    {ch}
                  </span>
                ) : (
                  <Glyph ch={ch} px={px} py={py} centers={centers} i={i} />
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
