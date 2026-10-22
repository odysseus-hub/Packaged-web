"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { duration, easeInOutQuart } from "@/components/motion/tokens";
import { GradedPlate, LOG, LOOKS, SceneDefs } from "./scene";

export function Looks() {
  const [active, setActive] = useState(LOOKS[0]);
  const [split, setSplit] = useState(50);
  const sliderId = useId();

  return (
    <section id="looks" className="section-pad relative border-t border-hairline bg-[oklch(0.115_0.006_60)]">
      <SceneDefs />
      <div className="container-x">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="slate text-brand">The looks</p>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em] text-balance">
              One plate. <em>Six</em> films it could belong to.
            </h2>
          </div>
          <p className="max-w-[44ch] text-lg leading-relaxed text-pretty text-muted-foreground lg:col-span-5">
            The same ungraded shot, through Nocturne&rsquo;s looks. Drag the split to compare
            against camera log; pick a look to regrade the frame.
          </p>
        </Reveal>

        <Reveal y={48} delay={0.1} className="mt-14">
          <figure data-flowy="product">
            <div className="relative aspect-[2.39/1] min-h-[220px] w-full overflow-hidden rounded-sm bg-black ring-1 ring-hairline has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-brand">
              {/* Graded layer, crossfading between looks */}
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={active.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: duration.base, ease: easeInOutQuart }}
                >
                  <GradedPlate look={active} className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
              {/* Log layer, clipped to the left of the split */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
              >
                <GradedPlate look={LOG} className="h-full w-full" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-px bg-foreground/80"
                style={{ left: `${split}%` }}
              >
                <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground/60 bg-black/60 font-mono text-[0.6rem] text-foreground backdrop-blur">
                  ⟷
                </span>
              </div>
              <span className="slate absolute top-4 left-4 rounded-sm bg-black/55 px-2 py-1 text-[0.6rem] text-foreground/80">
                Log
              </span>
              <span className="slate absolute top-4 right-4 rounded-sm bg-black/55 px-2 py-1 text-[0.6rem] text-brand">
                {active.name}
              </span>
              <label htmlFor={sliderId} className="sr-only">
                Compare camera log with the {active.name} grade
              </label>
              <input
                id={sliderId}
                type="range"
                min={0}
                max={100}
                value={split}
                onChange={(e) => setSplit(Number(e.target.value))}
                style={{ touchAction: "pan-y" }}
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />
            </div>
            <figcaption className="slate mt-4 flex flex-wrap justify-between gap-2 text-[0.65rem] text-muted-foreground">
              <span>Plate 04 · “Route 9, magic hour” · rendered in code</span>
              <span>{active.note}</span>
            </figcaption>
          </figure>
        </Reveal>

        <Stagger gap={0.06} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {LOOKS.map((look) => {
            const on = look.id === active.id;
            return (
              <StaggerItem key={look.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(look)}
                  className={`group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                    on ? "" : "opacity-70 hover:opacity-100"
                  } transition-opacity`}
                >
                  <GradedPlate
                    look={look}
                    className={`aspect-[2.39/1] w-full rounded-[2px] ring-1 transition-shadow ${
                      on ? "ring-brand" : "ring-hairline group-hover:ring-foreground/30"
                    }`}
                  />
                  <span className={`mt-3 block text-sm ${on ? "text-brand" : "text-foreground"}`}>
                    {look.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{look.note}</span>
                </button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
