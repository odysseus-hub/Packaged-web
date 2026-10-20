import { Logo } from "./Logo";

const links = [
  { href: "#proof", label: "Proof" },
  { href: "#features", label: "Features" },
  { href: "#integrations", label: "Integrations" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-signal">
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8" aria-label="Main">
        <a href="#top" className="text-ink [--logo-fg:#ff4d00]" aria-label="Relay home">
          <Logo />
        </a>
        <ul className="hidden items-center gap-8 font-mono text-sm font-medium uppercase tracking-wider md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="underline-offset-4 hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#signup" className="hidden font-mono text-sm uppercase tracking-wider hover:underline sm:inline">
            Log in
          </a>
          <a
            href="#signup"
            className="rounded-full border-2 border-ink bg-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-bone transition hover:bg-bone hover:text-ink sm:px-5 sm:text-sm"
          >
            Start free →
          </a>
        </div>
      </nav>
    </header>
  );
}
