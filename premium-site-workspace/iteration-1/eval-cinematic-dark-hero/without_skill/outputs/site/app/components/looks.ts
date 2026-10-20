export type Look = {
  id: string;
  name: string;
  tag: string;
  description: string;
  filter: string;
  overlay: string;
  blend: "soft-light" | "overlay" | "color" | "multiply" | "screen" | "normal";
  swatch: string[];
};

export const LOG_FILTER = "saturate(0.45) contrast(0.68) brightness(1.12)";

export const looks: Look[] = [
  {
    id: "midnight",
    name: "Midnight Teal",
    tag: "Thriller · Neo-noir",
    description: "Crushed teal shadows, protected skin, a single warm practical punching through.",
    filter: "saturate(1.25) contrast(1.25) brightness(0.82) hue-rotate(-8deg)",
    overlay: "linear-gradient(180deg, rgba(10,70,90,0.75) 0%, rgba(0,40,55,0.55) 55%, rgba(255,130,60,0.35) 100%)",
    blend: "soft-light",
    swatch: ["#0b2a33", "#1f5a63", "#e8a25a"],
  },
  {
    id: "kodak",
    name: "Print '83",
    tag: "Film emulation",
    description: "Rich print-stock density, rolled-off highlights and that slightly green-gold midtone.",
    filter: "sepia(0.25) saturate(1.35) contrast(1.15) brightness(0.95)",
    overlay: "linear-gradient(180deg, rgba(60,90,70,0.45), rgba(220,150,70,0.45))",
    blend: "soft-light",
    swatch: ["#2e3a2b", "#b88a4a", "#f1d9a8"],
  },
  {
    id: "bleach",
    name: "Silver Retention",
    tag: "War · Drama",
    description: "Bleach-bypass grit. Desaturated, high-contrast, metallic highlights.",
    filter: "grayscale(0.65) contrast(1.55) brightness(0.9)",
    overlay: "linear-gradient(180deg, rgba(150,170,180,0.35), rgba(40,40,40,0.4))",
    blend: "overlay",
    swatch: ["#1a1c1e", "#7d858a", "#d9dcd8"],
  },
  {
    id: "neon",
    name: "Neon Vigil",
    tag: "Night exterior",
    description: "Magenta-cyan split tone for wet streets and sodium-vapor nights.",
    filter: "saturate(1.6) contrast(1.2) brightness(0.78) hue-rotate(-20deg)",
    overlay: "linear-gradient(135deg, rgba(255,40,140,0.55), rgba(20,200,220,0.5))",
    blend: "soft-light",
    swatch: ["#2a0b2e", "#d0337e", "#2fc3d3"],
  },
  {
    id: "golden",
    name: "Magic Hour",
    tag: "Romance · Coming-of-age",
    description: "Honeyed highlights, lifted blacks and a soft halation glow.",
    filter: "saturate(1.3) contrast(0.98) brightness(1.04) sepia(0.2)",
    overlay: "linear-gradient(180deg, rgba(255,170,90,0.55), rgba(255,110,60,0.35))",
    blend: "soft-light",
    swatch: ["#5a3420", "#e59a52", "#ffe0a8"],
  },
];
