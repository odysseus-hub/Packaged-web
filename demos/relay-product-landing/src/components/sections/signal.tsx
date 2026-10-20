"use client";

import { CountUp } from "@/components/motion/count-up";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const facts = [
  { k: "10 s", v: "check interval on every plan" },
  { k: "14", v: "probe regions, quorum of 3 before paging" },
  { k: "0", v: "pages for a single flaky probe" },
];

export function Signal() {
  return (
    <section
      id="signal"
      aria-labelledby="signal-title"
      className="relative overflow-hidden border-y border-hairline py-[clamp(6rem,12vw,11rem)]"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <Stagger>
          <StaggerItem>
            <p id="signal-title" className="font-mono text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              Median time from first failed check → phone buzzing
            </p>
          </StaggerItem>
          <StaggerItem>
            <p
              className="-ml-[0.04em] mt-4 font-display leading-[0.8] tracking-[-0.02em] text-[clamp(9rem,32vw,30rem)]"
              data-flowy="signal-number"
            >
              <CountUp to={8.2} duration={1.4} format={(n) => n.toFixed(1)} />
              <span className="text-brand">s</span>
            </p>
          </StaggerItem>
          <StaggerItem className="mt-10 grid gap-10 border-t border-hairline pt-8 md:grid-cols-12">
            <p className="max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground md:col-span-5">
              Measured across 41 million checks in September. The industry default is a
              one-minute interval and a five-minute confirmation window. That&rsquo;s six
              minutes of your customers finding out first.
            </p>
            <ul className="grid grid-cols-3 gap-6 md:col-span-6 md:col-start-7">
              {facts.map((f) => (
                <li key={f.v}>
                  <p className="font-display text-4xl tabular-nums sm:text-5xl">{f.k}</p>
                  <p className="mt-2 text-sm leading-snug text-muted-foreground">{f.v}</p>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
