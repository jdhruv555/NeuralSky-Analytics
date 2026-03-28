"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function VisionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "192px 0", background: "#09090f", position: "relative", overflow: "hidden" }}>
      <div className="absolute inset-0 grid-bg" />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,85,0,0.055) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 700, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 28 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65 }}
          style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p className="label" style={{ marginBottom: 32 }}>Vision</p>

          <blockquote style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 28, textAlign: "center" }}>
            Every night, the sky writes a story.
            <br />
            <span className="text-gradient">NeuralSky makes sure<br />someone is reading it.</span>
          </blockquote>

          <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 64, textAlign: "center" }}>Dhruv Jha, Founder</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/technology">
              <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                className="btn-orange" style={{ padding: "14px 36px", fontSize: 14 }}>
                Explore the Platform
              </motion.button>
            </Link>
            <motion.a href="https://www.linkedin.com/in/dhruvjha555/" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }} className="btn-ghost"
              style={{ padding: "14px 36px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect with Dhruv
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
