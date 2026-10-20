"use client";

import { ArrowDownRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";
import { duration, easeOutExpo } from "@/components/motion/tokens";

const MATTE = { duration: duration.hero, ease: easeOutExpo };

export function Hero() {
  // flowy layer: scroll-linked exit. Background drifts slower than the page (depth),
  // the title card lifts and dims as the next reel arrives. Off under reduced motion.
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Background: one light source — a beam of projector light through haze. */}
      <motion.div
        data-flowy="hero-bg"
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={reduce ? undefined : { y: bgY }}
      >
        <BackgroundPaths
          className="absolute inset-0 min-h-0 bg-transparent text-brand dark:bg-transparent dark:text-brand"
          count={54}
          angle={-11}
          spread={0.9}
          speed={0.55}
        >
          {null}
        </BackgroundPaths>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_18%_8%,oklch(0.8_0.135_72/0.16),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_45%,transparent_40%,var(--background)_100%)]" />
      </motion.div>

      {/* The matte: 2.39:1 letterbox bars that open like the first frame of a film. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[7svh] origin-top bg-black/70"
        initial={{ scaleY: 7 }}
        animate={{ scaleY: 1 }}
        transition={MATTE}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[7svh] origin-bottom bg-black/70"
        initial={{ scaleY: 7 }}
        animate={{ scaleY: 1 }}
        transition={MATTE}
      />

      <motion.div
        data-flowy="hero-content"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="container-x relative z-20 flex flex-1 flex-col justify-end pt-32 pb-[calc(7svh+3.5rem)]"
      >
        <Stagger onMount delay={0.35} className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <StaggerItem>
            <p className="font-mono text-[0.72rem] tracking-[0.32em] text-brand uppercase">
              Nocturne Labs presents
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="font-mono text-[0.72rem] tracking-[0.2em] text-muted-foreground uppercase">
              Reel 01 · 00:00:00:01
            </p>
          </StaggerItem>
        </Stagger>

        <MaskedLines
          lines={[
            "Every frame,",
            <>
              graded <em className="text-brand">by night.</em>
            </>,
          ]}
          as="h1"
          delay={0.55}
          className="font-display text-[clamp(3.5rem,10.5vw,10.5rem)] leading-[0.9] tracking-[-0.035em] text-balance"
        />

        <Stagger
          onMount
          delay={1.05}
          className="mt-10 grid gap-10 md:grid-cols-12 md:items-end"
        >
          <StaggerItem className="md:col-span-6 lg:col-span-5">
            <p className="max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground sm:text-[1.15rem]">
              Nocturne is an AI colorist for indie filmmakers. It matches your
              shots, builds the look you describe, and renders a finished 4K
              timeline in under a minute&nbsp;&mdash; not overnight.
            </p>
          </StaggerItem>
          <StaggerItem className="flex flex-wrap items-center gap-4 md:col-span-6 md:justify-end lg:col-span-7">
            <Magnetic>
              <motion.a
                href="#waitlist"
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 text-[0.95rem] font-medium text-brand-foreground shadow-[0_0_60px_-10px_var(--brand)] outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Join the waitlist
              </motion.a>
            </Magnetic>
            <a
              href="#looks"
              className="group inline-flex h-12 items-center gap-2 px-2 text-[0.95rem] text-foreground/80 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span className="link-draw">See the looks</span>
              <ArrowDownRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
          </StaggerItem>
        </Stagger>
      </motion.div>

      {/* End-of-frame credits, sitting inside the bottom matte. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 flex h-[7svh] items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="container-x flex items-center justify-between gap-4 font-mono text-[0.65rem] tracking-[0.22em] text-muted-foreground/80 uppercase">
          <span>Directed by you</span>
          <span className="hidden sm:inline">Graded by Nocturne</span>
          <span><span className="hidden sm:inline">Early access · </span>Winter 2026</span>
        </div>
      </motion.div>
    </section>
  );
}
