export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <path d="M5 17h6l3-7 4 13 3-6h6" fill="none" stroke="var(--logo-fg, #ff4d00)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className="display-tight text-2xl tracking-tight">Relay</span>
    </span>
  );
}
