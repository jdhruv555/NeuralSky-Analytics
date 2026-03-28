"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const v = useInView(ref, { once: true });
  useEffect(() => {
    if (!v) return;
    const dur = 1800; const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((e * to).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [v, to, decimals]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

const stats = [
  { to: 12.4, suffix: "M+", decimals: 1, label: "Signals Processed" },
  { to: 98.7, suffix: "%", decimals: 1, label: "Detection Precision" },
  { to: 4.2, suffix: "x", decimals: 1, label: "Faster Review" },
  { to: 24, suffix: "/7", decimals: 0, label: "Monitoring Uptime" },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "80px 0", background: "#0d0d12", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                textAlign: "center", padding: "32px 16px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none"
              }}>
              <div className="text-gradient" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 900, marginBottom: 10, display: "block" }}>
                <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <p style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
