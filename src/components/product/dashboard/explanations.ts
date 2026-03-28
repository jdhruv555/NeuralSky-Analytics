export type PanelExplanation = {
  title: string;
  summary: string;
  bullets: string[];
};

export const DASHBOARD_PANELS: Record<string, PanelExplanation> = {
  overview: {
    title: "Mission overview",
    summary:
      "This screen summarizes survey throughput, detection pressure, and data health for your workspace in one place.",
    bullets: [
      "Numbers refresh from the same store as Upload, Explorer, and Anomaly Center — no duplicate datasets.",
      "Use it as a daily checkpoint before deep dives in Analytics or Review.",
    ],
  },
  kpis: {
    title: "Key metrics",
    summary: "High-level counts and rollups derived from observations and scored events currently in the workspace.",
    bullets: [
      "Total observations — all rows in the observation store (seed + uploads).",
      "Anomalies detected — rows that passed the scoring threshold after processing.",
      "High confidence — events with model confidence at or above 85%.",
      "Surveys / datasets — configured projects plus uploaded files.",
      "Classification confidence — mean confidence across detected anomalies (not global accuracy).",
      "Telescope feeds — distinct telescope IDs present in data (proxy for active streams).",
    ],
  },
  insights: {
    title: "Insights",
    summary:
      "Rule-based summaries generated from current anomaly lists and observation counts. They are deterministic, not LLM output.",
    bullets: [
      "Severity reflects heuristic tags (e.g. high-risk queue, recent transient cluster).",
      "Use alongside charts; for decisions, use Review Queue and raw Explorer rows.",
    ],
  },
  timeline: {
    title: "Signal timeline",
    summary: "Daily counts of observations versus anomaly-flagged events on the same calendar day.",
    bullets: [
      "Observations — number of rows whose timestamp falls on that day.",
      "Anomalies — detection records aligned to that day (may be a subset of observations).",
      "Gaps in the line usually mean no data for that day in the current store.",
    ],
  },
  trend: {
    title: "Anomaly trend",
    summary: "Simple 14-day window of how many anomaly detections occurred per day (from the timeline aggregation).",
    bullets: [
      "Useful for spotting bursts that warrant a pipeline or feed check.",
      "Scale is count per day, not severity-weighted.",
    ],
  },
  classDist: {
    title: "Source class distribution",
    summary: "Share of observations by catalogued source type (pulsar, galaxy, transient, etc.).",
    bullets: [
      "Based on the source_type field on each observation.",
      "Uploads that omit class may appear under Unknown or default labels from the parser.",
    ],
  },
  surveyBars: {
    title: "Survey completion",
    summary: "Observation counts currently associated with each project in the workspace.",
    bullets: [
      "A higher bar means more rows tagged to that project (including seed assignments).",
      "Creating projects and assigning uploads changes these totals after pipeline runs.",
    ],
  },
  recent: {
    title: "Recent detections",
    summary: "Latest anomaly records by score order — quick access to IDs and severity before opening Review or Explorer.",
    bullets: ["Click through to Anomaly Center or Review for workflow actions."],
  },
  ingestion: {
    title: "Ingestion & datasets",
    summary: "Files you uploaded via Survey Upload, plus the bundled seed survey used for demos.",
    bullets: [
      "Status reflects parser + pipeline state on that dataset.",
      "Seed survey is read-only baseline data for first-load experience.",
    ],
  },
};
