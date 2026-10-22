"use client";

import { BellRing, Gauge, Radio, Siren } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import NotificationStack, { type StackNotification } from "@/components/kokonutui/notification-stack";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";
import { duration, easeOutExpo } from "@/components/motion/tokens";

const icon = (Icon: typeof Siren, loud = false) => (
  <span
    className={
      loud
        ? "flex size-8 items-center justify-center bg-brand text-brand-foreground"
        : "flex size-8 items-center justify-center border border-border bg-secondary text-foreground"
    }
  >
    <Icon className="size-4" aria-hidden />
  </span>
);

const alerts: StackNotification[] = [
  {
    id: "a1",
    app: "Relay",
    title: "checkout-api is DOWN",
    body: "POST /v1/charges → 503 from 4 of 6 regions. Paging @maya.",
    time: "9.4s",
    icon: icon(Siren, true),
  },
  {
    id: "a2",
    app: "Relay",
    title: "Paged @maya via Slack + phone",
    body: "Escalates to @dev-oncall in 2 min if nobody acks.",
    time: "9.4s",
    icon: icon(BellRing),
  },
  {
    id: "a3",
    app: "Relay",
    title: "Status page → Investigating",
    body: "status.acme.dev updated for 2,140 subscribers.",
    time: "11s",
    icon: icon(Radio),
  },
  {
    id: "a4",
    app: "Relay",
    title: "p95 spike on GET /v1/search",
    body: "1,840 ms against a 210 ms baseline.",
    time: "2m",
    icon: icon(Gauge),
  },
];

export function Hero() {
  // flowy layer: as the hero scrolls away, the stroked "10" sinks slower than the page
  // (depth) and the copy lifts and dims. Under reduced motion both map to rest.
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 260]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], reduce ? [1, 1] : [1, 0.15]);

  return (
    <section
      ref={ref}
      id="hero"
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 lg:pt-32"
    >
      {/* Background: the countdown as image — giant stroked numerals cropped by the edge. */}
      <motion.div
        aria-hidden
        data-flowy="hero-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: easeOutExpo }}
        style={{ y: bgY }}
        className="pointer-events-none absolute -right-[12vw] -bottom-[8vw] -z-10 select-none font-display leading-[0.8] stroke-type text-[78vw] lg:-right-[6vw] lg:text-[54vw]"
      >
        10
      </motion.div>

      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <motion.div className="lg:col-span-8" data-flowy="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <Stagger onMount gap={0.06}>
            <StaggerItem>
              <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span aria-hidden className="signal-dot size-2 bg-brand" />
                API monitoring for small dev teams
              </p>
            </StaggerItem>
          </Stagger>
          <MaskedLines
            delay={0.12}
            lines={[
              "Your API broke.",
              "You knew in",
              <span key="t" className="text-brand">
                9.4 seconds.
              </span>,
            ]}
            className="font-display text-[clamp(3.4rem,8.6vw,9.25rem)] uppercase leading-[0.98] tracking-[-0.01em] text-balance"
          />
          <Stagger onMount delay={0.55} className="mt-9 flex flex-col gap-9">
            <StaggerItem>
              <p className="max-w-[54ch] text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
                Relay checks every endpoint from six regions every ten seconds, confirms the
                failure, and pages the right person before a single customer opens a ticket.
                p95 dashboards and a public status page come with it.
              </p>
            </StaggerItem>
            <StaggerItem className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Magnetic>
                <a
                  href="#signup"
                  className="inline-flex h-14 items-center gap-3 bg-brand px-7 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-brand-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  Start free — 10 endpoints
                  <span aria-hidden>→</span>
                </a>
              </Magnetic>
              <a
                href="#features"
                className="font-mono text-sm uppercase tracking-[0.14em] text-foreground underline decoration-brand decoration-2 underline-offset-8 hover:text-brand focus-visible:text-brand focus-visible:outline-none"
              >
                See what it watches
              </a>
            </StaggerItem>
          </Stagger>
        </motion.div>

        <motion.div
          className="relative lg:col-span-4"
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: duration.hero, ease: easeOutExpo, delay: 0.75 }}
          data-flowy="hero-product"
        >
          <div aria-hidden className="hazard h-2.5 w-full" />
          <div className="border border-t-0 border-border bg-background/70 p-4 backdrop-blur-sm sm:p-5">
            <NotificationStack notifications={alerts} className="max-w-none" />
            <dl className="mt-5 grid grid-cols-3 border-t border-border pt-4 font-mono text-[11px] uppercase tracking-[0.12em]">
              {[
                ["Failed", "00.0s"],
                ["Confirmed", "03.1s"],
                ["Paged", "09.4s"],
              ].map(([k, v], i) => (
                <div key={k}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className={i === 2 ? "mt-1 text-base text-brand" : "mt-1 text-base"}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
