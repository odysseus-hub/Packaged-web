import type { Metadata } from "next";
// Pairing from ART_DIRECTION.md: Instrument Serif (display) / Inter Tight (text) / Geist Mono (timecodes).
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
  title: "Nocturne — AI color grading for independent film",
  description:
    "Nocturne grades your log footage like a feature colorist would: pick a look, match every shot, export in minutes. Join the waitlist.",
  openGraph: {
    title: "Nocturne — AI color grading for independent film",
    description: "Every frame, graded like cinema. Join the Nocturne waitlist.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="bg-background font-sans text-foreground">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
