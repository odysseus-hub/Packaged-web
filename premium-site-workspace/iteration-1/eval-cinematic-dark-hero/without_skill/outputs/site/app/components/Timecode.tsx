"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Timecode() {
  const [frames, setFrames] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      setFrames(Math.floor(((t - start) / 1000) * 24));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const f = frames % 24;
  const s = Math.floor(frames / 24) % 60;
  const m = Math.floor(frames / 1440) % 60;
  return (
    <span className="tabular-nums" aria-hidden>
      01:{pad(m)}:{pad(s)}:{pad(f)}
    </span>
  );
}
