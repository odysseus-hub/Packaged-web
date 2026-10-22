"use client";

import { MotionConfig, motion, stagger as staggerFn } from "motion/react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { itemVariants } from "@/components/motion/reveal";
import { stagger } from "@/components/motion/tokens";
import { Container, PlateLabel } from "./plate";

const LINES = ["Content still arrives.", "It just doesn't travel.", "Nothing waits on an animation."];

export function PlateReduced() {
  const [reduced, setReduced] = useState(false);
  const [run, setRun] = useState(0);
  return (
    <section className="section-pad">
      <Container>
        <PlateLabel n="11" name="Reduced motion" rule='MotionConfig reducedMotion="user" drops transforms and keeps opacity. Custom loops are gated by hand.' />
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
              Accessibility is a <span className="misreg">design</span> decision.
            </h2>
            <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-muted-foreground text-pretty">
              Flip the switch to preview what someone with Reduced Motion turned on sees: the same cascade, minus the
              travel. On this page, the shader freezes to one printed frame, and the pin, parallax, flood, smooth scroll and marquee stand down.
            </p>
          </div>
          <div className="min-w-0 rounded-3xl border border-border bg-card p-6 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <label className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                <Switch
                  checked={reduced}
                  onCheckedChange={(v) => {
                    setReduced(v);
                    setRun((r) => r + 1);
                  }}
                  aria-label="Preview reduced motion"
                />
                Preview reduced motion: <span className="text-brand">{reduced ? "on" : "off"}</span>
              </label>
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="font-mono text-[11px] uppercase tracking-[0.16em] underline decoration-brand decoration-2 underline-offset-4 hover:text-brand"
              >
                ↻ Replay
              </button>
            </div>
            {/* Nested MotionConfig for this preview only. "user", not "never", when off: the switch can
                add reduction, but never force motion on someone whose OS asked for less. */}
            <MotionConfig reducedMotion={reduced ? "always" : "user"}>
              <motion.ul
                key={run}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={{ hidden: {}, show: { transition: { delayChildren: staggerFn(stagger.loose) } } }}
                className="mt-6 space-y-3"
              >
                {LINES.map((l) => (
                  <motion.li
                    key={l}
                    variants={{ ...itemVariants, hidden: { opacity: 0, y: 48 } }}
                    className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-tight tracking-[-0.03em]"
                  >
                    {l}
                  </motion.li>
                ))}
              </motion.ul>
            </MotionConfig>
          </div>
        </div>
      </Container>
    </section>
  );
}
