import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Looks } from "@/components/sections/looks";
import { Nav } from "@/components/sections/nav";
import { Pricing } from "@/components/sections/pricing";
import { Speed } from "@/components/sections/speed";
import { Testimonials } from "@/components/sections/testimonials";
import { Waitlist } from "@/components/sections/waitlist";

export default function Home() {
  return (
    <div className="grain relative">
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Looks />
        <Speed />
        <Testimonials />
        <Pricing />
        <Faq />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
