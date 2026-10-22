"use client";

import { useReducedMotion } from "motion/react";
import { Area, AreaChart } from "@/components/charts/area-chart";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Gauge } from "@/components/charts/gauge";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { CountUp } from "@/components/motion/count-up";
import { InViewMount, MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";
import { LiveFeed } from "./live-feed";
import { Container, PlateLabel } from "./plate";

// Real results from this repo's eval (premium-site-workspace/iteration-{1,2}/benchmark.md):
// 19 scripted checks × 2 sites per round.
const ROUNDS = [
  { name: "Round 1", skill: 38, baseline: 21 },
  { name: "Round 2", skill: 37, baseline: 21 },
];

// The motion token itself, plotted: cubic-bezier(0.16, 1, 0.3, 1) sampled over 1.1s.
function bezier(t: number, p1: number, p2: number) {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
}
const T0 = Date.UTC(2026, 0, 1);
const EASE = Array.from({ length: 45 }, (_, i) => {
  const s = i / 44;
  return { date: new Date(T0 + Math.round(bezier(s, 0.16, 0.3) * 1100)), progress: Math.round(bezier(s, 1, 1) * 100) };
});

export function PlateProof() {
  // Only selects animation durations (a motion value, not markup), so motion's hook is fine here.
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 1100;
  return (
    <section id="proof" className="section-pad">
      <Container>
        <PlateLabel n="08" name="Charts as proof" rule="A chart is an argument. It reveals when seen, never off-screen at load." />

        <div className="mt-14 grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Checks passed, with vs without the skill</p>
            <p className="mt-3 font-display text-[clamp(5rem,16vw,14rem)] font-extrabold leading-[0.82] tracking-[-0.045em]">
              +<CountUp to={42} />
              <span className="text-brand">pts</span>
            </p>
          </div>
          <MaskedLines
            as="h2"
            onMount={false}
            lines={["Same model.", <>Same prompts.</>, <><span className="misreg">Different</span> sites.</>]}
            className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em] md:col-span-5"
          />
        </div>

        <Stagger className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <StaggerItem className="min-w-0 rounded-3xl border border-border bg-card p-6 lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Checks passed / 38 · <span className="text-brand">skill</span> vs <span className="text-foreground/50">baseline</span>
            </p>
            <InViewMount aspect="4 / 3" className="mt-4">
              <BarChart data={ROUNDS} aspectRatio="4 / 3" animationDuration={dur} barGap={0.35}>
                <Grid horizontal numTicksRows={4} />
                <Bar dataKey="skill" fill="var(--chart-line-primary)" lineCap="round" />
                <Bar dataKey="baseline" fill="var(--chart-line-secondary)" lineCap="round" />
                <BarXAxis />
              </BarChart>
            </InViewMount>
          </StaggerItem>

          <StaggerItem className="min-w-0 rounded-3xl border border-border bg-card p-6 lg:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Round 2 pass rate</p>
            <InViewMount aspect="4 / 3" className="mt-8 flex items-center justify-center">
              <Gauge
                value={97}
                centerValue={97}
                suffix="%"
                defaultLabel="37 of 38 checks"
                activeFill="var(--brand)"
                inactiveFill="var(--foreground)"
                inactiveFillOpacity={0.12}
                minWidth={240}
              />
            </InViewMount>
          </StaggerItem>

          <StaggerItem className="min-w-0 rounded-3xl border border-border bg-card p-6 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              easeOutExpo, plotted · 0 → 1.1s
            </p>
            <InViewMount aspect="4 / 3" className="mt-4">
              <AreaChart data={EASE} aspectRatio="4 / 3" animationDuration={dur} margin={{ top: 16, right: 8, bottom: 16, left: 8 }}>
                <Grid horizontal numTicksRows={4} />
                <Area dataKey="progress" fill="var(--chart-line-primary)" fillOpacity={0.3} />
                <ChartTooltip showDatePill={false} rows={(p) => [{ label: "progress", value: `${p.progress}%`, color: "var(--brand)" }]} />
              </AreaChart>
            </InViewMount>
            <p className="mt-3 text-xs text-muted-foreground">Ninety percent of the distance in the first third of the time. That&apos;s the &ldquo;settle.&rdquo;</p>
          </StaggerItem>

          <StaggerItem className="min-w-0 rounded-3xl border border-border bg-card p-6 lg:col-span-12">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Frame time, live · <span className="text-brand">simulated feed</span> · budget 16.7ms
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Bklit live-line-chart · streams only while visible</p>
            </div>
            <InViewMount aspect="6 / 1" className="mt-4">
              <LiveFeed />
            </InViewMount>
          </StaggerItem>
        </Stagger>
      </Container>
    </section>
  );
}
