const items = [
  "Alerts in under 10 seconds",
  "p95 dashboards",
  "Public status pages",
  "14 regions",
  "30-second checks",
  "No agents",
  "Zero false-alarm paging",
  "Set up in 4 minutes",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-volt py-4 text-ink" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {row.map((t, i) => (
          <span key={i} className="display-tight flex items-center gap-8 px-4 text-3xl sm:text-4xl">
            {t}
            <span className="inline-block h-3 w-3 rotate-45 bg-ink" />
          </span>
        ))}
      </div>
    </div>
  );
}
