"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";

const metrics = [
  { n: "12.4M+", l: "Signals Processed" },
  { n: "98.7%", l: "Detection Precision" },
  { n: "4.2x", l: "Faster Review" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-40"><StarField count={160} /></div>
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,85,0,0.07) 0%, transparent 65%)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse-dot" />
          <span className="label">Space Data Intelligence Platform</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-white leading-[1.0] tracking-tight mb-6">
          Decode the Sky.<br />
          <span className="text-gradient">Detect the</span><br />
          <span className="text-gradient">Unexpected.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed mb-10">
          AI-powered analytics for telescope survey pipelines   anomaly detection, celestial event classification, and visual intelligence.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/technology">
            <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
              className="btn-orange px-8 py-3.5 text-sm tracking-wide">
              View Technology
            </motion.button>
          </Link>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="btn-ghost px-8 py-3.5 text-sm">
            See Platform Demo
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-px">
          {metrics.map((m, i) => (
            <div key={i} className={`flex-1 text-center py-6 px-8 ${i === 1 ? "border-x border-white/7 sm:border-y-0" : ""}`}
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", maxWidth: 200 }}>
              <div className="text-3xl font-black text-gradient mb-1">{m.n}</div>
              <div className="text-xs text-neutral-500">{m.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-600">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
