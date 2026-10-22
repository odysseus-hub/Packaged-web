"use client";

import { motion, useScroll, useTransform } from "motion/react";
import MorphicNavbar from "@/components/kokonutui/morphic-navbar";
import { duration, easeOutExpo } from "@/components/motion/tokens";

const ITEMS = {
  "#art": { name: "Art" },
  "#layout": { name: "Layout" },
  "#physics": { name: "Physics" },
  "#ink": { name: "Ink room" },
  "#proof": { name: "Proof" },
  "#toybox": { name: "Toybox" },
};

export function Nav() {
  // A paper strip fades in behind the bar once the page moves, so it reads over any section
  // (including the ink room and the pink install plate). Opacity only.
  const { scrollY } = useScroll();
  const strip = useTransform(scrollY, [0, 80], [0, 1]);
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, ease: easeOutExpo, delay: 0.9 }}
    >
      <motion.div
        aria-hidden
        style={{ opacity: strip }}
        className="absolute inset-0 border-b border-[oklch(0.22_0.02_265/0.1)] bg-[oklch(0.965_0.012_85/0.82)] backdrop-blur-md"
      />
      <div className="relative mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
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
