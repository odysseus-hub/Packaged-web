"use client";

import { motion } from "motion/react";
import { duration, easeOutExpo } from "@/components/motion/tokens";

const links = [
  { href: "#proof", label: "Proof" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, ease: easeOutExpo, delay: 1.0 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/75 backdrop-blur-md"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <a href="#hero" className="flex items-center gap-2.5 font-display text-2xl uppercase tracking-tight">
          <span aria-hidden className="siren-dot size-2.5 rounded-full bg-brand" />
          Relay
        </a>
        <div className="flex items-center gap-1 sm:gap-6">
          <ul className="hidden items-center gap-6 font-mono text-[13px] uppercase tracking-wider text-muted-foreground sm:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#cta"
            className="rounded-full bg-brand px-4 py-2 font-mono text-[13px] font-semibold uppercase tracking-wider text-brand-foreground transition-transform duration-200 hover:-translate-y-0.5"
          >
            Start free
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
