import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { TopNav } from "@/components/layout/TopNav";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SetLocate GO — From screen to street",
  description:
    "Visit real filming locations, verify with GPS, and compete weekly. A SetLocate game extension.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-bg-base text-ink-primary antialiased">
        <TopNav />
        <main className="pb-20 md:pb-0">{children}</main>
        <BottomTabBar />
      </body>
    </html>
  );
}
