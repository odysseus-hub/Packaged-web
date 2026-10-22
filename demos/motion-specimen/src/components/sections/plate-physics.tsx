"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import CradleText from "@/components/kokonutui/cradle-text";
import { Container, PlateLabel } from "./plate";

type Sticker = { id: string; x: string; y: string; r: number; node: React.ReactNode };

const STICKERS: Sticker[] = [
  {
    id: "burst", x: "8%", y: "12%", r: -8,
    node: (
      <svg viewBox="0 0 120 120" className="size-28 drop-shadow-[0_8px_0_rgb(0_0_0/0.12)]">
        <path fill="var(--brand)" d="M60 4l9 18 19-9 2 21 21 1-9 19 18 10-18 10 9 19-21 1-2 21-19-9-9 18-9-18-19 9-2-21-21-1 9-19L2 60l18-10-9-19 21-1 2-21 19 9z" />
        <text x="60" y="68" textAnchor="middle" className="fill-white font-display text-[22px] font-extrabold">NEW</text>
      </svg>
    ),
  },
  {
    id: "ok", x: "62%", y: "8%", r: 10,
    node: (
      <div className="grid size-24 place-items-center rounded-full border-[3px] border-foreground bg-[#ffe800] font-display text-3xl font-extrabold shadow-[0_8px_0_rgb(0_0_0/0.12)]">OK</div>
    ),
  },
  {
    id: "label", x: "30%", y: "56%", r: -3,
    node: (
      <div className="rounded-xl bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-background shadow-[0_8px_0_rgb(0_0_0/0.12)]">
        Printed in 2 inks · Lot 0425
      </div>
    ),
  },
  {
    id: "arrow", x: "74%", y: "58%", r: 14,
    node: (
      <svg viewBox="0 0 140 70" className="w-36 drop-shadow-[0_8px_0_rgb(0_0_0/0.12)]">
        <path fill="#0078bf" d="M0 20h90V0l50 35-50 35V50H0z" />
      </svg>
    ),
  },
  {
    id: "smile", x: "44%", y: "18%", r: 4,
    node: (
      <svg viewBox="0 0 100 100" className="size-20 drop-shadow-[0_8px_0_rgb(0_0_0/0.12)]">
        <circle cx="50" cy="50" r="46" fill="#ff6c2f" />
        <circle cx="35" cy="40" r="6" fill="#1b1e29" />
        <circle cx="65" cy="40" r="6" fill="#1b1e29" />
        <path d="M28 60q22 22 44 0" stroke="#1b1e29" strokeWidth="7" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "stamp", x: "6%", y: "62%", r: -12,
    node: (
      <div className="rotate-0 rounded-md border-[3px] border-dashed border-brand px-4 py-2 font-display text-2xl font-extrabold uppercase text-brand">
        Proof
      </div>
    ),
  },
];

export function PlatePhysics() {
  const sheet = useRef<HTMLDivElement>(null);
  return (
    <section id="physics" className="section-pad bg-muted/60">
      <Container>
        <PlateLabel n="05" name="Physics" rule="Things you can grab should have weight: momentum when thrown, elastic at the edges, springy at rest." />
        <div className="mt-6">
          <CradleText text="Physics" intro className="justify-start" />
        </div>
        <p className="max-w-[52ch] text-muted-foreground">
          Knock a letter above: Kokonut&apos;s <code className="font-mono text-foreground">cradle-text</code> clacks through the
          word. Then throw the stickers around the sheet below: Motion <code className="font-mono text-foreground">drag</code> with
          momentum, elastic constraints and a bounce-back spring.
        </p>

        <div
          ref={sheet}
          className="relative mt-10 h-[460px] overflow-hidden rounded-[32px] border-2 border-dashed border-foreground/25 bg-card sm:h-[520px]"
        >
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle,oklch(0.22_0.02_265/0.12)_1px,transparent_1.5px)] [background-size:22px_22px]" />
          <p className="absolute bottom-5 right-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Sticker sheet · drag &amp; throw
          </p>
          {STICKERS.map((s) => (
            <motion.div
              key={s.id}
              data-cursor="Throw"
              drag
              dragConstraints={sheet}
              dragElastic={0.18}
              dragTransition={{ bounceStiffness: 320, bounceDamping: 16, power: 0.35 }}
              whileHover={{ scale: 1.05, rotate: s.r + 4 }}
              whileDrag={{ scale: 1.12, rotate: s.r - 6, zIndex: 10 }}
              initial={{ rotate: s.r }}
              className="absolute cursor-grab touch-none select-none active:cursor-grabbing"
              style={{ left: s.x, top: s.y }}
            >
              {s.node}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
