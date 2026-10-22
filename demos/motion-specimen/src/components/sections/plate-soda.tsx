"use client";

import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { type PointerEvent, useRef, useState } from "react";
import { FLAVORS } from "@/components/fx/soda/label";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import { PlateLabel } from "./plate";

// three.js stays out of the server bundle and off the critical path.
const CanScene = dynamic(() => import("@/components/fx/soda/can-scene").then((m) => m.CanScene), { ssr: false });

function Segment({ i, progress }: { i: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const fill = useTransform(progress, [i / 3, (i + 1) / 3], [0, 1]);
  return (
    <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-black/15">
      <motion.span className="absolute inset-0 origin-left rounded-full bg-black/80" style={{ scaleX: fill }} />
    </span>
  );
}

export function PlateSoda() {
  const section = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const active = useInView(section, { margin: "200px 0px 200px 0px" });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const [idx, setIdx] = useState(0);
  const drag = useRef({ vel: 0, offset: 0 });
  const ptr = useRef<{ x: number; t: number } | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const next = Math.min(FLAVORS.length - 1, Math.max(0, Math.floor(v * FLAVORS.length)));
    setIdx((cur) => (cur === next ? cur : next));
  });

  // Flavor chips: scroll to that third of the pinned section (or swap directly when reduced).
  function choose(i: number) {
    const el = section.current;
    if (reduce || !el) return setIdx(i);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / FLAVORS.length), behavior: "smooth" });
  }

  // Grab-to-spin with momentum. touch-action: pan-y keeps vertical page scroll on touch.
  function down(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    ptr.current = { x: e.clientX, t: performance.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    const p = ptr.current;
    if (!p) return;
    const now = performance.now();
    const dx = e.clientX - p.x;
    drag.current.offset += dx * 0.012;
    drag.current.vel = (dx * 0.012) / Math.max(0.008, (now - p.t) / 1000);
    ptr.current = { x: e.clientX, t: now };
  }
  function up() {
    ptr.current = null;
  }
  // Drag momentum decays like a can spun on a table; the 3D scene calls this every frame.
  const spin = (dt: number) => {
    const d = drag.current;
    if (!ptr.current) {
      d.offset += d.vel * dt;
      d.vel *= Math.pow(0.04, dt);
    }
    return d.offset;
  };

  const f = FLAVORS[idx];
  return (
    <section id="soda" ref={section} className={cn("relative", !reduce && "h-[400svh]")}>
      <div className={cn("relative h-svh overflow-hidden", !reduce && "sticky top-0")}>
        <motion.div aria-hidden className="absolute inset-0" animate={{ backgroundColor: f.stage }} transition={{ duration: 0.8 }} />

        {/* Giant flavor name behind the can */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={f.id}
              initial={{ y: "70%", opacity: 0, rotate: 4 }}
              animate={{ y: "0%", opacity: 1, rotate: 0 }}
              exit={{ y: "-70%", opacity: 0, rotate: -4 }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              className="whitespace-nowrap font-display text-[clamp(6rem,24vw,26rem)] font-extrabold uppercase leading-none tracking-[-0.05em]"
              style={{ color: f.paper }}
            >
              {f.name.split(" ")[1]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* The can */}
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          data-cursor="Spin"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          <CanScene progress={scrollYProgress} flavor={idx} spin={spin} reduce={reduce} active={active} />
        </div>

        {/* Copy */}
        <div className="pointer-events-none relative mx-auto flex h-full max-w-[1320px] flex-col justify-between px-5 pb-10 pt-24 text-[#1b1e29] sm:px-8 lg:px-12">
          <div className="max-w-md [&_*]:!border-black/15">
            <PlateLabel n="05b" name="Product, in the round" rule="Real 3D: three.js + React Three Fiber. Scroll spins it, flavors flip it, you can grab it." />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="pointer-events-auto max-w-sm rounded-3xl bg-white/70 p-6 backdrop-blur-md">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/60">Specimen Soda · No.{f.no}</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <h3 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.03em]">{f.name}</h3>
                  <p className="mt-2 hidden text-sm leading-relaxed text-black/70 sm:block">{f.note}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex gap-2">
                {FLAVORS.map((fl, i) => (
                  <button
                    key={fl.id}
                    onClick={() => choose(i)}
                    aria-label={`Show ${fl.name}`}
                    aria-pressed={i === idx}
                    className={cn(
                      "size-8 rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                      i === idx ? "scale-110 border-black" : "border-white"
                    )}
                    style={{ backgroundColor: fl.paper }}
                  />
                ))}
              </div>
              {!reduce ? (
                <div className="mt-5 flex gap-1.5">
                  {FLAVORS.map((fl, i) => (
                    <Segment key={fl.id} i={i} progress={scrollYProgress} />
                  ))}
                </div>
              ) : null}
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/60">
              {reduce ? "Still shot · reduced motion" : "Scroll to spin · drag to throw"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
