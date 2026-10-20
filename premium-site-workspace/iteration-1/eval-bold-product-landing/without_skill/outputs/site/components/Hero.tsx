export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-signal text-ink">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
        <p className="mb-6 inline-flex items-center gap-3 rounded-full border-2 border-ink px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] sm:text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-ink" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink" />
          </span>
          API monitoring for small dev teams
        </p>

        <h1 className="display text-[clamp(3.1rem,10.6vw,10.5rem)]">
          <span className="block">Your API</span>
          <span className="block">broke.</span>
          <span className="block text-bone [-webkit-text-stroke:2px_var(--color-ink)] sm:[-webkit-text-stroke:3px_var(--color-ink)]">
            You know
          </span>
          <span className="block">
            in <span className="whitespace-nowrap">&lt;10<span className="normal-case">s</span>.</span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="max-w-xl text-lg font-medium leading-snug sm:text-2xl">
              Relay hits your endpoints every 5 seconds from 3 regions, pages the right human before your
              customers notice, and turns every check into p95 dashboards and a public status page.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#signup"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider text-bone shadow-[6px_6px_0_0_var(--color-bone)] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--color-bone)]"
              >
                Start monitoring free
                <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
              <a
                href="#proof"
                className="inline-flex items-center justify-center rounded-full border-2 border-ink px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider transition hover:bg-ink hover:text-bone"
              >
                See the numbers
              </a>
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink/70">
              Free for 10 endpoints · No card · 90-second setup
            </p>
          </div>

          <div className="lg:col-span-6">
            <AlertCard />
          </div>
        </div>
      </div>

      <dl className="relative grid grid-cols-1 border-t-2 border-ink sm:grid-cols-3">
        {[
          { k: "7.2", v: "median time to alert" },
          { k: "p95", v: "latency per endpoint, per region" },
          { k: "1 click", v: "public status page on your domain" },
        ].map((s, i) => (
          <div
            key={s.v}
            className={`flex items-baseline gap-4 px-4 py-6 sm:block sm:px-8 sm:py-8 ${
              i > 0 ? "border-t-2 border-ink sm:border-l-2 sm:border-t-0" : ""
            }`}
          >
            <dt className="display whitespace-nowrap text-4xl sm:text-6xl lg:text-7xl">
              {s.k}
              {s.v.startsWith("median") && <span className="normal-case">s</span>}
            </dt>
            <dd className="mt-2 font-mono text-xs font-bold uppercase tracking-wider sm:text-sm">{s.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function AlertCard() {
  return (
    <div className="relative">
      <div className="absolute -right-2 -top-2 h-full w-full rounded-2xl bg-ink" aria-hidden="true" />
      <figure
        className="relative rotate-[-1.2deg] rounded-2xl border-2 border-ink bg-ink-2 p-5 font-mono text-[13px] text-bone shadow-2xl sm:p-7 sm:text-sm"
        aria-label="Example Relay alert"
      >
        <div className="flex items-center justify-between border-b border-ink-3 pb-4">
          <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-signal">
            <span className="h-2.5 w-2.5 rounded-full bg-signal" /> Relay alert · SEV-1
          </span>
          <span className="text-bone/50">03:12:07 UTC</span>
        </div>
        <div className="space-y-3 pt-4">
          <p className="text-xl font-bold text-bone sm:text-2xl">
            <span className="mr-2 rounded bg-signal px-1.5 py-0.5 text-sm text-ink">POST</span>
            /v1/checkout
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-bone/80">
            <span className="text-bone/45">status</span>
            <span className="text-signal">502 Bad Gateway</span>
            <span className="text-bone/45">regions</span>
            <span>iad ✕ · fra ✕ · sin ✕</span>
            <span className="text-bone/45">p95</span>
            <span>
              1,240ms <span className="text-signal">▲ 4.1×</span>
            </span>
            <span className="text-bone/45">routed to</span>
            <span>#oncall · PagerDuty</span>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-signal px-4 py-3 text-ink">
            <span className="text-xs font-bold uppercase tracking-wider">Detected in</span>
            <span className="display text-3xl sm:text-4xl">7.2<span className="normal-case">s</span></span>
          </div>
          <p className="pt-1 text-bone/50">
            &gt; status page updated: <span className="text-bone">status.acme.dev</span>
            <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-signal" aria-hidden="true" />
          </p>
        </div>
      </figure>
    </div>
  );
}
