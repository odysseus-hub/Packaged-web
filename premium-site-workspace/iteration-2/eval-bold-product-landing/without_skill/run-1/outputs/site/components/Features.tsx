type Feature = { n: string; title: string; body: string; span?: string; tone?: "volt" | "ink" | "line" };

const features: Feature[] = [
  {
    n: "01",
    title: "Alerts in under 10 seconds",
    body: "Every failure is re-checked from three regions in parallel, then routed to Slack, PagerDuty, SMS or a webhook. Median failure-to-ping time: 6.8 seconds.",
    span: "lg:col-span-2",
    tone: "volt",
  },
  {
    n: "02",
    title: "p95 that means something",
    body: "p50, p95 and p99 per endpoint, per region, kept for 13 months. Spot the slow creep weeks before it becomes an outage.",
  },
  {
    n: "03",
    title: "Multi-step checks",
    body: "Log in, create an order, read it back. Assert on status, headers and JSON paths in one check.",
  },
  {
    n: "04",
    title: "Routing that respects sleep",
    body: "On-call rotations, escalation after 5 minutes unacked, quiet hours for the non-critical stuff.",
  },
  {
    n: "05",
    title: "Checks as code",
    body: "Keep checks in relay.config.ts next to your API. Preview them in pull requests, ship them on merge.",
  },
  {
    n: "06",
    title: "SSL & domain watch",
    span: "md:col-span-2 lg:col-span-1",
    body: "Warnings 30, 14 and 3 days before a certificate or domain quietly expires on a Saturday.",
  },
  {
    n: "07",
    title: "Status pages your users trust",
    body: "A public page on status.yourdomain.com that updates itself from incidents. Subscribers get email and RSS. Your support inbox gets a break.",
    span: "lg:col-span-2",
    tone: "ink",
  },
];

function StatusMock() {
  const rows = [
    { name: "API", state: "Operational" },
    { name: "Checkout", state: "Degraded" },
    { name: "Webhooks", state: "Operational" },
  ];
  return (
    <div className="mt-8 border border-paper/15 bg-ink-2 p-4 font-mono text-[12px]">
      <div className="flex items-center justify-between text-paper/50">
        <span>status.acme.dev</span>
        <span>updated 4s ago</span>
      </div>
      <ul className="mt-3 divide-y divide-paper/10">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center justify-between py-2">
            <span className="text-paper/90">{r.name}</span>
            <span className={`inline-flex items-center gap-2 ${r.state === "Degraded" ? "text-volt" : "text-paper/60"}`}>
              <span className={`h-2 w-2 ${r.state === "Degraded" ? "bg-volt" : "bg-paper/60"}`} />
              {r.state}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExpiryMock() {
  const rows = [
    { host: "api.acme.dev", kind: "SSL", days: 3 },
    { host: "acme.dev", kind: "Domain", days: 14 },
    { host: "hooks.acme.dev", kind: "SSL", days: 61 },
  ];
  return (
    <ul className="mt-auto space-y-2 pt-8 font-mono text-[12px]">
      {rows.map((r) => (
        <li key={r.host} className="flex items-center justify-between border border-paper/10 px-3 py-2.5">
          <span className="truncate text-paper/80">
            <span className="text-paper/40">{r.kind} · </span>
            {r.host}
          </span>
          <span className={`shrink-0 tabular ${r.days <= 3 ? "bg-volt px-1.5 font-bold text-ink" : "text-paper/60"}`}>
            {r.days}d
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Features() {
  return (
    <section id="features" className="bg-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
        <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="fade-up display text-[clamp(2.75rem,8vw,7.5rem)]">
            Everything.
            <br />
            <span className="text-paper/30">Nothing extra.</span>
          </h2>
          <p className="fade-up max-w-sm text-lg leading-relaxed text-paper/70">
            Seven things a small team actually needs to sleep at night. We left out the 200 that look good in a
            procurement spreadsheet.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-paper/15 bg-paper/15 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {features.map((f) => {
            const tone =
              f.tone === "volt" ? "bg-volt text-ink" : f.tone === "ink" ? "bg-ink-2 text-paper" : "bg-ink text-paper";
            const muted = f.tone === "volt" ? "text-ink/75" : "text-paper/65";
            return (
              <article
                key={f.n}
                className={`group relative flex flex-col p-6 sm:p-8 ${tone} ${f.span ?? ""} ${f.span?.startsWith("lg:") ? "md:col-span-2" : ""}`}
              >
                <span className={`font-mono text-sm ${f.tone === "volt" ? "text-ink" : "text-volt"}`}>{f.n}</span>
                <h3
                  className={`display-tight mt-6 ${
                    f.span?.startsWith("lg:") ? "text-[clamp(2rem,5vw,4.25rem)]" : "text-3xl sm:text-[2.1rem]"
                  }`}
                >
                  {f.title}
                </h3>
                <p className={`mt-4 max-w-xl leading-relaxed ${muted}`}>{f.body}</p>
                {f.n === "01" && (
                  <div className="mt-8 flex items-end gap-4">
                    <span className="display text-[clamp(4rem,10vw,8rem)] leading-none tabular">6.8s</span>
                    <span className="mb-3 font-mono text-xs uppercase tracking-wider text-ink/70">
                      median
                      <br />
                      failure → ping
                    </span>
                  </div>
                )}
                {f.n === "06" && <ExpiryMock />}
                {f.n === "07" && <StatusMock />}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
