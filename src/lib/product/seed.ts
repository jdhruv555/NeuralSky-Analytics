import type { Observation, Project, SourceType, WorkspaceSettings } from "@/types/product";

const TELESCOPES = ["VLT-UT4", "Keck-II", "Gemini-N", "Subaru", "LCOGT-1m"];
const SOURCES: SourceType[] = [
  "Pulsar",
  "Galaxy",
  "Quasar",
  "Unknown Source",
  "Transient Event",
  "Candidate Anomaly",
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoFromDays(base: Date, daysOffset: number, hours: number) {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() - daysOffset);
  d.setUTCHours(hours, Math.floor((hours % 1) * 60), 0, 0);
  return d.toISOString();
}

export function buildSeedObservations(count = 110, seed = 42): Observation[] {
  const rand = mulberry32(seed);
  const base = new Date();
  const obs: Observation[] = [];

  for (let i = 0; i < count; i++) {
    const ra = rand() * 360;
    const dec = rand() * 140 - 70;
    const telescope_id = TELESCOPES[Math.floor(rand() * TELESCOPES.length)];
    const source_type = SOURCES[Math.floor(rand() * SOURCES.length)];
    const flux = 0.5 + rand() * 4.5 + (source_type === "Transient Event" ? rand() * 8 : 0);
    const brightness = 12 + rand() * 8 - flux * 0.4;
    const signal_to_noise = 8 + rand() * 35 + (flux > 6 ? rand() * 20 : 0);
    const anomaly_hint =
      source_type === "Candidate Anomaly" || source_type === "Transient Event"
        ? 0.4 + rand() * 0.55
        : rand() * 0.35;

    obs.push({
      id: `obs-${i + 1}`,
      observation_id: `NSK-${2026}${String(i + 1).padStart(5, "0")}`,
      timestamp: isoFromDays(base, Math.floor(rand() * 14), rand() * 24),
      ra: Number(ra.toFixed(6)),
      dec: Number(dec.toFixed(6)),
      brightness: Number(brightness.toFixed(3)),
      flux: Number(flux.toFixed(4)),
      signal_to_noise: Number(signal_to_noise.toFixed(2)),
      wavelength: 400 + rand() * 600,
      exposure_time: 30 + Math.floor(rand() * 480),
      source_type,
      telescope_id,
      anomaly_score: Number((anomaly_hint * (0.6 + rand())).toFixed(4)),
      confidence: Number((0.55 + rand() * 0.44).toFixed(3)),
    });
  }

  return obs;
}

export function buildSeedProjects(observations: Observation[]): Project[] {
  const byTel = (t: string) => observations.filter((o) => o.telescope_id === t).length;
  return [
    {
      id: "proj-draco-deep",
      name: "Draco Deep Field",
      telescope: "VLT-UT4",
      source: "Survey",
      createdAt: new Date(Date.now() - 86400000 * 21).toISOString(),
      observationCount: byTel("VLT-UT4"),
      anomaliesFound: 0,
      runStatus: "complete",
      datasetIds: [],
    },
    {
      id: "proj-transient-hunt",
      name: "Transient Hunt Q1",
      telescope: "Keck-II",
      source: "Targeted",
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
      observationCount: byTel("Keck-II"),
      anomaliesFound: 0,
      runStatus: "idle",
      datasetIds: [],
    },
    {
      id: "proj-sky-sweep",
      name: "Sky Sweep North",
      telescope: "Gemini-N",
      source: "All-sky",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      observationCount: byTel("Gemini-N"),
      anomaliesFound: 0,
      runStatus: "idle",
      datasetIds: [],
    },
  ];
}

export function defaultSettings(): WorkspaceSettings {
  return {
    workspaceName: "NeuralSky Observatory",
    profileName: "Analyst",
    email: "analyst@neuralsky.io",
    telescopeFeeds: [
      { id: "feed-1", name: "VLT Stream", active: true, endpoint: "kafka://vlt.internal/nsk" },
      { id: "feed-2", name: "Gemini North", active: true, endpoint: "https://api.gemini.edu/feed" },
      { id: "feed-3", name: "LCOGT Network", active: false, endpoint: "wss://lco.global/stream" },
    ],
    anomalyZThreshold: 2.8,
    isolationSensitivity: 0.72,
    classificationSensitivity: 0.65,
    exportFormatDefault: "csv",
    integrations: {
      observatoryApi: true,
      telescopeFeed: true,
      webhooks: false,
      emailAlerts: true,
    },
    webhookUrl: "https://hooks.neuralsky.io/ingest/demo",
  };
}
