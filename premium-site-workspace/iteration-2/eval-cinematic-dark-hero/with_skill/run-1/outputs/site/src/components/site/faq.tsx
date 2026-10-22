import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = [
  {
    q: "Which cameras and formats does Nocturne support?",
    a: "Log footage from ARRI (LogC3/LogC4), Sony (S-Log3), RED (Log3G10), Blackmagic (Film Gen 5), Canon (C-Log2/3), Panasonic (V-Log) and Apple Log. Rec.709 footage works too, with less latitude to grade.",
  },
  {
    q: "Does it replace my colorist?",
    a: "For many shorts and music videos, the first pass is the finished grade. On features, most teams use Nocturne for balance and matching, then export the Resolve project so a colorist spends their time on the scenes that matter.",
  },
  {
    q: "Does my footage leave my machine?",
    a: "No. Grading and rendering run locally on Apple silicon or an NVIDIA RTX GPU. Only anonymous usage counts are sent, and you can turn those off.",
  },
  {
    q: "What do I get from the export?",
    a: "A graded render (ProRes, DNxHR or H.265), a .cube LUT per scene, and on Pro and Studio a DaVinci Resolve project with every adjustment as editable nodes.",
  },
  {
    q: "When does the waitlist open up?",
    a: "We’re inviting filmmakers from the waitlist in small batches, in the order they signed up. You’ll get one email when your seat is ready — nothing else.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section-pad border-t border-hairline">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="slate text-brand">FAQ</p>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,4.5vw,4rem)] leading-[0.95] tracking-[-0.02em]">
            Notes from <em>dailies</em>.
          </h2>
        </div>
        <Accordion className="lg:col-span-8">
          {FAQ.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-hairline">
              <AccordionTrigger className="py-6 font-display text-[clamp(1.35rem,2.2vw,1.75rem)] font-normal leading-snug hover:no-underline hover:text-brand focus-visible:ring-brand">
                {f.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[62ch] pb-4 text-[1.05rem] leading-relaxed text-pretty text-muted-foreground">
                  {f.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
