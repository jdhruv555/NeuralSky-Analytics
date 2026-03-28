import type { Observation, SourceType } from "@/types/product";

const SOURCE_TYPES: SourceType[] = [
  "Pulsar",
  "Galaxy",
  "Quasar",
  "Unknown Source",
  "Transient Event",
  "Candidate Anomaly",
];

function parseSource(s: string): SourceType {
  const t = s.trim();
  return (SOURCE_TYPES.find((x) => x === t) ?? "Unknown Source") as SourceType;
}

export function parseObservationCSV(text: string): { rows: Observation[]; errors: string[] } {
  const errors: string[] = [];
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    errors.push("CSV must include a header row and at least one data row.");
    return { rows: [], errors };
  }
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);

  const rows: Observation[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",").map((c) => c.trim());
    try {
      const obs: Observation = {
        id: `upl-${Date.now()}-${i}`,
        observation_id: cells[idx("observation_id")] || `UPL-${i}`,
        timestamp: cells[idx("timestamp")] || new Date().toISOString(),
        ra: parseFloat(cells[idx("ra")] || "0"),
        dec: parseFloat(cells[idx("dec")] || "0"),
        brightness: parseFloat(cells[idx("brightness")] || "15"),
        flux: parseFloat(cells[idx("flux")] || "1"),
        signal_to_noise: parseFloat(cells[idx("signal_to_noise")] || "12"),
        wavelength: parseFloat(cells[idx("wavelength")] || "550"),
        exposure_time: parseFloat(cells[idx("exposure_time")] || "120"),
        source_type: parseSource(cells[idx("source_type")] || "Unknown Source"),
        telescope_id: cells[idx("telescope_id")] || "IMPORT",
        anomaly_score: cells[idx("anomaly_score")] ? parseFloat(cells[idx("anomaly_score")]) : undefined,
        confidence: cells[idx("confidence")] ? parseFloat(cells[idx("confidence")]) : undefined,
      };
      if (Number.isNaN(obs.ra) || Number.isNaN(obs.dec)) {
        errors.push(`Row ${i + 1}: invalid coordinates`);
        continue;
      }
      rows.push(obs);
    } catch {
      errors.push(`Row ${i + 1}: parse error`);
    }
  }

  return { rows, errors };
}

export function parseObservationJSON(text: string): { rows: Observation[]; errors: string[] } {
  const errors: string[] = [];
  try {
    const data = JSON.parse(text) as unknown;
    const arr = Array.isArray(data) ? data : (data as { observations?: unknown }).observations;
    if (!Array.isArray(arr)) {
      errors.push("JSON must be an array of observations or { observations: [] }.");
      return { rows: [], errors };
    }
    const rows: Observation[] = arr.map((raw: Record<string, unknown>, i: number) => ({
      id: `upl-json-${Date.now()}-${i}`,
      observation_id: String(raw.observation_id ?? `JSON-${i}`),
      timestamp: String(raw.timestamp ?? new Date().toISOString()),
      ra: Number(raw.ra ?? 0),
      dec: Number(raw.dec ?? 0),
      brightness: Number(raw.brightness ?? 15),
      flux: Number(raw.flux ?? 1),
      signal_to_noise: Number(raw.signal_to_noise ?? 12),
      wavelength: Number(raw.wavelength ?? 550),
      exposure_time: Number(raw.exposure_time ?? 120),
      source_type: parseSource(String(raw.source_type ?? "Unknown Source")),
      telescope_id: String(raw.telescope_id ?? "JSON"),
      anomaly_score: raw.anomaly_score != null ? Number(raw.anomaly_score) : undefined,
      confidence: raw.confidence != null ? Number(raw.confidence) : undefined,
    }));
    return { rows, errors };
  } catch {
    errors.push("Invalid JSON");
    return { rows: [], errors };
  }
}

/** Mock FITS: pipe-delimited key-value block */
export function parseMockFITS(text: string): { rows: Observation[]; errors: string[] } {
  const errors: string[] = [];
  const rows: Observation[] = [];
  const blocks = text.split(/\n---\n/).map((b) => b.trim()).filter(Boolean);
  blocks.forEach((block, i) => {
    const kv: Record<string, string> = {};
    block.split("\n").forEach((line) => {
      const [k, ...rest] = line.split("|");
      if (k && rest.length) kv[k.trim().toLowerCase()] = rest.join("|").trim();
    });
    try {
      rows.push({
        id: `fits-${Date.now()}-${i}`,
        observation_id: kv.observation_id ?? `FITS-${i}`,
        timestamp: kv.timestamp ?? new Date().toISOString(),
        ra: parseFloat(kv.ra ?? "0"),
        dec: parseFloat(kv.dec ?? "0"),
        brightness: parseFloat(kv.brightness ?? "15"),
        flux: parseFloat(kv.flux ?? "1"),
        signal_to_noise: parseFloat(kv.signal_to_noise ?? "12"),
        wavelength: parseFloat(kv.wavelength ?? "550"),
        exposure_time: parseFloat(kv.exposure_time ?? "120"),
        source_type: parseSource(kv.source_type ?? "Unknown Source"),
        telescope_id: kv.telescope_id ?? "FITS-MOCK",
      });
    } catch {
      errors.push(`Block ${i + 1}: invalid`);
    }
  });
  if (!rows.length && !errors.length) errors.push("No FITS-like records found.");
  return { rows, errors };
}
