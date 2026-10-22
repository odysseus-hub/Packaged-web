"use client";

import { motion } from "motion/react";
import MorphicNavbar from "@/components/kokonutui/morphic-navbar";
import { duration, easeOutExpo } from "@/components/motion/tokens";

const ITEMS = {
  "#art": { name: "Art" },
  "#timing": { name: "Timing" },
  "#proof": { name: "Proof" },
  "#scroll": { name: "Scroll" },
  "#install": { name: "Install" },
};

export function Nav() {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, ease: easeOutExpo, delay: 0.9 }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <a href="#top" className="font-display text-xl font-extrabold tracking-[-0.04em]">
          Specimen<span className="text-brand">.</span>
        </a>
        <MorphicNavbar items={ITEMS} defaultPath="#art" compact className="hidden md:flex" />
        <a
          href="#install"
          className="rounded-full bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-background transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Install
        </a>
      </div>
    </motion.header>
  );
}
