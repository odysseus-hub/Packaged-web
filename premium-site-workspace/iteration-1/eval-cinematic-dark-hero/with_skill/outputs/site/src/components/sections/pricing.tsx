"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HoverLift } from "@/components/motion/hover";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./section-heading";

const PLANS = [
  {
    name: "Free",
    price: "0",
    blurb: "For shorts, tests and learning what a grade can do.",
    features: [
      "1080p exports",
      "3 custom looks a month",
      "30 minutes of cloud render a month",
      "Shot-matching up to 20 clips",
      "Community look library",
    ],
    cta: "Join the waitlist",
  },
  {
    name: "Pro",
    price: "24",
    blurb: "For the filmmaker finishing their own work, start to print.",
    features: [
      "4K exports, ProRes · DNxHR · H.265",
      "Unlimited looks and shot-matching",
      "10 hours of cloud render a month",
      "LUT + CDL export, XML round-trip",
      "Resolve, Premiere and Final Cut",
    ],
    cta: "Reserve Pro",
    featured: true,
  },
  {
    name: "Studio",
    price: "79",
    blurb: "For small crews and post houses sharing one look across a slate.",
    features: [
      "Everything in Pro, up to 8K",
      "HDR delivery: PQ, HLG, ACES",
      "3 seats + shared look library",
      "50 hours of priority render a month",
      "Review links with frame notes",
    ],
    cta: "Reserve Studio",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-pad relative border-t border-hairline bg-surface/40">
      <div className="container-x">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow reel="06">Pricing</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.95] tracking-[-0.03em] text-balance">
              Cheaper than one day <em className="text-brand">in the suite.</em>
            </h2>
          </div>
          <p className="max-w-[42ch] text-lg leading-relaxed text-pretty text-muted-foreground lg:col-span-5">
            Waitlist members lock in launch pricing for their first year. Cancel
            any time; your looks and LUTs stay yours.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <StaggerItem key={p.name} className={cn(p.featured && "lg:-mt-6")}>
              <HoverLift lift={-6} scale={1.01} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-sm border bg-background p-7 sm:p-9",
                    p.featured
                      ? "border-brand/70 shadow-[0_0_90px_-40px_var(--brand)]"
                      : "border-hairline"
                  )}
                >
                  <header className="flex items-center justify-between">
                    <h3 className="font-display text-3xl">{p.name}</h3>
                    {p.featured ? (
                      <Badge className="rounded-full bg-brand font-mono text-[0.62rem] tracking-[0.16em] text-brand-foreground uppercase">
                        Most chosen
                      </Badge>
                    ) : null}
                  </header>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-7xl leading-none tracking-[-0.03em] tabular-nums">
                      ${p.price}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </p>
                  <p className="mt-4 min-h-[3lh] text-pretty text-muted-foreground">{p.blurb}</p>
                  <ul className="mt-8 flex-1 space-y-3 border-t border-hairline pt-6 text-[0.95rem]">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <Check aria-hidden="true" className={cn("mt-0.5 size-4 shrink-0", p.featured ? "text-brand" : "text-muted-foreground")} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#waitlist"
                    className={cn(
                      "mt-10 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      p.featured
                        ? "bg-brand text-brand-foreground hover:bg-brand/90"
                        : "border border-hairline text-foreground hover:border-foreground/30 hover:bg-foreground/5"
                    )}
                  >
                    {p.cta}
                    <span className="sr-only"> — {p.name} plan</span>
                  </a>
                </article>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
