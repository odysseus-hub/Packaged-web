"use client";

import { useState } from "react";
import GradedFrame from "./GradedFrame";
import { LOG_FILTER, looks } from "./looks";

export default function Showcase() {
  const [active, setActive] = useState(0);
  const [split, setSplit] = useState(50);
  const look = looks[active];

  return (
    <div>
      {/* Before / after viewer */}
      <div className="relative overflow-hidden rounded-sm border border-line bg-black shadow-[0_40px_120px_-40px_rgba(232,162,90,0.25)]">
        <div className="relative aspect-[2.39/1] min-h-[220px] w-full select-none">
          <GradedFrame id="sc-graded" filter={look.filter} overlay={look.overlay} blend={look.blend} className="absolute inset-0" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
            <GradedFrame id="sc-log" filter={LOG_FILTER} className="absolute inset-0" />
          </div>

          {/* divider */}
          <div className="pointer-events-none absolute inset-y-0" style={{ left: `${split}%` }}>
            <div className="absolute inset-y-0 -translate-x-1/2 border-l border-bone/80" />
            <div className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/70 bg-ink/70 text-xs text-bone backdrop-blur">
              ⟷
            </div>
          </div>

          <span className="absolute left-3 top-3 rounded-sm bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/80">
            Camera LOG
          </span>
          <span className="absolute right-3 top-3 rounded-sm bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
            Nocturne · {look.name}
          </span>

          <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Drag to compare ungraded and graded footage"
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>

      {/* Look picker */}
      <div role="tablist" aria-label="Looks" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {looks.map((l, i) => {
          const on = i === active;
          return (
            <button
              key={l.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className={`group overflow-hidden rounded-sm border text-left transition ${
                on ? "border-ember/70 bg-ink-3" : "border-line bg-ink-2 hover:border-bone/25"
              } ${i === looks.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <div className="relative aspect-[2.39/1] overflow-hidden">
                <GradedFrame id={`thumb-${l.id}`} filter={l.filter} overlay={l.overlay} blend={l.blend} />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className={`font-display text-lg ${on ? "text-bone" : "text-bone/80"}`}>{l.name}</span>
                  <span className="flex gap-1">
                    {l.swatch.map((c) => (
                      <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{l.tag}</p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mute" aria-live="polite">
        <span className="text-bone">{look.name}.</span> {look.description}
      </p>
    </div>
  );
}
