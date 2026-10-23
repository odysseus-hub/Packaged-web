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
