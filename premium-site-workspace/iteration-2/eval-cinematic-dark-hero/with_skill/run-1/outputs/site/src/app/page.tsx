import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Looks } from "@/components/site/looks";
import { Pricing } from "@/components/site/pricing";
import { Speed } from "@/components/site/speed";
import { Voices } from "@/components/site/voices";
import { Waitlist } from "@/components/site/waitlist";

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <main>
        <Hero />
        <HowItWorks />
        <Looks />
        <Speed />
        <Voices />
        <Pricing />
        <Faq />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
