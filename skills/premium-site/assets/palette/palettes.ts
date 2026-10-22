// Palette sets (example values from the Motion Specimen demo: replace with your own). CSS (globals.css, [data-palette]) is the source of truth for rendering;
// this mirror exists for labels and swatches in the UI.
export type PaletteId = "tangerine" | "riso-pink" | "fern";

export const PALETTES: { id: PaletteId; name: string; paper: string; ink: string; brand: string; swatch: [string, string] }[] = [
  { id: "tangerine", name: "Tangerine × Federal Blue", paper: "oklch(0.962 0.018 78)", ink: "oklch(0.27 0.09 262)", brand: "oklch(0.64 0.2 38)", swatch: ["#eb5116", "#0c2352"] },
  { id: "riso-pink", name: "Fluoro Pink × Blue-Black", paper: "oklch(0.965 0.012 85)", ink: "oklch(0.22 0.02 265)", brand: "oklch(0.64 0.25 358)", swatch: ["#f61c8b", "#161b24"] },
  { id: "fern", name: "Riso Green × Aubergine", paper: "oklch(0.962 0.016 110)", ink: "oklch(0.26 0.09 300)", brand: "oklch(0.58 0.15 152)", swatch: ["#0a924b", "#2c1648"] },
];

export const DEFAULT_PALETTE: PaletteId = "tangerine";
export const STORAGE_KEY = "site-palette";

/** Runs before paint (inline in <head>) so a returning visitor never sees the default flash. */
export const PALETTE_BOOT = `try{var p=localStorage.getItem("${STORAGE_KEY}");if(p)document.documentElement.dataset.palette=p}catch(e){}`;
