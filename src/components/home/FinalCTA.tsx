"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "192px 0", background: "#09090f", position: "relative", overflow: "hidden" }}>
      <div className="absolute inset-0 grid-bg" />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,85,0,0.06) 0%, transparent 65%)",
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="label" style={{ marginBottom: 24, display: "block" }}>Ready to Launch</p>

          <h2 style={{
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            fontWeight: 900, color: "white", lineHeight: 1.0,
            marginBottom: 24, textAlign: "center"
          }}>
            The Universe Has
            <br />
            <span className="text-gradient">More to Reveal.</span>
          </h2>

          <p style={{ color: "#737373", marginBottom: 48, maxWidth: 420, margin: "0 auto 48px auto", textAlign: "center" }}>
            Join observatories and research teams using NeuralSky to unlock discoveries hidden in their data.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/technology">
              <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                className="btn-orange" style={{ padding: "14px 36px", fontSize: 14, letterSpacing: "0.04em" }}>
                Explore Technology
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button whileHover={{ scale: 1.02 }} className="btn-ghost"
                style={{ padding: "14px 36px", fontSize: 14 }}>
                Meet the Team
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
