"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { HoverLift } from "@/components/motion/hover";
import { Reveal, Stagger, itemVariants } from "@/components/motion/reveal";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    blurb: "For tests, music videos and your first short.",
    features: [
      "1080p exports, watermark-free",
      "8 looks",
      "Up to 30 minutes of footage a month",
      ".cube LUT export",
    ],
    cta: "Join the waitlist",
    featured: false,
  },
  {
    name: "Pro",
    price: "$24",
    blurb: "For filmmakers finishing work for festivals and clients.",
    features: [
      "4K & 6K exports, ProRes and DNxHR",
      "All 40+ looks and text-to-grade",
      "Shot matching across cameras",
      "DaVinci Resolve project export",
      "10 hours of footage a month",
    ],
    cta: "Join the waitlist",
    featured: true,
  },
  {
    name: "Studio",
    price: "$79",
    blurb: "For production companies and post houses.",
    features: [
      "Everything in Pro",
      "5 seats with shared looks",
      "Custom looks trained on your references",
      "Unlimited footage",
      "Priority render queue & support",
    ],
    cta: "Join the waitlist",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-pad border-t border-hairline">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="slate text-brand">Pricing</p>
          <h2 className="mt-5 font-display text-[clamp(2.6rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em] text-balance">
            Cheaper than <em>one day</em> in a grading suite.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">Prices in USD, per month. Studio includes five seats.</p>
        </Reveal>

        <Stagger gap={0.1} className="mt-16">
          <ul className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {PLANS.map((p) => (
              <motion.li key={p.name} variants={itemVariants} className="h-full">
                <HoverLift className="h-full" lift={-6} scale={1.01}>
                  <div
                    className={`relative flex h-full flex-col rounded-sm border p-8 transition-colors sm:p-10 ${
                      p.featured
                        ? "border-brand/70 bg-surface shadow-[0_0_80px_-30px_var(--brand)]"
                        : "border-hairline bg-surface/50 hover:border-foreground/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-3xl">{p.name}</h3>
                      {p.featured && (
                        <Badge className="bg-brand text-brand-foreground">Most chosen</Badge>
                      )}
                    </div>
                    <p className="mt-6 flex items-baseline gap-1">
                      <span className="font-display text-6xl tracking-[-0.02em] tabular-nums">{p.price}</span>
                      <span className="text-sm text-muted-foreground">/ month</span>
                    </p>
                    <p className="mt-4 text-[0.98rem] text-pretty text-muted-foreground">{p.blurb}</p>
                    <ul className="mt-8 space-y-3 border-t border-hairline pt-8 text-[0.95rem]">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-3">
                          <Check aria-hidden="true" className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-brand" : "text-muted-foreground"}`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#waitlist"
                      className={`mt-10 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        p.featured
                          ? "bg-brand text-brand-foreground hover:brightness-110"
                          : "border border-hairline text-foreground hover:border-foreground/40"
                      }`}
                    >
                      {p.cta}
                      <span className="sr-only"> for {p.name}</span>
                    </a>
                  </div>
                </HoverLift>
              </motion.li>
            ))}
          </ul>
        </Stagger>
      </div>
    </section>
  );
}
