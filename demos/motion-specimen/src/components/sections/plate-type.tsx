"use client";

import { ProximityType } from "@/components/fx/variable-type";
import { Container, PlateLabel } from "./plate";

export function PlateType() {
  return (
    <section id="type" className="section-pad overflow-hidden">
      <Container>
        <PlateLabel n="03b" name="Variable type" rule="Kinetic type through the font's own axes: weight and width swell toward the pointer, on springs." />
        <ProximityType
          lines={["Type that", "leans in."]}
          className="mt-12 font-display text-[clamp(4rem,14vw,13rem)] leading-[0.86] tracking-[-0.03em]"
        />
        <p className="mt-10 max-w-[52ch] text-muted-foreground">
          Bricolage Grotesque ships live <code className="font-mono text-foreground">wght</code> and{" "}
          <code className="font-mono text-foreground">wdth</code> axes. Each glyph reads its distance to your cursor
          (or a slow scanner, on touch) and springs between 320/78 and 800/100. One line, contained, never body copy.
        </p>
      </Container>
    </section>
  );
}
