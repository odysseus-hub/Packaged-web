"use client";

import { useReducedMotion } from "motion/react";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { CountUp } from "@/components/motion/count-up";
import { InViewMount, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Eyebrow } from "./section-heading";

// Frames per second rendering 4K ProRes 422 HQ with a full grade applied.
// Two series stacked so Nocturne alone carries the accent and the rest stay neutral.
const FPS = [
  { name: "Nocturne", nocturne: 380, other: 0 },
  { name: "GPU workstation", nocturne: 0, other: 52 },
  { name: "Laptop, CPU", nocturne: 0, other: 11 },
];

export function Speed() {
  const reduce = useReducedMotion();
  return (
    <section id="speed" className="section-pad relative border-t border-hairline">
      <div className="container-x">
        <Reveal>
          <Eyebrow reel="04">Render speed</Eyebrow>
        </Reveal>

        {/* One giant number, alone on the screen. */}
        <Stagger className="mt-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <StaggerItem className="lg:col-span-8">
            <p className="font-display leading-[0.8] tracking-[-0.05em] text-[clamp(8rem,30vw,26rem)]">
              <CountUp to={38} duration={1.8} className="text-brand" />
              <span className="ml-[0.06em] text-foreground/30 italic">s</span>
            </p>
          </StaggerItem>
          <StaggerItem className="lg:col-span-4 lg:pb-[3vw]">
            <p className="max-w-[34ch] font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-tight text-balance">
              to grade and render a ten-minute 4K short.
            </p>
            <p className="mt-4 font-mono text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
              14,400 frames · ProRes 422 HQ · full grade
            </p>
          </StaggerItem>
        </Stagger>

        <div className="mt-[clamp(5rem,10vw,9rem)] grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-4">
            <p className="font-display text-[clamp(4.5rem,9vw,8rem)] leading-[0.85] tracking-[-0.04em] tabular-nums">
              <CountUp to={7.3} format={(n) => n.toFixed(1)} />
              <span className="text-foreground/30 italic">×</span>
            </p>
            <h3 className="mt-6 max-w-[30ch] text-xl leading-snug text-balance">
              faster than exporting the same grade from a desktop GPU.
            </h3>
            <p className="mt-4 max-w-[40ch] leading-relaxed text-pretty text-muted-foreground">
              Nocturne renders on a farm of film-tuned GPUs, frame-parallel, so
              your laptop stays free for the next cut.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-7 lg:col-start-6">
            <figure className="rounded-sm border border-hairline bg-surface/60 p-5 sm:p-8">
              <figcaption className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase">
                <span>Frames per second · 4K, graded</span>
                <span className="text-brand">Higher is better</span>
              </figcaption>
              <InViewMount aspect="16 / 9" className="mt-4">
                <BarChart
                  data={FPS}
                  stacked
                  aspectRatio="16 / 9"
                  barGap={0.42}
                  margin={{ top: 24, right: 8, bottom: 36, left: 8 }}
                  animationDuration={reduce ? 0 : 1100}
                >
                  <Grid horizontal numTicksRows={4} />
                  <Bar dataKey="nocturne" fill="var(--chart-line-primary)" lineCap={4} animate={!reduce} />
                  <Bar dataKey="other" fill="var(--chart-line-secondary)" lineCap={4} animate={!reduce} />
                  <BarXAxis showAllLabels />
                </BarChart>
              </InViewMount>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-hairline pt-5 text-sm">
                {FPS.map((d) => (
                  <div key={d.name}>
                    <dt className="text-muted-foreground">{d.name}</dt>
                    <dd className="mt-1 font-mono text-base text-foreground tabular-nums">
                      {d.nocturne || d.other} fps
                    </dd>
                  </div>
                ))}
              </dl>
            </figure>
          </Reveal>
        </div>
        <p className="mt-10 max-w-[80ch] text-xs leading-relaxed text-muted-foreground/80">
          Internal benchmark, October 2026: 10-minute 23.976 fps UHD timeline, ARRI LogC4 source,
          four-node grade with shot-match. GPU workstation: single RTX-class card, local export.
          Figures are pre-release and will be re-published at launch.
        </p>
      </div>
    </section>
  );
}
