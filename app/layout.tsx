import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { TopBar } from "@/components/TopBar";
import { TabBar } from "@/components/TabBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pocket Trainer — Your Coach. In Your Pocket.",
  description:
    "Pocket Trainer is an AI-powered personal fitness operating system. Your trainer, nutrition coach, workout planner, form analyst, and accountability partner — all in one.",
  applicationName: "Pocket Trainer",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Pocket Trainer" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col">
            <TopBar />
            <main className="flex-1 px-4 pb-32 pt-4">{children}</main>
          </div>
          <TabBar />
        </Providers>
      </body>
    </html>
  );
}
