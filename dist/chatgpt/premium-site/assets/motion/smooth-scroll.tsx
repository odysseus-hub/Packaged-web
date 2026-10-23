"use client";

// Inertial smooth scroll for the scroll layer — Lenis driven by Motion's own frame loop, so
// there is exactly ONE animation clock on the page and useScroll() reads this frame's position.
// Skipped entirely under reduced motion and on touch devices (native momentum is better there).
// Requires: npm i lenis   and   import "lenis/dist/lenis.css" in app/layout.tsx.
// Remove any CSS `scroll-behavior: smooth` (html/body) — it fights Lenis' own easing.
import Lenis from "lenis";
import { cancelFrame, frame } from "motion/react";
import { useEffect } from "react";

/** navOffset: height (px) of a fixed/sticky header, so anchor links land below it. */
export function SmoothScroll({ navOffset = 0 }: { navOffset?: number }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: { offset: -navOffset } });
    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.setup(update, true);
    return () => {
      cancelFrame(update);
      lenis.destroy();
    };
  }, [navOffset]);
  return null;
}
