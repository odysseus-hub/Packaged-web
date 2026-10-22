import { Wordmark } from "./Logo";

const cols = [
  { h: "Product", l: ["Uptime checks", "Latency dashboards", "Status pages", "Alert routing", "Changelog"] },
  { h: "Developers", l: ["Docs", "API reference", "CLI", "Checks as code", "System status"] },
  { h: "Company", l: ["About", "Blog", "Careers", "Security", "Contact"] },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark />
            <p className="mt-4 max-w-sm text-paper/60">
              API monitoring for small dev teams. Built by people who got paged by their customers one too many times.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {cols.map((c) => (
              <div key={c.h}>
                <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-volt">{c.h}</h3>
                <ul className="mt-4 space-y-2.5">
                  {c.l.map((x) => (
                    <li key={x}>
                      <a href="#top" className="text-paper/70 transition-colors hover:text-paper">
                        {x}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="display mt-16 select-none text-[clamp(4.5rem,23vw,21rem)] leading-[0.78] text-paper/[0.06]" aria-hidden="true">
          Relay
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-paper/10 pt-6 font-mono text-[12px] uppercase tracking-wider text-paper/50 sm:flex-row sm:justify-between">
          <span>© 2026 Relay Labs</span>
          <span>All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
