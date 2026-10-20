"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

// Wordmarks set in the page's own type, not borrowed brand art: the strip stays one voice.
const integrations = [
  "Slack",
  "PagerDuty",
  "Discord",
  "GitHub",
  "Vercel",
  "Opsgenie",
  "Linear",
  "MS Teams",
  "Twilio",
  "Webhooks",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={
        hidden
          ? "marquee-dup flex shrink-0 items-center gap-x-[clamp(2rem,4vw,3.5rem)] pr-[clamp(2rem,4vw,3.5rem)]"
          : "flex shrink-0 flex-wrap items-center gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-4 pr-[clamp(2rem,4vw,3.5rem)] marquee-row"
      }
    >
      {integrations.map((name) => (
        <li key={name}>
          <span className="block whitespace-nowrap font-display text-[clamp(2.5rem,6vw,5.5rem)] uppercase leading-none text-foreground/35 transition-colors duration-200 hover:text-foreground">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Integrations() {
  // flowy layer: a CSS marquee (compositor-only translateX) that leans into scroll speed —
  // scroll velocity → a sprung skew. Under reduced motion it is a static wrapped row.
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(
    useTransform(velocity, (v) => (reduce ? 0 : Math.max(-8, Math.min(8, v / -250)))),
    { stiffness: 200, damping: 40 }
  );

  return (
    <section
      id="integrations"
      aria-labelledby="integrations-title"
      className="border-y border-hairline py-[clamp(4rem,8vw,7rem)]"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="integrations-title" className="font-mono text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
            Pages you wherever you already are
          </h2>
          <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-brand">40+</span> integrations · open webhooks
          </p>
        </div>
      </div>
      {/* Skew lives on the wrapper; the CSS animation owns the track's transform. */}
      <motion.div style={{ skewX: skew }} className="marquee mt-10 overflow-hidden" data-flowy="marquee">
        <div className="marquee-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </motion.div>
    </section>
  );
}
