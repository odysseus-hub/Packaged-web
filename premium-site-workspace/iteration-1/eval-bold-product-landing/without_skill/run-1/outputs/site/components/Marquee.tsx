const items = [
  "Alerts in under 10 seconds",
  "p95 latency dashboards",
  "Public status pages",
  "Checks every 5s from 3 regions",
  "Zero 3am false alarms",
];

export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="display-tight flex items-center whitespace-nowrap px-6 text-3xl sm:text-5xl">
          {t}
          <span className="ml-12 text-signal" aria-hidden="true">✱</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-5 text-bone sm:py-7">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
