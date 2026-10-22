const cols = [
  { title: "Product", links: ["Alerts", "Latency", "Status pages", "Pricing"] },
  { title: "Developers", links: ["Docs", "relay.yml reference", "API", "Changelog"] },
  { title: "Company", links: ["About", "Security", "Privacy", "Contact"] },
];

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border pt-20">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 md:grid-cols-12 lg:px-12">
        <p className="max-w-[30ch] text-base leading-relaxed text-muted-foreground md:col-span-5">
          Relay is API monitoring for small dev teams. Built by people who got paged by their
          customers one too many times.
        </p>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title} className="md:col-span-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{c.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#hero" className="text-base hover:text-brand focus-visible:text-brand focus-visible:outline-none">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-[1320px] flex-wrap justify-between gap-4 px-5 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:px-8 lg:px-12">
        <span>© 2026 Relay Labs</span>
        <span>All systems operational</span>
      </div>
      <p
        aria-hidden
        className="mt-6 -mb-[0.2em] select-none text-center font-display text-[31vw] uppercase leading-[0.8] text-foreground/[0.06]"
      >
        Relay
      </p>
    </footer>
  );
}
