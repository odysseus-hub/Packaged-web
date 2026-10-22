import { InkCursor, ScrollProgress } from "@/components/fx/chrome";
import { Faq, Footer, Install } from "@/components/sections/closing";
import { Hero } from "@/components/sections/hero";
import { InkRoom } from "@/components/sections/ink-room";
import { Nav } from "@/components/sections/nav";
import { PlateArt } from "@/components/sections/plate-art";
import { PlateLayout } from "@/components/sections/plate-layout";
import { PlateLine } from "@/components/sections/plate-line";
import { PlateMap } from "@/components/sections/plate-map";
import { PlatePhysics } from "@/components/sections/plate-physics";
import { PlateProof } from "@/components/sections/plate-proof";
import { PlateReduced } from "@/components/sections/plate-reduced";
import { PlateSoda } from "@/components/sections/plate-soda";
import { PlateTiming } from "@/components/sections/plate-timing";
import { PlateToybox } from "@/components/sections/plate-toybox";
import { PlateType } from "@/components/sections/plate-type";

// Server component composing client sections: static HTML, per-section hydration.
export default function Page() {
  return (
    <>
      <ScrollProgress />
      <InkCursor />
      <Nav />
      <main>
        <Hero />
        <PlateArt />
        <PlateTiming />
        <PlateType />
        <PlateLayout />
        <PlatePhysics />
        <PlateSoda />
        <PlateLine />
        <InkRoom />
        <PlateProof />
        <PlateToybox />
        <PlateMap />
        <PlateReduced />
        <Faq />
        <Install />
      </main>
      <Footer />
    </>
  );
}
