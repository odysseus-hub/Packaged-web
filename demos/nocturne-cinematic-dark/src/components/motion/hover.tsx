"use client";

// Spring-driven hover primitives. Springs (not tweens) for anything the pointer touches:
// they can be interrupted mid-flight and still feel physical.
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { type ComponentProps, type PointerEvent, useRef } from "react";
import { spring } from "./tokens";

/** Card/button that lifts on hover and presses on tap. */
export function HoverLift({
  lift = -6,
  scale = 1.015,
  children,
  ...props
}: ComponentProps<typeof motion.div> & { lift?: number; scale?: number }) {
  return (
    <motion.div
      whileHover={{ y: lift, scale }}
      whileTap={{ scale: 0.98 }}
      transition={spring.hover}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic wrapper: the child drifts toward the cursor and springs home on leave.
 * Fine pointers only, and inert under reduced motion — it's decoration, never function.
 */
export function Magnetic({
  strength = 0.35,
  children,
  className,
}: {
  strength?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), spring.follow);
  const y = useSpring(useMotionValue(0), spring.follow);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
