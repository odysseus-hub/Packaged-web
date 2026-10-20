"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Activity, Gauge, Siren } from "lucide-react";
import NotificationStack, { type StackNotification } from "@/components/kokonutui/notification-stack";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";
import { duration, easeOutExpo, travel } from "@/components/motion/tokens";

const icon = (node: React.ReactNode, hot = false) => (
  <span
    className={
      hot
        ? "flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground"
        : "flex size-8 items-center justify-center rounded-lg bg-foreground/10 text-foreground"
    }
  >
    {node}
  </span>
);

const alerts: StackNotification[] = [
  {
    id: "a1",
    app: "Relay",
    title: "POST /v1/checkout — 503",
    body: "Failing from 9 of 14 regions. Paged @maya (on-call). Detected in 8.2s.",
    time: "3:14:15",
    icon: icon(<Siren className="size-4" />, true),
  },
  {
    id: "a2",
    app: "Relay",
    title: "p95 latency 1,240 ms",
    body: "GET /v1/search crossed your 600 ms budget in eu-west.",
    time: "3:14:22",
    icon: icon(<Gauge className="size-4" />),
  },
  {
    id: "a3",
    app: "Relay",
    title: "Status page updated",
    body: "status.acme.dev → “Investigating elevated checkout errors.”",
    time: "3:14:31",
    icon: icon(<Activity className="size-4" />),
  },
];

export function Hero() {
  // flowy layer: as the hero leaves, the grid drifts slower than the page (depth) and the
  // headline block lifts and dims, handing the eye to the giant number below.
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Under reduced motion every value resolves to its resting state (same markup, no drift).
  const bgY = useTransform(scrollYProgress, (p) => (reduce ? 0 : p * 160));
  const contentY = useTransform(scrollYProgress, (p) => (reduce ? 0 : p * -90));
  const contentOpacity = useTransform(scrollYProgress, (p) =>
    reduce ? 1 : 1 - 0.85 * Math.min(1, Math.max(0, (p - 0.35) / 0.55))
  );

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-[clamp(4rem,8vw,7rem)]"
    >
      {/* Background: a faint scoreboard grid, the "broadcast monitor" */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: easeOutExpo }}
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,oklch(1_0_0/5%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/5%)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]"
        data-flowy="hero-bg"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-brand/15 blur-[120px]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12"
        data-flowy="hero-content"
      >
        <Stagger onMount delay={0.05} className="mb-6 flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
          <StaggerItem className="flex items-center gap-3">
            <span aria-hidden className="siren-dot size-2 rounded-full bg-brand" />
            Incident #4127 · live replay
          </StaggerItem>
        </Stagger>

        <MaskedLines
          as="h1"
          lines={[
            "Your API broke",
            "at 3:14:07.",
            <>
              You knew at <span className="text-brand">3:14:15.</span>
            </>,
          ]}
          className="font-display text-[clamp(3rem,10vw,10.5rem)] uppercase leading-[0.9] tracking-[-0.01em] text-balance"
        />

        <div className="mt-12 grid items-end gap-12 lg:grid-cols-12">
          <Stagger onMount delay={0.55} className="lg:col-span-5">
            <StaggerItem>
              <p className="max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
                Relay checks your endpoints from 14 regions every 10 seconds and pages the
                right person in <strong className="font-semibold text-foreground">under 10 seconds</strong>.
                Before the first customer email. Before the tweet.
              </p>
            </StaggerItem>
            <StaggerItem className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href="#cta"
                  className="inline-flex h-14 items-center rounded-full bg-brand px-8 font-display text-xl uppercase tracking-wide text-brand-foreground transition-shadow hover:shadow-[0_0_0_6px_oklch(0.7_0.215_38/0.25)]"
                >
                  Start free — 2 minutes
                </a>
              </Magnetic>
              <a
                href="#proof"
                className="font-mono text-sm uppercase tracking-wider text-muted-foreground underline decoration-hairline underline-offset-8 transition-colors hover:text-foreground hover:decoration-brand"
              >
                See the numbers ↓
              </a>
            </StaggerItem>
          </Stagger>

          <motion.div
            initial={{ opacity: 0, y: travel.lg, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: duration.hero, ease: easeOutExpo, delay: 0.85 }}
            className="w-full lg:col-span-6 lg:col-start-7 lg:flex lg:justify-end"
            data-flowy="hero-product"
          >
            <div className="relative w-full max-w-md lg:-rotate-2">
              <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-brand/10 blur-2xl" />
              <NotificationStack notifications={alerts} className="relative max-w-md" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
