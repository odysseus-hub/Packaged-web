"use client";

import { motion } from "motion/react";
import { spring } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";
import { PALETTES } from "./palettes";
import { setPalette, usePalette } from "./use-palette";

/** Three overprinted ink dots. Click one to re-ink the whole page from that point. */
export function PaletteSwitcher({ className }: { className?: string }) {
  const current = usePalette();
  return (
    <div role="radiogroup" aria-label="Ink palette" className={cn("flex items-center gap-1.5 rounded-full border border-border bg-card/80 p-1", className)}>
      {PALETTES.map((p) => {
        const on = p.id === current.id;
        return (
          <button
            key={p.id}
            role="radio"
            aria-checked={on}
            aria-label={p.name}
            title={p.name}
            data-cursor="Re-ink"
            onClick={(e) => setPalette(p.id, { x: e.clientX, y: e.clientY })}
            className="relative grid size-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {on ? <motion.span layoutId="palette-ring" className="absolute inset-0 rounded-full border-2 border-foreground" transition={spring.layout} /> : null}
            <span className="relative block size-5">
              <span className="absolute left-0 top-0 size-3.5 rounded-full mix-blend-multiply" style={{ background: p.swatch[0] }} />
              <span className="absolute bottom-0 right-0 size-3.5 rounded-full mix-blend-multiply" style={{ background: p.swatch[1] }} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
