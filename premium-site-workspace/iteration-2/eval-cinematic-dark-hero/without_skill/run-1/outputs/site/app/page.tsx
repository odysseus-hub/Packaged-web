import Reveal from "@/components/Reveal";
import Timecode from "@/components/Timecode";
import Scene from "@/components/Scene";
import Looks from "@/components/Looks";
import Waitlist from "@/components/Waitlist";

const NAV = [
  ["How it works", "#how"],
  ["Looks", "#looks"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
];

function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-amber uppercase">
      <span className="text-smoke">{n}</span>
      <span className="h-px w-8 bg-amber/50" />
      {children}
    </p>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-label="Nocturne">
      {/* the plate */}
      <div className="absolute inset-0 -z-10">
        <div className="drift absolute -inset-[6%] opacity-40" style={{ filter: "contrast(1.25) saturate(1.1) brightness(0.55) hue-rotate(-8deg)" }}>
          <Scene className="h-full w-full" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,60,72,.85), rgba(14,40,50,.55) 55%, rgba(210,120,60,.35))", mixBlendMode: "soft-light" }} />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_0%,rgba(7,7,10,.55)_45%,#07070a_85%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      {/* letterbox */}
      <div className="letterbox absolute inset-x-0 top-0 z-20 bg-black" aria-hidden />
      <div className="letterbox absolute inset-x-0 bottom-0 z-20 bg-black" aria-hidden />

      {/* nav */}
      <header className="seq seq-d2 absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex h-[7vh] min-h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
          <a href="#" className="font-display text-xl tracking-[0.2em] uppercase">Nocturne</a>
          <ul className="hidden items-center gap-8 text-[13px] text-smoke md:flex">
            {NAV.map(([l, h]) => (
              <li key={h}><a href={h} className="transition-colors hover:text-bone">{l}</a></li>
            ))}
          </ul>
          <a href="#waitlist" className="rounded-sm border border-bone/25 px-3.5 py-1.5 text-[13px] transition hover:border-amber hover:text-amber">
            Join waitlist
          </a>
        </nav>
      </header>

      {/* titles */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-[9vh] pb-[11vh] text-center">

        <p className="seq seq-d1 mb-8 font-mono text-[10px] tracking-[0.3em] text-smoke uppercase sm:text-[11px] sm:tracking-[0.45em]">
          An AI colorist for independent film
        </p>

        <div className="relative">
          <div className="seq-streak pointer-events-none absolute top-1/2 left-1/2 h-[2px] w-[180%] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(63,167,163,.0)_10%,rgba(120,200,255,.55)_35%,rgba(255,240,220,.95)_50%,rgba(120,200,255,.55)_65%,transparent)] blur-[1px]" aria-hidden />
          <div className="seq-streak pointer-events-none absolute top-1/2 left-1/2 h-24 w-[120%] max-w-[900px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(120,200,255,.18),transparent_70%)]" aria-hidden />
          <p className="seq-presents pointer-events-none absolute inset-0 grid place-items-center font-mono text-[11px] tracking-[0.5em] whitespace-nowrap text-bone/70 uppercase opacity-0" aria-hidden>
            Nocturne Labs presents
          </p>
          <h1 className="seq-title relative font-display text-[clamp(3.4rem,13vw,11rem)] leading-[0.9] tracking-[0.18em] uppercase [text-shadow:0_0_40px_rgba(232,162,90,.15)]">
            <span className="flicker inline-block">Nocturne</span>
          </h1>
        </div>

        <p className="seq seq-d1 mt-8 max-w-xl font-display text-[clamp(1.4rem,3.2vw,2.2rem)] leading-snug text-bone/90 italic">
          Every frame, graded like it matters.
        </p>
        <p className="seq seq-d2 mt-4 max-w-md text-[15px] leading-relaxed text-smoke">
          Nocturne reads your footage the way a seasoned colorist does — then balances, matches and grades
          every shot in minutes. Built for filmmakers without a finishing budget.
        </p>

        <div className="seq seq-d3 mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a href="#waitlist" className="rounded-sm bg-amber px-6 py-3 text-sm font-medium tracking-wide text-ink transition hover:bg-[#f2b673]">
            Request early access
          </a>
          <a href="#looks" className="group flex items-center gap-2 px-4 py-3 text-sm text-bone/80 transition hover:text-bone">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-bone/30 text-[9px] transition group-hover:border-amber group-hover:text-amber">▶</span>
            See the looks
          </a>
        </div>
      </div>

      {/* bottom HUD */}
      <div className="seq seq-d3 absolute inset-x-0 bottom-0 z-30">
        <div className="mx-auto flex h-[7vh] min-h-12 max-w-7xl items-center justify-between px-4 font-mono text-[10px] tracking-[0.22em] text-smoke uppercase sm:px-8">
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-ember" /> Reel 01</span>
          <span className="hidden sm:inline">Directed by you · Graded by Nocturne</span>
          <Timecode />
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Drop in your cut",
    body: "Import an XML, EDL or AAF from Resolve, Premiere or Final Cut — or just the raw clips. Nocturne reads LOG, RAW and Rec.709, and detects your camera profile automatically.",
    tag: "Ingest · 0:42",
  },
  {
    n: "02",
    title: "Choose a reference",
    body: "Pick a look, upload a still from a film you love, or describe it in words: “winter in Helsinki, sodium streetlights, tired.” Nocturne builds a grade around it — and protects skin tones.",
    tag: "Look dev · 1:10",
  },
  {
    n: "03",
    title: "Grade, match, deliver",
    body: "Every shot is balanced and matched across the scene, then graded. Tweak anything with familiar wheels and curves, then export a graded master, a CDL, or a node tree straight into Resolve.",
    tag: "Render · 3:36",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl scroll-mt-10 px-4 py-28 sm:px-8 sm:py-36">
      <Reveal>
        <Eyebrow n="I.">How it works</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[1.02]">
          From flat log footage to a finished grade <em className="text-amber">before the coffee gets cold.</em>
        </h2>
      </Reveal>
      <ol className="mt-16 grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 120} className="relative flex flex-col bg-ink p-7 sm:p-9">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-6xl text-bone/15">{s.n}</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-smoke uppercase">{s.tag}</span>
            </div>
            <h3 className="mt-10 font-display text-3xl">{s.title}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-smoke">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Showcase() {
  return (
    <section id="looks" className="relative scroll-mt-10 border-y border-white/5 bg-night py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow n="II.">The look library</Eyebrow>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[1.02]">
              One plate. <em className="text-amber">Five films.</em>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-smoke">
            Forty-plus looks built with working colorists, each one a full grade — not a filter. Here&apos;s the same
            ungraded plate through five of them.
          </p>
        </Reveal>
        <Reveal><Looks /></Reveal>
      </div>
    </section>
  );
}

const STATS = [
  { k: "38", u: "ms", label: "to grade a 4K frame", sub: "on a MacBook Pro M3 Pro, no cloud round-trip" },
  { k: "11", u: "min", label: "to balance and grade a 90-minute feature", sub: "1,412 shots, matched scene-by-scene" },
  { k: "24", u: "×", label: "faster than a manual first pass", sub: "measured against three colorists on the same reel" },
];

function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-28 sm:px-8 sm:py-36" aria-labelledby="speed">
      <Reveal>
        <Eyebrow n="III.">Render speed</Eyebrow>
        <h2 id="speed" className="mt-6 max-w-3xl font-display text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[1.02]">
          Fast enough to grade <em className="text-amber">on set.</em>
        </h2>
      </Reveal>
      <dl className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 120} className="border-t border-white/15 pt-8">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <p className="font-display text-[clamp(4.5rem,9vw,7.5rem)] leading-none tracking-tight">
                {s.k}<span className="ml-1 text-[0.4em] text-amber">{s.u}</span>
              </p>
              <p className="mt-5 text-lg text-bone">{s.label}</p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-smoke uppercase">{s.sub}</p>
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

const QUOTES = [
  {
    q: "We shot our feature on two different cameras over eighteen days. Nocturne matched them in an afternoon. My colorist friend asked who I'd hired.",
    who: "Ama Okafor",
    role: "Writer-director, ‘Harmattan’ — SXSW 2026",
  },
  {
    q: "It doesn't flatten everything into the same teal-and-orange soup. It actually listened when I said I wanted it to feel like a bruise.",
    who: "Tomás Ibarra",
    role: "Cinematographer, ‘Los Desvelados’",
  },
  {
    q: "I used to lose a week to grading every short. Now it's one evening, and I spend it making choices instead of fixing white balance.",
    who: "Lena Marsh",
    role: "Documentary filmmaker",
  },
];

function Testimonials() {
  return (
    <section className="border-y border-white/5 bg-night py-28 sm:py-36" aria-labelledby="voices">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <Eyebrow n="IV.">From the festival circuit</Eyebrow>
          <h2 id="voices" className="mt-6 font-display text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[1.02]">
            Filmmakers, <em className="text-amber">in their words.</em>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {QUOTES.map((t, i) => (
            <Reveal as="figure" key={t.who} delay={i * 120} className="flex flex-col justify-between rounded-sm border border-white/10 bg-ink/60 p-8">
              <blockquote className="font-display text-[1.6rem] leading-snug text-bone/95">
                <span className="mr-1 text-amber">&ldquo;</span>{t.q}<span className="text-amber">&rdquo;</span>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-teal/50 to-ember/50 font-display text-lg">
                  {t.who.split(" ").map((p) => p[0]).join("")}
                </span>
                <span>
                  <span className="block text-sm text-bone">{t.who}</span>
                  <span className="block text-[13px] text-smoke">{t.role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "Free",
    price: "$0",
    per: "forever",
    blurb: "For shorts, tests and film school.",
    features: ["3 active projects", "1080p export", "8 starter looks", "Auto white balance & exposure", "Community support"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$24",
    per: "/ month",
    blurb: "For working filmmakers finishing real projects.",
    features: ["Unlimited projects", "4K export, ProRes & DNx", "Full look library (40+)", "Reference-still & text-prompt looks", "Shot matching across cameras", "LUT, CDL & Resolve node export"],
    cta: "Join the Pro waitlist",
    featured: true,
  },
  {
    name: "Studio",
    price: "$79",
    per: "/ month",
    blurb: "For small post houses and collectives.",
    features: ["Everything in Pro", "Up to 5 seats", "8K, ACES & HDR (PQ/HLG) deliverables", "Train custom looks on your past work", "Shared look libraries", "Priority rendering & support"],
    cta: "Talk to us",
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl scroll-mt-10 px-4 py-28 sm:px-8 sm:py-36">
      <Reveal className="text-center">
        <div className="flex justify-center"><Eyebrow n="V.">Pricing</Eyebrow></div>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[1.02]">
          Priced for budgets <em className="text-amber">with no line for color.</em>
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {PLANS.map((p, i) => (
          <Reveal
            key={p.name}
            delay={i * 120}
            className={`relative flex flex-col rounded-sm border p-8 ${p.featured ? "border-amber/50 bg-gradient-to-b from-amber/[0.08] to-transparent" : "border-white/10 bg-night/50"}`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-8 rounded-sm bg-amber px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-ink uppercase">Most popular</span>
            )}
            <h3 className="font-mono text-[12px] tracking-[0.28em] text-smoke uppercase">{p.name}</h3>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-6xl">{p.price}</span>
              <span className="text-sm text-smoke">{p.per}</span>
            </p>
            <p className="mt-3 text-[15px] text-smoke">{p.blurb}</p>
            <ul className="mt-8 flex-1 space-y-3 border-t border-white/10 pt-8 text-[15px]">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className={`mt-[0.55em] h-1 w-3 shrink-0 ${p.featured ? "bg-amber" : "bg-bone/40"}`} />
                  <span className="text-bone/90">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#waitlist"
              className={`mt-10 block rounded-sm px-5 py-3 text-center text-sm font-medium transition ${p.featured ? "bg-amber text-ink hover:bg-[#f2b673]" : "border border-white/20 text-bone hover:border-amber hover:text-amber"}`}
            >
              {p.cta}
            </a>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-smoke">Annual billing saves two months. Students and festival-selected films get Pro free for a year.</p>
    </section>
  );
}

const FAQS = [
  ["Will it replace my colorist?", "No — and it isn't trying to. Nocturne handles the hours of balancing and matching so your budget goes to creative decisions. Many colorists in our beta use it to do the first pass, then finish by hand."],
  ["Which cameras and formats are supported?", "ARRI LogC3/C4, RED Log3G10, Sony S-Log3, Canon Log 2/3, Panasonic V-Log, Blackmagic Film Gen 5, Apple Log, iPhone ProRes Log, plus standard Rec.709 footage. ProRes, DNx, BRAW and R3D are read natively."],
  ["Does my footage get uploaded anywhere?", "Not unless you want it to. Grading runs locally on Apple Silicon and recent NVIDIA GPUs. Cloud rendering is optional and footage is deleted after export."],
  ["Can I bring the grade into DaVinci Resolve?", "Yes. Export a node tree, CDLs per shot, or a LUT. Pro and Studio include a Resolve plugin that round-trips the timeline with grades applied."],
  ["Who owns the looks I create?", "You do. Custom looks trained on your work are private to your account and never used to train shared models."],
  ["When does the waitlist open up?", "We're onboarding in batches through the winter, prioritising films in post with a delivery date. Tell us about yours when you sign up."],
];

function FAQ() {
  return (
    <section id="faq" className="scroll-mt-10 border-t border-white/5 bg-night py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <Eyebrow n="VI.">FAQ</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.3rem,5.5vw,4.5rem)] leading-[1.02]">
            Questions <em className="text-amber">from the edit bay.</em>
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-smoke">
            Something else? Write to <a href="mailto:hello@nocturne.film" className="text-bone underline decoration-amber/60 underline-offset-4 hover:text-amber">hello@nocturne.film</a>.
          </p>
        </Reveal>
        <Reveal className="divide-y divide-white/10 border-y border-white/10">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between gap-6 font-display text-2xl text-bone/95 transition hover:text-bone">
                {q}
                <span className="faq-plus grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 font-sans text-lg text-amber transition-transform duration-300">+</span>
              </summary>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-smoke">{a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="waitlist" className="relative isolate scroll-mt-10 overflow-hidden px-4 py-32 sm:px-8 sm:py-44">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(232,162,90,.18),transparent_60%)]" />
      <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(120,200,255,.35),rgba(255,240,220,.6),rgba(120,200,255,.35),transparent)]" />
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] tracking-[0.4em] text-smoke uppercase">Coming this winter</p>
        <h2 className="mt-6 font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.98]">
          Your film deserves <em className="text-amber">a final pass.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-smoke">
          Join 4,200 filmmakers on the waitlist. Early members lock in Pro at $16/mo for life.
        </p>
        <div className="mt-10"><Waitlist /></div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const credits: [string, string][] = [
    ["Product", "How it works · Looks · Pricing"],
    ["Company", "About · Careers · Press kit"],
    ["Legal", "Privacy · Terms"],
  ];
  return (
    <footer className="border-t border-white/5 bg-black px-4 pt-20 pb-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-md space-y-5 text-center">
          {credits.map(([k, v]) => (
            <div key={k}>
              <p className="font-mono text-[10px] tracking-[0.35em] text-smoke uppercase">{k}</p>
              <p className="mt-1 font-display text-lg text-bone/80">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[12px] text-smoke sm:flex-row">
          <span className="font-display text-base tracking-[0.25em] text-bone uppercase">Nocturne</span>
          <span className="font-mono tracking-[0.2em] uppercase">Fin. · © {new Date().getFullYear()} Nocturne Labs</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Showcase />
      <Stats />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
