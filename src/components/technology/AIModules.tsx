"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const modules = [
  { id: "ade", icon: "⚡", name: "Anomaly Detection Engine", tag: "Core model",
    desc: "Transformer-based architecture trained on 40M+ labeled celestial events. Detects statistical deviations across multi-band photometric time series in milliseconds.",
    stats: [{ l: "Parameters", v: "1.2B" },{ l: "Precision", v: "98.7%" },{ l: "Latency", v: "8ms" }] },
  { id: "spr", icon: "◎", name: "Survey Pattern Recognition", tag: "Coverage AI",
    desc: "Learns spatial survey patterns, predicts re-observation targets, and identifies sky coverage gaps with anomalous object density.",
    stats: [{ l: "Coverage", v: "Full Sky" },{ l: "Resolution", v: "0.1 arc" },{ l: "Cycle", v: "30s" }] },
  { id: "tea", icon: "◈", name: "Temporal Event Analysis", tag: "Time-domain",
    desc: "Longitudinal analysis of multi-epoch observations, correlating events across survey runs to construct complete object lifecycle timelines.",
    stats: [{ l: "Epoch Depth", v: "20 yrs" },{ l: "Resolution", v: "1 min" },{ l: "Surveys", v: "48+" }] },
];

export default function AIModules() {
  const [active, setActive] = useState("ade");
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });
  const mod = modules.find((m) => m.id === active) || modules[0];

  return (
    <section ref={ref} style={{ padding: "160px 0", background: "#0d0d12" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 48, width: "100%" }}>
          <p className="label" style={{ marginBottom: 20 }}>AI Architecture</p>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "white", lineHeight: 1.1, textAlign: "center" }}>
            Five Modules.<br /><span className="text-gradient">One Intelligence.</span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24, width: "100%", flexWrap: "wrap" }}>
          {modules.map((m, i) => (
            <motion.button key={m.id} initial={{ opacity: 0, y: 14 }} animate={v ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }} onClick={() => setActive(m.id)}
              style={{
                padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s",
                background: active === m.id ? "rgba(255,85,0,0.12)" : "rgba(255,255,255,0.03)",
                border: active === m.id ? "1px solid rgba(255,85,0,0.35)" : "1px solid rgba(255,255,255,0.07)",
                color: active === m.id ? "#FF5500" : "#9CA3AF",
              }}>
              <span>{m.icon}</span>
              <span>{m.name.split(" ").slice(0,2).join(" ")}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            style={{ width: "100%", borderRadius: 20, padding: "40px 40px", textAlign: "center", background: "#111118", border: "1px solid rgba(255,85,0,0.15)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 16px", background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.2)" }}>
              {mod.icon}
            </div>
            <p style={{ fontSize: 11, fontFamily: "monospace", color: "#FF5500", marginBottom: 8 }}>{mod.tag}</p>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 16 }}>{mod.name}</h3>
            <p style={{ color: "#9ca3af", lineHeight: 1.7, marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>{mod.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, maxWidth: 400, margin: "0 auto" }}>
              {mod.stats.map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "14px 8px", borderRadius: 12, background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-gradient" style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{s.v}</p>
                  <p style={{ fontSize: 10, color: "#6b7280" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
