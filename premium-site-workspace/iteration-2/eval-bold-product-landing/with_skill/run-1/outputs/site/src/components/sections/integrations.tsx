"use client";

import { Reveal } from "@/components/motion/reveal";

// Wordmarks set in the page's own display face — no third-party logo files.
const names = [
  "Slack",
  "PagerDuty",
  "Discord",
  "MS Teams",
  "Opsgenie",
  "GitHub",
  "Vercel",
  "Linear",
  "Datadog",
  "Twilio SMS",
  "Webhooks",
];

const item =
  "shrink-0 font-display text-3xl uppercase text-foreground/40 transition-colors duration-200 hover:text-foreground sm:text-4xl";

export function Integrations() {
  return (
    <section id="integrations" aria-labelledby="integrations-title" className="border-y border-border">
      <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:px-12">
        <h2
          id="integrations-title"
          className="font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-muted-foreground lg:col-span-3"
        >
          Pages you wherever
          <br className="hidden lg:block" /> your team already is
        </h2>
        {/* flowy layer: an endless ticker (CSS transform loop on a duplicated track). Under
            reduced motion the loop stops, the duplicate hides and the list wraps statically. */}
        <Reveal className="marquee min-w-0 lg:col-span-9" data-flowy="marquee">
          <div className="marquee-track">
            <ul className="marquee-group gap-x-9 gap-y-4">
              {names.map((n) => (
                <li key={n} className={item}>
                  {n}
                </li>
              ))}
            </ul>
            <ul className="marquee-group marquee-dup gap-x-9" aria-hidden>
              {names.map((n) => (
                <li key={n} className={item}>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
