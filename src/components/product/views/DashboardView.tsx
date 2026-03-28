"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductBadge } from "@/components/product/ui/Badge";
import { AIInsightsPanel } from "@/components/product/AIInsightsPanel";
import { ExplainDialog } from "@/components/product/ui/ExplainDialog";
import { DASHBOARD_PANELS } from "@/components/product/dashboard/explanations";
import { CHART, CHART_SEQUENCE, chartTooltipStyle } from "@/lib/product/chart-theme";

function SectionHeader({
  panelId,
  hint,
}: {
  panelId: keyof typeof DASHBOARD_PANELS;
  /** Optional single short line; full copy lives behind About. */
  hint?: string;
}) {
  const panel = DASHBOARD_PANELS[panelId];
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 border-b border-slate-800/90 pb-3">
      <div className="min-w-0 space-y-0.5">
        <h3 className="text-sm font-medium text-slate-100">{panel.title}</h3>
        {hint ? <p className="text-xs text-slate-500 max-w-prose">{hint}</p> : null}
      </div>
      <ExplainDialog panel={panel} className="shrink-0 self-start sm:pt-0.5" />
    </div>
  );
}

export default function DashboardView() {
  const observations = useProductStore((s) => s.observations);
  const anomalies = useProductStore((s) => s.anomalies);
  const projects = useProductStore((s) => s.projects);
  const datasets = useProductStore((s) => s.datasets);
  const settings = useProductStore((s) => s.settings);

  const metrics = useMemo(() => {
    const highConf = anomalies.filter((a) => a.confidence >= 0.85).length;
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

  const kpiItems = [
    { label: "Observations", value: metrics.totalObs },
    { label: "Detections", value: metrics.anomalies },
    { label: "High confidence", value: metrics.highConf },
    { label: "Surveys & files", value: metrics.surveys },
    { label: "Mean confidence", value: `${metrics.acc.toFixed(1)}%` },
    { label: "Telescope IDs", value: metrics.telActive },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-24 lg:pb-10">
      {/* Hero */}
      <header className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1 min-w-0">
            <h2 className="text-xl font-semibold tracking-tight text-slate-100">Overview</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
              {settings.workspaceName} — survey volume, detections, and ingestion status.
            </p>
          </div>
          <ExplainDialog panel={DASHBOARD_PANELS.overview} />
        </div>
      </header>

      {/* KPIs */}
      <section className="space-y-4">
        <SectionHeader panelId="kpis" hint="Rollups from the live observation and anomaly store." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
          {kpiItems.map((c) => (
            <div
              key={c.label}
              className="rounded-lg border border-slate-800/90 bg-slate-950/40 px-4 py-4"
            >
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-100">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Insights — full width, calmer */}
      <section className="space-y-4">
        <SectionHeader panelId="insights" />
        <AIInsightsPanel hideIntro />
      </section>

      {/* Charts row 1 */}
      <section className="space-y-4">
        <SectionHeader panelId="timeline" />
        <ProductCard className="min-w-0">
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashObs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={CHART.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: CHART.axis, fontSize: CHART.tick }}
                  tickLine={false}
                  axisLine={{ stroke: CHART.grid }}
                />
                <YAxis
                  tick={{ fill: CHART.axis, fontSize: CHART.tick }}
                  tickLine={false}
                  axisLine={{ stroke: CHART.grid }}
                  width={36}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  labelStyle={{ color: CHART.label }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: CHART.label }} />
                <Area
                  type="monotone"
                  dataKey="signals"
                  stroke={CHART.primary}
                  strokeWidth={1.5}
                  fill="url(#dashObs)"
                  name="Observations"
                />
                <Area
                  type="monotone"
                  dataKey="anomalies"
                  stroke={CHART.secondaryStroke}
                  strokeWidth={1.5}
                  fill="transparent"
                  name="Detections"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>
      </section>

      <section className="space-y-4">
        <SectionHeader panelId="trend" />
        <ProductCard className="min-w-0">
          <div className="h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: CHART.axis, fontSize: CHART.tick }}
                  tickLine={false}
                  axisLine={{ stroke: CHART.grid }}
                />
                <YAxis
                  tick={{ fill: CHART.axis, fontSize: CHART.tick }}
                  tickLine={false}
                  axisLine={{ stroke: CHART.grid }}
                  width={36}
                />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: CHART.label }} />
                <Legend wrapperStyle={{ fontSize: 11, color: CHART.label }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={CHART.accent}
                  strokeWidth={2}
                  dot={false}
                  name="Detections / day"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ProductCard>
      </section>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        <section className="space-y-4 min-w-0">
          <SectionHeader panelId="classDist" />
          <ProductCard className="min-w-0">
            <div className="h-[260px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="transparent"
                  >
                    {classDist.map((_, i) => (
                      <Cell key={i} fill={CHART_SEQUENCE[i % CHART_SEQUENCE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: 11, color: CHART.label }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ProductCard>
        </section>

        <section className="space-y-4 min-w-0">
          <SectionHeader panelId="surveyBars" />
          <ProductCard className="min-w-0">
            <div className="h-[260px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projects.map((p) => ({ name: p.name.length > 14 ? `${p.name.slice(0, 14)}…` : p.name, obs: p.observationCount }))}
                  margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
                >
                  <CartesianGrid stroke={CHART.grid} strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: CHART.axis, fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: CHART.grid }}
                    interval={0}
                    height={48}
                  />
                  <YAxis
                    tick={{ fill: CHART.axis, fontSize: CHART.tick }}
                    tickLine={false}
                    axisLine={{ stroke: CHART.grid }}
                    width={36}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="obs" fill={CHART.primary} radius={[4, 4, 0, 0]} name="Observations" maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ProductCard>
        </section>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
        <section className="space-y-4">
          <SectionHeader panelId="recent" />
          <ProductCard>
            <ul className="max-h-[240px] space-y-2 overflow-y-auto pr-1">
              {anomalies.slice(0, 8).map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-800/80 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-slate-200">{a.observation_id}</p>
                    <p className="text-[11px] text-slate-500">{a.timestamp.slice(0, 16)}</p>
                  </div>
                  <ProductBadge kind={a.severity}>{a.severity}</ProductBadge>
                </li>
              ))}
            </ul>
          </ProductCard>
        </section>

        <section className="space-y-4">
          <SectionHeader panelId="ingestion" />
          <ProductCard>
            <ul className="space-y-2">
              {datasets.length === 0 && (
                <li className="text-sm text-slate-500">No uploads yet. Use Survey Upload to add a file.</li>
              )}
              {datasets.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-800/80 px-3 py-2.5"
                >
                  <span className="truncate text-xs text-slate-200">{d.name}</span>
                  <ProductBadge kind={d.processingStatus === "complete" ? "Confirmed" : "Pending"}>
                    {d.processingStatus}
                  </ProductBadge>
                </li>
              ))}
              <li className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-500">
                <span>Seed survey</span>
                <span className="text-slate-400">Ready</span>
              </li>
            </ul>
          </ProductCard>
        </section>
      </div>
    </div>
  );
}
