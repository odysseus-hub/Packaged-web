"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_PALETTE, PALETTES, type PaletteId, STORAGE_KEY } from "./palettes";

// The palette lives on <html data-palette>. Reading it through useSyncExternalStore keeps
// hydration safe (the server snapshot is the default) and keeps every reader in sync.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });
  return () => mo.disconnect();
}
const read = () => (document.documentElement.dataset.palette as PaletteId | undefined) ?? DEFAULT_PALETTE;

export function usePalette() {
  const id = useSyncExternalStore(subscribe, read, () => DEFAULT_PALETTE);
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

/**
 * Re-ink the page. With View Transitions, the new palette grows out of the click point as a
 * circle; without them (or under reduced motion) it swaps instantly.
 */
export function setPalette(id: PaletteId, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.palette = id;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vt = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }).startViewTransition;
  if (!vt || reduce) return apply();
  const x = origin?.x ?? innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  vt.call(document, apply).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
}
