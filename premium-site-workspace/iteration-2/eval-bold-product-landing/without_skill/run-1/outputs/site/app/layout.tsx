import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Relay — API monitoring that yells first",
  description:
    "Relay watches your APIs and alerts your team in under 10 seconds. p95 latency dashboards and public status pages for small dev teams.",
  openGraph: {
    title: "Relay — API monitoring that yells first",
    description: "Alerts in under 10 seconds. p95 dashboards. Public status pages. Built for small dev teams.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
