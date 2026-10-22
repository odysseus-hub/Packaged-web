"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LiveLine } from "@/components/charts/live-line";
import { LiveLineChart } from "@/components/charts/live-line-chart";
import { LiveXAxis } from "@/components/charts/live-x-axis";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";

type Pt = { time: number; value: number };

// Simulated feed: frame time (ms) of a page that respects the 16.7ms budget, with the odd
// hitch. Mounted client-side only (inside InViewMount), so there is no server snapshot to match.
function next(prev: number) {
  const spike = Math.random() < 0.06 ? 6 + Math.random() * 8 : 0;
  return Math.max(6, Math.min(26, prev + (11.5 - prev) * 0.25 + (Math.random() - 0.5) * 3 + spike));
}
function seed(): Pt[] {
  const now = Date.now() / 1000;
  let v = 11;
  return Array.from({ length: 40 }, (_, i) => ({ time: now - (40 - i) * 0.5, value: (v = next(v)) }));
}

export function LiveFeed() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.1 });
  const [data, setData] = useState<Pt[]>(seed);
  const value = data[data.length - 1]?.value ?? 11;

  useEffect(() => {
    if (reduce || !visible) return;
    const id = setInterval(() => {
      setData((d) => [...d.slice(-120), { time: Date.now() / 1000, value: next(d[d.length - 1]?.value ?? 11) }]);
    }, 500);
    return () => clearInterval(id);
  }, [reduce, visible]);

  return (
    <div ref={ref} className="h-56 w-full">
      <LiveLineChart data={data} value={value} window={18} exaggerate paused={reduce || !visible} margin={{ top: 16, right: 56, bottom: 28, left: 8 }}>
        <LiveLine dataKey="value" stroke="var(--brand)" fill formatValue={(v) => `${v.toFixed(1)}ms`} />
        <LiveXAxis />
      </LiveLineChart>
    </div>
  );
}
