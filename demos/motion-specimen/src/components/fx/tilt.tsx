"use client";

// 3D tilt card with a moving specular glare. The card turns toward the pointer on springs,
// its inner layers sit at different translateZ depths, and a radial highlight tracks the
// pointer. Fine pointers only; flat and static under reduced motion.
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TiltCard({ children, className, max = 14 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 220, damping: 20, mass: 0.5 });
  const rotateY = useTransform(sx, [0, 1], reduce ? [0, 0] : [-max, max]);
  const rotateX = useTransform(sy, [0, 1], reduce ? [0, 0] : [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.32), transparent 55%)`;
  const glareOpacity = useMotionValue(0);
  const gOp = useSpring(glareOpacity, { stiffness: 200, damping: 30 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    glareOpacity.set(1);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  }

  return (
    <div className="[perspective:1000px]" onPointerMove={onMove} onPointerLeave={onLeave} data-cursor="Tilt">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("relative overflow-hidden rounded-[28px]", className)}
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare, opacity: gOp }} />
      </motion.div>
    </div>
  );
}

/** A layer inside TiltCard lifted toward the viewer. */
export function Depth({ z, children, className }: { z: number; children: ReactNode; className?: string }) {
  return (
    <div className={className} style={{ transform: `translateZ(${z}px)` }}>
      {children}
    </div>
  );
}
