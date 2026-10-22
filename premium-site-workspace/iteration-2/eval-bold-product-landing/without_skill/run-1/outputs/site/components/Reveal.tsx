"use client";

import { useEffect } from "react";

/** Adds `.js` to <html> and marks `.reveal` blocks visible as they scroll into view. */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) return;
    let pending = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    root.classList.add("js");

    const show = (el: Element) => {
      el.classList.add("is-visible");
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && show(e.target)),
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    pending.forEach((el) => io.observe(el));

    // Safety net for fast scrolls and anchor jumps: anything already scrolled past is revealed.
    let raf = 0;
    const sweep = () => {
      raf = 0;
      const limit = window.innerHeight;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < limit) {
          show(el);
          return false;
        }
        return true;
      });
      if (!pending.length) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
