"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { spring } from "@/components/motion/tokens";
import { ScrambleText } from "@/components/fx/text";
import { Container, PlateLabel } from "./plate";

// Real riso drum inks (manufacturer swatch values). These are artwork, not UI tokens.
const INKS = [
  { id: "pink", name: "Fluorescent Pink", hex: "#ff48b0", temp: "warm", note: "The one this page is printed in. Glows under UV; prints louder than any screen pink." },
  { id: "yellow", name: "Yellow", hex: "#ffe800", temp: "warm", note: "Nearly invisible alone, electric over blue. Best as a second pass." },
  { id: "orange", name: "Orange", hex: "#ff6c2f", temp: "warm", note: "Warm, opaque, forgiving. Overprints pink into a hot red." },
  { id: "teal", name: "Teal", hex: "#00838a", temp: "cool", note: "Calm and dense. Carries body text better than black on cream stock." },
  { id: "blue", name: "Blue", hex: "#0078bf", temp: "cool", note: "The workhorse. Overprints yellow into a riso green no screen can fake." },
  { id: "purple", name: "Purple", hex: "#765ba7", temp: "cool", note: "Moody. Under pink it turns plum; under yellow, mud. Use with intent." },
] as const;

type Filter = "all" | "warm" | "cool";

export function PlateLayout() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shown = INKS.filter((i) => filter === "all" || i.temp === filter);
  const sel = INKS.find((i) => i.id === open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="layout" className="section-pad">
      <Container>
        <PlateLabel n="04" name="Layout & shared elements" rule="Things that move between states keep their identity. A swatch becomes the panel; it doesn't get replaced by it." />
        <div className="mt-14 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-[14ch] font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
            <ScrambleText text="A swatch book" /> <span className="misreg">that morphs.</span>
          </h2>
          <LayoutGroup id="filters">
            <div role="radiogroup" aria-label="Filter inks" className="flex rounded-full border border-border bg-card p-1">
              {(["all", "warm", "cool"] as Filter[]).map((f) => (
                <button
                  key={f}
                  role="radio"
                  aria-checked={filter === f}
                  onClick={() => setFilter(f)}
                  className="relative rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {filter === f ? (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-foreground" transition={spring.layout} />
                  ) : null}
                  <span className={`relative ${filter === f ? "text-background" : ""}`}>{f}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <LayoutGroup id="inks">
          <motion.ul layout className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((ink) => (
                <motion.li
                  key={ink.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={spring.layout}
                  className="min-w-0"
                >
                  <motion.button
                    layoutId={`ink-${ink.id}`}
                    onClick={() => setOpen(ink.id)}
                    data-cursor="Open"
                    style={{ borderRadius: 28, backgroundColor: ink.hex }}
                    className="group relative block aspect-[4/5] w-full overflow-hidden p-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground/40"
                    whileHover={{ y: -6 }}
                    transition={spring.layout}
                  >
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.35),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <motion.span layoutId={`ink-name-${ink.id}`} className="relative block font-display text-xl font-extrabold leading-tight tracking-[-0.02em] text-black/85 sm:text-2xl">
                      {ink.name}
                    </motion.span>
                    <span className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.14em] text-black/60">{ink.hex}</span>
                  </motion.button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          <AnimatePresence>
            {sel ? (
              <>
                <motion.div
                  key="scrim"
                  className="fixed inset-0 z-[90] bg-foreground/50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(null)}
                />
                <div className="pointer-events-none fixed inset-0 z-[91] grid place-items-center p-5">
                  <motion.div
                    layoutId={`ink-${sel.id}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={sel.name}
                    style={{ borderRadius: 36, backgroundColor: sel.hex }}
                    className="pointer-events-auto relative w-full max-w-2xl overflow-hidden p-8 sm:p-12"
                    transition={spring.layout}
                  >
                    <motion.span layoutId={`ink-name-${sel.id}`} className="block font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.035em] text-black/85">
                      {sel.name}
                    </motion.span>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.18 } }} exit={{ opacity: 0 }}>
                      <p className="mt-8 max-w-[40ch] text-lg leading-relaxed text-black/75">{sel.note}</p>
                      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-black/60">{sel.hex} · {sel.temp}</p>
                      <button
                        ref={closeRef}
                        onClick={() => setOpen(null)}
                        className="mt-10 rounded-full bg-black/85 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Close · Esc
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
              </>
            ) : null}
          </AnimatePresence>
        </LayoutGroup>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          layoutId shared elements · AnimatePresence popLayout reflow · Escape closes
        </p>
      </Container>
    </section>
  );
}
