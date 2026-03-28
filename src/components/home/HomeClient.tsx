"use client";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/home/Hero"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
    </div>
  ),
});

const DashboardShowcase = dynamic(() => import("@/components/home/DashboardShowcase"), {
  ssr: false,
  loading: () => <div className="py-28 bg-[#080c16]" />,
});

export { Hero, DashboardShowcase };
