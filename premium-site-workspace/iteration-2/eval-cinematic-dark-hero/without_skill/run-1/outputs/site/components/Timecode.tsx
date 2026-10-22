"use client";
import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Timecode() {
  const [f, setF] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      setF(Math.floor(((t - start) / 1000) * 24));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const frames = f % 24;
  const s = Math.floor(f / 24);
  return (
    <span className="tabular-nums" aria-hidden>
      01:{pad(Math.floor(s / 60) % 60)}:{pad(s % 60)}:{pad(frames)}
    </span>
  );
}
