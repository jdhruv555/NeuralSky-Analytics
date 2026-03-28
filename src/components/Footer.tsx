import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#09090f" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/neuralsky-logo.png" alt="NeuralSky" width={120} height={32} style={{ height: 28, width: "auto", objectFit: "contain" }} />
        </Link>

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
