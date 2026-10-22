import { Wordmark } from "./Logo";

const links = [
  { href: "#proof", label: "Proof" },
  { href: "#features", label: "Features" },
  { href: "#integrations", label: "Integrations" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10" aria-label="Main">
        <a href="#top" aria-label="Relay home">
          <Wordmark />
        </a>
        <ul className="hidden items-center gap-8 font-mono text-[13px] uppercase tracking-wider text-paper/70 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-volt">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#signup" className="hidden font-mono text-[13px] uppercase tracking-wider text-paper/70 hover:text-paper sm:inline">
            Log in
          </a>
          <a
            href="#signup"
            className="bg-volt px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
          >
            Start free
          </a>
        </div>
      </nav>
    </header>
  );
}
