import { SectionLabel } from "./Proof";

export function Features() {
  return (
    <section id="features" className="bg-ink py-20 text-bone sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <SectionLabel n="02" label="Features" invert />
        <h2 className="display max-w-5xl text-[clamp(2.6rem,7.2vw,7rem)]">
          Everything loud. <span className="text-signal">Nothing noisy.</span>
        </h2>

        <div className="mt-14 grid gap-4 md:grid-cols-6 lg:gap-5">
          {/* Big hero tile */}
          <article className="relative overflow-hidden rounded-3xl bg-signal p-6 text-ink sm:p-10 md:col-span-4 md:row-span-2">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]">Alerting</p>
            <p className="display mt-6 text-[clamp(5rem,16vw,14rem)] leading-[0.8]">&lt;10<span className="normal-case">s</span></p>
            <h3 className="display-tight mt-6 text-3xl sm:text-4xl">From first 5xx to your phone buzzing.</h3>
            <p className="mt-4 max-w-lg text-lg leading-snug">
              Checks every 5 seconds from 3 regions. A failure is confirmed from a second region before anyone
              gets paged, so speed never costs you a false alarm at 3am.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              {["Slack", "SMS", "Phone call", "PagerDuty", "Webhooks"].map((c) => (
                <span key={c} className="rounded-full border-2 border-ink px-3 py-1">
                  {c}
                </span>
              ))}
            </div>
          </article>

          <Tile kicker="Dashboards" title="p95, not averages." className="md:col-span-2">
            Averages hide the users who are suffering. See p50 / p95 / p99 per endpoint and per region, with
            deploy markers on every chart.
            <Sparkline />
          </Tile>

          <Tile kicker="Status pages" title="Public. Automatic. Yours." className="md:col-span-2">
            status.yourapp.com, updated by your checks, not by someone remembering to. Email and RSS subscribers
            included.
            <div className="mt-5 flex gap-1" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className={`h-6 flex-1 rounded-sm ${i === 17 ? "bg-bone/40" : "bg-signal"}`} />
              ))}
            </div>
          </Tile>

          <Tile kicker="Checks" title="Multi-step API flows." className="md:col-span-2">
            Log in, create a cart, check out. Chain requests, pass tokens between steps, and assert on JSON
            bodies, headers and timing.
          </Tile>

          <Tile kicker="On-call" title="Routing that respects sleep." className="md:col-span-2">
            Rotations, escalation after 5 minutes of silence, quiet hours for non-critical checks. One person
            gets woken up, not the whole team.
          </Tile>

          <Tile kicker="Setup" title="Live in 90 seconds." className="md:col-span-2">
            Paste a curl, an OpenAPI spec, or let the CLI find your routes.
            <pre className="mt-5 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12px] leading-relaxed text-bone/80">
              <code>
                <span className="text-signal">$</span> npx relay init{"\n"}
                <span className="text-bone/45">✓ found 14 routes in openapi.yaml</span>
                {"\n"}
                <span className="text-bone/45">✓ checks live in iad, fra, sin</span>
              </code>
            </pre>
          </Tile>
        </div>
      </div>
    </section>
  );
}

function Tile({
  kicker,
  title,
  children,
  className = "",
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`group rounded-3xl border-2 border-ink-3 bg-ink-2 p-6 transition hover:border-signal sm:p-8 ${className}`}
    >
      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-signal">{kicker}</p>
      <h3 className="display-tight mt-4 text-2xl sm:text-3xl">{title}</h3>
      <div className="mt-3 leading-snug text-bone/70">{children}</div>
    </article>
  );
}

function Sparkline() {
  const p95 = [62, 58, 66, 55, 70, 48, 52, 40, 44, 35, 38, 30];
  const p50 = [30, 28, 32, 27, 31, 25, 26, 22, 23, 20, 21, 18];
  const toPath = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (arr.length - 1)) * 200},${80 - v}`).join(" ");
  return (
    <svg viewBox="0 0 200 80" className="mt-5 h-20 w-full" aria-hidden="true">
      <path d={toPath(p50)} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" />
      <path d={toPath(p95)} fill="none" stroke="#ff4d00" strokeWidth="3" strokeLinejoin="round" />
      <line x1="120" x2="120" y1="0" y2="80" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="3 3" />
      <text x="124" y="10" fill="currentColor" fillOpacity="0.5" fontSize="8" fontFamily="monospace">
        deploy
      </text>
    </svg>
  );
}
