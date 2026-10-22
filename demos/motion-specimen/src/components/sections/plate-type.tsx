"use client";

import DynamicText from "@/components/kokonutui/dynamic-text";
import { Reveal } from "@/components/motion/reveal";
import { Container, PlateLabel } from "./plate";

export function PlateType() {
  return (
    <section className="section-pad overflow-hidden">
      <Container>
        <PlateLabel n="04" name="Kinetic type" rule="One expressive line per page, at most. It accents the message; it never delays it." />
        <Reveal className="mt-16">
          <p className="font-display text-[clamp(3rem,10vw,9.5rem)] font-extrabold leading-[0.9] tracking-[-0.032em]">
            Make it
          </p>
          <div className="font-display text-[clamp(3rem,10vw,9.5rem)] font-extrabold leading-[0.95] tracking-[-0.032em] text-brand">
            <DynamicText mode="morph" words={["arrive.", "settle.", "respond.", "breathe."]} interval={2400} className="min-h-[1em]" />
          </div>
        </Reveal>
        <p className="mt-10 max-w-[52ch] text-muted-foreground">
          Kokonut&apos;s <code className="font-mono text-foreground">dynamic-text</code>: shared letters travel, old ones fall and new
          ones land. Under reduced motion it swaps words without the travel.
        </p>
      </Container>
    </section>
  );
}
