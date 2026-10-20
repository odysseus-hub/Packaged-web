import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Reveal from "./components/Reveal";
import Showcase from "./components/Showcase";
import Waitlist from "./components/Waitlist";
import GradedFrame from "./components/GradedFrame";
import { LOG_FILTER, looks } from "./components/looks";

function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
      <span className="text-mute">{n}</span>
      <span className="h-px w-10 bg-ember/50" />
      {children}
    </p>
  );
}

const steps = [
  {
    n: "01",
    title: "Drop in your footage",
    body: "LOG, RAW or Rec.709 from any camera — Arri, RED, Blackmagic, Sony, even your phone. Nocturne reads the color science and normalizes every clip.",
    meta: "BRAW · R3D · ProRes · H.265",
  },
  {
    n: "02",
    title: "Direct the look",
    body: "Pick a look, upload a reference still from a film you love, or just describe it: “cold, lonely, a little hopeful.” Nocturne builds the grade around your intent.",
    meta: "Looks · Reference frames · Prompts",
  },
  {
    n: "03",
    title: "Grade, match, deliver",
    body: "Every shot is balanced and matched across scenes, skin tones protected. Tweak with real wheels, then export LUTs or round-trip straight into Resolve and Premiere.",
    meta: "LUT · XML · DRP · ProRes 4444",
  },
];

const stats = [
  { value: "2.4s", label: "Average time to grade a shot", note: "4K LogC, M3 Pro" },
  { value: "11 min", label: "First-pass grade on a 90-minute feature", note: "1,180 shots, shot-matched" },
  { value: "14×", label: "Faster than a manual first pass", note: "vs. median beta-tester workflow" },
];

const testimonials = [
  {
    quote:
      "We shot our whole feature on two different cameras and a borrowed drone. Nocturne matched it in an afternoon. My colorist budget went to an extra day of shooting.",
    name: "Maya Okonkwo",
    role: "Director, “Salt Flats” — SXSW ’26",
  },
  {
    quote:
      "It doesn’t flatten everything into the same Instagram teal-and-orange. I gave it a still from Paris, Texas and it understood the assignment.",
    name: "Tomás Reyes",
    role: "Cinematographer, short films & music videos",
  },
  {
    quote:
      "The first time I saw my dailies come back graded I genuinely got chills. It feels like the movie I had in my head.",
    name: "Hana Lindqvist",
    role: "Writer-director, “The Quiet Hours”",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "For shorts, tests and film-school projects.",
    features: ["1080p exports (watermarked)", "5 starter looks", "30 min of footage / month", "LUT export"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$24",
    cadence: "/ month",
    blurb: "For working indie filmmakers shipping real projects.",
    features: [
      "4K exports, no watermark",
      "All 40+ looks + reference-frame matching",
      "Unlimited footage",
      "Scene-wide shot matching",
      "Resolve & Premiere round-trip",
    ],
    cta: "Join waitlist for Pro",
    featured: true,
  },
  {
    name: "Studio",
    price: "$79",
    cadence: "/ month",
    blurb: "For small post houses and multi-editor teams.",
    features: [
      "Everything in Pro",
      "6K/8K & HDR (PQ / HLG) delivery",
      "5 seats + shared look libraries",
      "Custom look training on your past work",
      "Priority render queue & support",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

const faqs = [
  {
    q: "Will Nocturne replace my colorist?",
    a: "No — it replaces the grind. Nocturne handles balancing, shot matching and a strong first-pass look so you (or your colorist) can spend time on the creative decisions that matter.",
  },
  {
    q: "Which cameras and formats are supported?",
    a: "Most LOG and RAW formats including Arri LogC3/4, RED IPP2, Blackmagic Film Gen 5, Sony S-Log3, Canon C-Log, Panasonic V-Log and Apple Log, plus ProRes, H.264 and H.265.",
  },
  {
    q: "Does it work with DaVinci Resolve and Premiere?",
    a: "Yes. Export standard .cube LUTs from any plan, or on Pro and Studio round-trip a full timeline with per-shot grades via XML / DRP.",
  },
  {
    q: "Is my footage used to train your models?",
    a: "Never by default. Your footage stays yours. Studio teams can opt in to train a private look model on their own past work — it is never shared.",
  },
  {
    q: "Does it run locally or in the cloud?",
    a: "Both. Previews and grading run on-device on Apple Silicon and modern NVIDIA GPUs; heavy renders can be pushed to our cloud queue.",
  },
  {
    q: "When does the waitlist open up?",
    a: "We are onboarding filmmakers in small batches through the winter. Waitlist members get Pro free for their first three months.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        {/* Festival / format strip */}
        <div className="overflow-hidden border-y border-line bg-ink-2 py-5" aria-hidden>
          <div className="anim-marquee flex w-max gap-14 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.35em] text-mute/70">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              [
                "Arri LogC4",
                "RED IPP2",
                "Blackmagic Film Gen 5",
                "Sony S-Log3",
                "Apple Log",
                "Canon C-Log2",
                "DaVinci Resolve",
                "Premiere Pro",
                "ACES 1.3",
                "Rec.2020 PQ",
              ].map((t) => (
                <span key={`${k}-${t}`} className="flex items-center gap-14">
                  {t} <span className="text-ember/60">✦</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* How it works */}
        <section id="how" className="relative mx-auto max-w-7xl scroll-mt-20 px-5 py-28 sm:px-8 md:py-40">
          <Reveal>
            <Eyebrow n="I.">How it works</Eyebrow>
            <h2 className="mt-6 max-w-3xl font-display text-5xl font-light leading-[1.02] text-bone md:text-7xl">
              From flat LOG to final look <em className="text-ember">in three cuts.</em>
            </h2>
          </Reveal>

          <ol className="mt-20 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 120} className="flex flex-col bg-ink p-8 md:p-10">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-6xl font-light text-ember/90">{s.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Step</span>
                </div>
                <h3 className="mt-10 font-display text-3xl text-bone">{s.title}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-mute">{s.body}</p>
                <p className="mt-8 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-bone/50">
                  {s.meta}
                </p>
              </Reveal>
            ))}
          </ol>

          {/* LOG -> graded strip */}
          <Reveal className="mt-10 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Ingest · LOG", filter: LOG_FILTER, overlay: undefined, blend: "normal" },
              { label: "Balance · Rec.709", filter: "saturate(0.95) contrast(1.05)", overlay: undefined, blend: "normal" },
              { label: `Look · ${looks[0].name}`, filter: looks[0].filter, overlay: looks[0].overlay, blend: looks[0].blend },
            ].map((f, i) => (
              <figure key={f.label}>
                <div className="aspect-[2.39/1] overflow-hidden rounded-sm border border-line">
                  <GradedFrame id={`step-${i}`} filter={f.filter} overlay={f.overlay} blend={f.blend} />
                </div>
                <figcaption className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-mute sm:text-[10px]">
                  {f.label}
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        {/* Showcase */}
        <section id="looks" className="relative scroll-mt-20 border-t border-line bg-ink-2 py-28 md:py-40">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <Eyebrow n="II.">The looks</Eyebrow>
                <h2 className="mt-6 max-w-3xl font-display text-5xl font-light leading-[1.02] text-bone md:text-7xl">
                  One shot. <em className="text-ember">Five films.</em>
                </h2>
              </div>
              <p className="max-w-sm leading-relaxed text-mute">
                Drag across the frame to compare camera LOG with Nocturne&apos;s grade. Every look is built by working colorists
                and adapts to your footage — not a filter slapped on top.
              </p>
            </Reveal>
            <Reveal className="mt-14">
              <Showcase />
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section aria-labelledby="speed-h" className="relative overflow-hidden border-t border-line py-28 md:py-36">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/10 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow n="III.">Render speed</Eyebrow>
              <h2 id="speed-h" className="mt-6 max-w-3xl font-display text-5xl font-light leading-[1.02] text-bone md:text-7xl">
                Faster than your coffee <em className="text-ember">gets cold.</em>
              </h2>
            </Reveal>
            <dl className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 120} className="border-t border-bone/20 pt-8">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-7xl font-light leading-none text-bone md:text-8xl">{s.value}</span>
                    <span className="mt-5 block text-lg text-bone/85">{s.label}</span>
                    <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-mute">{s.note}</span>
                  </dd>
                </Reveal>
              ))}
            </dl>
            <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-mute/70">
              * Internal benchmarks from the private beta, Sept 2026.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="voices-h" className="border-t border-line bg-ink-2 py-28 md:py-40">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow n="IV.">From the beta</Eyebrow>
              <h2 id="voices-h" className="mt-6 max-w-3xl font-display text-5xl font-light leading-[1.02] text-bone md:text-7xl">
                Filmmakers, <em className="text-ember">on the record.</em>
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal as="article" key={t.name} delay={i * 120} className="flex h-full flex-col rounded-sm border border-line bg-ink p-8 md:p-10">
                  <span className="font-display text-6xl leading-none text-ember/70" aria-hidden>“</span>
                  <blockquote className="mt-2 flex-1 font-display text-2xl leading-snug text-bone/90">{t.quote}</blockquote>
                  <footer className="mt-10 flex items-center gap-4 border-t border-line pt-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-ember/80 to-teal/60 font-display text-lg text-ink">
                      {t.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                    <span>
                      <span className="block text-sm text-bone">{t.name}</span>
                      <span className="block text-xs text-mute">{t.role}</span>
                    </span>
                  </footer>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 border-t border-line py-28 md:py-40">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="text-center">
              <div className="flex justify-center">
                <Eyebrow n="V.">Pricing</Eyebrow>
              </div>
              <h2 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-light leading-[1.02] text-bone md:text-7xl">
                Studio-grade color, <em className="text-ember">indie budget.</em>
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
              {plans.map((p, i) => (
                <Reveal
                  key={p.name}
                  delay={i * 120}
                  className={`relative flex flex-col rounded-sm border p-8 md:p-10 ${
                    p.featured
                      ? "border-ember/60 bg-gradient-to-b from-ink-3 to-ink shadow-[0_30px_100px_-30px_rgba(232,162,90,0.35)]"
                      : "border-line bg-ink-2"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-ember px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-mute">{p.name}</h3>
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-6xl font-light text-bone">{p.price}</span>
                    <span className="text-sm text-mute">{p.cadence}</span>
                  </p>
                  <p className="mt-3 text-sm text-mute">{p.blurb}</p>
                  <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3 text-sm text-bone/85">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#waitlist"
                    className={`mt-10 rounded-full px-6 py-3 text-center text-sm uppercase tracking-[0.16em] transition ${
                      p.featured ? "bg-ember text-ink hover:bg-bone" : "border border-bone/25 text-bone hover:border-ember hover:text-ember"
                    }`}
                  >
                    {p.cta}
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-line bg-ink-2 py-28 md:py-40">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <Eyebrow n="VI.">FAQ</Eyebrow>
              <h2 className="mt-6 font-display text-5xl font-light leading-[1.02] text-bone md:text-6xl">
                Questions from <em className="text-ember">the edit bay.</em>
              </h2>
              <p className="mt-6 max-w-sm text-mute">
                Something else? Write to <a className="text-bone underline decoration-ember/60 underline-offset-4" href="mailto:hello@nocturne.film">hello@nocturne.film</a>.
              </p>
            </Reveal>
            <Reveal>
              <div className="divide-y divide-line border-y border-line">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-6">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 font-display text-2xl text-bone transition hover:text-ember">
                      {f.q}
                      <span className="faq-icon text-2xl text-ember transition-transform duration-300" aria-hidden>+</span>
                    </summary>
                    <p className="mt-4 max-w-2xl leading-relaxed text-mute">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Waitlist CTA */}
        <section id="waitlist" className="grain relative scroll-mt-20 overflow-hidden border-t border-line py-32 md:py-48">
          <div className="absolute inset-0 opacity-40">
            <GradedFrame id="cta" filter={`${looks[3].filter} brightness(0.5) blur(2px)`} overlay={looks[3].overlay} blend={looks[3].blend} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-ember">Now casting · early access</p>
              <h2 className="mt-6 font-display text-5xl font-light leading-[1] text-bone sm:text-6xl md:text-8xl">
                Your film deserves <em className="text-ember">a grade.</em>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-bone/70">
                Join 4,200+ filmmakers on the waitlist. Invites go out in small batches, every week.
              </p>
            </Reveal>
            <Reveal className="mt-12">
              <Waitlist />
            </Reveal>
          </div>
        </section>
      </main>

      {/* End credits */}
      <footer className="border-t border-line bg-black py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 text-center sm:px-8">
          <p className="font-display text-3xl tracking-[0.3em] text-bone">NOCTURNE</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-mute">
            Color by Nocturne · Made for the ones who shoot at night
          </p>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] text-mute">
            <li><a className="hover:text-bone" href="#how">How it works</a></li>
            <li><a className="hover:text-bone" href="#looks">Looks</a></li>
            <li><a className="hover:text-bone" href="#pricing">Pricing</a></li>
            <li><a className="hover:text-bone" href="#faq">FAQ</a></li>
            <li><a className="hover:text-bone" href="mailto:hello@nocturne.film">Contact</a></li>
          </ul>
          <p className="text-xs text-mute/60">© {new Date().getFullYear()} Nocturne Labs. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
