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

// Weekly p95 for GET /v1/search in a sample Relay workspace. Relay goes in at week 4.
const p95 = [1180, 1240, 1310, 1205, 980, 860, 720, 640, 580, 510, 470, 430, 410, 390, 368, 352];
const latency = p95.map((ms, i) => ({
  date: new Date(Date.UTC(2026, 2, 2 + i * 7)),
  p95: ms,
}));

// Minutes of customer-facing downtime per month. Relay goes in at the start of March.
const uptime = [
  { name: "Jan", before: 212, after: 0 },
  { name: "Feb", before: 147, after: 0 },
  { name: "Mar", before: 0, after: 64 },
  { name: "Apr", before: 0, after: 22 },
  { name: "May", before: 0, after: 9 },
  { name: "Jun", before: 0, after: 4 },
];

const eyebrow = "font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground";
const h2 = "mt-5 font-display text-[clamp(3rem,6vw,6rem)] uppercase leading-[0.88] text-balance";

export function Latency() {
  const reduce = useReducedMotion();
  return (
    <section id="latency" aria-labelledby="latency-title" className="border-t border-border py-[clamp(6rem,12vw,11rem)]">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <Stagger className="lg:col-span-4">
          <StaggerItem>
            <p className={eyebrow}>p95 latency dashboards</p>
          </StaggerItem>
          <StaggerItem>
            <h2 id="latency-title" className={h2}>
              p95 down <span className="text-brand">72%</span> in 12 weeks.
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground">
              Per-endpoint p95 and p99 showed one team exactly where the time went: an N+1 on
              search and a cold cache on checkout. Two fixes, one sprint.
            </p>
          </StaggerItem>
          <StaggerItem>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 font-mono">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Before</dt>
                <dd className="mt-1 text-2xl tabular-nums">1,240 ms</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Week 16</dt>
                <dd className="mt-1 text-2xl tabular-nums text-brand">352 ms</dd>
              </div>
            </dl>
          </StaggerItem>
        </Stagger>

        <Reveal className="lg:col-span-8" data-flowy="product">
          <figure className="border border-border bg-surface p-4 sm:p-6">
            <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <span>GET /v1/search · p95 · weekly</span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-0.5 w-5 bg-brand" /> Sample workspace
              </span>
            </figcaption>
            <InViewMount aspect="16 / 9">
              <AreaChart
                data={latency}
                aspectRatio="16 / 9"
                animationDuration={reduce ? 0 : 1100}
                margin={{ left: 8, right: 8, top: 24, bottom: 36 }}
              >
                <Grid horizontal numTicksRows={4} />
                <Area dataKey="p95" fill="var(--chart-line-primary)" fillOpacity={0.35} strokeWidth={2.5} />
                <XAxis numTicks={5} />
                <ChartTooltip />
              </AreaChart>
            </InViewMount>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

export function Uptime() {
  const reduce = useReducedMotion();
  return (
    <section id="uptime" aria-labelledby="uptime-title" className="border-t border-border bg-surface py-[clamp(6rem,12vw,11rem)]">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <Reveal className="order-2 lg:order-1 lg:col-span-7">
          <figure className="border border-border bg-background p-4 sm:p-6">
            <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <span>Minutes down per month</span>
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 bg-[var(--chart-line-secondary)]" /> Before Relay
                </span>
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 bg-brand" /> With Relay
                </span>
              </span>
            </figcaption>
            <InViewMount aspect="3 / 2">
              <BarChart
                data={uptime}
                aspectRatio="3 / 2"
                stacked
                barGap={0.35}
                animationDuration={reduce ? 0 : 1100}
                margin={{ left: 8, right: 8, top: 24, bottom: 36 }}
              >
                <Grid horizontal numTicksRows={4} />
                <Bar dataKey="before" fill="var(--chart-line-secondary)" lineCap="butt" />
                <Bar dataKey="after" fill="var(--chart-line-primary)" lineCap="butt" />
                <BarXAxis />
                <ChartTooltip showDatePill={false} />
              </BarChart>
            </InViewMount>
          </figure>
        </Reveal>

        <Stagger className="order-1 lg:order-2 lg:col-span-5">
          <StaggerItem>
            <p className={eyebrow}>Uptime</p>
          </StaggerItem>
          <StaggerItem>
            <h2 id="uptime-title" className={h2}>
              212 minutes down.
              <br />
              Then <span className="text-brand">4</span>.
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground">
              Outages don’t vanish. They get short. When the first page lands in ten seconds
              instead of after a support ticket, a 40-minute incident becomes a 4-minute one.
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-10 border-t border-border pt-6 font-display text-6xl uppercase tabular-nums">
              99.99<span className="text-brand">%</span>
              <span className="ml-3 align-middle font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                June uptime
              </span>
            </p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
