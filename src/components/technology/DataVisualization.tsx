"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function SkyMap({ v }: { v: boolean }) {
  const cols = 18; const rows = 9;
  const cells = Array.from({ length: cols * rows }, () => {
    const a = Math.random();
    return { a, hot: a > 0.93 };
  });
  return (
    <div style={{ padding: 24, borderRadius: 20, background: "#0e0e16", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>All-Sky Survey Map</p>
          <p style={{ fontSize: 10, color: "#4b5563", marginTop: 3, fontFamily: "monospace" }}>Equatorial coords / RA-DEC</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} className="animate-pulse-dot"/>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#22c55e" }}>LIVE</span>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 3 }}>
          {cells.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={v ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.001 }}
              style={{ aspectRatio: "1", borderRadius: 2,
                background: c.hot ? `rgba(255,85,0,${c.a})` : `rgba(255,255,255,${c.a * 0.1})`,
                boxShadow: c.hot ? "0 0 5px rgba(255,85,0,0.5)" : "none" }} />
          ))}
        </div>
        <div style={{ position: "absolute", top: 6, right: 6, padding: "3px 10px", borderRadius: 99, fontSize: 10, fontFamily: "monospace", background: "rgba(255,85,0,0.12)", color: "#FF5500", border: "1px solid rgba(255,85,0,0.2)" }}>
          14 anomalies
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "monospace", color: "#374151", marginBottom: 6 }}>
        {["0h","4h","8h","12h","16h","20h","24h"].map(t => <span key={t}>{t}</span>)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#374151", alignItems: "center" }}>
        <span>-90 DEC</span>
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {[0.07,0.2,0.5,1.0].map((a,i) => <div key={i} style={{ width: 16, height: 6, borderRadius: 2, background: `rgba(255,85,0,${a})` }}/>)}
          <span style={{ marginLeft: 4 }}>anomaly</span>
        </div>
        <span>+90 DEC</span>
      </div>
    </div>
  );
}

function SpectralChart({ v }: { v: boolean }) {
  const lines = [
    { name: "H-alpha", wl: "656nm", rel: 0.95 },
    { name: "OIII", wl: "500nm", rel: 0.72 },
    { name: "NII", wl: "658nm", rel: 0.61 },
    { name: "SII", wl: "671nm", rel: 0.44 },
    { name: "Hbeta", wl: "486nm", rel: 0.38 },
  ];
  const colors = ["#FF5500","#FF7733","#FF9966","#FFB388","#FFCC99"];
  return (
    <div style={{ padding: 24, borderRadius: 20, background: "#0e0e16", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Spectral Classification</p>
          <p style={{ fontSize: 10, color: "#4b5563", marginTop: 3 }}>Object AT2025abc emission lines</p>
        </div>
        <span style={{ fontSize: 10, fontFamily: "monospace", padding: "2px 10px", borderRadius: 99, background: "rgba(255,85,0,0.1)", color: "#FF5500", border: "1px solid rgba(255,85,0,0.2)" }}>GRB CANDIDATE</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "#6b7280", width: 48 }}>{l.name}</span>
            <div style={{ flex: 1, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={v ? { width: `${l.rel*100}%` } : { width: 0 }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                style={{ height: "100%", background: `linear-gradient(90deg,${colors[i]}40,${colors[i]})` }}/>
            </div>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: colors[i], width: 32 }}>{l.wl}</span>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "#4b5563", width: 24 }}>{(l.rel*100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <div style={{ height: 56, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
        <svg viewBox="0 0 200 54" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
          <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF5500" stopOpacity="0.28"/><stop offset="100%" stopColor="#FF5500" stopOpacity="0"/></linearGradient></defs>
          <polyline points="0,50 20,45 40,40 60,16 65,5 70,16 80,36 100,30 120,45 130,26 140,41 160,50 180,47 200,50" fill="none" stroke="#FF5500" strokeWidth="1.2" strokeLinecap="round"/>
          <polygon points="0,54 0,50 20,45 40,40 60,16 65,5 70,16 80,36 100,30 120,45 130,26 140,41 160,50 180,47 200,50 200,54" fill="url(#sg)"/>
          {[{x:65,y:5},{x:130,y:26}].map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#FF5500" style={{ filter: "drop-shadow(0 0 3px #FF5500)" }}/>)}
        </svg>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: "monospace", color: "#374151", marginTop: 4, padding: "0 2px" }}>
        <span>400nm</span><span>500nm</span><span>600nm</span><span>700nm</span>
      </div>
    </div>
  );
}

export default function DataVisualization() {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "160px 0", background: "#09090f" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 56, width: "100%" }}>
          <p className="label" style={{ marginBottom: 20 }}>Data Layer</p>
          <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "white", lineHeight: 1.1, textAlign: "center" }}>
            Every Corner<br /><span className="text-gradient">of the Sky.</span>
          </h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}>
            {v && <SkyMap v={v} />}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
            <SpectralChart v={v} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
