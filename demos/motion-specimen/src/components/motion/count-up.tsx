"use client";

// Stat counter that rolls up once when scrolled into view. Under reduced motion it renders
// the final value immediately — a number is content, so it must never depend on animation.
import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { easeOutExpo } from "./tokens";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  format = (n: number) => Math.round(n).toLocaleString(),
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = usePrefersReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(from, to, { duration, ease: easeOutExpo, onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(reduce ? to : value)}
    </span>
  );
}
