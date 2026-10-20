"use client";

import { useState } from "react";

const data = [842, 815, 798, 702, 561, 437, 341, 288, 214, 176, 149, 128];
const events: Record<number, string> = {
  2: "Relay flags /search p95 spike",
  5: "N+1 query on /orders fixed",
  8: "Edge cache on /catalog",
};
const Y_MAX = 900;
const ticks = [0, 300, 600, 900];

const x = (i: number) => (i / (data.length - 1)) * 100;
const y = (v: number) => 100 - (v / Y_MAX) * 100;

export function LatencyChart() {
  const [active, setActive] = useState<number | null>(null);
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  const shown = active ?? data.length - 1;

  return (
    <div>
      <div className="relative ml-12 mr-2 h-[240px] sm:h-[300px]">
        {/* grid + y labels */}
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-dashed border-bone/15" style={{ top: `${y(t)}%` }}>
            <span className="absolute -left-12 -translate-y-1/2 font-mono text-[11px] text-bone/50">{t}ms</span>
          </div>
        ))}

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label="p95 latency fell from 842 milliseconds in week 1 to 128 milliseconds in week 12"
        >
          <defs>
            <linearGradient id="lat-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff4d00" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff4d00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#lat-fill)" />
          <path
            d={line}
            fill="none"
            stroke="#ff4d00"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* event markers */}
        {Object.entries(events).map(([i, label]) => {
          const idx = Number(i);
          return (
            <div
              key={i}
              className="pointer-events-none absolute bottom-0 border-l border-bone/30"
              style={{ left: `${x(idx)}%`, top: `${y(data[idx]) + 6}%` }}
            >
              <span className="absolute bottom-2 left-1.5 hidden w-32 font-mono text-[10px] uppercase leading-tight tracking-wide text-bone/55 sm:block">
                {label}
              </span>
            </div>
          );
        })}

        {/* active point */}
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-signal bg-ink transition-all duration-150"
          style={{ left: `${x(shown)}%`, top: `${y(data[shown])}%` }}
        />
        <div
          className="pointer-events-none absolute whitespace-nowrap rounded-md bg-bone px-2.5 py-1.5 font-mono text-xs font-bold text-ink transition-all duration-150"
          style={{
            left: `${x(shown)}%`,
            top: `${y(data[shown])}%`,
            transform: `translate(${shown > 8 ? "-100%" : shown < 2 ? "0" : "-50%"}, calc(-100% - 14px))`,
          }}
        >
          Wk {shown + 1} · {data[shown]}ms
        </div>

        {/* hover capture */}
        <div
          className="absolute inset-0 cursor-crosshair"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const f = (e.clientX - r.left) / r.width;
            setActive(Math.max(0, Math.min(data.length - 1, Math.round(f * (data.length - 1)))));
          }}
          onPointerLeave={() => setActive(null)}
        />
      </div>
      <div className="relative ml-12 mr-2 mt-3 h-4">
        {data.map((_, i) => (
          <span
            key={i}
            className={`absolute -translate-x-1/2 font-mono text-[11px] text-bone/50 ${i % 2 === 1 ? "hidden sm:inline" : ""}`}
            style={{ left: `${x(i)}%` }}
          >
            W{i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
