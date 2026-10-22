"use client";

import type { ReactNode } from "react";
import UptimeCard from "@/components/kokonutui/uptime-card";
import { HoverLift } from "@/components/motion/hover";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

function Cell({
  label,
  title,
  body,
  children,
  className = "",
  lift = true,
}: {
  label: string;
  title: string;
  body: string;
  children?: ReactNode;
  className?: string;
  lift?: boolean;
}) {
  const inner = (
    <article className="flex h-full flex-col border border-border bg-surface p-6 transition-colors duration-200 hover:border-foreground/25 sm:p-7">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <h3 className="mt-3 font-display text-3xl uppercase leading-[0.95] sm:text-4xl">{title}</h3>
      <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-pretty text-muted-foreground">{body}</p>
      {children ? <div className="mt-6 flex-1">{children}</div> : null}
    </article>
  );
  return (
    <StaggerItem className={`min-w-0 ${className}`}>
      {lift ? (
        <HoverLift lift={-4} scale={1} className="h-full">
          {inner}
        </HoverLift>
      ) : (
        inner
      )}
    </StaggerItem>
  );
}

const spark = [42, 44, 41, 47, 45, 52, 88, 61, 48, 46, 43, 45, 44, 42, 41, 43, 40, 42];

const regions = [
  ["us-east-1", "38 ms", true],
  ["us-west-2", "71 ms", true],
  ["eu-west-1", "112 ms", true],
  ["eu-central-1", "118 ms", true],
  ["ap-south-1", "203 ms", false],
  ["ap-southeast-2", "241 ms", true],
] as const;

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="border-t border-border py-[clamp(6rem,12vw,11rem)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            id="features-title"
            className="font-display text-[clamp(3rem,6.5vw,6.5rem)] uppercase leading-[0.88] text-balance lg:col-span-9"
          >
            Everything a six-person team needs. <span className="text-brand">Nothing</span> a 600-person
            team does.
          </h2>
          <p className="max-w-[40ch] text-lg leading-relaxed text-muted-foreground lg:col-span-3">
            One config file, one bill, zero agents to install. Set up in the time it takes your
            coffee to cool.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-6 lg:mt-20">
          <Cell
            lift={false}
            className="md:col-span-6 lg:col-span-4 lg:row-span-2"
            label="01 · Status pages"
            title="Public status pages, auto-updated"
            body="Every check feeds a status page on your own domain. Incidents open and resolve themselves; subscribers get email and RSS. Hover the bars."
          >
            <UptimeCard title="status.acme.dev" className="max-w-none" />
          </Cell>

          <Cell
            className="md:col-span-3 lg:col-span-2"
            label="02 · Alerts"
            title="Paged in under 10 s"
            body="Quorum from three regions before anyone wakes up. Then Slack, push, SMS and a voice call, in that order."
          >
            <ol className="space-y-2 font-mono text-xs uppercase tracking-[0.1em]">
              {[
                ["+0s", "Slack #incidents"],
                ["+0s", "Push · @maya"],
                ["+60s", "Voice call"],
                ["+120s", "Escalate · @dev-oncall"],
              ].map(([t, s], i) => (
                <li key={s} className="flex justify-between gap-3 border-b border-border pb-2">
                  <span>{s}</span>
                  <span className={i === 0 ? "text-brand" : "text-muted-foreground"}>{t}</span>
                </li>
              ))}
            </ol>
          </Cell>

          <Cell
            className="md:col-span-3 lg:col-span-2"
            label="03 · Latency"
            title="p50 · p95 · p99 per endpoint"
            body="Not an average that hides your slowest users. Percentiles per route, per region."
          >
            <div className="flex h-20 items-end gap-1" aria-hidden>
              {spark.map((v, i) => (
                <span
                  key={i}
                  className={v > 60 ? "flex-1 bg-brand" : "flex-1 bg-foreground/25"}
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
              p95 · 88 ms spike at 14:06 · <span className="text-brand">flagged</span>
            </p>
          </Cell>

          <Cell
            className="md:col-span-6 lg:col-span-3"
            label="04 · Checks as code"
            title="relay.yml lives in your repo"
            body="Review monitors in pull requests. Relay syncs on every push to main."
          >
            <pre className="overflow-x-auto border border-border bg-background p-4 font-mono text-[13px] leading-relaxed text-muted-foreground">
              <code>
                <span className="text-foreground">checks:</span>
                {"\n  - "}
                <span className="text-foreground">name:</span> checkout-api
                {"\n    "}
                <span className="text-foreground">url:</span> https://api.acme.dev/v1/health
                {"\n    "}
                <span className="text-foreground">every:</span> <span className="text-brand">10s</span>
                {"\n    "}
                <span className="text-foreground">expect:</span> {"{ status: 200, p95: < 300ms }"}
                {"\n    "}
                <span className="text-foreground">page:</span> on-call/backend
              </code>
            </pre>
          </Cell>

          <Cell
            className="md:col-span-6 lg:col-span-3"
            label="05 · Regions"
            title="Six regions, quorum confirmed"
            body="One flaky network path never pages you. Three regions have to agree."
          >
            <ul className="grid gap-x-6 gap-y-2 font-mono sm:grid-cols-2 text-xs uppercase tracking-[0.08em]">
              {regions.map(([r, ms, ok]) => (
                <li key={r} className="flex items-center justify-between gap-2 border-b border-border pb-2">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className={ok ? "size-1.5 bg-foreground/60" : "size-1.5 bg-brand"} />
                    {r}
                  </span>
                  <span className={ok ? "text-muted-foreground" : "text-brand"}>{ok ? ms : "timeout"}</span>
                </li>
              ))}
            </ul>
          </Cell>

          <Cell
            className="md:col-span-2"
            label="06 · On-call"
            title="Rotas that stay fair"
            body="Weekly or follow-the-sun, with overrides from Slack. Nobody takes three weekends in a row."
          />
          <Cell
            className="md:col-span-2"
            label="07 · Assertions"
            title="Assert on the body, not the ping"
            body="Check JSON fields, headers and response time. A 200 with an empty cart is still an outage."
          />
          <Cell
            className="md:col-span-2"
            label="08 · Expiry"
            title="Certs & domains"
            body="TLS and domain expiry warnings 30, 14 and 3 days out. Never again on a Saturday."
          />
        </Stagger>
      </div>
    </section>
  );
}
