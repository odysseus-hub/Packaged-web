import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const sans = Archivo({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://relay.dev"),
  title: "Relay — API monitoring that pages you in under 10 seconds",
  description:
    "Relay watches your APIs from 14 regions, pages your team in under 10 seconds, charts p95 latency, and hosts your public status page. Built for small dev teams.",
  openGraph: {
    title: "Relay — know before your customers do",
    description: "Alerts in under 10 seconds. p95 dashboards. Public status pages. For small dev teams.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="grain bg-background font-sans text-foreground">
        <MotionProvider>
          <SmoothScroll />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
