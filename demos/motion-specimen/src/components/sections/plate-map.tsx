"use client";

import NotificationStack, { type StackNotification } from "@/components/kokonutui/notification-stack";
import SmoothTab, { type SwipeTabItem } from "@/components/kokonutui/smooth-tab";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { Container, PlateLabel } from "./plate";

function Pick({ section, pick, why }: { section: string; pick: string; why: string }) {
  return (
    <div className="flex h-full flex-col gap-3 p-1">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">{section}</p>
      <p className="font-display text-2xl font-extrabold tracking-[-0.03em] text-zinc-900">{pick}</p>
      <p className="text-sm leading-relaxed text-zinc-600">{why}</p>
    </div>
  );
}

const TABS: SwipeTabItem[] = [
  {
    id: "hero",
    title: "Hero",
    content: <Pick section="Hero" pick="dot-field · background-paths · shape-hero" why="The first screen must show something. Generative canvases take their color from CSS, so they print in your accent." />,
  },
  {
    id: "features",
    title: "Features",
    content: <Pick section="Features" pick="Bento grid + HoverLift" why="Mixed spans, a live micro-demo in every cell, never three identical icon cards." />,
  },
  {
    id: "proof",
    title: "Proof",
    content: <Pick section="Proof" pick="Bklit charts + CountUp" why="One number as the argument, one chart as the evidence, both revealed when seen." />,
  },
  {
    id: "cta",
    title: "CTA",
    content: <Pick section="CTA" pick="particle-button · attract-button" why="One signature interaction per page. The final CTA is a good place to spend it." />,
  },
];

// Recolored to the tokens: the icon chips print in brand pink, not Kokonut's default status palette.
const chip = (label: string) => (
  <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--brand)] font-mono text-[10px] font-bold text-white">{label}</span>
);
const CHECKS: StackNotification[] = [
  { id: "shots", app: "screenshot.mjs", title: "3 passes, 0 issues", body: "Desktop, 390px mobile and reduced motion. No overflow, no console or hydration errors.", time: "now", icon: chip("SS") },
  { id: "audit", app: "check_site.py", title: "0 fail · 1 warn", body: "The warn is 9 hex values: real riso ink swatches painted as artwork, which the rule allows. UI colors are all tokens.", time: "1m", icon: chip("CS") },
  { id: "build", app: "next build", title: "Static, prerendered", body: "Turbopack, Next 16.4. The page ships as static HTML.", time: "2m", icon: chip("NB") },
  { id: "lint", app: "eslint", title: "Clean", body: "Strict on authored code. Vendored registry code is linted leniently.", time: "2m", icon: chip("ES") },
];

export function PlateMap() {
  return (
    <section className="section-pad bg-muted/60">
      <Container>
        <PlateLabel n="10" name="Section map & verification" rule="Every section gets a job, a component and one motion idea. Then it gets checked." />
        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <MaskedLines
              as="h2"
              onMount={false}
              lines={["A component", <>for every <span className="misreg">section</span>.</>]}
              className="font-display text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold leading-[0.92] tracking-[-0.04em]"
            />
            <Reveal className="mt-10 rounded-3xl border border-border bg-white p-4 sm:p-6">
              <SmoothTab items={TABS} defaultTabId="hero" activeColor="bg-[var(--brand)]" activeTextColor="text-white" label="Section map" className="max-w-none" />
            </Reveal>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Kokonut smooth-tab · swipe the panel or drag the indicator
            </p>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <p className="max-w-[40ch] text-lg leading-relaxed text-muted-foreground text-pretty">
              Nothing ships on vibes. Before deploy, every site runs the same four checks, and a human looks at the
              screenshots. These are this page&apos;s results.
            </p>
            <Reveal className="mt-8">
              <NotificationStack notifications={CHECKS} />
            </Reveal>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Kokonut notification-stack · hover to fan out, swipe to dismiss
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
