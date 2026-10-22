"use client";

import { motion } from "motion/react";
import { duration, easeOutExpo } from "@/components/motion/tokens";

const links = [
  { href: "#features", label: "Features" },
  { href: "#latency", label: "Proof" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, ease: easeOutExpo, delay: 0.9 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <a
          href="#hero"
          className="flex items-center gap-2.5 font-display text-2xl uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span aria-hidden className="size-3.5 bg-brand" />
          Relay
        </a>
        <div className="flex items-center gap-1 sm:gap-6">
          <ul className="hidden items-center gap-6 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative py-1 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
                >
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#signup"
            className="inline-flex h-10 items-center bg-brand px-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start free
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
