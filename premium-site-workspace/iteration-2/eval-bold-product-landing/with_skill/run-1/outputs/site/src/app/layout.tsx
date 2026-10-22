import type { Metadata } from "next";
import { Anton, Archivo, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
});
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://relay.dev"),
  title: "Relay — Know your API is down in under 10 seconds",
  description:
    "API monitoring for small dev teams: alerts in under 10 seconds, p95 latency dashboards and public status pages. Free for your first 10 endpoints.",
  openGraph: {
    title: "Relay — API monitoring that shouts",
    description:
      "Alerts in under 10 seconds, p95 latency dashboards and public status pages for small dev teams.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="bg-background font-sans text-foreground">
        <MotionProvider>
          <SmoothScroll navOffset={64} />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
