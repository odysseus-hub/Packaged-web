"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "./section-heading";

const FAQS = [
  {
    q: "Does Nocturne replace a colorist?",
    a: "No — it replaces the hours of balancing and matching that come before the creative work. Many of our early users are colorists who hand Nocturne the first pass and spend their time on the shots that matter.",
  },
  {
    q: "Which cameras and formats does it read?",
    a: "LOG and RAW from ARRI, RED, Sony, Canon, Blackmagic, Panasonic and Fujifilm, plus ProRes, DNxHR and H.264/H.265. If your camera has a published LOG curve, Nocturne can work with it.",
  },
  {
    q: "Is my footage used to train your models?",
    a: "Never. Footage is encrypted in transit and at rest, used only to render your grade, and deleted from our render farm 7 days after export — or immediately, if you ask.",
  },
  {
    q: "Can I take the grade back into DaVinci Resolve?",
    a: "Yes. Export a LUT and CDL for any NLE, or round-trip an XML to Resolve with the node tree intact so a colorist can keep going where Nocturne stopped.",
  },
  {
    q: "When does the waitlist open up?",
    a: "We’re letting filmmakers in weekly, in the order they joined, starting winter 2026. Waitlist members keep launch pricing for their first year.",
  },
  {
    q: "Is there a discount for students and film schools?",
    a: "Yes — Pro is free for students with a valid school email, and we offer classroom licences for film programmes. Mention it when you join.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section-pad relative border-t border-hairline">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow reel="07">Questions</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,4.5vw,4.25rem)] leading-[0.95] tracking-[-0.03em] text-balance">
            Before you <em className="text-brand">roll.</em>
          </h2>
        </Reveal>
        <Reveal className="lg:col-span-7 lg:col-start-6">
          <Accordion className="border-t border-hairline">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-b border-hairline">
                <AccordionTrigger className="py-6 font-display text-[1.5rem] leading-snug font-normal hover:no-underline sm:text-[1.75rem]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-pretty text-muted-foreground">
                  <p className="max-w-[62ch]">{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
