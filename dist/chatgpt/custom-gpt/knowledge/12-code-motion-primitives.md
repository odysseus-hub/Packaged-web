# Motion primitives & templates

Tested source. Copy into `src/components/motion/` (scaffold.sh does this) and the layout and art-direction templates.


## `assets/motion/count-up.tsx`

```tsx
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
```


## `assets/motion/hover.tsx`

```tsx
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
```


## `assets/motion/motion-provider.tsx`

```tsx
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
```


## `assets/motion/reveal.tsx`

```tsx
"use client";

// Time-based entrance primitives: in-view reveals, staggered groups, masked line reveals.
// These fire ONCE when an element enters the viewport. Scroll-*linked* motion (parallax,
// scrubbing, pinning, smooth scroll) is not here on purpose — that is the scroll layer's job (references/scroll-layer.md).
import { motion, stagger as staggerFn, useInView, type Variants } from "motion/react";
import { type ComponentProps, type ElementType, type ReactNode, useRef } from "react";
import { duration, easeOutExpo, stagger, travel } from "./tokens";

const VIEWPORT = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;

type RevealProps = ComponentProps<typeof motion.div> & {
  /** Travel distance on the y axis. */
  y?: number;
  delay?: number;
};

/** Fade + rise into place once, when scrolled into view. */
export function Reveal({ y = travel.md, delay = 0, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: duration.base, ease: easeOutExpo, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const group = (gap: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { delayChildren: staggerFn(gap, { startDelay: delay }) } },
});

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: travel.md },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeOutExpo } },
};

type StaggerProps = ComponentProps<typeof motion.div> & {
  gap?: number;
  delay?: number;
  /** Animate on mount instead of on scroll-into-view (use for above-the-fold heroes). */
  onMount?: boolean;
};

/** Parent that cascades its <StaggerItem> children. */
export function Stagger({ gap = stagger.base, delay = 0, onMount, children, ...props }: StaggerProps) {
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT };
  return (
    <motion.div variants={group(gap, delay)} initial="hidden" {...trigger} {...props}>
      {children}
    </motion.div>
  );
}

/** Renders a div. Inside <ul>/<ol>, use `<motion.li variants={itemVariants}>` instead. */
export function StaggerItem({ children, ...props }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}

const lineVariants: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: duration.hero, ease: easeOutExpo } },
};

/**
 * Masked headline: each line slides up from behind its own clip. The display-type signature
 * move. Pass lines explicitly so breaks are art-directed, not left to the browser.
 */
export function MaskedLines({
  lines,
  as: Tag = "h1",
  className,
  gap = stagger.loose,
  delay = 0.1,
  onMount = true,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  gap?: number;
  delay?: number;
  onMount?: boolean;
}) {
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT };
  return (
    <Tag className={className}>
      <motion.span className="block" variants={group(gap, delay)} initial="hidden" {...trigger}>
        {lines.map((line, i) => (
          // pb/-mb keeps descenders from being clipped by overflow-hidden.
          <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span className="block will-change-transform" variants={lineVariants}>
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Mount children only once they scroll into view. Bklit charts (and any component whose
 * entrance runs on mount) otherwise finish animating off-screen at page load. The box keeps
 * its aspect ratio while empty so nothing jumps.
 */
export function InViewMount({
  children,
  aspect = "2 / 1",
  className,
}: {
  children: ReactNode;
  aspect?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  return (
    <div ref={ref} className={className} style={inView ? undefined : { aspectRatio: aspect }}>
      {inView ? children : null}
    </div>
  );
}
```


## `assets/motion/smooth-scroll.tsx`

```tsx
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
```


## `assets/motion/tokens.ts`

```ts
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
  hero: 1.1, // headline / hero choreography
} as const;

export const stagger = {
  tight: 0.04, // letters, small icons
  base: 0.08, // list items, cards
  loose: 0.14, // big blocks, hero lines
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
```


## `assets/motion/use-prefers-reduced-motion.ts`

```ts
"use client";

// Hydration-safe reduced-motion read. The server snapshot (false) is also used for the
// hydration render, so server and client HTML always match; React then re-renders with the
// real preference. Use this — not motion's useReducedMotion — whenever the value changes
// RENDERED OUTPUT (text, markup, which element exists). motion's hook returns the real value
// on the first client render, which mismatches the server HTML (React error #418).
// Using motion's hook only to pick animation targets/values passed to motion props is fine.
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
```


## `assets/templates/art-direction.md`

```markdown
# Art direction — <site name>

**Concept (one sentence, a world not a feeling):**
> …

**Audience & single job of the page:** (who lands here, and the one action we want)

**Display type:** <family> (<weights/axes>) — set at clamp(…) / leading … / tracking …
**Text type:** <family> — body 18px / measure 65ch
**Mono (optional):** …

**Accent:** `--brand: oklch(…)` · on-accent `--brand-foreground: oklch(…)`
**Neutrals:** background `oklch(…)` · surface `oklch(…)` · hairline `oklch(… / 10%)` · tinted toward hue …
**Theme:** dark | light

**Hero imagery:** generative (<kokonut component>) | product UI | photography | type-as-image
Layers: background … / midground … / foreground …

**Spacing:** section padding clamp(6rem,12vw,11rem) · container 1320px · grid 12-col

**Signature moment (one):** …
**Motion personality:** (e.g. "slow, weighty, cinematic — expo-out, long holds" or "snappy, springy, tactile")

## Section map
| # | Section | Job | Component(s) | Layout | Motion idea (one) |
|---|---|---|---|---|---|
| 1 | Hero | | | | |
| 2 | | | | | |

## Copy voice
3 adjectives + 2 banned words:
```


## `assets/templates/layout.tsx`

```tsx
import type { Metadata } from "next";
// Swap these three for the art direction's pairing (references/art-direction.md §2).
// Keep the variable names: globals.css maps --font-display / --font-sans / --font-mono.
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "TODO: Site name — one-line promise",
  description: "TODO: one sentence that sells it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="bg-background font-sans text-foreground">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
```
