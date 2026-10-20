import { Cta } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Integrations } from "@/components/sections/integrations";
import { Nav } from "@/components/sections/nav";
import { Pricing } from "@/components/sections/pricing";
import { Proof } from "@/components/sections/proof";
import { Signal } from "@/components/sections/signal";

// Server component: composes client sections so the HTML stays static and JS splits per section.
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Signal />
        <Proof />
        <Features />
        <Integrations />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
