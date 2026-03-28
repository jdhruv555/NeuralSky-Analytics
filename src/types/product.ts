export type SourceType =
  | "Pulsar"
  | "Galaxy"
  | "Quasar"
  | "Unknown Source"
  | "Transient Event"
  | "Candidate Anomaly";

export type Severity = "Low" | "Medium" | "High" | "Critical";

export type ReviewStatus = "Pending" | "Reviewed" | "Confirmed" | "Rejected";

export type Priority = "Low" | "Normal" | "High";

export interface Observation {
  id: string;
  observation_id: string;
  timestamp: string;
  ra: number;
  dec: number;
  brightness: number;
  flux: number;
  signal_to_noise: number;
  wavelength: number;
  exposure_time: number;
  source_type: SourceType;
  telescope_id: string;
  anomaly_score?: number;
  confidence?: number;
  project_id?: string;
  dataset_id?: string;
  notes?: string;
  tags?: string[];
}

export interface AnomalyEvent {
  id: string;
  observation_id: string;
  anomaly_score: number;
  confidence: number;
  severity: Severity;
  timestamp: string;
  ra: number;
  dec: number;
  probable_class: string;
  signal_summary: string;
  notes: string;
  review_status: ReviewStatus;
  tags: string[];
  priority: Priority;
  assignee?: string;
  project_id?: string;
}

export interface UploadedDataset {
  id: string;
  name: string;
  uploadedAt: string;
  rowCount: number;
  validation: "valid" | "warning" | "error";
  processingStatus: "idle" | "processing" | "complete" | "failed";
  project_id?: string;
  observations: Observation[];
  metadata: Record<string, string>;
  previewRows: Record<string, string | number>[];
}

export type PipelineStageStatus = "pending" | "running" | "done" | "error";

export interface PipelineStage {
  name: string;
  status: PipelineStageStatus;
  log: string[];
}

export interface PipelineRun {
  id: string;
  projectId: string;
  datasetId: string;
  stages: PipelineStage[];
  startedAt: string;
  completedAt?: string;
  status: "running" | "complete" | "failed";
}

export interface Project {
  id: string;
  name: string;
  telescope: string;
  source: string;
  createdAt: string;
  observationCount: number;
  anomaliesFound: number;
  runStatus: "idle" | "running" | "complete";
  latestPipelineId?: string;
  datasetIds: string[];
}

export interface WorkspaceSettings {
  workspaceName: string;
  profileName: string;
  email: string;
  telescopeFeeds: { id: string; name: string; active: boolean; endpoint: string }[];
  anomalyZThreshold: number;
  isolationSensitivity: number;
  classificationSensitivity: number;
  exportFormatDefault: "csv" | "json";
  integrations: {
    observatoryApi: boolean;
    telescopeFeed: boolean;
    webhooks: boolean;
    emailAlerts: boolean;
  };
  webhookUrl: string;
}

export interface AIInsight {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
}
