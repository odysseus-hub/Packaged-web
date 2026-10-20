import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Relay — Your API broke. Know in 10 seconds.",
  description:
    "API monitoring for small dev teams. Alerts in under 10 seconds, p95 latency dashboards, and public status pages. Free for your first 10 endpoints.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Relay — API monitoring for small dev teams",
    description: "Alerts in under 10 seconds. p95 latency dashboards. Public status pages.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff4d00",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
