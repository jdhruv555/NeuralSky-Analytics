"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import type { AnomalyEvent, Severity } from "@/types/product";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductBadge } from "@/components/product/ui/Badge";
import { ProductButton } from "@/components/product/ui/Button";

const SEVERITIES: Severity[] = ["Low", "Medium", "High", "Critical"];

export default function AnomaliesView() {
  const anomalies = useProductStore((s) => s.anomalies);
  const observations = useProductStore((s) => s.observations);
  const [severity, setSeverity] = useState<string>("all");
  const [tel, setTel] = useState("all");
  const [detail, setDetail] = useState<AnomalyEvent | null>(null);

  const telescopes = useMemo(
    () => Array.from(new Set(observations.map((o) => o.telescope_id))),
    [observations],
  );

  const filtered = useMemo(() => {
    return anomalies.filter((a) => {
      if (severity !== "all" && a.severity !== severity) return false;
      if (tel !== "all") {
        const o = observations.find((x) => x.observation_id === a.observation_id);
        if (o?.telescope_id !== tel) return false;
      }
      return true;
    });
  }, [anomalies, severity, tel, observations]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Detection</p>
        <h2 className="text-2xl font-semibold text-white mt-1">Anomaly detection center</h2>
        <p className="text-sm text-slate-400 mt-2">
          Z-score and isolation-style scoring over flux, SNR, and brightness — ranked for triage.
        </p>
      </div>

      <ProductCard>
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-xs"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="all">All severities</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-xs"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          >
            <option value="all">All telescopes</option>
            {telescopes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Conf.</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Coords</th>
                <th className="px-3 py-2">Class</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-white/[0.04] hover:bg-white/[0.02] cursor-pointer"
                  onClick={() => setDetail(a)}
                >
                  <td className="px-3 py-2 font-mono text-cyan-200/90">{a.observation_id}</td>
                  <td className="px-3 py-2 tabular-nums">{a.anomaly_score.toFixed(4)}</td>
                  <td className="px-3 py-2 tabular-nums">{a.confidence.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <ProductBadge kind={a.severity}>{a.severity}</ProductBadge>
                  </td>
                  <td className="px-3 py-2 text-slate-400">{a.timestamp.slice(0, 16)}</td>
                  <td className="px-3 py-2">
                    {a.ra.toFixed(2)}°, {a.dec.toFixed(2)}°
                  </td>
                  <td className="px-3 py-2 text-slate-300">{a.probable_class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProductCard>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <ProductCard glow>
              <p className="text-[10px] uppercase text-slate-500">Anomaly detail</p>
              <h3 className="text-lg font-semibold text-white font-mono">{detail.observation_id}</h3>
              <p className="text-xs text-slate-400 mt-2">{detail.signal_summary}</p>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between border border-white/[0.06] rounded-md px-2 py-1.5">
                  <span className="text-slate-500">Review</span>
                  <ProductBadge kind={detail.review_status}>{detail.review_status}</ProductBadge>
                </div>
                <div className="flex justify-between border border-white/[0.06] rounded-md px-2 py-1.5">
                  <span className="text-slate-500">Priority</span>
                  <span>{detail.priority}</span>
                </div>
              </div>
              <ProductButton variant="secondary" className="mt-4 w-full" onClick={() => setDetail(null)}>
                Close
              </ProductButton>
            </ProductCard>
          </div>
        </div>
      )}
    </div>
  );
}
