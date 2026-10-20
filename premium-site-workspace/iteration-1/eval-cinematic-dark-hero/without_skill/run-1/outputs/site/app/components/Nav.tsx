"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#looks", label: "Looks" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Nocturne home">
          <span className="relative inline-block h-5 w-5 rounded-full bg-bone">
            <span className="absolute -right-1 -top-0.5 h-4 w-4 rounded-full bg-ink" />
          </span>
          <span className="font-display text-xl tracking-[0.18em] text-bone">NOCTURNE</span>
        </a>
        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[13px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-bone">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a
            href="#waitlist"
            className="hidden rounded-full border border-bone/25 px-5 py-2 text-[13px] uppercase tracking-[0.16em] text-bone transition hover:border-ember hover:text-ember sm:inline-block"
          >
            Join waitlist
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-bone transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-4 bg-bone transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-line px-5 pb-6 pt-2 md:hidden">
          {[...links, { href: "#waitlist", label: "Join waitlist" }].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm uppercase tracking-[0.18em] text-bone/80"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
