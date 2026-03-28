import type { AnomalyEvent, Observation, Severity } from "@/types/product";

function severityFromScore(score: number, z: number): Severity {
  const combined = score * 0.55 + Math.min(1, z / 5) * 0.45;
  if (combined >= 0.85) return "Critical";
  if (combined >= 0.65) return "High";
  if (combined >= 0.4) return "Medium";
  return "Low";
}

function meanStd(values: number[]) {
  const n = values.length;
  if (!n) return { mean: 0, std: 1 };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const v = values.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
  const std = Math.sqrt(v) || 1;
  return { mean, std };
}

/** Z-score on flux & SNR + isolation-style score from brightness deviation */
export function scoreObservations(observations: Observation[], zThreshold: number) {
  const fluxes = observations.map((o) => o.flux);
  const snrs = observations.map((o) => o.signal_to_noise);
  const bright = observations.map((o) => o.brightness);
  const { mean: mf, std: sf } = meanStd(fluxes);
  const { mean: ms, std: ss } = meanStd(snrs);
  const { mean: mb, std: sb } = meanStd(bright);

  return observations.map((o) => {
    const zFlux = Math.abs(o.flux - mf) / sf;
    const zSnr = Math.abs(o.signal_to_noise - ms) / ss;
    const zBright = Math.abs(o.brightness - mb) / sb;
    const zMax = Math.max(zFlux, zSnr * 0.6, zBright * 0.35);
    const isolationSim = Math.min(1, (zFlux + zSnr) / 8);
    const baseScore = o.anomaly_score ?? 0;
    const combined = Math.min(
      1,
      baseScore * 0.35 + (zMax / (zThreshold * 1.4)) * 0.35 + isolationSim * 0.3,
    );
    return { observation: o, zMax, combined, severity: severityFromScore(combined, zMax) };
  });
}

export function buildAnomalyEvents(
  observations: Observation[],
  zThreshold: number,
  projectId?: string,
): AnomalyEvent[] {
  const scored = scoreObservations(observations, zThreshold);
  const events: AnomalyEvent[] = [];

  scored.forEach(({ observation: o, combined, severity }, idx) => {
    if (combined < 0.28 && severity === "Low") return;
    const id = `anom-${o.id}-${idx}`;
    events.push({
      id,
      observation_id: o.observation_id,
      anomaly_score: Number(combined.toFixed(4)),
      confidence: Number(Math.min(0.99, 0.5 + combined * 0.48).toFixed(3)),
      severity,
      timestamp: o.timestamp,
      ra: o.ra,
      dec: o.dec,
      probable_class:
        o.source_type === "Unknown Source" || o.source_type === "Candidate Anomaly"
          ? "Unclassified transient"
          : o.source_type,
      signal_summary: `Flux z=${(o.flux).toFixed(2)}σ dev; SNR ${o.signal_to_noise.toFixed(1)}; λ≈${o.wavelength.toFixed(0)}nm`,
      notes: "",
      review_status: combined > 0.55 ? "Pending" : "Pending",
      tags: combined > 0.7 ? ["priority", "spectral"] : ["auto"],
      priority: severity === "Critical" || severity === "High" ? "High" : "Normal",
      assignee: undefined,
      project_id: projectId ?? o.project_id,
    });
  });

  events.sort((a, b) => b.anomaly_score - a.anomaly_score);
  return events;
}
