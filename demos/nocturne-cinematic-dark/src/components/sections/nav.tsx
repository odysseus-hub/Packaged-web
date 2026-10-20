"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { duration, easeOutExpo } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#looks", label: "Looks" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // The nav is the last thing the title sequence reveals.
      transition={{ duration: duration.base, ease: easeOutExpo, delay: 1.5 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500",
        scrolled
          ? "border-hairline bg-background/70 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="container-x flex h-16 items-center justify-between gap-6"
      >
        <a
          href="#hero"
          className="font-display text-2xl tracking-tight italic outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Nocturne
        </a>
        <ul className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="link-draw transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#waitlist"
          className="rounded-full border border-brand/50 px-4 py-1.5 font-mono text-[0.72rem] tracking-[0.14em] text-brand uppercase transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          Join waitlist
        </a>
      </nav>
    </motion.header>
  );
}
