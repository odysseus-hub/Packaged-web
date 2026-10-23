"use client";

// Hydration-safe reduced-motion read. The server snapshot (false) is also used for the
// hydration render, so server and client HTML always match; React then re-renders with the
// real preference. Use this — not motion's useReducedMotion — whenever the value changes
// RENDERED OUTPUT (text, markup, which element exists). motion's hook returns the real value
// on the first client render, which mismatches the server HTML (React error #418).
// Using motion's hook only to pick animation targets/values passed to motion props is fine.
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
