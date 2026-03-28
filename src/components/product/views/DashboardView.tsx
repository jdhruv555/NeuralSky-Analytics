"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import {
  Activity,
  Radio,
  Shield,
  Target,
  Telescope,
  Zap,
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductBadge } from "@/components/product/ui/Badge";
import { AIInsightsPanel } from "@/components/product/AIInsightsPanel";
import { cn } from "@/lib/utils";

const COLORS = ["#22d3ee", "#818cf8", "#c084fc", "#34d399", "#fbbf24", "#fb7185"];

export default function DashboardView() {
  const observations = useProductStore((s) => s.observations);
  const anomalies = useProductStore((s) => s.anomalies);
  const projects = useProductStore((s) => s.projects);
  const datasets = useProductStore((s) => s.datasets);
  const settings = useProductStore((s) => s.settings);

  const metrics = useMemo(() => {
    const highConf = anomalies.filter((a) => a.confidence >= 0.85).length;
    const crit = anomalies.filter((a) => a.severity === "Critical" || a.severity === "High").length;
    const telActive = new Set(observations.map((o) => o.telescope_id)).size;
    const acc = anomalies.length
      ? anomalies.reduce((s, a) => s + a.confidence, 0) / anomalies.length
      : 0;
    return {
      totalObs: observations.length,
      anomalies: anomalies.length,
      highConf,
      surveys: projects.length + datasets.length,
      acc: acc * 100,
      telActive,
      crit,
    };
  }, [observations, anomalies, projects, datasets]);

  const timelineData = useMemo(() => {
    const byDay = new Map<string, { day: string; signals: number; anomalies: number }>();
    observations.forEach((o) => {
      const day = o.timestamp.slice(0, 10);
      const cur = byDay.get(day) ?? { day, signals: 0, anomalies: 0 };
      cur.signals += 1;
      byDay.set(day, cur);
    });
    anomalies.forEach((a) => {
      const day = a.timestamp.slice(0, 10);
      const cur = byDay.get(day) ?? { day, signals: 0, anomalies: 0 };
      cur.anomalies += 1;
      byDay.set(day, cur);
    });
    return Array.from(byDay.values())
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-14);
  }, [observations, anomalies]);

  const classDist = useMemo(() => {
    const m = new Map<string, number>();
    observations.forEach((o) => m.set(o.source_type, (m.get(o.source_type) ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [observations]);

  const anomalyTrend = useMemo(() => {
    return timelineData.map((d) => ({
      day: d.day.slice(5),
      score: d.anomalies,
    }));
  }, [timelineData]);

  const cards = [
    { label: "Total observations", value: metrics.totalObs, icon: Telescope, accent: "text-cyan-400" },
    { label: "Anomalies detected", value: metrics.anomalies, icon: Zap, accent: "text-violet-400" },
    { label: "High confidence events", value: metrics.highConf, icon: Target, accent: "text-emerald-400" },
    { label: "Surveys / datasets", value: metrics.surveys, icon: Activity, accent: "text-indigo-400" },
    {
      label: "Classification confidence",
      value: `${metrics.acc.toFixed(1)}%`,
      icon: Shield,
      accent: "text-amber-400",
    },
    { label: "Telescope feeds active", value: metrics.telActive, icon: Radio, accent: "text-cyan-300" },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-8">
      <div className="flex flex-col xl:flex-row gap-6 xl:items-start">
        <div className="flex-1 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Workspace</p>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Mission overview</h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            End-to-end telescopic survey health, anomaly pressure, and ingestion posture for{" "}
            <span className="text-slate-200">{settings.workspaceName}</span>.
          </p>
        </div>
        <AIInsightsPanel className="w-full xl:w-[380px] shrink-0" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <ProductCard glow className="h-full">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{c.label}</p>
                  <p className="text-2xl font-semibold text-white mt-1 tabular-nums">{c.value}</p>
                </div>
                <c.icon className={cn("w-8 h-8 opacity-90", c.accent)} />
              </div>
              <div className="mt-3 h-px w-full bg-gradient-to-r from-cyan-500/20 via-transparent to-violet-500/20" />
            </ProductCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductCard glow>
          <p className="text-sm font-medium text-white mb-4">Signal timeline · detections</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(34,211,238,0.2)" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Area type="monotone" dataKey="signals" stroke="#22d3ee" fill="url(#g1)" name="Observations" />
                <Area type="monotone" dataKey="anomalies" stroke="#a78bfa" fill="transparent" name="Anomalies" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard glow>
          <p className="text-sm font-medium text-white mb-4">Anomaly trend (14d)</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(167,139,250,0.25)" }}
                />
                <Line type="monotone" dataKey="score" stroke="#c084fc" strokeWidth={2} dot={false} name="Detections" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductCard>
          <p className="text-sm font-medium text-white mb-4">Source class distribution</p>
          <div className="h-[240px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classDist}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {classDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>

        <ProductCard>
          <p className="text-sm font-medium text-white mb-4">Survey completion</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projects.map((p) => ({ name: p.name.slice(0, 12), obs: p.observationCount }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Bar dataKey="obs" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Observations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductCard>
          <p className="text-sm font-medium text-white mb-3">Recent detections</p>
          <ul className="space-y-2 max-h-[220px] overflow-y-auto">
            {anomalies.slice(0, 8).map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-xs text-slate-200 truncate font-mono">{a.observation_id}</p>
                  <p className="text-[11px] text-slate-500">{a.timestamp.slice(0, 16)}</p>
                </div>
                <ProductBadge kind={a.severity}>{a.severity}</ProductBadge>
              </li>
            ))}
          </ul>
        </ProductCard>

        <ProductCard>
          <p className="text-sm font-medium text-white mb-3">Ingestion & datasets</p>
          <ul className="space-y-2">
            {datasets.length === 0 && (
              <li className="text-sm text-slate-500">No uploads yet — use Survey Upload to ingest.</li>
            )}
            {datasets.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] px-3 py-2"
              >
                <span className="text-xs text-slate-200 truncate">{d.name}</span>
                <ProductBadge kind={d.processingStatus === "complete" ? "Confirmed" : "Pending"}>
                  {d.processingStatus}
                </ProductBadge>
              </li>
            ))}
            <li className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
              <span>Seed survey (bundled)</span>
              <span className="text-emerald-400/90">Ready</span>
            </li>
          </ul>
        </ProductCard>
      </div>
    </div>
  );
}
