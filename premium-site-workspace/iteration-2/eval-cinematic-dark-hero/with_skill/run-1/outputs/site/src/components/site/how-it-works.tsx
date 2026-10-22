"use client";

import { motion } from "motion/react";
import { Reveal, Stagger, itemVariants } from "@/components/motion/reveal";

const STEPS = [
  {
    slug: "Scene 01 — Ingest",
    title: "Drop in your log footage.",
    body: "Drag a timeline, an XML or a folder of clips. Nocturne reads the camera metadata, picks the right input transform for ARRI, Sony, RED, Blackmagic or iPhone log, and normalises every shot before it touches a look.",
    meta: "LogC4 · S-Log3 · REDWideGamut · BMD Film · Apple Log",
  },
  {
    slug: "Scene 02 — Choose",
    title: "Pick a look, or describe one.",
    body: "Start from a hand-built look, or type the brief you’d give a colorist — “sodium streetlights, crushed blacks, skin stays honest.” Nocturne builds the grade and shows it on your hero shot first.",
    meta: "40+ looks · text-to-grade · reference stills",
  },
  {
    slug: "Scene 03 — Match & export",
    title: "Every shot matched. Export anywhere.",
    body: "Nocturne balances exposure and white point shot to shot, keeps skin tones consistent across cameras, then hands back a graded render, a .cube LUT per scene, or a DaVinci Resolve project with every node intact.",
    meta: "ProRes · DNxHR · H.265 · .cube · .drp",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="section-pad border-t border-hairline">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="slate text-brand">How it works</p>
              <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-balance">
                Three scenes. <em>No</em> suite.
              </h2>
              <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-pretty text-muted-foreground">
                The work a colorist does over a week — balance, match, look — compressed into a
                pass you can run the night before a festival deadline.
              </p>
            </Reveal>
          </div>
        </div>

        <Stagger gap={0.14} className="lg:col-span-8 lg:col-start-5">
          <ol className="divide-y divide-hairline border-y border-hairline">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.slug}
                variants={itemVariants}
                className="grid gap-6 py-12 sm:grid-cols-[7rem_1fr] sm:gap-10 lg:py-16"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-[clamp(4rem,7vw,6rem)] leading-none text-foreground/20 tabular-nums"
                >
                  0{i + 1}
                </span>
                <div>
                  <p className="slate text-muted-foreground">{s.slug}</p>
                  <h3 className="mt-3 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.01em]">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-[60ch] text-[1.06rem] leading-relaxed text-pretty text-muted-foreground">
                    {s.body}
                  </p>
                  <p className="mt-6 font-mono text-xs text-foreground/60">{s.meta}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </Stagger>
      </div>
    </section>
  );
}
