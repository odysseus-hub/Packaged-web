"use client";

import { useState } from "react";
import { SectionLabel } from "./Proof";

const plans = [
  {
    name: "Hobby",
    monthly: 0,
    blurb: "For side projects and the API you swear is temporary.",
    features: ["10 endpoints", "60-second checks", "1 region", "1 status page", "Email + Slack alerts", "7-day history"],
    cta: "Start free",
  },
  {
    name: "Team",
    monthly: 29,
    blurb: "For the 2–15 person team that ships daily and sleeps nightly.",
    features: [
      "100 endpoints",
      "5-second checks · <10s alerts",
      "3 regions with confirmation",
      "p95 / p99 dashboards",
      "Status page on your domain",
      "On-call rotations + escalation",
      "90-day history",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    monthly: 99,
    blurb: "For teams with an SLA in a contract somewhere.",
    features: [
      "500 endpoints",
      "Everything in Team",
      "10 regions",
      "Multi-step API flows",
      "SSO + audit log",
      "SLA reports",
      "13-month history",
    ],
    cta: "Start 14-day trial",
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" className="bg-bone pb-20 sm:pb-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <SectionLabel n="04" label="Pricing" />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display text-[clamp(2.6rem,7.2vw,7rem)]">
            Priced for <span className="text-signal">small teams.</span>
          </h2>
          <div
            role="radiogroup"
            aria-label="Billing period"
            className="inline-flex self-start rounded-full border-2 border-ink p-1 font-mono text-sm font-bold uppercase tracking-wider lg:self-auto"
          >
            {[
              { v: false, l: "Monthly" },
              { v: true, l: "Annual −20%" },
            ].map((o) => (
              <button
                key={o.l}
                role="radio"
                aria-checked={annual === o.v}
                onClick={() => setAnnual(o.v)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 transition ${annual === o.v ? "bg-ink text-bone" : "hover:bg-ink/10"}`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-6">
          {plans.map((p) => {
            const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
            const featured = p.featured;
            return (
              <article
                key={p.name}
                className={`relative flex flex-col rounded-3xl border-2 border-ink p-6 sm:p-8 ${
                  featured ? "bg-signal shadow-[10px_10px_0_0_var(--color-ink)] lg:-translate-y-4" : "bg-bone"
                }`}
              >
                {featured && (
                  <span className="absolute -top-4 left-6 rounded-full bg-ink px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-bone">
                    Most teams pick this
                  </span>
                )}
                <h3 className="display-tight text-3xl">{p.name}</h3>
                <p className={`mt-2 min-h-[3rem] leading-snug ${featured ? "text-ink" : "text-ink/70"}`}>{p.blurb}</p>
                <p className="mt-6 flex items-end gap-2">
                  <span className="display text-7xl sm:text-8xl">${price}</span>
                  <span className="mb-2 font-mono text-xs font-bold uppercase tracking-wider">
                    / mo{p.monthly > 0 && annual ? ", billed yearly" : ""}
                  </span>
                </p>
                <ul className="mt-8 space-y-3 border-t-2 border-ink pt-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-medium">
                      <span
                        className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] ${
                          featured ? "bg-ink text-signal" : "bg-signal text-ink"
                        }`}
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#signup"
                  className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-4 font-mono text-sm font-bold uppercase tracking-wider transition ${
                    featured
                      ? "bg-ink text-bone hover:bg-bone hover:text-ink"
                      : "border-2 border-ink hover:bg-ink hover:text-bone"
                  }`}
                >
                  {p.cta} →
                </a>
              </article>
            );
          })}
        </div>
        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-ink/55">
          All prices USD. Extra endpoints $0.20/mo each. Cancel any time, keep your status page history.
        </p>
      </div>
    </section>
  );
}
