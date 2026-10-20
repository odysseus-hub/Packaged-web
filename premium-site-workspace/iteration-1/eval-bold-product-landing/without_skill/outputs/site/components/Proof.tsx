import { LatencyChart } from "./LatencyChart";

// 90 days of uptime; three short incidents.
const incidents: Record<number, number> = { 22: 99.71, 57: 99.86, 76: 99.93 };
const days = Array.from({ length: 90 }, (_, i) => incidents[i] ?? 100);
const avg = days.reduce((a, b) => a + b, 0) / days.length;

const detect = [
  { label: "Relay", sub: "5s checks, 2-region confirm", secs: 7.2, display: "7.2s", relay: true },
  { label: "1-minute pinger", sub: "60s interval + retry", secs: 95, display: "1m 35s" },
  { label: "5-minute pinger", sub: "free-tier uptime bots", secs: 390, display: "6m 30s" },
  { label: "Your customers", sub: "support ticket / angry tweet", secs: 2460, display: "41m" },
];
const LOG_MAX = Math.log10(3000);

export function Proof() {
  return (
    <section id="proof" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <SectionLabel n="01" label="Proof" />
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="display text-[clamp(2.6rem,7.2vw,7rem)] lg:col-span-8">
            Numbers that <span className="text-signal">don&apos;t whisper.</span>
          </h2>
          <p className="max-w-md text-lg leading-snug text-ink/75 lg:col-span-4">
            What happens when a five-person team stops guessing. Twelve weeks of a Relay workspace: slow
            endpoints found, fixed, and kept fixed.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Latency */}
          <article className="rounded-3xl border-2 border-ink bg-ink p-5 text-bone sm:p-8 lg:col-span-7">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-bone/55">p95 latency · all endpoints</p>
                <p className="display mt-3 text-5xl sm:text-6xl">
                  842<span className="text-2xl normal-case">ms</span> <span className="text-signal">→</span> 128
                  <span className="text-2xl normal-case">ms</span>
                </p>
              </div>
              <span className="display rounded-full bg-signal px-4 py-2 text-2xl text-ink sm:text-3xl">−85%</span>
            </header>
            <LatencyChart />
          </article>

          {/* Uptime */}
          <article className="flex flex-col rounded-3xl border-2 border-ink bg-signal p-5 sm:p-8 lg:col-span-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]">Uptime · last 90 days</p>
            <p className="display mt-3 text-[clamp(3.6rem,6.4vw,6.4rem)]">{avg.toFixed(2)}%</p>
            <p className="mt-3 max-w-sm font-medium leading-snug">
              Three incidents. Each caught in under 10 seconds, each fixed before most users noticed.
            </p>
            <div className="mt-auto pt-10">
              <div
                className="flex h-28 items-end gap-[2px] sm:h-36"
                role="img"
                aria-label={`Daily uptime for 90 days. Average ${avg.toFixed(3)} percent. Incidents on days 23, 58 and 77.`}
              >
                {days.map((d, i) => {
                  const h = 100 - (100 - d) * 220; // exaggerate dips for visibility
                  const bad = d < 100;
                  return (
                    <div
                      key={i}
                      title={`Day ${i + 1}: ${d.toFixed(2)}%`}
                      className={`flex-1 rounded-[1px] transition-opacity hover:opacity-60 ${bad ? "bg-bone" : "bg-ink"}`}
                      style={{ height: `${Math.max(h, 12)}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-wider">
                <span>90 days ago</span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-bone ring-1 ring-ink" /> incident
                </span>
                <span>Today</span>
              </div>
            </div>
          </article>

          {/* Time to detect */}
          <article className="rounded-3xl border-2 border-ink bg-bone-2 p-5 sm:p-8 lg:col-span-12">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink/60">
                  Time from outage to someone knowing
                </p>
                <h3 className="display-tight mt-3 text-3xl sm:text-5xl">Who finds out first?</h3>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink/55">Log scale · typical values</p>
            </div>
            <ul className="space-y-4">
              {detect.map((d) => {
                const w = (Math.log10(d.secs) / LOG_MAX) * 100;
                return (
                  <li key={d.label} className="grid items-center gap-2 sm:grid-cols-[220px_1fr] sm:gap-6">
                    <div>
                      <p className={`display-tight text-xl sm:text-2xl ${d.relay ? "text-signal" : ""}`}>{d.label}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-ink/55">{d.sub}</p>
                    </div>
                    <div className="relative h-12 rounded-lg bg-ink/5 sm:h-14">
                      <div
                        className={`flex h-full items-center justify-end rounded-lg pr-3 ${
                          d.relay ? "bg-signal text-ink" : "bg-ink text-bone"
                        }`}
                        style={{ width: `${w}%` }}
                      >
                        <span className="display text-xl normal-case sm:text-3xl">{d.display}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-ink/50">
          Charts show sample data from a demo workspace. Competitor timings are typical configurations, not benchmarks.
        </p>
      </div>
    </section>
  );
}

export function SectionLabel({ n, label, invert = false }: { n: string; label: string; invert?: boolean }) {
  return (
    <p
      className={`mb-8 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] ${
        invert ? "text-bone/70" : "text-ink/70"
      }`}
    >
      <span className="rounded-full bg-signal px-2.5 py-1 text-ink">{n}</span>
      {label}
      <span className={`h-[2px] flex-1 ${invert ? "bg-bone/20" : "bg-ink/15"}`} />
    </p>
  );
}
