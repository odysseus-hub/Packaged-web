"use client";

import AttractButton from "@/components/kokonutui/attract-button";
import CardStack, { type DeckCard } from "@/components/kokonutui/card-stack";
import DynamicText from "@/components/kokonutui/dynamic-text";
import GlitchText from "@/components/kokonutui/glitch-text";
import LiquidGauge from "@/components/kokonutui/liquid-gauge";
import SwooshText from "@/components/kokonutui/swoosh-text";
import { HoverLift } from "@/components/motion/hover";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { Container, PlateLabel } from "./plate";

function Cell({ name, hint, className, children }: { name: string; hint: string; className?: string; children: React.ReactNode }) {
  return (
    <StaggerItem className={cn("min-w-0", className)}>
      <HoverLift lift={-4} scale={1.005} className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card">
        <div className="flex flex-1 items-center justify-center p-6">{children}</div>
        <div className="flex items-baseline justify-between gap-3 border-t border-border px-6 py-4 font-mono text-[11px] uppercase tracking-[0.14em]">
          <span className="text-brand">{name}</span>
          <span className="text-right normal-case tracking-normal text-muted-foreground">{hint}</span>
        </div>
      </HoverLift>
    </StaggerItem>
  );
}

// Print-sheet artwork for the deck: two overprinted riso shapes per card.
function Art({ a, b }: { a: string; b: string }) {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="140" fill="#f6f1e8" />
      <circle cx="80" cy="70" r="52" fill={a} style={{ mixBlendMode: "multiply" }} />
      <rect x="92" y="28" width="84" height="84" rx="18" fill={b} style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}

const DECK: DeckCard[] = [
  { id: "a", title: "Pink over Blue", subtitle: "Two-pass overprint", art: <Art a="#ff48b0" b="#0078bf" />, description: "Where the inks cross, a violet no single drum carries.", specs: [{ label: "Passes", value: "2" }, { label: "Stock", value: "Cream 120gsm" }], price: "Plate A" },
  { id: "b", title: "Yellow over Teal", subtitle: "Riso green", art: <Art a="#ffe800" b="#00838a" />, description: "The green screens can't match: yellow pulled through teal.", specs: [{ label: "Passes", value: "2" }, { label: "Stock", value: "Natural 100gsm" }], price: "Plate B" },
  { id: "c", title: "Orange over Pink", subtitle: "Hot red", art: <Art a="#ff6c2f" b="#ff48b0" />, description: "Two warm inks stacked into a red that vibrates on paper.", specs: [{ label: "Passes", value: "2" }, { label: "Stock", value: "White 120gsm" }], price: "Plate C" },
];

export function PlateToybox() {
  return (
    <section id="toybox" className="section-pad bg-muted/60">
      <Container>
        <PlateLabel n="09" name="Toybox" rule="One signature interaction per page is the rule. This plate breaks it on purpose so you can try them all." />
        <h2 className="mt-14 max-w-[16ch] font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
          Kokonut, <span className="misreg">off the leash.</span>
        </h2>

        <Stagger className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
          <Cell name="attract-button" hint="Iron filings align to its field. Hover, then press." className="md:col-span-3">
            <div className="py-10">
              <AttractButton>Magnetize</AttractButton>
            </div>
          </Cell>
          <Cell name="swoosh-text" hint="Extruded type lit by your pointer. Press a letter." className="md:col-span-3">
            <SwooshText text="PRINT" as="p" accent="var(--brand)" className="font-display text-[clamp(3.5rem,8vw,6.5rem)] font-extrabold" />
          </Cell>
          <Cell name="card-stack" hint="Drag or flick the top card under the deck." className="md:col-span-2 md:row-span-2">
            <CardStack cards={DECK} accent="var(--brand)" actionLabel="Pull a proof" />
          </Cell>
          <Cell name="glitch-text" hint="Hover to shear the bands." className="md:col-span-4">
            <GlitchText text="MISREGISTERED" trigger="hover" intensity="strong" accent="var(--brand)" as="p" className="font-display text-[clamp(2rem,6vw,4.5rem)] font-extrabold tracking-[-0.03em]" />
          </Cell>
          <Cell name="liquid-gauge" hint="Drag the surface. It sloshes." className="md:col-span-2">
            <LiquidGauge defaultValue={68} label="Pink ink left" total={1000} unit="ml" />
          </Cell>
          <Cell name="dynamic-text" hint="Shared letters travel between words." className="md:col-span-2">
            <p className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">
              Make it <span className="text-brand"><DynamicText mode="morph" words={["arrive.", "settle.", "respond.", "breathe."]} interval={2400} /></span>
            </p>
          </Cell>
        </Stagger>
      </Container>
    </section>
  );
}
