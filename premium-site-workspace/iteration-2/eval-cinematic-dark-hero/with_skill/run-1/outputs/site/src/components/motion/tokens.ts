// Motion tokens: the single source of timing truth for the whole site.
// Every animation pulls from here so the page reads as one hand, not twenty.
import type { Transition } from "motion/react";

/** Expo-out: fast start, long settle. The default for entrances. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
/** Quart in-out: for things that move between two resting states (tabs, toggles). */
export const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

export const duration = {
  micro: 0.18, // hovers, presses, focus rings
  base: 0.6, // single-element reveals
  hero: 1.3, // headline / hero choreography — cinematic: slow, weighty
} as const;

export const stagger = {
  tight: 0.04, // letters, small icons
  base: 0.08, // list items, cards
  loose: 0.16, // big blocks, hero lines
} as const;

/** Distance (px) things travel on reveal. Small travel reads expensive; big travel reads cheap. */
export const travel = { sm: 12, md: 24, lg: 48 } as const;

export const spring = {
  /** Hover lift / press — snappy, barely-there overshoot. */
  hover: { type: "spring", stiffness: 400, damping: 28, mass: 0.6 },
  /** Magnetic follow / cursor-linked — soft and floaty. */
  follow: { type: "spring", stiffness: 160, damping: 18, mass: 0.4 },
  /** Layout / shared-element moves. Duration-based so it composes with tokens. */
  layout: { type: "spring", visualDuration: 0.5, bounce: 0.15 },
} satisfies Record<string, Transition>;

export const reveal: Transition = { duration: duration.base, ease: easeOutExpo };
