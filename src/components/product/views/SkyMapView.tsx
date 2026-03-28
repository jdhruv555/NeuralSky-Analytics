"use client";

import { useMemo, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import type { Observation } from "@/types/product";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductBadge } from "@/components/product/ui/Badge";

type Mode = "all" | "anomalies" | "heatmap";

export default function SkyMapView() {
  const observations = useProductStore((s) => s.observations);
  const anomalies = useProductStore((s) => s.anomalies);
  const [mode, setMode] = useState<Mode>("all");
  const [tel, setTel] = useState("all");
  const [heat, setHeat] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; label: string } | null>(null);
  const [selected, setSelected] = useState<Observation | null>(null);

  const anomalyIds = useMemo(() => new Set(anomalies.map((a) => a.observation_id)), [anomalies]);

  const points = useMemo(() => {
    let obs = observations;
    if (tel !== "all") obs = obs.filter((o) => o.telescope_id === tel);
    if (mode === "anomalies") obs = obs.filter((o) => anomalyIds.has(o.observation_id));
    return obs.map((o) => {
      const a = anomalies.find((x) => x.observation_id === o.observation_id);
      return {
        o,
        x: (o.ra / 360) * 100,
        y: 100 - ((o.dec + 90) / 180) * 100,
        isAnom: !!a,
        score: a?.anomaly_score ?? o.anomaly_score ?? 0,
      };
    });
  }, [observations, tel, mode, anomalyIds, anomalies]);

  const handleHover = (e: React.MouseEvent, label: string) => {
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement;
    const rect = svg?.getBoundingClientRect();
    if (!rect) return;
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top, label });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Coverage</p>
        <h2 className="text-2xl font-semibold text-white mt-1">Sky map & survey coverage</h2>
        <p className="text-sm text-slate-400 mt-2">
          Mollweide-style projection simplified to plate carrée for demo — RA/DEC mapped to canvas.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "All observations"],
            ["anomalies", "Anomalies only"],
            ["heatmap", "Score-weighted"],
          ] as [Mode, string][]
        ).map(([k, lab]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              mode === k
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-100"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20"
            }`}
          >
            {lab}
          </button>
        ))}
        <label className="flex items-center gap-2 text-xs text-slate-400 ml-2">
          <input type="checkbox" checked={heat} onChange={(e) => setHeat(e.target.checked)} />
          Cluster emphasis
        </label>
        <select
          className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-1.5 text-xs"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
        >
          <option value="all">All telescopes</option>
          {Array.from(new Set(observations.map((o) => o.telescope_id))).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <ProductCard glow className="relative overflow-hidden">
        <div className="product-scan-line absolute inset-0 pointer-events-none opacity-40" />
        <svg
          viewBox="0 0 100 50"
          className="w-full h-auto min-h-[280px] rounded-lg bg-[#030712] border border-cyan-500/10"
          onMouseLeave={() => setTip(null)}
        >
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[0, 20, 40, 60, 80, 100].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="50" stroke="rgba(148,163,184,0.08)" strokeWidth="0.08" />
          ))}
          {[0, 10, 20, 30, 40, 50].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(148,163,184,0.08)" strokeWidth="0.08" />
          ))}
          {points.map((p) => {
            const r = mode === "heatmap" ? 0.35 + p.score * 0.9 : heat ? 0.45 : 0.35;
            const fill = p.isAnom ? "#f472b6" : "#22d3ee";
            const op = mode === "heatmap" ? 0.25 + p.score * 0.55 : 0.55;
            return (
              <circle
                key={p.o.id}
                cx={p.x}
                cy={p.y}
                r={r}
                fill={fill}
                opacity={op}
                className="cursor-pointer"
                onMouseEnter={(e) => handleHover(e, `${p.o.observation_id} · ${p.o.telescope_id}`)}
                onClick={() => setSelected(p.o)}
              />
            );
          })}
        </svg>
        {tip && (
          <div
            className="absolute pointer-events-none text-[10px] bg-black/80 border border-white/10 px-2 py-1 rounded-md text-cyan-100"
            style={{ left: tip.x, top: tip.y - 28 }}
          >
            {tip.label}
          </div>
        )}
      </ProductCard>

      {selected && (
        <ProductCard>
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-[10px] uppercase text-slate-500">Selected</p>
              <p className="font-mono text-cyan-200">{selected.observation_id}</p>
              <p className="text-xs text-slate-400 mt-1">
                RA {selected.ra.toFixed(4)}° · DEC {selected.dec.toFixed(4)}° · {selected.telescope_id}
              </p>
            </div>
            <ProductBadge kind={anomalyIds.has(selected.observation_id) ? "High" : "Low"}>
              {anomalyIds.has(selected.observation_id) ? "Anomaly" : "Nominal"}
            </ProductBadge>
          </div>
          <button type="button" className="mt-3 text-xs text-cyan-400 hover:underline" onClick={() => setSelected(null)}>
            Clear selection
          </button>
        </ProductCard>
      )}
    </div>
  );
}
