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
import { CHART, chartTooltipStyle } from "@/lib/product/chart-theme";

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
    <div className="mx-auto max-w-6xl space-y-10 pb-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Signal analytics</h2>
          <p className="mt-1 text-sm text-slate-500">Distributions and relationships from the current filter.</p>
        </div>
        <select
          className="max-w-xs rounded-md border border-slate-700/80 bg-slate-950/50 px-3 py-2 text-xs text-slate-200"
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

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <ProductCard>
          <p className="mb-3 text-sm font-medium text-slate-200">Anomaly score distribution</p>
          <div className="h-[260px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDist}>
                <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="bin" tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <YAxis tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} width={32} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill={CHART.primary} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard>
          <p className="mb-3 text-sm font-medium text-slate-200">Brightness vs flux</p>
          <div className="h-[260px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" />
                <XAxis type="number" dataKey="x" name="Brightness" tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <YAxis type="number" dataKey="y" name="Flux" tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <ZAxis type="number" dataKey="z" range={[20, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={chartTooltipStyle} />
                <Scatter name="Observations" data={scatter} fill={CHART.secondaryStroke} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard>
          <p className="mb-3 text-sm font-medium text-slate-200">Detections over time</p>
          <div className="h-[260px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byTime}>
                <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <YAxis tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} width={32} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="c" fill={CHART.accent} radius={[4, 4, 0, 0]} name="Detections" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard>
          <p className="mb-3 text-sm font-medium text-slate-200">Source type breakdown</p>
          <div className="h-[260px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBreak} layout="vertical">
                <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fill: CHART.axis, fontSize: 9 }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="value" fill={CHART.secondary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard>
          <p className="mb-3 text-sm font-medium text-slate-200">Signal-to-noise histogram</p>
          <div className="h-[260px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snHist}>
                <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <YAxis tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} width={32} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill={CHART.primary} opacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard>
          <p className="mb-3 text-sm font-medium text-slate-200">Confidence trend (indexed)</p>
          <div className="h-[260px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confTrend}>
                <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <YAxis tick={{ fill: CHART.axis, fontSize: CHART.tick }} tickLine={false} axisLine={{ stroke: CHART.grid }} width={36} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="conf" stroke={CHART.accent} strokeWidth={2} dot={false} name="Confidence" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>
      </div>
    </div>
  );
}
