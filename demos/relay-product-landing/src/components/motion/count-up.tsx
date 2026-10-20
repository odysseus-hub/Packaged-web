"use client";

// Stat counter that rolls up once when scrolled into view. Under reduced motion it jumps to
// the final value right after hydration — a number is content, so it must never depend on
// animation. (Rendering `reduce ? to : value` directly causes a hydration mismatch: the
// server has no media query, so useReducedMotion() is null there and true on the client.)
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { easeOutExpo } from "./tokens";

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
  const reduce = useReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    // Reduced motion: jump straight to the final value (duration 0), no need to wait for view.
    if (!inView && !reduce) return;
    const controls = animate(from, to, {
      duration: reduce ? 0 : duration,
      ease: easeOutExpo,
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(value)}
    </span>
  );
}
