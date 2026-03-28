import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NeuralSky   Space Data Analytics Platform",
  description: "AI-powered telescopic survey analytics and anomaly detection for observatories and research institutions.",
  keywords: "space data, telescope analytics, anomaly detection, AI, celestial events, observatory",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#070b14] text-slate-200 antialiased">
        <Navigation />
        <main className="page-transition">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
