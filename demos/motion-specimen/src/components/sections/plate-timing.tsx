"use client";

import { useState } from "react";
import { HoverLift } from "@/components/motion/hover";
import { MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, PlateLabel } from "./plate";

const TOKENS = [
  { name: "easeOutExpo", value: "[0.16, 1, 0.3, 1]", note: "Everything that arrives. Fast start, long settle." },
  { name: "duration.base", value: "0.6s", note: "One reveal. Over 1.2s and the reader is waiting on you." },
  { name: "duration.hero", value: "1.1s", note: "Headline lines only. Message legible by 1.5s." },
  { name: "stagger.base", value: "80ms", note: "Cards and list items cascade in reading order." },
  { name: "travel.md", value: "24px", note: "Short travel reads expensive. 100px slides read cheap." },
  { name: "spring.hover", value: "400 / 28 / 0.6", note: "Stiffness, damping, mass. Interruptible mid-flight." },
];

export function PlateTiming() {
  const [run, setRun] = useState(0);
  return (
    <section id="timing" className="section-pad bg-muted/60">
      <Container>
        <PlateLabel n="02–03" name="Stagger & springs" rule="Groups cascade once, in view. Anything the pointer touches is a spring." />
        <div className="mt-14 flex flex-wrap items-end justify-between gap-8">
          <MaskedLines
            as="h2"
            onMount={false}
            lines={["Timing is", <>a <span className="misreg">token</span>, not a vibe.</>]}
            className="max-w-[16ch] font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.04em]"
          />
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="rounded-full border border-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            ↻ Replay the cascade
          </button>
        </div>

        {/* Changing the key remounts the group, which replays its stagger on demand. */}
        <Stagger key={run} onMount={run > 0} className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOKENS.map((t, i) => (
            <StaggerItem key={t.name} className="min-w-0">
              <HoverLift className="h-full rounded-3xl border border-border bg-card p-7 shadow-[0_1px_0_var(--border)] transition-shadow hover:shadow-[0_24px_50px_-28px_oklch(0.22_0.02_265/45%)]">
                <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-brand">{t.name}</span>
                </div>
                <p className="mt-8 font-display text-4xl font-extrabold tracking-[-0.03em]">{t.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Hover a card: spring lift. Replay: 80ms stagger, 24px travel, expo-out.
        </p>
      </Container>
    </section>
  );
}
