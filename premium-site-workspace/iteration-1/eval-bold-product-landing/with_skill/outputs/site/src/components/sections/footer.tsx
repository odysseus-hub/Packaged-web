const cols = [
  { h: "Product", l: ["Alerts", "Latency", "Status pages", "On-call", "Pricing"] },
  { h: "Developers", l: ["Docs", "API", "CLI", "Changelog", "Status"] },
  { h: "Company", l: ["About", "Blog", "Careers", "Security", "Contact"] },
];

export function Footer() {
  return (
    <footer className="overflow-hidden pt-[clamp(5rem,10vw,8rem)]">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 md:grid-cols-12 lg:px-12">
        <p className="max-w-[32ch] text-muted-foreground md:col-span-4">
          API monitoring for small dev teams. Made by people who have been woken up by worse tools.
        </p>
        <nav aria-label="Footer" className="grid grid-cols-3 gap-6 md:col-span-7 md:col-start-6">
          {cols.map((c) => (
            <div key={c.h}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{c.h}</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {c.l.map((l) => (
                  <li key={l}>
                    <a href="#" className="transition-colors hover:text-brand">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1320px] flex-wrap justify-between gap-4 px-5 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:px-8 lg:px-12">
        <span>© 2026 Relay Labs, Inc.</span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2 rounded-full bg-brand" /> All systems operational
        </span>
      </div>
      <p
        aria-hidden
        className="mt-6 select-none text-center font-display text-[34vw] uppercase leading-[0.72] tracking-[-0.02em] text-foreground/[0.06] [margin-bottom:-0.12em]"
      >
        Relay
      </p>
    </footer>
  );
}
