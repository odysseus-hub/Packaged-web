"use client";

// Wrap the app once (in app/layout.tsx). reducedMotion="user" makes every motion component
// drop transform/layout animation when the OS asks for reduced motion, while keeping opacity
// fades — so content still arrives, it just doesn't travel.
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { reveal } from "./tokens";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={reveal}>
      {children}
    </MotionConfig>
  );
}
