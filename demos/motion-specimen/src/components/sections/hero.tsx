"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import DotField from "@/components/kokonutui/dot-field";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { Container } from "./plate";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  // flowy layer: as the hero leaves, the type drifts up and fades. Same element and style
  // object in every mode; under reduced motion the values resolve to their resting state.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [1, 0]);

  return (
    <section id="top" ref={ref} className="relative">
      <DotField
        className="min-h-[100svh] items-end bg-transparent pb-14 pt-32 text-[var(--brand)] sm:pb-20"
        spacing={14}
        seed={11}
      >
        <motion.div style={{ y, opacity }} className="relative w-full text-foreground">
          <Container>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-brand">Plate 00</span>&nbsp;&nbsp;A specimen of motion, printed in two inks
            </p>
            <MaskedLines
              as="h1"
              lines={[
                "Motion,",
                <>
                  printed <span className="misreg">by the</span>
                </>,
                "rules.",
              ]}
              className="font-display text-[clamp(3.5rem,11vw,11rem)] font-extrabold leading-[0.9] tracking-[-0.03em]"
            />
            <Stagger onMount delay={0.55} className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
              <StaggerItem className="md:col-span-5">
                <p className="max-w-[46ch] text-lg leading-relaxed text-muted-foreground text-pretty">
                  This page is the premium-site skill, demonstrating itself. Every plate below runs the
                  rule it describes: the art direction, the stagger, the spring, the chart, the scroll and
                  the reduced-motion fallback.
                </p>
              </StaggerItem>
              <StaggerItem className="flex flex-wrap items-center gap-5 md:col-span-7 md:justify-end">
                <Magnetic>
                  <a
                    href="#art"
                    className="inline-flex h-14 items-center rounded-full bg-brand px-7 font-medium text-brand-foreground shadow-[0_10px_30px_-10px_var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
                  >
                    Read the plates ↓
                  </a>
                </Magnetic>
                <a
                  href="#install"
                  className="font-mono text-[12px] uppercase tracking-[0.16em] underline decoration-brand decoration-2 underline-offset-[6px] hover:text-brand"
                >
                  Skip to install
                </a>
              </StaggerItem>
            </Stagger>
            <p className="mt-16 hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:block">
              Fig. 1: halftone field (Kokonut dot-field). Drag across it fast, or click.
            </p>
          </Container>
        </motion.div>
      </DotField>
    </section>
  );
}
