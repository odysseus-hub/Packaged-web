import { avg, downtimeByMonth, latencyWeeks, relayInstalledWeek, uptimeDays } from "@/lib/data";

const Y_MAX = 1000;

function LatencyChart() {
  const n = latencyWeeks.length;
  const x = (i: number) => (i / (n - 1)) * 100;
  const y = (v: number) => 100 - (v / Y_MAX) * 100;
  const line = latencyWeeks.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(3)},${y(d.p95).toFixed(3)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  const first = latencyWeeks[relayInstalledWeek - 1]; // the week Relay went on
  const last = latencyWeeks[n - 1];
  const drop = Math.round((1 - last.p95 / first.p95) * 100);
  const installX = x(relayInstalledWeek - 1);
  const ticks = [0, 250, 500, 750, 1000];

  return (
    <figure className="reveal min-w-0 border-2 border-ink bg-paper p-5 sm:p-8">
      <figcaption className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-ash">p95 latency · checkout-api · weekly</p>
          <p className="display mt-3 flex flex-wrap items-baseline text-[2.6rem] text-ink tabular sm:text-7xl">
            {first.p95}
            <span className="text-[0.45em]">ms</span>
            <span className="mx-2 text-volt sm:mx-4">→</span>
            {last.p95}
            <span className="text-[0.45em]">ms</span>
          </p>
        </div>
        <div className="bg-ink px-4 py-3 text-paper">
          <div className="display text-5xl text-volt tabular sm:text-6xl">−{drop}%</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-paper/60">in {n - relayInstalledWeek} weeks on Relay</div>
        </div>
      </figcaption>

      <div className="mt-8 flex gap-3">
        {/* y-axis labels */}
        <div className="relative w-12 shrink-0 font-mono text-[11px] text-ash tabular" aria-hidden="true">
          <div className="relative h-[260px] sm:h-[360px]">
            {ticks.map((t) => (
              <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${y(t)}%` }}>
                {t === 0 ? "0" : `${t}ms`}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="relative h-[260px] sm:h-[360px]">
            {ticks.map((t) => (
              <div
                key={t}
                className={`absolute inset-x-0 ${t === 0 ? "border-t-2 border-ink" : "border-t border-ink/10"}`}
                style={{ top: `${y(t)}%` }}
              />
            ))}

            {/* Relay installed marker */}
            <div className="absolute inset-y-0 border-l-2 border-dashed border-ink/60" style={{ left: `${installX}%` }}>
              <span className="absolute bottom-2 left-2 whitespace-nowrap bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-paper sm:text-[11px]">
                Relay on
              </span>
            </div>

            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              role="img"
              aria-label={`Weekly p95 latency falls from ${first.p95} milliseconds to ${last.p95} milliseconds over ${n} weeks.`}
            >
              <path d={area} fill="var(--color-volt)" opacity="0.14" />
              <path
                d={line}
                fill="none"
                stroke="var(--color-volt)"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {latencyWeeks.map((d, i) => (
              <span
                key={d.week}
                title={`Week ${d.week}: ${d.p95}ms`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-volt ${
                  i === relayInstalledWeek - 1 || i === n - 1 ? "h-4 w-4 bg-ink" : "h-2.5 w-2.5 bg-paper"
                }`}
                style={{ left: `${x(i)}%`, top: `${y(d.p95)}%` }}
              />
            ))}

            <span
              className="absolute -translate-x-full -translate-y-[170%] whitespace-nowrap font-mono text-xs font-bold text-ink tabular"
              style={{ left: "100%", top: `${y(last.p95)}%` }}
            >
              {last.p95}ms
            </span>

            <div className="curtain absolute inset-y-0 -right-1 left-0 bg-paper" aria-hidden="true" />
          </div>

          <div className="mt-3 flex justify-between font-mono text-[11px] text-ash tabular" aria-hidden="true">
            {latencyWeeks.map((d, i) => (
              <span key={d.week} className={`w-0 whitespace-nowrap text-center ${i % 3 === 0 || i === n - 1 ? "" : "invisible sm:visible"}`}>
                <span className="-ml-3 inline-block w-6">W{d.week}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

function UptimeChart() {
  const last30 = avg(uptimeDays.slice(-30));
  const first30 = avg(uptimeDays.slice(0, 30));
  const min = 97;
  const h = (v: number) => 8 + ((v - min) / (100 - min)) * 92;
  const incidents = uptimeDays.filter((v) => v < 100).length;

  return (
    <figure className="reveal flex h-full min-w-0 flex-col border-2 border-ink bg-ink p-5 text-paper sm:p-8">
      <figcaption>
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-paper/50">Daily uptime · last 90 days</p>
        <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
          <p className="display text-5xl text-paper tabular sm:text-7xl">{last30.toFixed(3)}%</p>
          <p className="pb-1 font-mono text-[12px] uppercase tracking-wider text-paper/60">
            last 30 days · up from <span className="text-volt">{first30.toFixed(2)}%</span>
          </p>
        </div>
      </figcaption>

      <div className="mt-8 flex flex-1 gap-3">
        <div className="relative w-10 shrink-0 font-mono text-[11px] text-paper/50 tabular" aria-hidden="true">
          <span className="absolute right-0 top-0 -translate-y-1/2">100%</span>
          <span className="absolute bottom-0 right-0 translate-y-1/2">97%</span>
        </div>
        <div className="relative min-h-[180px] flex-1">
          <div
            className="absolute inset-0 flex items-end gap-[2px] sm:gap-[3px]"
            role="img"
            aria-label={`${incidents} incident days in the last 90 days, none in the most recent two weeks.`}
          >
            {uptimeDays.map((v, i) => (
              <div
                key={i}
                title={`Day ${i + 1}: ${v}%`}
                className={`grow-bar flex-1 ${v < 100 ? "bg-volt" : "bg-paper/80"}`}
                style={{ height: `${h(v)}%`, ["--i" as string]: i }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="ml-[52px] mt-3 flex justify-between font-mono text-[11px] uppercase text-paper/50">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
      <p className="mt-6 flex items-center gap-2 text-sm text-paper/70">
        <span className="inline-block h-3 w-3 bg-volt" /> Incident day. Each one got a root cause, not a shrug.
      </p>
    </figure>
  );
}

function DowntimeChart() {
  const max = Math.max(...downtimeByMonth.map((d) => d.minutes));
  return (
    <figure className="reveal flex h-full min-w-0 flex-col border-2 border-ink bg-volt p-5 text-ink sm:p-8">
      <figcaption>
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink/70">Median downtime per team · minutes / month</p>
        <p className="display mt-3 text-5xl tabular sm:text-7xl">
          {downtimeByMonth[0].minutes}→{downtimeByMonth[downtimeByMonth.length - 1].minutes}
          <span className="text-[0.45em]">min</span>
        </p>
      </figcaption>
      <div
        className="mt-8 flex min-h-[180px] flex-1 items-end gap-2 border-b-2 border-ink sm:gap-3"
        role="img"
        aria-label={`Median monthly downtime falls from ${downtimeByMonth[0].minutes} minutes in month one to ${
          downtimeByMonth[downtimeByMonth.length - 1].minutes
        } minutes in month six.`}
      >
        {downtimeByMonth.map((d, i) => (
          <div key={d.label} className="flex h-full flex-1 flex-col justify-end">
            <span className="mb-1 text-center font-mono text-xs font-bold tabular">{d.minutes}</span>
            <div className="grow-bar bg-ink" style={{ height: `${(d.minutes / max) * 85}%`, ["--i" as string]: i * 12 }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 font-mono text-[11px] uppercase sm:gap-3">
        {downtimeByMonth.map((d) => (
          <span key={d.label} className="flex-1 text-center">
            {d.label}
          </span>
        ))}
      </div>
    </figure>
  );
}

export default function Proof() {
  return (
    <section id="proof" className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
        <div className="reveal grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="fade-up display text-[clamp(2.75rem,8vw,7.5rem)] lg:col-span-8">
            Faster alerts.
            <br />
            <span className="text-volt">Faster fixes.</span>
          </h2>
          <p className="fade-up max-w-md text-lg leading-relaxed text-ink/75 lg:col-span-4">
            When you hear about a slowdown in seconds instead of from a support ticket, you fix it
            while it’s small. Here’s what that looks like on one real-shaped checkout API.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:mt-16">
          <LatencyChart />
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <UptimeChart />
            </div>
            <div className="lg:col-span-2">
              <DowntimeChart />
            </div>
          </div>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-ash">
          Illustrative figures for a representative team. Your results depend on your code, not our marketing.
        </p>
      </div>
    </section>
  );
}
