"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const QUOTES = [
  {
    quote:
      "We shot on three different cameras over two summers. Nocturne made it look like one film. I stopped apologising for the B-cam.",
    name: "Inès Marchetti",
    role: "Director, feature documentary",
  },
  {
    quote:
      "I typed “late October, the light’s already leaving” and the first pass was honestly close to what I’d have asked a colorist for.",
    name: "Tomasz Wierzbicki",
    role: "Writer-director, short film",
  },
  {
    quote:
      "The Resolve export is the part that sold me. Every node is there, so I can keep going by hand where it matters.",
    name: "Adaeze Nwosu",
    role: "Editor & colorist, music videos",
  },
];

export function Voices() {
  return (
    <section id="voices" className="section-pad border-t border-hairline bg-[oklch(0.115_0.006_60)]">
      <div className="container-x">
        <Reveal>
          <p className="slate text-brand">From the edit bay</p>
          <blockquote className="mt-8 max-w-[22ch] font-display text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[1] tracking-[-0.02em] text-balance italic">
            &ldquo;It&rsquo;s the first tool that grades like it has <span className="not-italic text-brand">watched</span> films, not just
            footage.&rdquo;
          </blockquote>
          <p className="mt-8 text-sm text-muted-foreground">
            <span className="text-foreground">Rafael Okonkwo-Lindqvist</span> — Cinematographer,
            narrative features
          </p>
        </Reveal>

        <Stagger gap={0.1} className="mt-[clamp(4rem,8vw,7rem)] grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <StaggerItem key={q.name} className={i === 1 ? "md:translate-y-12" : i === 2 ? "md:translate-y-24" : ""}>
              <figure className="flex h-full flex-col justify-between rounded-sm border border-hairline bg-surface p-7">
                <blockquote className="text-[1.05rem] leading-relaxed text-pretty text-foreground/90">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 border-t border-hairline pt-4">
                  <span className="block text-sm text-foreground">{q.name}</span>
                  <span className="slate mt-1 block text-[0.6rem] text-muted-foreground">{q.role}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
