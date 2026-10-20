"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { HoverLift } from "@/components/motion/hover";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { duration, easeOutExpo } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Side project",
    monthly: 0,
    yearly: 0,
    blurb: "For the thing you launched on a Sunday.",
    features: ["10 endpoints · 60 s checks", "Email + Slack alerts", "1 public status page", "7 days of history"],
    cta: "Start free",
  },
  {
    name: "Team",
    monthly: 29,
    yearly: 24,
    blurb: "For the 2–15 people who get paged.",
    features: [
      "100 endpoints · 10 s checks",
      "SMS, phone, PagerDuty, Opsgenie",
      "p95 dashboards + latency budgets",
      "On-call rotations",
      "Custom-domain status page",
      "13 months of history",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    monthly: 99,
    yearly: 82,
    blurb: "For when the status page has subscribers.",
    features: ["500 endpoints · 10 s checks", "Everything in Team", "SSO + audit log", "Private probes in your VPC", "99.99% SLA"],
    cta: "Talk to us",
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-[clamp(6rem,12vw,11rem)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 id="pricing-title" className="font-display text-[clamp(2.75rem,6vw,6rem)] uppercase leading-[0.92]">
            Cheaper than <br className="hidden sm:block" />
            <span className="text-brand">one bad night.</span>
          </h2>
          <label className="flex cursor-pointer items-center gap-3 font-mono text-[13px] uppercase tracking-wider text-muted-foreground">
            <span className={cn(!yearly && "text-foreground")}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} aria-label="Bill yearly" />
            <span className={cn(yearly && "text-foreground")}>
              Yearly <span className="text-brand">−17%</span>
            </span>
          </label>
        </div>

        <Stagger className="mt-16 grid items-stretch gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <StaggerItem key={plan.name} className={cn(plan.featured && "lg:-mt-6")}>
                <HoverLift
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border p-7 sm:p-9",
                    plan.featured
                      ? "border-brand bg-surface shadow-[0_30px_80px_-30px_oklch(0.7_0.215_38/0.45)]"
                      : "border-hairline bg-surface/60"
                  )}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground">
                      Most teams
                    </span>
                  )}
                  <h3 className="font-mono text-sm uppercase tracking-[0.16em] text-muted-foreground">{plan.name}</h3>
                  <div className="mt-5 flex items-end gap-2">
                    <span className="font-display text-7xl leading-none">$</span>
                    <span className="relative inline-flex overflow-hidden font-display text-7xl leading-none tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={price}
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: "0%", opacity: 1 }}
                          exit={{ y: "-100%", opacity: 0 }}
                          transition={{ duration: duration.base, ease: easeOutExpo }}
                          className="inline-block"
                        >
                          {price}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="pb-1.5 text-sm text-muted-foreground">
                      /mo{price > 0 && yearly ? ", billed yearly" : ""}
                    </span>
                  </div>
                  <p className="mt-4 text-pretty text-muted-foreground">{plan.blurb}</p>
                  <ul className="mt-8 mb-10 space-y-3 border-t border-hairline pt-8 text-[15px]">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-brand" : "text-muted-foreground")} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#cta"
                    className={cn(
                      "mt-auto inline-flex h-12 items-center justify-center rounded-full font-mono text-[13px] font-semibold uppercase tracking-wider transition-colors",
                      plan.featured
                        ? "bg-brand text-brand-foreground hover:bg-brand/90"
                        : "border border-hairline hover:border-foreground/40"
                    )}
                  >
                    {plan.cta}
                  </a>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
