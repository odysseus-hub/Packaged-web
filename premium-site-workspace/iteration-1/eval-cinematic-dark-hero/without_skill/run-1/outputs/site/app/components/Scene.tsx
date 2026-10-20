/**
 * A procedurally drawn "film still" — a lone figure on a desert road at dusk,
 * with a motel sign and power lines. Neutral, flat-ish colors so that grades
 * applied on top (CSS filters + blend overlays) read clearly.
 */
export default function Scene({ id, className = "" }: { id: string; className?: string }) {
  const g = (n: string) => `${id}-${n}`;
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Film still: a lone figure on a desert road at dusk beside a roadside motel sign"
    >
      <defs>
        <linearGradient id={g("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4a63" />
          <stop offset="0.45" stopColor="#8a8a92" />
          <stop offset="0.72" stopColor="#c9b59a" />
          <stop offset="1" stopColor="#e2cfae" />
        </linearGradient>
        <radialGradient id={g("sun")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4dc" />
          <stop offset="0.35" stopColor="#f3dcae" stopOpacity="0.9" />
          <stop offset="1" stopColor="#e8c79a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g("ground")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c5f52" />
          <stop offset="1" stopColor="#2a2622" />
        </linearGradient>
        <linearGradient id={g("road")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#59544f" />
          <stop offset="1" stopColor="#1d1c1b" />
        </linearGradient>
        <radialGradient id={g("neon")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f1c7b7" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f1c7b7" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill={`url(#${g("sky")})`} />
      <circle cx="980" cy="560" r="260" fill={`url(#${g("sun")})`} />
      <circle cx="980" cy="560" r="62" fill="#fbecd0" />

      {/* far mountains */}
      <path d="M0 560 L140 470 L260 520 L420 420 L560 500 L700 450 L860 530 L1020 470 L1180 520 L1340 430 L1480 500 L1600 460 L1600 640 L0 640 Z" fill="#7d7a80" opacity="0.75" />
      <path d="M0 600 L180 540 L330 580 L520 520 L700 590 L900 560 L1100 600 L1280 540 L1460 590 L1600 560 L1600 660 L0 660 Z" fill="#5d5552" />

      {/* ground */}
      <rect y="620" width="1600" height="280" fill={`url(#${g("ground")})`} />

      {/* road */}
      <path d="M940 620 L1000 620 L1500 900 L420 900 Z" fill={`url(#${g("road")})`} />
      <path d="M968 624 L972 624 L990 680 L982 680 Z M996 712 L1008 712 L1036 800 L1016 800 Z M1052 840 L1076 840 L1100 900 L1068 900 Z" fill="#e9dcc2" opacity="0.8" />

      {/* power lines */}
      <g stroke="#2a2522" strokeWidth="5" fill="none">
        <line x1="260" y1="300" x2="260" y2="700" />
        <line x1="210" y1="330" x2="310" y2="330" />
        <line x1="600" y1="430" x2="600" y2="640" strokeWidth="3" />
        <line x1="570" y1="446" x2="630" y2="446" strokeWidth="3" />
        <path d="M210 330 Q 400 420 570 446 M310 330 Q 450 410 630 446 M630 446 Q 790 500 920 560" strokeWidth="1.6" />
      </g>

      {/* motel sign */}
      <g transform="translate(60 20)">
        <circle cx="1340" cy="380" r="160" fill={`url(#${g("neon")})`} />
        <rect x="1330" y="430" width="14" height="260" fill="#1f1b19" />
        <rect x="1240" y="300" width="200" height="140" rx="10" fill="#2a2321" stroke="#e9b7a3" strokeWidth="5" />
        <text x="1340" y="362" textAnchor="middle" fontFamily="Georgia, serif" fontSize="40" fill="#f6d8c8" letterSpacing="6">MOTEL</text>
        <text x="1340" y="412" textAnchor="middle" fontFamily="Georgia, serif" fontSize="26" fill="#b9e3df" letterSpacing="8">VACANCY</text>
      </g>

      {/* figure */}
      <g fill="#141210">
        <ellipse cx="760" cy="800" rx="70" ry="10" opacity="0.5" />
        <circle cx="760" cy="612" r="20" />
        <path d="M736 640 Q760 628 784 640 L792 720 L780 722 L778 800 L764 800 L760 735 L756 800 L742 800 L740 722 L728 720 Z" />
        <path d="M784 646 L812 700 L804 704 L780 664 Z" />
      </g>
    </svg>
  );
}
