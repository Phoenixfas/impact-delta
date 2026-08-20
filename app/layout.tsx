import type { Metadata } from "next";
import { Geist, Geist_Mono, Lobster } from "next/font/google";
import "./globals.css";
import KineticBackground from "@/components/KineticBackground";
import SmoothScroll from "@/components/SmoothScroll";
import RevealProvider from "@/components/RevealProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lobster = Lobster({
  variable: "--font-cursive",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IMPACT B2B | Enterprise Kinetic Platform",
  description:
    "Next-generation corporate B2B event production and enterprise summit platform featuring award-winning kinetic interactive physics and smooth precision scrolling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lobster.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative text-slate-900 bg-white selection:bg-[#003E95] selection:text-white">
        <RevealProvider>
          <KineticBackground />
          <SmoothScroll>{children}</SmoothScroll>
        </RevealProvider>
      </body>
    </html>
  );
}
