import type { AnomalyEvent, Project } from "@/types/product";

export function toCSV(rows: Record<string, string | number | boolean | undefined>[]): string {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"')) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const header = keys.join(",");
  const body = rows.map((r) => keys.map((k) => esc(r[k])).join(",")).join("\n");
  return `${header}\n${body}`;
}

export function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAnomaliesCSV(events: AnomalyEvent[]) {
  const rows = events.map((e) => ({
    id: e.id,
    observation_id: e.observation_id,
    anomaly_score: e.anomaly_score,
    confidence: e.confidence,
    severity: e.severity,
    timestamp: e.timestamp,
    ra: e.ra,
    dec: e.dec,
    probable_class: e.probable_class,
    review_status: e.review_status,
  }));
  downloadBlob(`neuralsky-anomalies-${Date.now()}.csv`, toCSV(rows), "text/csv");
}

export function exportReviewedCSV(events: AnomalyEvent[]) {
  const reviewed = events.filter((e) => e.review_status !== "Pending");
  exportAnomaliesCSV(reviewed);
}

export function exportProjectJSON(project: Project) {
  downloadBlob(
    `neuralsky-project-${project.id}.json`,
    JSON.stringify(project, null, 2),
    "application/json",
  );
}
