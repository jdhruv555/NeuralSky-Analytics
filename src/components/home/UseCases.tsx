"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const cases = [
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: "Transient Event Detection",
    desc: "Surface gamma-ray bursts, supernovae, and fast radio bursts within seconds.",
    stat: "< 4s",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    title: "Survey Prioritization",
    desc: "Intelligent queue management focuses telescope time on the highest-value targets.",
    stat: "4.2x",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    ),
    title: "Observatory Intelligence",
    desc: "Real-time pipeline monitoring and automated quality checks for facility ops.",
    stat: "24/7",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    ),
    title: "Rare Signal Discovery",
    desc: "Uncover faint, unclassified signals buried in years of archival survey data.",
    stat: "40+",
  },
];

export default function UseCases() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "160px 0", background: "#09090f" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }} style={{ textAlign: "center", marginBottom: 64 }}>
          <p className="label" style={{ marginBottom: 20 }}>Use Cases</p>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "white", lineHeight: 1.1, textAlign: "center" }}>
            Built for Every<br />Observatory Workflow.
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, maxWidth: 860, margin: "0 auto" }}>
          {cases.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "28px 28px",
                transition: "border-color 0.3s ease",
              }}
              className="card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#FF5500", background: "rgba(255,85,0,0.09)", border: "1px solid rgba(255,85,0,0.18)"
                }}>
                  {c.icon}
                </div>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#FF5500" }}>{c.stat}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 8 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "#737373", lineHeight: 1.6 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
