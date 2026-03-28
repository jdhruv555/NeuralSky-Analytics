"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import StarField from "@/components/StarField";

const pillars = [
  { icon: "◎", label: "Mission", desc: "Accelerate scientific discovery by making AI anomaly detection accessible to every observatory on Earth." },
  { icon: "◈", label: "What We Build", desc: "An analytics platform that transforms raw telescope output into classified, prioritized celestial intelligence." },
  { icon: "⚡", label: "Why It Matters", desc: "The universe produces more events per night than any team can manually review. No discovery should go unseen." },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true });

  return (
    <section ref={ref} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}><StarField count={140} /></div>
      <div className="absolute inset-0 grid-bg" />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,85,0,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" }}>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45 }}
          className="label" style={{ marginBottom: 24 }}>About NeuralSky</motion.p>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.08 }}
          style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 900, color: "white", lineHeight: 1.0, marginBottom: 28, textAlign: "center" }}>
          We Built the Intelligence<br /><span className="text-gradient">the Sky Deserves.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.18 }}
          style={{ fontSize: 17, color: "#9ca3af", maxWidth: 560, margin: "0 auto 64px", lineHeight: 1.7, textAlign: "center" }}>
          Every night, telescopes generate more data than humanity can review. Transient events are captured and never surface to a researcher. NeuralSky fixes that.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, width: "100%" }}>
          {pillars.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 + i * 0.12 }}
              style={{ padding: "32px 24px", borderRadius: 20, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 24, color: "#FF5500", marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 10 }}>{item.label}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
