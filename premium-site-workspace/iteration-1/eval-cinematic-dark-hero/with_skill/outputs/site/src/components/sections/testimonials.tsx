"use client";

import { MaskedLines, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Eyebrow } from "./section-heading";

const VOICES = [
  {
    quote:
      "It matched a Sony FX3 and an old Blackmagic Pocket in one pass. I stopped noticing which camera was which — so did the audience.",
    name: "Jonas Lindqvist",
    role: "Cinematographer, “Salt Year”",
  },
  {
    quote:
      "I typed “1970s police procedural, nicotine highlights” and got a node tree I’d have been proud to build myself.",
    name: "Priya Raman",
    role: "Editor & colorist",
  },
  {
    quote:
      "Music videos live on turnaround. Forty seconds to re-render the whole cut means I say yes to the artist’s notes at midnight.",
    name: "Mateo Ruiz",
    role: "Music video director",
  },
  {
    quote:
      "Documentary footage is chaos — six cameras, every light source on earth. Nocturne gave the film one temperature.",
    name: "Hana Sato",
    role: "Documentary filmmaker",
  },
];

export function Testimonials() {
  return (
    <section id="voices" className="section-pad relative border-t border-hairline">
      <div className="container-x">
        <Reveal>
          <Eyebrow reel="05">From the cutting room</Eyebrow>
        </Reveal>

        <figure className="mt-12 lg:ml-[8.33%]">
          <blockquote>
            <MaskedLines
              as="p"
              onMount={false}
              delay={0}
              lines={[
                "“I graded my feature on",
                "a train between festivals.",
                <>
                  It looked <em className="text-brand">loved.</em>”
                </>,
              ]}
              className="font-display text-[clamp(2.1rem,5.6vw,5.5rem)] leading-[1] text-balance tracking-[-0.025em] italic"
            />
          </blockquote>
          <Reveal delay={0.4}>
            <figcaption className="mt-8 font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">
              Amara Okafor — writer-director, “The Long Low Tide”
            </figcaption>
          </Reveal>
        </figure>

        <Stagger className="mt-[clamp(4rem,8vw,7rem)] grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VOICES.map((v, i) => (
            <StaggerItem key={v.name} className={i % 2 === 1 ? "lg:mt-16" : undefined}>
              <figure className="flex h-full flex-col justify-between gap-8 rounded-sm border border-hairline bg-surface/60 p-6 transition-colors duration-300 hover:border-foreground/20">
                <blockquote className="text-[1.02rem] leading-relaxed text-pretty text-foreground/90">
                  {v.quote}
                </blockquote>
                <figcaption>
                  <p className="font-display text-xl">{v.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{v.role}</p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
