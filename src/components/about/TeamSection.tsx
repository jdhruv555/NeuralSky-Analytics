"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function TeamSection() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "160px 0", background: "#0d0d12" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}
          style={{ width: "100%", marginBottom: 48 }}>
          <p className="label" style={{ marginBottom: 16 }}>The Builder</p>
          <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, color: "white", textAlign: "center" }}>
            Meet the <span className="text-gradient">Founder</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={v ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ width: "100%", borderRadius: 24, padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", background: "#111118", border: "1px solid rgba(255,85,0,0.15)" }}>

          <div style={{ width: 80, height: 80, borderRadius: 20, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(255,85,0,0.18), rgba(255,140,0,0.06))", border: "2px solid rgba(255,85,0,0.25)" }}>
            <svg viewBox="0 0 48 48" fill="none" style={{ width: 44, height: 44 }}>
              <circle cx="24" cy="18" r="9" stroke="#FF5500" strokeWidth="1.5"/>
              <path d="M24 10v-3M24 30v3M17 18H14M34 18h3" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <circle cx="24" cy="18" r="3.5" fill="#FF5500" opacity="0.25"/>
              <circle cx="24" cy="18" r="1.5" fill="#FF5500"/>
              <path d="M11 38c0-7.2 5.8-13 13-13s13 5.8 13 13" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
            </svg>
          </div>

          <h3 style={{ fontSize: 26, fontWeight: 900, color: "white", marginBottom: 4 }}>Dhruv Jha</h3>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#FF5500", marginBottom: 6 }}>Founder and CEO</p>
          <p style={{ fontSize: 11, color: "#4b5563", fontFamily: "monospace", marginBottom: 20 }}>AI / Space-Tech Builder</p>

          <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.65, marginBottom: 28, maxWidth: 320, textAlign: "center" }}>
            Building NeuralSky to bridge the gap between astronomical data volume and scientific discovery velocity.
          </p>

          <motion.a href="https://www.linkedin.com/in/dhruvjha555/" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 28px", borderRadius: 12, fontWeight: 700, fontSize: 14, color: "white", textDecoration: "none", background: "#0077b5", border: "1px solid rgba(0,119,181,0.35)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Connect on LinkedIn
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
