import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#09090f" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "#FF5500", flexShrink: 0 }}>
            <svg viewBox="0 0 20 20" fill="none" style={{ width: 14, height: 14 }}>
              <circle cx="10" cy="10" r="3" fill="white"/>
              <path d="M10 3v2.5M10 14.5V17M3 10h2.5M14.5 10H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: "white" }}>NEURALSKY</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[["Home","/"],["Technology","/technology"],["Product","/product"],["About Us","/about"]].map(([l,h]) => (
            <Link key={h} href={h} style={{ fontSize: 12, color: "#6b7280", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="https://www.linkedin.com/in/dhruvjha555/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: "#6b7280", textDecoration: "none" }}>LinkedIn</a>
          <span style={{ fontSize: 12, color: "#374151" }}>2026 NeuralSky</span>
        </div>
      </div>
    </footer>
  );
}
