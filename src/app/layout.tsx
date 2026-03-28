import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "bg-[#0c1222]/95 border border-cyan-500/20 text-slate-100 backdrop-blur-xl",
            },
          }}
        />
      </body>
    </html>
  );
}
