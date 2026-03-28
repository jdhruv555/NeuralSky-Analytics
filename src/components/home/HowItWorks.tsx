"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { n: "01", title: "Ingest", desc: "Raw telescope data streams in via FITS, HDF5, or live API feeds." },
  { n: "02", title: "Filter", desc: "AI strips noise, calibrates photometry, isolates signal candidates." },
  { n: "03", title: "Detect", desc: "40+ ensemble models score each object for anomalous behavior." },
  { n: "04", title: "Visualize", desc: "Insights surface in dashboards and exportable reports." },
];

const Arrow = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 32, marginTop: -56 }}>
    <svg viewBox="0 0 24 10" style={{ width: 20, opacity: 0.25 }}>
      <path d="M0 5h20M16 2l4 3-4 3" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  </div>
);

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "160px 0", background: "#09090f" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}
          style={{ marginBottom: 72 }}>
          <p className="label" style={{ marginBottom: 20 }}>How It Works</p>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "white", lineHeight: 1.1 }}>
            From Observation<br />to Discovery.
          </h2>
        </motion.div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: 180 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16, marginBottom: 20,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.25)"
                }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#FF5500" }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#737373", lineHeight: 1.6, maxWidth: 150, margin: "0 auto" }}>{s.desc}</p>
              </motion.div>
              {i < steps.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
