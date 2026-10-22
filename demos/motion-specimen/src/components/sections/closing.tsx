"use client";

import ParticleButton from "@/components/kokonutui/particle-button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Magnetic } from "@/components/motion/hover";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { Container, PlateLabel } from "./plate";

const FAQ = [
  {
    q: "Is this a template?",
    a: "No. It's a skill: an order of work, a set of rules and a toolbox. Every site starts from its own concept sentence, so two sites made with it shouldn't look alike.",
  },
  {
    q: "What does it install?",
    a: "Next.js, Tailwind v4 and shadcn/ui, plus Motion for animation, Kokonut UI for animated components and Bklit UI for charts. Kokonut and Bklit arrive as source code in your project, with their known install bugs patched by a script.",
  },
  {
    q: "Who owns the scroll effects?",
    a: "The flowy skill. This one owns time-based motion: entrances, staggers, hovers. flowy adds smooth scroll, pinning, parallax and marquees, on the same Motion clock, so the page never runs two animation loops.",
  },
  {
    q: "What happens with Reduced Motion turned on?",
    a: "Transforms drop out and opacity stays, so content still arrives. Smooth scroll, pinning, parallax and loops stand down. Numbers render at their final value. Nothing on the page depends on an animation finishing.",
  },
];

const INSTALL = "unzip premium-site.skill -d ~/.claude/skills/";

export function Faq() {
  return (
    <section className="section-pad">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <PlateLabel n="10" name="Questions" />
          <h2 className="mt-8 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
            Printer&apos;s notes.
          </h2>
        </div>
        <Reveal className="min-w-0 lg:col-span-8">
          <Accordion className="border-t border-border">
            {FAQ.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                <AccordionTrigger className="py-6 font-display text-xl font-bold tracking-[-0.02em] hover:no-underline sm:text-2xl">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[62ch] pb-6 text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}

export function Install() {
  async function copy() {
    await navigator.clipboard.writeText(INSTALL);
    await new Promise((r) => setTimeout(r, 450)); // let the pending state read as an action
  }
  return (
    <section id="install" className="section-pad relative overflow-hidden bg-brand text-brand-foreground">
      <Container>
        <div className="flex flex-wrap items-baseline gap-x-4 border-t border-brand-foreground/30 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-foreground/80">
          <span>Plate 11</span>
          <span className="text-brand-foreground">Install</span>
        </div>
        <MaskedLines
          as="h2"
          onMount={false}
          lines={["Print your", "own."]}
          className="mt-14 font-display text-[clamp(4rem,14vw,13rem)] font-extrabold leading-[0.84] tracking-[-0.04em]"
        />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          <code className="min-w-0 overflow-x-auto rounded-2xl bg-foreground px-5 py-4 font-mono text-sm text-background md:col-span-7">
            <span className="select-none text-brand">$ </span>
            {INSTALL}
          </code>
          <div className="md:col-span-5">
            <Magnetic>
              <ParticleButton
                onClick={copy}
                pendingLabel="Copying"
                successLabel="Copied"
                errorLabel="Copy failed"
                className="h-14 rounded-full bg-foreground px-7 text-base text-background hover:bg-foreground/90"
              >
                Copy install command
              </ParticleButton>
            </Magnetic>
          </div>
        </div>
        <p className="mt-8 max-w-[56ch] text-brand-foreground/85">
          Or click <em>Save skill</em> on the packaged <code className="font-mono">premium-site.skill</code> file. Then ask for a
          landing page and watch which plates it reaches for.
        </p>
      </Container>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden pt-20">
      <Container className="grid grid-cols-1 gap-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-3">
        <div>
          <p className="text-foreground">Colophon</p>
          <p className="mt-2 normal-case tracking-normal">Set in Bricolage Grotesque, Instrument Sans and JetBrains Mono.</p>
        </div>
        <div>
          <p className="text-foreground">Inks</p>
          <p className="mt-2 normal-case tracking-normal">Blue-black oklch(0.22 0.02 265) · Fluorescent pink oklch(0.64 0.25 358)</p>
        </div>
        <div>
          <p className="text-foreground">Built with</p>
          <p className="mt-2 normal-case tracking-normal">Next.js 16 · Tailwind 4 · shadcn/ui · Motion · Kokonut UI · Bklit UI</p>
        </div>
      </Container>
      <p
        aria-hidden
        className="mt-16 select-none whitespace-nowrap text-center font-display text-[24vw] font-extrabold leading-[0.72] tracking-[-0.07em] text-foreground"
      >
        Specimen<span className="text-brand">.</span>
      </p>
    </footer>
  );
}
