"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { HoverLift } from "@/components/motion/hover";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { duration, easeOutExpo, spring } from "@/components/motion/tokens";

type Period = "monthly" | "yearly";

const plans = [
  {
    name: "Hobby",
    price: { monthly: 0, yearly: 0 },
    pitch: "For side projects and the API you swore was temporary.",
    features: ["10 endpoints", "30-second checks, 3 regions", "1 status page on relay.page", "Slack + email alerts", "7-day history"],
    cta: "Start free",
  },
  {
    name: "Team",
    price: { monthly: 29, yearly: 24 },
    pitch: "For teams of 2–15 who carry a pager.",
    features: [
      "100 endpoints",
      "10-second checks, 6 regions",
      "p95 / p99 latency dashboards",
      "Status page on your domain",
      "On-call rotas, SMS + voice",
      "90-day history",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    price: { monthly: 99, yearly: 82 },
    pitch: "For when the status page has its own fan club.",
    features: ["500 endpoints", "Everything in Team", "Unlimited status pages", "SSO + audit log", "1-year history", "Priority support, 1-hour response"],
    cta: "Talk to us",
  },
];

export function Pricing() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="border-t border-border py-[clamp(6rem,12vw,11rem)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="pricing-title"
            className="max-w-[14ch] font-display text-[clamp(3rem,7vw,7rem)] uppercase leading-[0.88]"
          >
            Priced for teams, not <span className="text-brand">enterprises</span>.
          </h2>
          <div
            role="radiogroup"
            aria-label="Billing period"
            className="inline-flex self-start border border-border p-1 font-mono text-xs uppercase tracking-[0.14em] lg:self-end"
          >
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={period === p}
                onClick={() => setPeriod(p)}
                className="relative px-4 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {period === p && (
                  <motion.span layoutId="period-pill" transition={spring.layout} className="absolute inset-0 bg-foreground" />
                )}
                <span className={`relative ${period === p ? "text-background" : "text-muted-foreground"}`}>
                  {p === "monthly" ? "Monthly" : "Yearly −17%"}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <Stagger className="mt-16 grid gap-4 lg:mt-20 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <HoverLift lift={-6} scale={1} className="h-full">
                <article
                  className={`relative flex h-full flex-col border p-7 sm:p-9 ${
                    plan.featured ? "border-brand bg-surface" : "border-border"
                  }`}
                >
                  {plan.featured && (
                    <p className="absolute -top-3 left-7 bg-brand px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-foreground">
                      What most teams pick
                    </p>
                  )}
                  <h3 className="font-display text-4xl uppercase">{plan.name}</h3>
                  <p className="mt-2 min-h-[3rem] text-base text-muted-foreground">{plan.pitch}</p>
                  <div className="mt-8 flex items-end gap-2">
                    <span className="font-display text-7xl leading-none">$</span>
                    <span className="relative inline-flex overflow-hidden font-display text-7xl leading-none tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={plan.price[period]}
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: "0%", opacity: 1 }}
                          exit={{ y: "-100%", opacity: 0 }}
                          transition={{ duration: duration.base, ease: easeOutExpo }}
                        >
                          {plan.price[period]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="pb-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      / month{plan.price.monthly > 0 && period === "yearly" ? ", billed yearly" : ""}
                    </span>
                  </div>
                  <ul className="mt-8 flex-1 space-y-3 border-t border-border pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3 text-base">
                        <span aria-hidden className={`mt-2 size-1.5 shrink-0 ${plan.featured ? "bg-brand" : "bg-foreground/50"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#signup"
                    className={`mt-10 inline-flex h-12 items-center justify-center font-mono text-sm font-semibold uppercase tracking-[0.14em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      plan.featured
                        ? "bg-brand text-brand-foreground"
                        : "border border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </article>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Prices in USD. No per-seat fees. Extra endpoints $0.20 each.
        </p>
      </div>
    </section>
  );
}
