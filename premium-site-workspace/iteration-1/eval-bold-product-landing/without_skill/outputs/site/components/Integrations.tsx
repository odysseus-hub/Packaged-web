import { SectionLabel } from "./Proof";

const tools = [
  "Slack",
  "PagerDuty",
  "Discord",
  "GitHub",
  "Microsoft Teams",
  "Opsgenie",
  "Linear",
  "Vercel",
  "Grafana",
  "Datadog",
  "Webhooks",
  "Twilio SMS",
];

export function Integrations() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {tools.map((t) => (
        <li key={t} className="flex items-center px-6 sm:px-10">
          <span className="display-tight whitespace-nowrap text-3xl text-ink/35 transition hover:text-ink sm:text-5xl">
            {t}
          </span>
          <span className="ml-12 h-3 w-3 rotate-45 bg-signal sm:ml-20" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <section id="integrations" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <SectionLabel n="03" label="Integrations" />
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="display text-[clamp(2.6rem,7.2vw,7rem)] lg:col-span-8">
            Pages where <span className="text-signal">you already live.</span>
          </h2>
          <p className="max-w-md text-lg leading-snug text-ink/75 lg:col-span-4">
            Two-click installs. Alerts land in the channel, acks sync back, and deploys from GitHub and Vercel
            show up on every latency chart.
          </p>
        </div>
      </div>
      <div className="group mt-14 overflow-hidden border-y-2 border-ink py-8 sm:py-10">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[1440px] px-4 font-mono text-xs uppercase tracking-wider text-ink/55 sm:px-8">
        + REST API, Terraform provider, and a CLI for checks-as-code
      </p>
    </section>
  );
}
