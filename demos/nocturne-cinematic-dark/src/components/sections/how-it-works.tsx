"use client";

import { motion } from "motion/react";
import { itemVariants, Reveal, Stagger } from "@/components/motion/reveal";
import { Eyebrow } from "./section-heading";

const STEPS = [
  {
    n: "01",
    tc: "00:00:12 — Ingest",
    title: "Drop in your cut",
    body: "Bring a timeline from Resolve, Premiere or Final Cut as XML, or drag raw clips straight in. Nocturne reads LOG and RAW from most cinema and mirrorless cameras, and keeps your edit exactly as it is.",
  },
  {
    n: "02",
    tc: "00:01:40 — Look",
    title: "Describe the look",
    body: "Say it the way you’d say it to a colorist: “sodium streetlight, cold shadows, keep the skin warm.” Nocturne builds a real node tree you can open, nudge and keep — not a filter you can’t undo.",
  },
  {
    n: "03",
    tc: "00:02:18 — Print",
    title: "Match, then render",
    body: "Shot-matching evens out every camera, lens and hour of the day. Render ProRes, DNxHR or H.265 in under a minute, or take the grade home to your NLE as a LUT and CDL.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="section-pad relative border-t border-hairline">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <Eyebrow reel="02">How it works</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.95] tracking-[-0.03em] text-balance">
              Three cuts from raw to <em className="text-brand">release.</em>
            </h2>
            <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-pretty text-muted-foreground">
              No nodes to learn, no scopes to squint at. You stay the director;
              Nocturne does the hours of balancing in between.
            </p>
          </Reveal>
        </div>

        <Stagger gap={0.14} className="lg:col-span-7 lg:col-start-6">
          <ol className="border-t border-hairline">
            {STEPS.map((s) => (
              <motion.li
                key={s.n}
                variants={itemVariants}
                className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-b border-hairline py-10 sm:gap-x-10 sm:py-12"
              >
                  <span
                    aria-hidden="true"
                    className="row-span-3 font-display text-[clamp(4rem,9vw,7.5rem)] leading-[0.8] text-foreground/15 italic tabular-nums"
                  >
                    {s.n}
                  </span>
                  <p className="font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
                    {s.tc}
                  </p>
                  <h3 className="font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-tight tracking-[-0.015em]">
                    <span className="sr-only">Step {s.n}: </span>
                    {s.title}
                  </h3>
                  <p className="max-w-[56ch] text-[1.05rem] leading-relaxed text-pretty text-muted-foreground">
                    {s.body}
                  </p>
              </motion.li>
            ))}
          </ol>
        </Stagger>
      </div>
    </section>
  );
}
