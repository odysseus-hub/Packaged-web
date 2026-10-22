"use client";
import { useState } from "react";
import Scene from "./Scene";

type Look = {
  id: string;
  name: string;
  ref: string;
  note: string;
  filter: string;
  overlay: string;
  blend: React.CSSProperties["mixBlendMode"];
  swatch: string[];
};

const LOOKS: Look[] = [
  {
    id: "teal",
    name: "Midnight Teal",
    ref: "NCT-01",
    note: "Cool, dense shadows with skin held warm. The neo-noir default.",
    filter: "contrast(1.18) saturate(1.05) brightness(0.88)",
    overlay: "linear-gradient(180deg, rgba(10,70,80,.75) 0%, rgba(20,90,95,.45) 55%, rgba(230,140,70,.35) 100%)",
    blend: "soft-light",
    swatch: ["#0f3b44", "#2f7d80", "#e09a5c"],
  },
  {
    id: "print",
    name: "2383 Print",
    ref: "NCT-07",
    note: "Rich film-print emulation: rolled-off highlights, warm mids, inky blacks.",
    filter: "contrast(1.28) saturate(1.15) sepia(0.18) brightness(0.92)",
    overlay: "linear-gradient(180deg, rgba(60,30,20,.5), rgba(200,120,60,.35))",
    blend: "overlay",
    swatch: ["#2a1712", "#a8643b", "#f0c88e"],
  },
  {
    id: "bleach",
    name: "Bleach Bypass",
    ref: "NCT-12",
    note: "Silver retained in the print. Harsh, desaturated, unforgiving.",
    filter: "saturate(0.32) contrast(1.5) brightness(0.95)",
    overlay: "linear-gradient(180deg, rgba(120,130,135,.35), rgba(30,32,34,.4))",
    blend: "multiply",
    swatch: ["#1d1f21", "#6f7579", "#d5d6d2"],
  },
  {
    id: "neon",
    name: "Sodium & Neon",
    ref: "NCT-19",
    note: "Magenta skies over sodium-vapor streets. Made for night exteriors.",
    filter: "contrast(1.2) saturate(1.45) hue-rotate(-22deg) brightness(0.85)",
    overlay: "linear-gradient(180deg, rgba(120,30,140,.7), rgba(255,120,40,.35))",
    blend: "soft-light",
    swatch: ["#3a0f4a", "#c02f8c", "#ff8a3d"],
  },
  {
    id: "golden",
    name: "Magic Hour",
    ref: "NCT-23",
    note: "Low sun, honeyed halation, lifted blacks. The last ten minutes of daylight.",
    filter: "sepia(0.35) saturate(1.35) contrast(1.02) brightness(1.04)",
    overlay: "radial-gradient(circle at 62% 62%, rgba(255,200,120,.65), rgba(120,60,30,.25) 70%)",
    blend: "screen",
    swatch: ["#5b3218", "#d98b3e", "#ffd99a"],
  },
];

const LOG_FILTER = "contrast(0.68) saturate(0.5) brightness(1.12)";

export default function Looks() {
  const [active, setActive] = useState(0);
  const [split, setSplit] = useState(42);
  const look = LOOKS[active];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
      <figure className="relative min-w-0">
        <div className="relative aspect-[4/3] sm:aspect-[2.39/1] overflow-hidden rounded-sm bg-black ring-1 ring-white/10">
          {/* graded layer */}
          <div className="absolute inset-0 transition-[filter] duration-700" style={{ filter: look.filter }}>
            <Scene className="h-full w-full" />
            <div className="absolute inset-0 transition-opacity duration-700" style={{ background: look.overlay, mixBlendMode: look.blend }} />
          </div>
          {/* ungraded (log) layer, clipped */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)`, filter: LOG_FILTER }}>
            <Scene className="h-full w-full" />
          </div>
          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,.75)]" />
          {/* divider */}
          <div className="pointer-events-none absolute inset-y-0 w-px bg-bone/80" style={{ left: `${split}%` }}>
            <div className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-bone/70 bg-ink/60 backdrop-blur font-mono text-[10px] text-bone">
              ⟷
            </div>
          </div>
          <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] text-bone/80 uppercase">Log · Ungraded</span>
          <span className="absolute top-3 right-3 font-mono text-[10px] tracking-[0.2em] text-amber uppercase">{look.ref} · {look.name}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Compare ungraded and graded"
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
        <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.18em] text-smoke uppercase">
          <span>Drag to compare · Sc. 14 — Tk. 3</span>
          <span>2.39 : 1 · ARRI LogC4 source</span>
        </figcaption>
      </figure>

      <div>
        <ul className="divide-y divide-white/10 border-y border-white/10" role="tablist" aria-label="Looks">
          {LOOKS.map((l, i) => (
            <li key={l.id}>
              <button
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`group flex w-full items-center gap-4 py-4 text-left transition-colors ${i === active ? "text-bone" : "text-smoke hover:text-bone"}`}
              >
                <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
                  {l.swatch.map((c) => (
                    <span key={c} className="h-6 w-3" style={{ background: c }} />
                  ))}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-2xl leading-none">{l.name}</span>
                </span>
                <span className={`font-mono text-[10px] tracking-[0.2em] ${i === active ? "text-amber" : "text-smoke/60"}`}>{l.ref}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 min-h-[3lh] text-sm leading-relaxed text-smoke" aria-live="polite">{look.note}</p>
      </div>
    </div>
  );
}
