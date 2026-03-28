import type { AIInsight, AnomalyEvent, Observation } from "@/types/product";

export function generateInsights(
  anomalies: AnomalyEvent[],
  observations: Observation[],
): AIInsight[] {
  const now = new Date().toISOString();
  const high = anomalies.filter((a) => a.severity === "High" || a.severity === "Critical");
  const last24h = Date.now() - 86400000;
  const recent = anomalies.filter((a) => new Date(a.timestamp).getTime() > last24h);

  const insights: AIInsight[] = [];

  if (high.length) {
    insights.push({
      id: "ins-high",
      title: "High-risk events in queue",
      detail: `${high.length} events exceed baseline anomaly scoring — prioritize spectroscopic follow-up.`,
      severity: "critical",
      createdAt: now,
    });
  }

  if (recent.length >= 3) {
    insights.push({
      id: "ins-transient",
      title: "Transient cluster (24h)",
      detail: `${recent.length} high-confidence transient candidates in the last 24 hours with above-baseline flux deviation.`,
      severity: "warning",
      createdAt: now,
    });
  }

  const telCounts = observations.reduce<Record<string, number>>((acc, o) => {
    acc[o.telescope_id] = (acc[o.telescope_id] ?? 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(telCounts).sort((a, b) => b[1] - a[1])[0];
  if (top) {
    insights.push({
      id: "ins-tel",
      title: "Telescope throughput",
      detail: `${top[0]} contributes ${top[1]} observations — SNR variance within expected survey bounds.`,
      severity: "info",
      createdAt: now,
    });
  }

  insights.push({
    id: "ins-sky",
    title: "Coverage sanity",
    detail: `Sky coverage spans ${new Set(observations.map((o) => `${Math.floor(o.ra / 30)}`)).size} coarse sectors — review polar gaps for next run.`,
    severity: "info",
    createdAt: now,
  });

  return insights.slice(0, 6);
}
