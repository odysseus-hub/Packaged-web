"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";
import { duration, easeOutExpo } from "@/components/motion/tokens";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#looks", label: "Looks" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/** Letterbox matte: closes in from the frame edge like a projector gate. */
function Matte({ side, children }: { side: "top" | "bottom"; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 1, ease: easeOutExpo }}
      style={{ originY: side === "top" ? 0 : 1 }}
      className={`absolute inset-x-0 z-20 h-[clamp(4rem,11svh,6.5rem)] bg-black ${
        side === "top" ? "top-0" : "bottom-0"
      }`}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  // flowy scroll layer: as the hero leaves, the light drifts slower than the page (depth) and the
  // title card lifts and dims like a credit clearing frame. Resting values under reduced motion.
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "28%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -90]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75], reduce ? [1, 1] : [1, 0.15]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[oklch(0.11_0.006_60)]"
    >
      {/* Background: a projector beam through haze. */}
      <motion.div
        data-flowy="hero-bg"
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ y: bgY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      >
        <BackgroundPaths
          className="absolute inset-0 h-full min-h-0 bg-transparent text-brand opacity-70 dark:bg-transparent dark:text-brand"
          count={39}
          angle={-7}
          spread={0.9}
          speed={0.45}
        >
          {null}
        </BackgroundPaths>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_55%,transparent,oklch(0.11_0.006_60/0.85)_75%)]" />
      </motion.div>

      <Matte side="top">
        <motion.nav
          aria-label="Primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, delay: 1.5 }}
          className="container-x flex h-full items-center justify-between gap-6"
        >
          <a href="#hero" className="font-display text-2xl tracking-tight text-foreground">
            Nocturne
          </a>
          <ul className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="draw-link transition-colors hover:text-foreground">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#waitlist"
            className="rounded-full border border-hairline px-4 py-2 text-sm text-foreground transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Join waitlist
          </a>
        </motion.nav>
      </Matte>

      <motion.div
        data-flowy="hero-title"
        style={{ y: titleY, opacity: titleOpacity }}
        className="container-x relative flex flex-1 flex-col justify-center pt-[clamp(6rem,16svh,9rem)] pb-[clamp(6rem,16svh,9rem)]">
        <Stagger onMount delay={0.35}>
          <StaggerItem>
            <p className="slate flex items-center gap-3 text-muted-foreground">
              <span className="inline-block h-px w-10 bg-brand" aria-hidden="true" />
              A Nocturne picture
            </p>
          </StaggerItem>
        </Stagger>

        <MaskedLines
          delay={0.5}
          lines={[
            "Every frame,",
            <>
              graded like <em className="text-brand">cinema</em>.
            </>,
          ]}
          className="mt-6 max-w-[14ch] font-display text-[clamp(3.4rem,9.5vw,10rem)] leading-[0.9] tracking-[-0.03em] text-balance"
        />

        <Stagger onMount delay={1.15} gap={0.12} className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <StaggerItem className="lg:col-span-5">
            <p className="max-w-[46ch] text-lg leading-relaxed text-pretty text-muted-foreground">
              Nocturne is an AI colorist for independent filmmakers. Drop in your log footage,
              choose a look, and every shot comes back matched and graded — in minutes, not a
              week in the suite.
            </p>
          </StaggerItem>
          <StaggerItem className="flex flex-wrap items-center gap-6 lg:col-span-4">
            <Magnetic>
              <a
                href="#waitlist"
                className="inline-flex h-12 items-center rounded-full bg-brand px-7 text-[0.95rem] font-medium text-brand-foreground transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Join the waitlist
              </a>
            </Magnetic>
            <a href="#looks" className="draw-link text-[0.95rem] text-foreground">
              See the looks
            </a>
          </StaggerItem>
          <StaggerItem className="hidden lg:col-span-3 lg:block">
            <dl className="slate grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-muted-foreground">
              <dt>Directed by</dt>
              <dd className="text-foreground">You</dd>
              <dt>Color by</dt>
              <dd className="text-foreground">Nocturne</dd>
              <dt>Format</dt>
              <dd className="text-foreground">Log → Rec.709</dd>
            </dl>
          </StaggerItem>
        </Stagger>
      </motion.div>

      <Matte side="bottom">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, delay: 1.6 }}
          className="container-x slate flex h-full items-center justify-between gap-4 text-[0.65rem] text-muted-foreground"
        >
          <span>Reel 01</span>
          <span className="hidden sm:inline">TC 00:00:00:01</span>
          <span className="hidden md:inline">2.39 : 1</span>
          <span>
            Scroll <span aria-hidden="true">↓</span>
          </span>
        </motion.div>
      </Matte>
    </section>
  );
}
