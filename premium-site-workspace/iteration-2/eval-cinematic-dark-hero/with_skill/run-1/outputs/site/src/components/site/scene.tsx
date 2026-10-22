// A single dusk "plate" drawn in SVG, defined once and reused with <use>, so every look grades
// the exact same frame. The grades themselves are CSS filters + a blend layer — the page shows
// color grading by actually grading something.

export const SCENE_ID = "nocturne-plate";

export function SceneDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="np-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2440" />
          <stop offset="0.45" stopColor="#5a4a6a" />
          <stop offset="0.75" stopColor="#c97a52" />
          <stop offset="1" stopColor="#f0b878" />
        </linearGradient>
        <radialGradient id="np-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff2d2" />
          <stop offset="0.35" stopColor="#ffd08a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb060" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="np-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a4446" />
          <stop offset="1" stopColor="#1c1618" />
        </linearGradient>
        <linearGradient id="np-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2a2a" />
          <stop offset="1" stopColor="#120e10" />
        </linearGradient>
        <g id={SCENE_ID}>
          <rect width="1200" height="502" fill="url(#np-sky)" />
          {/* stars */}
          <g fill="#fff" opacity="0.6">
            <circle cx="120" cy="60" r="1.4" />
            <circle cx="300" cy="34" r="1" />
            <circle cx="520" cy="80" r="1.2" />
            <circle cx="980" cy="50" r="1.4" />
            <circle cx="1100" cy="110" r="1" />
            <circle cx="700" cy="30" r="1" />
          </g>
          <circle cx="790" cy="318" r="150" fill="url(#np-sun)" />
          <circle cx="790" cy="318" r="34" fill="#ffe7b8" />
          {/* far range */}
          <path
            d="M0 300 L90 262 L170 284 L260 236 L360 278 L450 250 L560 290 L660 262 L760 296 L880 248 L980 280 L1080 244 L1200 274 L1200 340 L0 340 Z"
            fill="#7a5568"
            opacity="0.75"
          />
          {/* mid hills */}
          <path
            d="M0 330 C140 300 240 318 360 326 C480 334 560 300 700 312 C840 324 960 296 1200 318 L1200 360 L0 360 Z"
            fill="#4a3240"
          />
          {/* ground */}
          <rect y="350" width="1200" height="152" fill="url(#np-ground)" />
          {/* road */}
          <path d="M585 350 L615 350 L900 502 L300 502 Z" fill="url(#np-road)" />
          <path
            d="M600 356 L600 372 M600 384 L600 404 M600 420 L600 450 M600 470 L600 502"
            stroke="#e8c27a"
            strokeWidth="4"
            opacity="0.8"
          />
          {/* telephone poles */}
          <g stroke="#140f12" strokeWidth="4">
            <path d="M470 352 L470 280" />
            <path d="M380 380 L380 230" />
            <path d="M230 430 L230 140" strokeWidth="7" />
            <path d="M454 290 L486 290 M360 246 L400 246 M200 168 L260 168" strokeWidth="3" />
          </g>
          <path d="M486 292 Q600 310 1200 260 M400 248 Q700 300 1200 240" stroke="#140f12" strokeWidth="1.2" fill="none" />
          {/* car + taillights */}
          <g transform="translate(640 392)">
            <path d="M0 22 L6 8 Q10 0 22 0 L58 0 Q70 0 74 8 L80 22 L80 34 L0 34 Z" fill="#0f0b0d" />
            <rect x="4" y="20" width="10" height="5" rx="1.5" fill="#ff3b30" />
            <rect x="66" y="20" width="10" height="5" rx="1.5" fill="#ff3b30" />
          </g>
          {/* figure */}
          <g transform="translate(520 380)" fill="#0d0a0c">
            <circle cx="10" cy="6" r="6" />
            <path d="M2 14 Q10 10 18 14 L20 44 L16 70 L12 70 L10 46 L8 70 L4 70 L0 44 Z" />
          </g>
        </g>
      </defs>
    </svg>
  );
}

export type Look = {
  id: string;
  name: string;
  note: string;
  filter: string;
  /** Blend layer: a color wash in the look's palette. */
  wash: string;
  blend: "soft-light" | "overlay" | "color" | "multiply" | "screen";
  washOpacity: number;
};

/** Ungraded log: flat, desaturated, lifted blacks. */
export const LOG: Look = {
  id: "log",
  name: "Camera log",
  note: "Ungraded",
  filter: "saturate(0.42) contrast(0.62) brightness(1.18)",
  wash: "linear-gradient(#8a8a8a, #8a8a8a)",
  blend: "soft-light",
  washOpacity: 0.2,
};

export const LOOKS: Look[] = [
  {
    id: "sodium",
    name: "Sodium Night",
    note: "Streetlight amber, crushed blacks",
    filter: "sepia(0.35) saturate(1.35) contrast(1.22) brightness(0.78) hue-rotate(-8deg)",
    wash: "linear-gradient(160deg, #ff9a3c, #3a1200)",
    blend: "soft-light",
    washOpacity: 0.7,
  },
  {
    id: "teal",
    name: "Teal Dusk",
    note: "Cool shadows, warm skin",
    filter: "saturate(1.15) contrast(1.15) brightness(0.92)",
    wash: "linear-gradient(180deg, #0e6b78 0%, #0e6b78 45%, #ff9d5c 100%)",
    blend: "soft-light",
    washOpacity: 0.85,
  },
  {
    id: "bleach",
    name: "Bleach Bypass",
    note: "Silver retained, low saturation",
    filter: "saturate(0.35) contrast(1.5) brightness(0.96)",
    wash: "linear-gradient(#9fb1b5, #2c3436)",
    blend: "overlay",
    washOpacity: 0.35,
  },
  {
    id: "print",
    name: "Print 2383",
    note: "Film-print density, rich reds",
    filter: "contrast(1.25) saturate(1.2) sepia(0.12) brightness(0.9)",
    wash: "linear-gradient(180deg, #1d3a44, #b8562e)",
    blend: "soft-light",
    washOpacity: 0.5,
  },
  {
    id: "super8",
    name: "Super 8 Summer",
    note: "Faded, warm, a little lifted",
    filter: "sepia(0.45) saturate(1.4) contrast(0.92) brightness(1.08)",
    wash: "linear-gradient(135deg, #ffd27a, #c4522e)",
    blend: "soft-light",
    washOpacity: 0.55,
  },
  {
    id: "noir",
    name: "Nuit Noire",
    note: "Monochrome, hard key",
    filter: "grayscale(1) contrast(1.6) brightness(0.88)",
    wash: "linear-gradient(#000, #000)",
    blend: "overlay",
    washOpacity: 0,
  },
];

/** The plate rendered under one grade. */
export function GradedPlate({ look, className }: { look: Look; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <svg
        viewBox="0 0 1200 502"
        preserveAspectRatio="xMidYMid slice"
        className="block h-full w-full"
        style={{ filter: look.filter }}
        aria-hidden="true"
      >
        <use href={`#${SCENE_ID}`} />
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: look.wash, mixBlendMode: look.blend, opacity: look.washOpacity }}
      />
    </div>
  );
}
