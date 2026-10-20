import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Proof } from "@/components/Proof";
import { Features } from "@/components/Features";
import { Integrations } from "@/components/Integrations";
import { Pricing } from "@/components/Pricing";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#proof"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Proof />
        <Features />
        <Integrations />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
