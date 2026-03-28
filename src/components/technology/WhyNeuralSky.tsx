"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const points = [
  { metric: "60s", label: "Turnaround", them: "Manual review takes days per survey run", us: "Full pipeline runs in under 60 seconds" },
  { metric: "98.7%", label: "Precision", them: "Humans miss ~15% of anomalous events", us: "AI ensemble achieves 98.7% detection precision" },
  { metric: "10B+", label: "Scale", them: "Legacy tools cap at millions of objects", us: "Scales to billions with sub-linear cost" },
  { metric: "0", label: "Engineers", them: "Pipelines need dedicated engineering teams", us: "No-code workflow builder for researchers" },
];

export default function WhyNeuralSky() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "160px 0", background: "#0d0d12" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 56, width: "100%" }}>
          <p className="label" style={{ marginBottom: 20 }}>Why NeuralSky</p>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "white", lineHeight: 1.1, textAlign: "center" }}>
            Built Different.<br /><span className="text-gradient">For Science.</span>
          </h2>
        </motion.div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, marginBottom: 56 }}>
          {points.map((pt, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={v ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", borderRadius: 16, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ textAlign: "center", flexShrink: 0, width: 72 }}>
                <p className="text-gradient" style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{pt.metric}</p>
                <p style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>{pt.label}</p>
              </div>
              <div style={{ width: 1, height: 36, flexShrink: 0, background: "rgba(255,255,255,0.06)" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#f87171"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{pt.them}</p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#4ade80"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p style={{ fontSize: 12, color: "white", fontWeight: 500, lineHeight: 1.5 }}>{pt.us}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/about">
            <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
              className="btn-orange" style={{ padding: "14px 40px", fontSize: 14, letterSpacing: "0.03em" }}>
              Schedule a Demo
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
