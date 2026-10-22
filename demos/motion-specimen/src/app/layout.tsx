import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-display",
});
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Motion Specimen: the premium-site skill, printed",
  description:
    "A specimen book for motion. Every plate demonstrates the rule it prints: art direction, staggers, springs, charts, scroll and reduced motion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="bg-background font-sans text-foreground">
        <SmoothScroll navOffset={72} />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
