"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RisoShader } from "@/components/fx/riso-shader";
import { MisregWord, ScrambleText, SplitChars } from "@/components/fx/text";
import { Magnetic } from "@/components/motion/hover";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { Container } from "./plate";

const H1 = "font-display text-[clamp(3.5rem,11.5vw,11.5rem)] font-extrabold leading-[0.9] tracking-[-0.03em]";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  // flowy layer: as the hero leaves, type lifts and fades faster than the field behind it.
  // Same elements and style objects in every mode; reduced motion resolves to resting values.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -160]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], reduce ? [1, 1] : [1, 0]);
  const fieldY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden pb-14 pt-32 sm:pb-20">
      <motion.div className="absolute inset-0" style={{ y: fieldY, scale: fieldScale }}>
        <RisoShader className="h-full w-full" />
      </motion.div>
      <motion.div style={{ y, opacity }} className="relative w-full">
        <Container>
          <ScrambleText
            as="p"
            text="PLATE 00 — A SPECIMEN OF MOTION, PRINTED IN TWO INKS"
            className="mb-8 inline-block rounded-full bg-background/85 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-foreground/80 backdrop-blur-sm"
          />
          <h1 aria-label="Motion, printed by the rules." className={H1}>
            <span className="block"><SplitChars text="Motion," /></span>
            <span className="block">
              <SplitChars text="printed" delay={0.18} />{" "}
              <MisregWord>
                <SplitChars text="by the" delay={0.34} />
              </MisregWord>
            </span>
            <span className="block"><SplitChars text="rules." delay={0.5} /></span>
          </h1>
          <Stagger onMount delay={0.75} className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <StaggerItem className="md:col-span-5">
              <p className="max-w-[46ch] rounded-2xl bg-background/70 p-4 text-lg leading-relaxed text-foreground/80 backdrop-blur-sm text-pretty -m-4">
                The premium-site skill, demonstrating itself. A GPU shader prints this field in two inks.
                Move your cursor through it, then scroll fast and watch the plates slip.
              </p>
            </StaggerItem>
            <StaggerItem className="flex flex-wrap items-center gap-5 md:col-span-7 md:justify-end">
              <Magnetic>
                <a
                  href="#art"
                  data-cursor="Go"
                  className="group relative inline-flex h-14 items-center overflow-hidden rounded-full bg-foreground px-7 font-medium text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none" />
                  <span className="relative">Read the plates ↓</span>
                </a>
              </Magnetic>
              <a
                href="#install"
                className="rounded-full bg-background/85 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.16em] underline decoration-brand decoration-2 underline-offset-[6px] backdrop-blur-sm hover:text-brand"
              >
                Skip to install
              </a>
            </StaggerItem>
          </Stagger>
        </Container>
      </motion.div>
    </section>
  );
}
