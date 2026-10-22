/* A hand-drawn "film still": dusk highway, lone figure, parked car. Neutral-ish
   colors so the grades in the showcase have something to push around. */
export default function Scene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 680" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Film still: a figure beside a car on a desert highway at dusk">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b3550" />
          <stop offset="0.45" stopColor="#6c6a7c" />
          <stop offset="0.72" stopColor="#c99a78" />
          <stop offset="0.86" stopColor="#e9c18f" />
        </linearGradient>
        <radialGradient id="sun" cx="0.62" cy="0.62" r="0.35">
          <stop offset="0" stopColor="#fff1d2" stopOpacity="1" />
          <stop offset="0.12" stopColor="#ffd9a0" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#e7a77a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#e7a77a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c6250" />
          <stop offset="1" stopColor="#2a221e" />
        </linearGradient>
        <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d5552" />
          <stop offset="1" stopColor="#1d1b1c" />
        </linearGradient>
        <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff5a3c" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff5a3c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="680" fill="url(#sky)" />
      <rect width="1600" height="680" fill="url(#sun)" />
      {/* distant ranges */}
      <path d="M0 430 L120 392 L230 410 L340 360 L470 402 L600 372 L720 405 L860 350 L990 398 L1120 366 L1250 404 L1390 372 L1500 398 L1600 380 L1600 470 L0 470Z" fill="#8b7c86" opacity="0.75" />
      <path d="M0 455 L160 420 L300 448 L420 414 L560 452 L700 430 L820 458 L980 422 L1130 455 L1280 428 L1440 452 L1600 430 L1600 490 L0 490Z" fill="#6b5a5c" opacity="0.9" />
      {/* desert floor */}
      <rect y="470" width="1600" height="210" fill="url(#ground)" />
      {/* road */}
      <path d="M930 470 L960 470 L1380 680 L620 680 Z" fill="url(#road)" />
      <path d="M944 472 L948 472 L1010 680 L990 680 Z" fill="#e8d3a6" opacity="0.55" />
      {/* poles */}
      {[[300, 360, 1.0], [520, 420, 0.7], [690, 448, 0.45], [800, 461, 0.3]].map(([x, top, s], i) => (
        <g key={i} fill="#211b1a">
          <rect x={x} y={top} width={6 * s} height={(500 - top) * 1.0 + 40 * s} />
          <rect x={x - 22 * s} y={top + 8 * s} width={50 * s} height={4 * s} />
        </g>
      ))}
      <path d="M303 372 Q 420 420 522 428 Q 610 446 692 454 Q 750 460 802 466" stroke="#211b1a" strokeWidth="1.5" fill="none" />
      {/* car */}
      <g transform="translate(1040 540)">
        <ellipse cx="110" cy="78" rx="150" ry="14" fill="#000" opacity="0.45" />
        <path d="M0 50 L20 22 L70 6 L150 4 L200 24 L232 34 L236 64 L0 66 Z" fill="#2b2a2e" />
        <path d="M78 12 L146 10 L186 28 L64 30 Z" fill="#8e98a8" opacity="0.6" />
        <circle cx="52" cy="66" r="16" fill="#111" />
        <circle cx="190" cy="66" r="16" fill="#111" />
        <rect x="226" y="38" width="10" height="9" fill="#ff4a2a" />
        <circle cx="231" cy="42" r="34" fill="url(#lamp)" />
      </g>
      {/* figure */}
      <g transform="translate(905 498)" fill="#17120f">
        <circle cx="16" cy="8" r="9" />
        <path d="M4 20 Q16 14 28 20 L32 70 L26 72 L24 112 L18 112 L16 76 L14 112 L8 112 L6 72 L0 70 Z" />
      </g>
      <ellipse cx="921" cy="612" rx="40" ry="5" fill="#000" opacity="0.4" />
    </svg>
  );
}
