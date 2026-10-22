import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-face", display: "swap" });

export const metadata: Metadata = {
  title: "Nocturne — AI color grading for indie filmmakers",
  description:
    "Nocturne grades your footage like a seasoned colorist. Match looks, balance shots and export LUTs in minutes. Join the waitlist.",
  openGraph: {
    title: "Nocturne — AI color grading for indie filmmakers",
    description: "Grade like the masters. In minutes, not weeks.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#07070a", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(/[?&]still=1/.test(location.search))document.documentElement.classList.add('still')`,
          }}
        />
      </head>
      <body className="grain min-h-screen overflow-x-clip">{children}</body>
    </html>
  );
}
