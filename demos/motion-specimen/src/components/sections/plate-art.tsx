"use client";

import { MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, PlateLabel } from "./plate";

const SPACING = [
  { label: "eyebrow → headline", px: 24 },
  { label: "headline → body", px: 32 },
  { label: "body → CTA", px: 40 },
  { label: "section padding", px: 176 },
];

export function PlateArt() {
  return (
    <section id="art" className="section-pad">
      <Container>
        <PlateLabel n="01" name="Art direction" rule="One concept. One display face. One accent. Room to breathe." />
        <div className="mt-14 grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <MaskedLines
              as="h2"
              onMount={false}
              lines={["Decide the", <><span className="misreg">look</span> before</>, "the motion."]}
              className="font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.04em]"
            />
            <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-muted-foreground text-pretty">
              Every site starts as a sentence a designer could say out loud. This one is
              <em className="text-foreground"> a risograph specimen book</em>: paper stock, blue-black ink,
              one fluorescent pink pass printed slightly off-register.
            </p>
          </div>

          <Stagger className="grid gap-4 sm:grid-cols-2 md:col-span-7">
            <StaggerItem className="min-w-0 rounded-3xl border border-border bg-card p-7 sm:col-span-2">
              <div className="flex items-start justify-between gap-6">
                <span className="font-display text-[clamp(6rem,14vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.045em]">
                  Aa
                </span>
                <dl className="space-y-3 text-right font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <div><dt>Display</dt><dd className="text-foreground">Bricolage Grotesque</dd></div>
                  <div><dt>Text</dt><dd className="text-foreground">Instrument Sans</dd></div>
                  <div><dt>Labels</dt><dd className="text-foreground">JetBrains Mono</dd></div>
                </dl>
              </div>
            </StaggerItem>

            <StaggerItem className="min-w-0 overflow-hidden rounded-3xl border border-border bg-card">
              <div className="h-28 bg-brand" />
              <div className="p-6 font-mono text-[11px] uppercase tracking-[0.14em]">
                <p className="text-foreground">--brand</p>
                <p className="mt-1 normal-case tracking-normal text-muted-foreground">oklch(0.64 0.25 358)</p>
                <p className="mt-4 normal-case tracking-normal text-muted-foreground">Under 10% of any screen.</p>
              </div>
            </StaggerItem>

            <StaggerItem className="min-w-0 rounded-3xl border border-border bg-card p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Spacing rhythm</p>
              <ul className="mt-5 space-y-3">
                {SPACING.map((s) => (
                  <li key={s.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <span className="h-2 rounded-full bg-foreground" style={{ width: `${Math.min(100, (s.px / 176) * 100)}%` }} />
                    <span className="font-mono text-[11px] text-muted-foreground">{s.px}px</span>
                    <span className="col-span-2 -mt-2 text-xs text-muted-foreground">{s.label}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
