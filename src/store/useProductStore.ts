"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnomalyEvent,
  Observation,
  PipelineRun,
  Priority,
  Project,
  ReviewStatus,
  UploadedDataset,
  WorkspaceSettings,
} from "@/types/product";
import { buildAnomalyEvents } from "@/lib/product/anomaly-engine";
import { buildSeedObservations, buildSeedProjects, defaultSettings } from "@/lib/product/seed";
import { createEmptyPipelineRun, simulatePipelineProgress } from "@/lib/product/pipeline";
import { parseObservationCSV, parseObservationJSON, parseMockFITS } from "@/lib/product/parsers";

const STORAGE_KEY = "neuralsky-product-store-v1";

function countAnomaliesByProject(anomalies: AnomalyEvent[], projectId: string) {
  return anomalies.filter((a) => a.project_id === projectId).length;
}

type ProductState = {
  observations: Observation[];
  anomalies: AnomalyEvent[];
  datasets: UploadedDataset[];
  projects: Project[];
  pipelineRuns: PipelineRun[];
  settings: WorkspaceSettings;
  seedVersion: number;
  /** ingestion progress 0–1 for UI */
  uploadProgress: Record<string, number>;
};

type ProductActions = {
  resetDemo: () => void;
  addDatasetFromFile: (
    name: string,
    kind: "csv" | "json" | "fits",
    text: string,
    onProgress: (p: number) => void,
  ) => Promise<{ dataset: UploadedDataset | null; error?: string }>;
  runPipelineForDataset: (datasetId: string, projectId: string) => Promise<void>;
  recalculateAnomalies: () => void;
  updateReview: (
    eventId: string,
    patch: Partial<{
      review_status: ReviewStatus;
      notes: string;
      tags: string[];
      priority: Priority;
      assignee: string;
    }>,
  ) => void;
  createProject: (name: string, telescope: string, source: string) => Project;
  assignDatasetToProject: (datasetId: string, projectId: string) => void;
  updateSettings: (patch: Partial<WorkspaceSettings>) => void;
  attachObservationsToProject: (observationIds: string[], projectId: string) => void;
};

const SEED_VER = 1;

function initialState(): ProductState {
  const observations = buildSeedObservations(120, 42).map((o, i) => ({
    ...o,
    project_id: i % 3 === 0 ? "proj-draco-deep" : i % 3 === 1 ? "proj-transient-hunt" : "proj-sky-sweep",
  }));
  const settings = defaultSettings();
  const anomalies = buildAnomalyEvents(observations, settings.anomalyZThreshold);
  const projects = buildSeedProjects(observations).map((p) => ({
    ...p,
    anomaliesFound: anomalies.filter((a) => a.project_id === p.id).length,
    datasetIds: [],
  }));

  return {
    observations,
    anomalies,
    datasets: [],
    projects,
    pipelineRuns: [],
    settings,
    seedVersion: SEED_VER,
    uploadProgress: {},
  };
}

export const useProductStore = create<ProductState & ProductActions>()(
  persist(
    (set, get) => ({
      ...initialState(),

      resetDemo: () => set(initialState()),

      addDatasetFromFile: async (name, kind, text, onProgress) => {
        const id = `ds-${Date.now()}`;
        onProgress(0.1);
        await new Promise((r) => setTimeout(r, 120));
        onProgress(0.35);

        let rows: Observation[] = [];
        const errors: string[] = [];

        if (kind === "csv") {
          const r = parseObservationCSV(text);
          rows = r.rows;
          errors.push(...r.errors);
        } else if (kind === "json") {
          const r = parseObservationJSON(text);
          rows = r.rows;
          errors.push(...r.errors);
        } else {
          const r = parseMockFITS(text);
          rows = r.rows;
          errors.push(...r.errors);
        }

        onProgress(0.7);
        await new Promise((r) => setTimeout(r, 80));

        if (!rows.length) {
          return { dataset: null, error: errors.join("; ") || "No rows parsed" };
        }

        const observations = rows.map((o) => ({
          ...o,
          id: `${o.id}-${id}`,
          dataset_id: id,
        }));

        const previewRows = observations.slice(0, 8).map((o) => ({
          observation_id: o.observation_id,
          ra: o.ra,
          dec: o.dec,
          flux: o.flux,
          signal_to_noise: o.signal_to_noise,
        }));

        const dataset: UploadedDataset = {
          id,
          name,
          uploadedAt: new Date().toISOString(),
          rowCount: observations.length,
          validation: errors.length ? "warning" : "valid",
          processingStatus: "idle",
          observations,
          metadata: {
            parser: kind,
            warnings: errors.join("; ") || "none",
          },
          previewRows,
        };

        set((s) => ({
          datasets: [...s.datasets, dataset],
          observations: [...s.observations, ...observations],
        }));

        get().recalculateAnomalies();
        onProgress(1);
        return { dataset };
      },

      runPipelineForDataset: async (datasetId, projectId) => {
        const ds = get().datasets.find((d) => d.id === datasetId);
        if (!ds) return;

        set((s) => ({
          datasets: s.datasets.map((d) =>
            d.id === datasetId ? { ...d, processingStatus: "processing" as const } : d,
          ),
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, runStatus: "running" as const } : p,
          ),
        }));

        const runId = `run-${Date.now()}`;
        let run = createEmptyPipelineRun(runId, projectId, datasetId);
        set((s) => ({ pipelineRuns: [...s.pipelineRuns, run] }));

        run = await simulatePipelineProgress(run, (updated) => {
          set((s) => ({
            pipelineRuns: s.pipelineRuns.map((r) => (r.id === updated.id ? updated : r)),
          }));
        });

        const scoped = ds.observations;
        set((s) => ({
          datasets: s.datasets.map((d) =>
            d.id === datasetId ? { ...d, processingStatus: "complete" as const, project_id: projectId } : d,
          ),
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  runStatus: "complete" as const,
                  latestPipelineId: run.id,
                  datasetIds: Array.from(new Set([...p.datasetIds, datasetId])),
                  observationCount: p.observationCount + scoped.length,
                }
              : p,
          ),
          pipelineRuns: s.pipelineRuns.map((r) => (r.id === run.id ? run : r)),
          observations: s.observations.map((o) =>
            scoped.some((x) => x.id === o.id) ? { ...o, project_id: projectId } : o,
          ),
        }));
        get().recalculateAnomalies();
      },

      recalculateAnomalies: () => {
        const { observations, settings } = get();
        const next = buildAnomalyEvents(observations, settings.anomalyZThreshold);
        set({ anomalies: next });
        set((s) => ({
          projects: s.projects.map((p) => ({
            ...p,
            anomaliesFound: countAnomaliesByProject(next, p.id),
          })),
        }));
      },

      updateReview: (eventId, patch) => {
        set((s) => ({
          anomalies: s.anomalies.map((a) => (a.id === eventId ? { ...a, ...patch } : a)),
        }));
      },

      createProject: (name, telescope, source) => {
        const p: Project = {
          id: `proj-${Date.now()}`,
          name,
          telescope,
          source,
          createdAt: new Date().toISOString(),
          observationCount: 0,
          anomaliesFound: 0,
          runStatus: "idle",
          datasetIds: [],
        };
        set((s) => ({ projects: [...s.projects, p] }));
        return p;
      },

      assignDatasetToProject: (datasetId, projectId) => {
        set((s) => ({
          datasets: s.datasets.map((d) =>
            d.id === datasetId ? { ...d, project_id: projectId } : d,
          ),
        }));
      },

      attachObservationsToProject: (observationIds, projectId) => {
        set((s) => ({
          observations: s.observations.map((o) =>
            observationIds.includes(o.id) ? { ...o, project_id: projectId } : o,
          ),
        }));
        get().recalculateAnomalies();
      },

      updateSettings: (patch) => {
        set((s) => ({ settings: { ...s.settings, ...patch } }));
        get().recalculateAnomalies();
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        observations: s.observations,
        anomalies: s.anomalies,
        datasets: s.datasets,
        projects: s.projects,
        pipelineRuns: s.pipelineRuns,
        settings: s.settings,
        seedVersion: s.seedVersion,
      }),
    },
  ),
);
