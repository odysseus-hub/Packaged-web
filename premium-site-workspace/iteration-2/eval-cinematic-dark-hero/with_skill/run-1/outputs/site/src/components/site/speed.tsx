"use client";

import { useReducedMotion } from "motion/react";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { CountUp } from "@/components/motion/count-up";
import { InViewMount, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

// Minutes to a first full grade of a 20-minute short (ingest → matched → exported).
const DATA = [
  { name: "By hand", label: "By hand, shot by shot", other: 480, nocturne: 0 },
  { name: "LUT + match", label: "LUT + manual matching", other: 190, nocturne: 0 },
  { name: "Nocturne", label: "Nocturne", other: 0, nocturne: 14 },
];

export function Speed() {
  const reduce = useReducedMotion();
  return (
    <section id="speed" className="section-pad border-t border-hairline">
      <div className="container-x">
        {/* One giant number, alone. */}
        <Reveal className="text-center">
          <p className="slate text-muted-foreground">Real-time preview · 4K DCI · on a laptop</p>
          <p className="mt-6 font-display leading-[0.8] tracking-[-0.04em]">
            <CountUp to={38} className="text-[clamp(8rem,26vw,22rem)]" />
            <span className="ml-3 align-top font-display text-[clamp(2rem,5vw,4.5rem)] italic text-brand">
              fps
            </span>
          </p>
          <p className="mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            Scrub a graded 4K timeline at full frame rate on an Apple M-series or RTX laptop. No
            proxies, no render-to-preview.
          </p>
        </Reveal>

        <div className="mt-[clamp(6rem,12vw,10rem)] grid gap-12 lg:grid-cols-12 lg:items-center">
          <Stagger className="lg:col-span-5">
            <StaggerItem>
              <p className="slate text-brand">Render speed</p>
            </StaggerItem>
            <StaggerItem>
              <h2 className="mt-5 font-display text-[clamp(2.4rem,4.5vw,4rem)] leading-[0.98] tracking-[-0.02em] text-balance">
                A short film graded in <em className="text-brand">14 minutes</em>.
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-pretty text-muted-foreground">
                Time to a first full grade of a 20-minute short — ingest, shot-matched, exported to
                ProRes 422 HQ. 34× faster than matching shot by shot.
              </p>
            </StaggerItem>
            <StaggerItem>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-hairline pt-6">
                {DATA.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs text-muted-foreground">{d.label}</dt>
                    <dd
                      className={`mt-1 font-display text-3xl tabular-nums ${
                        d.nocturne ? "text-brand" : "text-foreground"
                      }`}
                    >
                      {d.nocturne || d.other}
                      <span className="ml-1 font-sans text-sm text-muted-foreground">min</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </StaggerItem>
          </Stagger>

          <div className="lg:col-span-7">
            <figure
              aria-label="Bar chart: minutes to grade a 20-minute short. By hand 480, LUT plus manual matching 190, Nocturne 14."
              className="rounded-sm border border-hairline bg-surface/60 p-4 sm:p-8"
            >
              <InViewMount aspect="16 / 10">
                <BarChart
                  data={DATA}
                  aspectRatio="16 / 10"
                  stacked
                  barGap={0.35}
                  animationDuration={reduce ? 0 : 1100}
                  margin={{ top: 24, right: 8, bottom: 40, left: 8 }}
                >
                  <Grid horizontal />
                  <Bar dataKey="other" fill="oklch(0.42 0.012 60)" lineCap={4} />
                  <Bar dataKey="nocturne" fill="var(--brand)" lineCap={4} />
                  <BarXAxis showAllLabels />
                </BarChart>
              </InViewMount>
              <figcaption className="slate mt-2 text-[0.6rem] text-muted-foreground">
                Minutes · lower is better · internal benchmark, 20-min short, 312 shots
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
