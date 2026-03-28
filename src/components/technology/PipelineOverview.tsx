"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stages = [
  { id: "01", label: "Raw Data", sub: "FITS / HDF5", icon: "◎" },
  { id: "02", label: "Pre-process", sub: "Calibrate + denoise", icon: "◈" },
  { id: "03", label: "AI Filter", sub: "Band isolation", icon: "⊗" },
  { id: "04", label: "Score", sub: "40+ models", icon: "◉" },
  { id: "05", label: "Classify", sub: "42 object types", icon: "✦" },
  { id: "06", label: "Visualize", sub: "Dashboard + API", icon: "◇" },
];

const perf = [
  { label: "Ingest", pct: 72, lat: "12ms" },
  { label: "Preproc", pct: 58, lat: "38ms" },
  { label: "Filter", pct: 85, lat: "67ms" },
  { label: "Score", pct: 91, lat: "145ms" },
  { label: "Classify", pct: 64, lat: "89ms" },
  { label: "Render", pct: 43, lat: "22ms" },
];

export default function PipelineOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 0 96px", background: "#09090f" }}>
      <div className="absolute inset-0 grid-bg" style={{ opacity: 0.6, pointerEvents: "none" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 1000, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 72, width: "100%" }}>
          <p className="label" style={{ marginBottom: 20 }}>Core Architecture</p>
          <h1 style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 900, color: "white", lineHeight: 1.0, marginBottom: 20, textAlign: "center" }}>
            The Intelligence<br />
            <span className="text-gradient">Pipeline</span>
          </h1>
          <p style={{ color: "#6b7280", maxWidth: 460, margin: "0 auto", textAlign: "center", lineHeight: 1.6 }}>
            End-to-end AI infrastructure for petabyte-scale telescope survey data.
          </p>
        </motion.div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", width: "100%" }}>
            {stages.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: 130 }}>
                  <div style={{
                    width: 58, height: 58, borderRadius: 14, marginBottom: 14,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,85,0,0.08)", border: "1px solid rgba(255,85,0,0.2)"
                  }}>
                    <span style={{ fontSize: 15, color: "#FF5500", lineHeight: 1 }}>{s.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "white", marginTop: 2 }}>{s.id}</span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 11, color: "#4b5563" }}>{s.sub}</p>
                </motion.div>
                {i < stages.length - 1 && (
                  <div style={{ flexShrink: 0, padding: "0 4px", marginTop: -30 }}>
                    <svg viewBox="0 0 20 8" style={{ width: 18, opacity: 0.22 }}>
                      <path d="M0 4h16M12 1.5l4 2.5-4 2.5" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }}
          style={{ width: "100%", maxWidth: 600, margin: "0 auto", borderRadius: 20, padding: 32, background: "#111118", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#d1d5db" }}>Pipeline Monitor</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} className="animate-pulse-dot"/>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: "#22c55e" }}>RUNNING</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {perf.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", width: 52 }}>{r.label}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                  <motion.div initial={{ width: 0 }} animate={v ? { width: `${r.pct}%` } : { width: 0 }}
                    transition={{ duration: 1.1, delay: 0.6 + i * 0.08, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: 99, background: r.pct > 85 ? "linear-gradient(90deg,#f59e0b,#ef4444)" : "linear-gradient(90deg,#FF5500,#FF9966)" }}/>
                </div>
                <span style={{ fontSize: 11, fontFamily: "monospace", width: 30, textAlign: "right", color: r.pct > 85 ? "#f59e0b" : "#FF5500" }}>{r.pct}%</span>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#374151", width: 36, textAlign: "right" }}>{r.lat}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[{l:"Throughput",v:"5.8 GB/s"},{l:"Avg Latency",v:"62ms"},{l:"Objects/sec",v:"14,200"}].map((m,i) => (
              <div key={i} style={{ textAlign: "center", padding: "12px 8px", borderRadius: 12, background: "rgba(255,255,255,0.025)" }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: "#FF5500" }}>{m.v}</p>
                <p style={{ fontSize: 10, color: "#4b5563", marginTop: 3 }}>{m.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
