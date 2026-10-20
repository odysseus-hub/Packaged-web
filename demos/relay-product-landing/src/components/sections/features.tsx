"use client";

import type { ReactNode } from "react";
import UptimeCard from "@/components/kokonutui/uptime-card";
import { HoverLift } from "@/components/motion/hover";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

function Cell({
  className,
  kicker,
  title,
  children,
}: {
  className?: string;
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <StaggerItem className={cn("min-w-0", className)}>
      <HoverLift
        lift={-5}
        scale={1.01}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-surface p-6 transition-colors hover:border-brand/50 sm:p-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{kicker}</p>
        <h3 className="mt-3 font-display text-3xl uppercase leading-[0.95] text-balance sm:text-4xl">{title}</h3>
        {children}
      </HoverLift>
    </StaggerItem>
  );
}

const timeline = [
  { t: "3:14:07.2", e: "Check fails · POST /v1/checkout · 503", r: "eu-west-1" },
  { t: "3:14:09.8", e: "Confirmed from a second region", r: "us-east-2" },
  { t: "3:14:11.4", e: "Quorum reached (3 of 14) — incident opened", r: "relay" },
  { t: "3:14:15.4", e: "Paged @maya via SMS + Slack #oncall", r: "8.2 s", hot: true },
];

const SPARK = [42, 44, 41, 47, 45, 52, 61, 58, 96, 132, 118, 71, 55, 49, 46, 44];

function Sparkline() {
  const w = 280;
  const h = 72;
  const max = Math.max(...SPARK);
  const pts = SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * w},${h - (v / max) * (h - 6) - 3}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-auto h-20 w-full" role="img" aria-label="p95 latency sparkline with a spike to 132 ms">
      <line x1="0" x2={w} y1={h - (80 / max) * (h - 6) - 3} y2={h - (80 / max) * (h - 6) - 3} stroke="currentColor" strokeOpacity="0.25" strokeDasharray="4 4" />
      <polyline points={pts} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// 14 probe regions; three lit = quorum.
const regions = ["iad", "ord", "sfo", "yyz", "gru", "lhr", "fra", "ams", "cdg", "sin", "nrt", "syd", "bom", "jnb"];
const lit = new Set(["lhr", "iad", "fra"]);

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-[clamp(6rem,12vw,11rem)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2
            id="features-title"
            className="font-display text-[clamp(2.75rem,6vw,6rem)] uppercase leading-[0.92] lg:col-span-8"
          >
            Three jobs. <span className="text-muted-foreground">Done loud.</span>
          </h2>
          <p className="max-w-[40ch] text-lg text-pretty text-muted-foreground lg:col-span-4">
            Alerting, latency, status pages. Everything a five-person team needs at 3 a.m., nothing it
            has to configure at 3 p.m.
          </p>
        </div>

        <Stagger className="mt-16 grid auto-rows-auto gap-4 md:grid-cols-6 lg:gap-5">
          {/* A — the hero feature */}
          <Cell
            className="md:col-span-6 lg:col-span-4 lg:row-span-2"
            kicker="01 · Alerts"
            title={
              <>
                Paged in <span className="text-brand">under 10 seconds</span>
              </>
            }
          >
            <ol className="mt-8 space-y-0 font-mono text-[13px]">
              {timeline.map((row) => (
                <li
                  key={row.t}
                  className={cn(
                    "grid grid-cols-[6.5rem_1fr] gap-4 border-t border-hairline py-3.5 sm:grid-cols-[7.5rem_1fr_auto]",
                    row.hot && "text-brand"
                  )}
                >
                  <span className="tabular-nums">{row.t}</span>
                  <span className={cn(!row.hot && "text-foreground/85")}>{row.e}</span>
                  <span className="hidden text-muted-foreground sm:block">{row.r}</span>
                </li>
              ))}
            </ol>
            <p className="mt-auto pt-8 max-w-[52ch] text-base text-pretty text-muted-foreground">
              10-second checks, multi-region confirmation and escalation policies that actually
              escalate. SMS, phone call, Slack, PagerDuty — whoever&rsquo;s on call, wherever they are.
            </p>
          </Cell>

          {/* B — p95 */}
          <Cell className="md:col-span-3 lg:col-span-2" kicker="02 · Latency" title="p95 dashboards">
            <p className="mt-3 text-sm text-muted-foreground">p50 / p95 / p99 per endpoint, per region. Budgets that page.</p>
            <Sparkline />
          </Cell>

          {/* C — quorum */}
          <Cell className="md:col-span-3 lg:col-span-2" kicker="03 · Quorum" title="No 3 a.m. false alarms">
            <ul className="mt-6 grid grid-cols-7 gap-1.5 font-mono text-[10px] uppercase" aria-label="Probe regions">
              {regions.map((r) => (
                <li
                  key={r}
                  className={cn(
                    "rounded-md border py-1.5 text-center",
                    lit.has(r) ? "border-brand bg-brand text-brand-foreground" : "border-hairline text-muted-foreground"
                  )}
                >
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">Three regions must agree before anyone wakes up.</p>
          </Cell>

          {/* D — status pages, flipped to the right on the second row-pair */}
          <Cell
            className="md:col-span-6 lg:col-span-4 lg:col-start-3 lg:row-start-3 lg:row-span-2"
            kicker="04 · Status pages"
            title={
              <>
                A public status page that <span className="text-brand">updates itself</span>
              </>
            }
          >
            <p className="mt-3 max-w-[52ch] text-sm text-muted-foreground">
              status.yourapp.com, on your domain, in your colors. Incidents open, update and resolve from
              the same alert that paged you. Hover the bars.
            </p>
            <div className="mt-8">
              <UptimeCard title="status.acme.dev" days={90} endDate="2026-10-19" className="max-w-none bg-background" />
            </div>
          </Cell>

          <Cell className="md:col-span-3 lg:col-span-2 lg:col-start-1" kicker="05 · On-call" title="Rotations that rotate">
            <p className="mt-3 text-sm text-muted-foreground">
              Weekly schedules, overrides, follow-the-sun. Synced to Google Calendar so nobody forgets it&rsquo;s their week.
            </p>
          </Cell>

          <Cell className="md:col-span-3 lg:col-span-2 lg:col-start-1" kicker="06 · Setup" title="Two minutes. One command.">
            <pre className="mt-5 overflow-x-auto rounded-xl border border-hairline bg-background p-4 font-mono text-[12px] leading-relaxed text-foreground/85">
              <code>
                <span className="text-brand">$</span> npx relay watch \{"\n"}
                {"  "}https://api.acme.dev
              </code>
            </pre>
          </Cell>
        </Stagger>
      </div>
    </section>
  );
}
