"use client";

import { useReducedMotion } from "motion/react";
import { Area, AreaChart } from "@/components/charts/area-chart";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";
import { InViewMount, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

// Median p95 (ms) across Relay teams, by week since install. Week 0 = the day they plugged Relay in.
const P95 = [842, 811, 768, 640, 590, 512, 455, 401, 352, 318, 266, 231, 214];
const latency = P95.map((p95, i) => ({
  date: new Date(Date.UTC(2026, 5, 1 + i * 7)),
  p95,
}));

// Minutes of customer-facing downtime per month (median team). Relay switched on in July.
const downtime = [
  { name: "Apr", before: 304, after: 0 },
  { name: "May", before: 271, after: 0 },
  { name: "Jun", before: 318, after: 0 },
  { name: "Jul", before: 0, after: 96 },
  { name: "Aug", before: 0, after: 41 },
  { name: "Sep", before: 0, after: 17 },
];

export function Proof() {
  const reduce = useReducedMotion();
  const anim = reduce ? 0 : 1100;

  return (
    <section id="proof" aria-labelledby="proof-title" className="py-[clamp(6rem,12vw,11rem)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <Stagger className="max-w-4xl">
          <StaggerItem>
            <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-brand">The receipts</p>
          </StaggerItem>
          <StaggerItem>
            <h2
              id="proof-title"
              className="mt-5 font-display text-[clamp(2.75rem,6vw,6rem)] uppercase leading-[0.92] text-balance"
            >
              What you can see, you fix. Fast.
            </h2>
          </StaggerItem>
        </Stagger>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* Latency — the wide one */}
          <Reveal className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  p95 latency · median Relay team · weeks since install
                </p>
                <h3 className="mt-3 max-w-[18ch] font-display text-3xl uppercase leading-none sm:text-4xl">
                  p95 down <span className="text-brand">74%</span> in one quarter
                </h3>
              </div>
              <p className="font-mono text-sm tabular-nums text-muted-foreground">
                <span className="text-foreground">842</span> → <span className="text-brand">214 ms</span>
              </p>
            </div>
            <InViewMount aspect="16 / 9" className="mt-6">
              <AreaChart
                data={latency}
                aspectRatio="16 / 9"
                animationDuration={anim}
                margin={{ top: 24, right: 16, bottom: 36, left: 16 }}
              >
                <Grid horizontal numTicksRows={4} />
                <Area dataKey="p95" fill="var(--chart-line-primary)" fillOpacity={0.35} strokeWidth={2.5} fadeEdges="left" />
                <XAxis numTicks={5} />
                <ChartTooltip
                  rows={(p) => [
                    { color: "var(--brand)", label: "p95", value: `${p.p95 as number} ms` },
                  ]}
                />
              </AreaChart>
            </InViewMount>
          </Reveal>

          {/* Uptime — the narrow one */}
          <Reveal delay={0.12} className="flex flex-col rounded-3xl border border-hairline bg-surface p-6 sm:p-8 lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Minutes of downtime per month
            </p>
            <h3 className="mt-3 font-display text-3xl uppercase leading-none sm:text-4xl">
              99.3% → <span className="text-brand">99.96%</span> uptime
            </h3>
            <div className="mt-4 flex gap-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-2.5 rounded-sm bg-foreground/35" /> Before Relay
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-2.5 rounded-sm bg-brand" /> With Relay
              </span>
            </div>
            <InViewMount aspect="5 / 4" className="mt-auto pt-4">
              <BarChart
                data={downtime}
                aspectRatio="5 / 4"
                stacked
                barGap={0.35}
                animationDuration={anim}
                margin={{ top: 16, right: 8, bottom: 32, left: 8 }}
              >
                <Grid horizontal numTicksRows={3} />
                <Bar dataKey="before" fill="var(--chart-line-secondary)" lineCap={6} />
                <Bar dataKey="after" fill="var(--chart-line-primary)" lineCap={6} />
                <BarXAxis showAllLabels />
                <ChartTooltip
                  rows={(p) => {
                    const m = (p.before as number) || (p.after as number);
                    return [{ color: p.after ? "var(--brand)" : "var(--chart-line-secondary)", label: "Downtime", value: `${m} min` }];
                  }}
                />
              </BarChart>
            </InViewMount>
          </Reveal>
        </div>
        <p className="mt-6 max-w-[70ch] text-sm text-muted-foreground">
          Median across 1,140 teams on Relay for at least two quarters. Teams don&rsquo;t get faster
          because we&rsquo;re magic — they get faster because the slow endpoint now has a name, a graph
          and a pager attached.
        </p>
      </div>
    </section>
  );
}
