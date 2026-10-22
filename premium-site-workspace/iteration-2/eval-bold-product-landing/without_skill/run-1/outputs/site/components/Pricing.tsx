"use client";

import { useState } from "react";

type Tier = {
  name: string;
  monthly: number;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Hobby",
    monthly: 0,
    blurb: "Side projects and the first API you ship.",
    features: ["5 endpoints", "1-minute checks from 3 regions", "Email + Slack alerts", "Status page on relay.page", "7 days of history"],
    cta: "Start free",
  },
  {
    name: "Team",
    monthly: 29,
    blurb: "For the 2–15 person team that's on call for real.",
    features: [
      "50 endpoints",
      "30-second checks from 14 regions",
      "Alerts in under 10 seconds",
      "p50 / p95 / p99 dashboards",
      "Status page on your own domain",
      "On-call rotations + escalation",
      "13 months of history · 10 seats",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    monthly: 99,
    blurb: "More endpoints, more people, more paperwork.",
    features: [
      "250 endpoints",
      "10-second checks",
      "Multi-step + checks as code",
      "Unlimited seats + SSO",
      "Private status pages",
      "Priority support, 1h response",
    ],
    cta: "Start 14-day trial",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display text-[clamp(2.75rem,8vw,7.5rem)]">
            Priced for
            <br />
            <span className="text-volt">teams of five.</span>
          </h2>
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="max-w-sm text-lg leading-relaxed text-paper/70 lg:text-right">
              Flat pricing. No per-seat tax on the Team plan. Cancel from the settings page, not a sales call.
            </p>
            <div role="group" aria-label="Billing period" className="inline-flex border-2 border-paper/20 p-1 font-mono text-[13px] uppercase tracking-wider">
              {[
                { v: false, l: "Monthly" },
                { v: true, l: "Yearly · 2 mo free" },
              ].map((o) => (
                <button
                  key={o.l}
                  type="button"
                  aria-pressed={annual === o.v}
                  onClick={() => setAnnual(o.v)}
                  className={`px-4 py-2 transition-colors ${annual === o.v ? "bg-volt text-ink" : "text-paper/70 hover:text-paper"}`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:items-stretch">
          {tiers.map((t) => {
            const price = annual ? Math.round((t.monthly * 10) / 12) : t.monthly;
            return (
              <article
                key={t.name}
                className={`relative flex flex-col border-2 p-6 sm:p-8 ${
                  t.featured
                    ? "border-volt bg-volt text-ink lg:-translate-y-4 lg:shadow-[10px_10px_0_0_var(--color-paper)]"
                    : "border-paper/15 bg-ink-2 text-paper"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3.5 left-6 bg-ink px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-volt">
                    Most teams pick this
                  </span>
                )}
                <h3 className="display-tight text-3xl">{t.name}</h3>
                <p className={`mt-2 text-sm ${t.featured ? "text-ink/75" : "text-paper/60"}`}>{t.blurb}</p>
                <p className="mt-8 flex items-end gap-2">
                  <span className="display text-7xl tabular sm:text-8xl">${price}</span>
                  <span className={`mb-2 font-mono text-xs uppercase tracking-wider ${t.featured ? "text-ink/70" : "text-paper/50"}`}>
                    / month
                    {t.monthly > 0 && annual ? <><br />billed yearly</> : null}
                  </span>
                </p>
                <ul className={`mt-8 flex-1 space-y-3 border-t-2 pt-6 ${t.featured ? "border-ink/20" : "border-paper/10"}`}>
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[15px] leading-snug">
                      <span aria-hidden="true" className={`mt-1.5 h-2 w-2 shrink-0 ${t.featured ? "bg-ink" : "bg-volt"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#signup"
                  className={`mt-8 inline-flex items-center justify-center px-6 py-4 font-extrabold uppercase tracking-wide transition-transform hover:-translate-y-0.5 ${
                    t.featured ? "bg-ink text-paper" : "border-2 border-paper/30 text-paper hover:border-paper"
                  }`}
                >
                  {t.cta}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
