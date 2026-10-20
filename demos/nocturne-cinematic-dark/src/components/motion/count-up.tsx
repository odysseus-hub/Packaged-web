"use client";

// Stat counter that rolls up once when scrolled into view. Under reduced motion it renders
// the final value immediately — a number is content, so it must never depend on animation.
import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { easeOutExpo } from "./tokens";

// Hydration-safe reduced-motion read: the server snapshot (false) is also used for the
// hydration render, so server and client HTML match; React then re-renders with the real
// preference. (motion's useReducedMotion returns the real value on the first client render,
// which made "reduce ? to : value" differ from the server HTML → React error #418.)
const QUERY = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}

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
