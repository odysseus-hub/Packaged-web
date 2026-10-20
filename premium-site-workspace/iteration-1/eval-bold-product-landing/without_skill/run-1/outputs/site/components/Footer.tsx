import { Logo } from "./Logo";

const cols = [
  { h: "Product", l: ["Alerting", "Dashboards", "Status pages", "Pricing", "Changelog"] },
  { h: "Developers", l: ["Docs", "API reference", "CLI", "Terraform", "Status"] },
  { h: "Company", l: ["About", "Blog", "Careers", "Security", "Contact"] },
];

export function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="text-signal [--logo-fg:#0a0a0a]" />
          <p className="mt-4 max-w-sm text-bone/60">
            API monitoring for small dev teams. Built by people who have been paged at 3am for the wrong reason.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-bone/20 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-bone/70">
            <span className="h-2 w-2 rounded-full bg-signal" /> All systems operational
          </p>
        </div>
        {cols.map((c) => (
          <nav key={c.h} className="md:col-span-2" aria-label={c.h}>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-signal">{c.h}</p>
            <ul className="mt-4 space-y-2.5">
              {c.l.map((l) => (
                <li key={l}>
                  <a href="#top" className="text-bone/70 hover:text-bone">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="overflow-hidden border-t border-bone/10">
        <p className="display select-none whitespace-nowrap px-4 pt-6 text-[22vw] leading-[0.75] text-ink-2 sm:px-8" aria-hidden="true">
          RELAY
        </p>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 px-4 py-6 font-mono text-xs uppercase tracking-wider text-bone/40 sm:flex-row sm:px-8">
        <span>© 2026 Relay Labs</span>
        <span>Privacy · Terms · DPA</span>
      </div>
    </footer>
  );
}
