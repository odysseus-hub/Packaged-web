import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Integrations } from "@/components/sections/integrations";
import { Nav } from "@/components/sections/nav";
import { Pricing } from "@/components/sections/pricing";
import { Latency, Uptime } from "@/components/sections/proof";
import { Signup } from "@/components/sections/signup";
import { Speed } from "@/components/sections/speed";

// Server component: composes client sections so the HTML stays static and JS splits per section.
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Integrations />
        <Speed />
        <Latency />
        <Uptime />
        <Features />
        <Pricing />
        <Signup />
      </main>
      <Footer />
    </>
  );
}
