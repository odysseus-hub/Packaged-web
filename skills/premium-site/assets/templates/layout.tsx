import type { Metadata } from "next";
// Swap these three for the art direction's pairing (references/art-direction.md §2).
// Keep the variable names: globals.css maps --font-display / --font-sans / --font-mono.
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "TODO: Site name — one-line promise",
  description: "TODO: one sentence that sells it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="bg-background font-sans text-foreground">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
