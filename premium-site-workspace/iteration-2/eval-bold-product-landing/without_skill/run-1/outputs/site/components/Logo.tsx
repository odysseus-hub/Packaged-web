export function RelayMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" fill="currentColor" />
      <path d="M7 22 L13 10 L19 22 L25 10" fill="none" stroke="var(--color-ink)" strokeWidth="3.4" strokeLinejoin="miter" strokeLinecap="square" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <RelayMark className="h-7 w-7 text-volt" />
      <span className="display-tight text-2xl tracking-tight">Relay</span>
    </span>
  );
}
