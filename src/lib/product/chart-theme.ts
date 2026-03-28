/** Cohesive, readable palette for product analytics (dark UI). */
export const CHART = {
  grid: "rgba(148, 163, 184, 0.12)",
  axis: "#94a3b8",
  tick: 11,
  label: "#cbd5e1",
  /** Primary series — observations, volume */
  primary: "#3b82f6",
  primaryMuted: "rgba(59, 130, 246, 0.15)",
  /** Secondary series — anomalies, contrast */
  secondary: "#64748b",
  secondaryStroke: "#94a3b8",
  /** Accent for highlights */
  accent: "#0ea5e9",
  tooltipBg: "#111827",
  tooltipBorder: "rgba(148, 163, 184, 0.2)",
} as const;

/** Distinct but harmonious fills for categorical data (pie / bars). */
export const CHART_SEQUENCE = [
  "#475569",
  "#64748b",
  "#3b82f6",
  "#60a5fa",
  "#0ea5e9",
  "#38bdf8",
] as const;

export const chartTooltipStyle = {
  backgroundColor: CHART.tooltipBg,
  border: `1px solid ${CHART.tooltipBorder}`,
  borderRadius: 8,
  fontSize: 12,
  color: CHART.label,
};
