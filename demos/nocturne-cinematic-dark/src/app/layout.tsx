import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-face" });

export const metadata: Metadata = {
  metadataBase: new URL("https://nocturne.film"),
  title: "Nocturne — AI color grading for indie filmmakers",
  description:
    "Nocturne grades your footage like a seasoned colorist would: match shots, build looks, and render a 4K timeline in minutes. Join the waitlist.",
  openGraph: {
    title: "Nocturne — AI color grading for indie filmmakers",
    description: "Every frame, graded by night. Join the Nocturne waitlist.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-brand-foreground"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScroll />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
