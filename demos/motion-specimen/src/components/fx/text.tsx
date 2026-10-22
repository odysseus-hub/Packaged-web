"use client";

import {
  motion,
  type MotionValue,
  stagger as staggerFn,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";
import { easeOutExpo } from "@/components/motion/tokens";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Per-character reveal: each glyph rises and un-tilts from behind its own clip, staggered.
 * Words stay unbroken (no mid-word wraps). Screen readers get the plain string via aria-label.
 */
export function SplitChars({
  text,
  className,
  delay = 0,
  gap = 0.028,
  onMount = true,
  charClassName,
}: {
  text: string;
  className?: string;
  delay?: number;
  gap?: number;
  onMount?: boolean;
  charClassName?: string;
}) {
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.6 } };
  return (
    <motion.span
      aria-label={text}
      className={cn("inline-block", className)}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { delayChildren: staggerFn(gap, { startDelay: delay }) } } }}
    >
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
              <motion.span
                className={cn("inline-block origin-bottom-left will-change-transform", charClassName)}
                variants={{
                  hidden: { y: "105%", rotate: 12 },
                  show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: easeOutExpo } },
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}

const GLYPHS = "▚▞▖▗▘▝◆◇○●■□▲△*/\\#%&+=";

/**
 * Decode effect: glyphs churn and resolve left to right once the text scrolls into view.
 * The server renders the final string; the scramble runs only after mount (hydration-safe),
 * and never under reduced motion.
 */
export function ScrambleText({ text, className, as: Tag = "span" }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = usePrefersReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const total = 380 + text.length * 22;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      const solved = Math.floor(p * text.length);
      setOut(
        [...text]
          .map((c, i) => (c === " " || i < solved ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("")
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text]);

  return (
    <Tag ref={ref} aria-label={text} className={className}>
      <span aria-hidden>{out}</span>
    </Tag>
  );
}

function Word({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrollWords({ text, className, accent = [] }: { text: string; className?: string; accent?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const still = useMotionValue(1);
  const progress = reduce ? still : scrollYProgress;
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <Word progress={progress} range={[i / words.length, (i + 1) / words.length]}>
            <span className={accent.includes(w.replace(/[.,]/g, "")) ? "text-brand" : undefined}>{w}</span>
          </Word>{" "}
        </span>
      ))}
    </p>
  );
}

/**
 * A misregistered word: the pink plate drifts against the ink plate with the cursor,
 * on a soft spring. Static (classic 0.045em offset) under reduced motion or touch.
 */
export function MisregWord({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 14, mass: 0.4 });
  const y = useSpring(my, { stiffness: 120, damping: 14, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(((e.clientX / window.innerWidth) - 0.5) * 22);
      my.set(((e.clientY / window.innerHeight) - 0.5) * 14);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <span className="relative inline-block">
      <motion.span
        aria-hidden
        className="absolute inset-0 text-brand mix-blend-multiply"
        style={{ x, y, translateX: "0.045em", translateY: "0.035em" }}
      >
        {children}
      </motion.span>
      <span className="relative mix-blend-multiply">{children}</span>
    </span>
  );
}
