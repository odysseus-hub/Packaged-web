"use client";

import { CountUp } from "@/components/motion/count-up";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const steps = [
  { t: "00.0s", title: "A check fails", body: "POST /v1/charges returns 503 from us-east." },
  { t: "03.1s", title: "Quorum confirms it", body: "Three regions agree. No flapping, no 3 a.m. false pages." },
  { t: "06.8s", title: "Routed by rota", body: "Relay reads the on-call schedule and picks Maya." },
  { t: "09.4s", title: "Her phone buzzes", body: "Slack, push and a voice call. Status page flips to Investigating." },
];

export function Speed() {
  return (
    <section id="speed" aria-labelledby="speed-title" className="relative overflow-hidden py-[clamp(6rem,12vw,11rem)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <h2 id="speed-title" className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Median time from failure to a human, across 1,200 teams
          </h2>
        </Reveal>
        <p
          className="mt-10 font-display uppercase leading-[0.86] tracking-[-0.02em] text-[clamp(9rem,34vw,30rem)]"
        >
          <CountUp to={9.4} duration={1.4} format={(n) => n.toFixed(1)} />
          <span className="text-brand">s</span>
        </p>

        <Stagger className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8" role="list">
          {steps.map((s, i) => (
            <StaggerItem
              key={s.t}
              role="listitem"
              className={`border-t-2 pt-5 ${i === steps.length - 1 ? "border-brand" : "border-border"}`}
            >
              <p className={`font-mono text-sm tabular-nums ${i === steps.length - 1 ? "text-brand" : "text-muted-foreground"}`}>
                {s.t}
              </p>
              <h3 className="mt-3 font-display text-3xl uppercase">{s.title}</h3>
              <p className="mt-2 max-w-[32ch] text-base leading-relaxed text-muted-foreground">{s.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
