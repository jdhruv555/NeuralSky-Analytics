"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function AnomalyMap() {
  const cols = 16; const rows = 7;
  const cells = Array.from({ length: cols * rows }, () => {
    const v = Math.random();
    return { v, hot: v > 0.91 };
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 4 }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          aspectRatio: "1", borderRadius: 4,
          background: c.hot ? `rgba(255,85,0,${c.v})` : `rgba(255,255,255,${c.v * 0.12})`,
          boxShadow: c.hot ? "0 0 7px rgba(255,85,0,0.55)" : "none",
        }} />
      ))}
    </div>
  );
}

function SignalLine() {
  const pts = [22,35,28,55,42,68,52,80,65,88,72,95,80,91,85,97,88,92];
  const max = Math.max(...pts);
  const coords = pts.map((p, i) => `${(i/(pts.length-1))*100},${100-(p/max)*88}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5500" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#FF5500" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${coords} 100,100`} fill="url(#sl)"/>
      <polyline points={coords} fill="none" stroke="#FF5500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const events = [
  { id: "NS-0127", type: "GRB Afterglow", conf: 97, time: "2s" },
  { id: "NS-0126", type: "Transient Event", conf: 91, time: "18s" },
  { id: "NS-0125", type: "Type Ia SN", conf: 94, time: "1m" },
  { id: "NS-0124", type: "Stellar Flare", conf: 78, time: "4m" },
];

export default function DashboardShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "160px 0", background: "#0d0d12" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }} style={{ textAlign: "center", marginBottom: 56 }}>
          <p className="label" style={{ marginBottom: 20 }}>Analytics Dashboard</p>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "white", lineHeight: 1.1, textAlign: "center" }}>
            Sky Intelligence,<br />Visualized Live.
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 32 }} animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
          style={{ margin: "0 auto", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#111118" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0e0e14" }}>
            {["#FF5F57","#FEBC2E","#28C840"].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }}/>)}
            <span style={{ marginLeft: 12, fontSize: 11, fontFamily: "monospace", color: "#4b5563" }}>neuralsky / survey_run_2025_04_28</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} className="animate-pulse-dot"/>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#22c55e" }}>LIVE</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px" }}>
            <div style={{ padding: 24, borderRight: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#d1d5db" }}>Anomaly Detection Map</p>
                <span style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 10px", borderRadius: 99, background: "rgba(255,85,0,0.1)", color: "#FF5500", border: "1px solid rgba(255,85,0,0.2)" }}>14 FLAGGED</span>
              </div>
              {v && <AnomalyMap />}
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, color: "#4b5563" }}>
                <span>Low</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0.08,0.2,0.4,0.7,1].map((a,i) => <div key={i} style={{ width: 20, height: 8, borderRadius: 2, background: `rgba(255,85,0,${a})` }}/>)}
                </div>
                <span>Anomaly</span>
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", marginBottom: 10 }}>Signal Intensity — Last 30 Nights</p>
                <div style={{ height: 80 }}><SignalLine /></div>
              </div>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#d1d5db" }}>Detected Events</p>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: "#FF5500" }}>HIGH PRIORITY</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {events.map((e, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 15 }} animate={v ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{e.id}</span>
                      <span style={{ fontSize: 12, fontWeight: 900, color: "#FF5500" }}>{e.conf}%</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>{e.type}</p>
                    <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                      <div style={{ height: "100%", borderRadius: 99, width: `${e.conf}%`, background: "linear-gradient(90deg,#FF5500,#FF9966)" }}/>
                    </div>
                    <p style={{ textAlign: "right", fontSize: 10, color: "#374151", marginTop: 4, fontFamily: "monospace" }}>{e.time} ago</p>
                  </motion.div>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{l:"Processed",v:"12.4M"},{l:"Surveys",v:"7"},{l:"Uptime",v:"99.97%"},{l:"Queued",v:"142"}].map((s,i) => (
                  <div key={i} style={{ textAlign: "center", padding: "10px 8px", borderRadius: 10, background: "rgba(255,255,255,0.025)" }}>
                    <p style={{ fontSize: 14, fontWeight: 900, color: "white" }}>{s.v}</p>
                    <p style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
