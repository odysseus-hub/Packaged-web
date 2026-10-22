const feed = [
  { t: "14:02:07.112", tag: "FAIL", msg: "GET /v1/checkout → 503", meta: "fra · iad · sin" },
  { t: "14:02:07.130", tag: "OPEN", msg: "Incident #418 · checkout-api", meta: "3/3 regions" },
  { t: "14:02:13.884", tag: "SENT", msg: "Slack → #oncall-backend", meta: "+6.8s" },
  { t: "14:02:13.901", tag: "SENT", msg: "PagerDuty → @maya", meta: "+6.8s" },
  { t: "14:02:14.020", tag: "PAGE", msg: "status.acme.dev → Degraded", meta: "+6.9s" },
];

const stats = [
  { k: "<10s", v: "from failure to the right person's phone" },
  { k: "14", v: "check regions, every 30 seconds" },
  { k: "p95", v: "and p99 latency, tracked per endpoint" },
  { k: "1 min", v: "to a public status page on your domain" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* oversized background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f3f0e8 1px, transparent 1px), linear-gradient(to bottom, #f3f0e8 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
        <p className="mb-6 inline-flex items-center gap-3 border border-volt/40 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.18em] text-volt sm:mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-volt opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
          </span>
          API monitoring for small dev teams
        </p>

        <h1 className="display text-[clamp(2.6rem,11vw,10.75rem)]">
          <span className="block">Your API breaks.</span>
          <span className="block">You know in</span>
          <span className="block text-volt">
            under 10s<span className="text-paper">.</span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="max-w-xl text-lg leading-relaxed text-paper/80 sm:text-xl">
              Relay hammers your endpoints from 14 regions, every 30 seconds. When something
              snaps, the on-call dev gets pinged before your first customer hits refresh. No
              agents. No YAML. No 40-seat enterprise contract.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#signup"
                className="group inline-flex items-center justify-center gap-3 bg-volt px-7 py-4 text-base font-extrabold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
              >
                Start monitoring free
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#proof"
                className="inline-flex items-center justify-center border border-paper/30 px-7 py-4 text-base font-bold uppercase tracking-wide text-paper transition-colors hover:border-paper"
              >
                See the numbers
              </a>
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-paper/50">
              Free forever for 5 endpoints · No card required
            </p>
          </div>

          {/* Alert console */}
          <div className="lg:col-span-7">
            <div className="border border-paper/15 bg-ink-2 shadow-[12px_12px_0_0_var(--color-volt)]">
              <div className="flex items-center justify-between border-b border-paper/10 px-4 py-3 font-mono text-[12px] uppercase tracking-wider text-paper/60">
                <span>relay://incidents</span>
                <span className="inline-flex items-center gap-2 text-volt">
                  <span className="h-1.5 w-1.5 rounded-full bg-volt" /> live
                </span>
              </div>
              <ol className="divide-y divide-paper/5 font-mono text-[12.5px] sm:text-[13.5px]">
                {feed.map((r) => (
                  <li key={r.t + r.tag} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5">
                    <span className="hidden text-paper/40 tabular sm:inline">{r.t}</span>
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`shrink-0 px-1.5 py-0.5 text-[11px] font-bold ${
                          r.tag === "FAIL" || r.tag === "OPEN" ? "bg-volt text-ink" : "bg-paper/10 text-paper"
                        }`}
                      >
                        {r.tag}
                      </span>
                      <span className="truncate text-paper/90">{r.msg}</span>
                    </span>
                    <span className={`text-right text-paper/50 tabular ${r.meta.startsWith("+") ? "" : "hidden sm:inline"}`}>{r.meta}</span>
                  </li>
                ))}
                <li className="px-4 py-2.5 text-paper/40">
                  $ waiting for next check<span className="animate-blink">_</span>
                </li>
              </ol>
              <div className="flex flex-wrap items-end justify-between gap-4 border-t border-paper/10 px-4 py-5">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">Failure → human</div>
                  <div className="display mt-1 text-6xl text-volt tabular sm:text-7xl">6.8s</div>
                </div>
                <p className="max-w-[16rem] text-sm leading-snug text-paper/60">
                  Confirmed from 3 regions before anyone gets paged. Fast, and no 3&nbsp;a.m. false alarms.
                </p>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px border-y border-paper/15 bg-paper/15 lg:mt-20 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="bg-ink py-6 pr-4 [&:nth-child(even)]:pl-4 lg:[&:not(:first-child)]:pl-6">
              <dt className="display-tight text-4xl text-paper sm:text-5xl">{s.k}</dt>
              <dd className="mt-2 text-sm leading-snug text-paper/60">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
