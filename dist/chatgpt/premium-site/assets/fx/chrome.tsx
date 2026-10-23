"use client";

// Page chrome effects: a scroll progress rule and an "ink dot" cursor follower that labels [data-cursor] targets.
// The follower is decoration only: the native cursor stays visible, it ignores touch,
// and it doesn't render under reduced motion.
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-brand"
      style={{ scaleX }}
    />
  );
}

export function LabelCursor() {
  const reduce = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.35 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(el?.dataset.cursor ?? null);
      setEnabled(true);
    };
    const onOut = () => setEnabled(false);
    // Scrolling moves content under a still pointer: re-read what the cursor is over.
    const onScroll = () => {
      const el = document.elementFromPoint(x.get(), y.get()) as HTMLElement | null;
      setLabel(el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onOut);
    };
  }, [reduce, x, y]);

  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-multiply"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-ml-[42px] -mt-[42px] flex size-[84px] items-center justify-center rounded-full bg-brand font-mono text-[10px] uppercase tracking-[0.14em] text-white"
        // Fixed 84px dot scaled down to 14px at rest: transform only, never width/height.
        initial={{ scale: 1 / 6, opacity: 0 }}
        animate={{
          scale: label ? 1 : 1 / 6,
          opacity: enabled ? 0.9 : 0,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        <AnimatePresence>
          {label ? (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
