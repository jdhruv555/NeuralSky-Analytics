"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/product/ui/Card";

export default function AnalyticsView() {
  const observations = useProductStore((s) => s.observations);
  const anomalies = useProductStore((s) => s.anomalies);
  const [tel, setTel] = useState("all");

  const scoped = useMemo(() => {
    if (tel === "all") return observations;
    return observations.filter((o) => o.telescope_id === tel);
  }, [observations, tel]);

  const telescopes = useMemo(
    () => Array.from(new Set(observations.map((o) => o.telescope_id))),
    [observations],
  );

  const scoreDist = useMemo(() => {
    const edges = [0, 0.2, 0.4, 0.6, 0.8, 1.01];
    return edges.slice(0, -1).map((lo, i) => {
      const hi = edges[i + 1];
      const count = anomalies.filter((a) => a.anomaly_score >= lo && a.anomaly_score < hi).length;
      return { bin: `${lo}-${hi}`, count };
    });
  }, [anomalies]);

  const scatter = useMemo(
    () =>
      scoped.slice(0, 400).map((o) => ({
        x: o.brightness,
        y: o.flux,
        z: o.signal_to_noise,
        id: o.observation_id,
      })),
    [scoped],
  );

  const byTime = useMemo(() => {
    const m = new Map<string, number>();
    anomalies.forEach((a) => {
      const d = a.timestamp.slice(0, 10);
      m.set(d, (m.get(d) ?? 0) + 1);
    });
    return Array.from(m.entries())
      .map(([day, c]) => ({ day: day.slice(5), c }))
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-20);
  }, [anomalies]);

  const sourceBreak = useMemo(() => {
    const m = new Map<string, number>();
    scoped.forEach((o) => m.set(o.source_type, (m.get(o.source_type) ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [scoped]);

  const snHist = useMemo(() => {
    const edges = [0, 10, 20, 30, 40, 50, 100];
    return edges.slice(0, -1).map((lo, i) => {
      const hi = edges[i + 1];
      const count = scoped.filter((o) => o.signal_to_noise >= lo && o.signal_to_noise < hi).length;
      return { range: `${lo}-${hi}`, count };
    });
  }, [scoped]);

  const confTrend = useMemo(() => {
    return byTime.map((b, i) => ({
      ...b,
      conf: anomalies[i]?.confidence ?? 0.75,
    }));
  }, [byTime, anomalies]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Analytics</p>
          <h2 className="text-2xl font-semibold text-white mt-1">Signal analytics</h2>
        </div>
        <select
          className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-xs max-w-xs"
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProductCard glow>
          <p className="text-sm font-medium text-white mb-3">Anomaly score distribution</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard glow>
          <p className="text-sm font-medium text-white mb-3">Brightness vs flux</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="x" name="Brightness" stroke="#64748b" fontSize={10} />
                <YAxis type="number" dataKey="y" name="Flux" stroke="#64748b" fontSize={10} />
                <ZAxis type="number" dataKey="z" range={[20, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#0f172a", border: "1px solid rgba(167,139,250,0.25)" }} />
                <Scatter name="Obs" data={scatter} fill="#a78bfa" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard glow>
          <p className="text-sm font-medium text-white mb-3">Detections over time</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Bar dataKey="c" fill="#6366f1" radius={[4, 4, 0, 0]} name="Detections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard glow>
          <p className="text-sm font-medium text-white mb-3">Source type breakdown</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBreak} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis type="category" dataKey="name" width={120} stroke="#64748b" fontSize={9} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)" }} />
                <Bar dataKey="value" fill="#34d399" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard glow>
          <p className="text-sm font-medium text-white mb-3">Signal-to-noise histogram</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snHist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard glow>
          <p className="text-sm font-medium text-white mb-3">Confidence trend (indexed)</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Line type="monotone" dataKey="conf" stroke="#f472b6" strokeWidth={2} dot={false} name="Confidence" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>
      </div>
    </div>
  );
}
