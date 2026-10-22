import { Faq, Footer, Install } from "@/components/sections/closing";
import { Hero } from "@/components/sections/hero";
import { Nav } from "@/components/sections/nav";
import { PlateArt } from "@/components/sections/plate-art";
import { PlateMap } from "@/components/sections/plate-map";
import { PlateProof } from "@/components/sections/plate-proof";
import { PlateReduced } from "@/components/sections/plate-reduced";
import { PlateScroll } from "@/components/sections/plate-scroll";
import { PlateTiming } from "@/components/sections/plate-timing";
import { PlateType } from "@/components/sections/plate-type";

// Server component composing client sections: static HTML, per-section hydration.
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PlateArt />
        <PlateTiming />
        <PlateType />
        <PlateProof />
        <PlateMap />
        <PlateScroll />
        <PlateReduced />
        <Faq />
        <Install />
      </main>
      <Footer />
    </>
  );
}
