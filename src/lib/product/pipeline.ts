import type { PipelineRun, PipelineStage } from "@/types/product";

export const PIPELINE_STAGE_NAMES = [
  "Ingestion",
  "Cleaning",
  "Normalization",
  "Signal Filtering",
  "Feature Extraction",
  "Anomaly Scoring",
  "Event Classification",
  "Review Queue Generation",
] as const;

export function createEmptyPipelineRun(
  id: string,
  projectId: string,
  datasetId: string,
): PipelineRun {
  const startedAt = new Date().toISOString();
  const stages: PipelineStage[] = PIPELINE_STAGE_NAMES.map((name) => ({
    name,
    status: "pending" as const,
    log: [],
  }));
  return {
    id,
    projectId,
    datasetId,
    stages,
    startedAt,
    status: "running",
  };
}

export async function simulatePipelineProgress(
  run: PipelineRun,
  onUpdate: (run: PipelineRun) => void,
  options?: { delayMs?: number },
): Promise<PipelineRun> {
  const delay = options?.delayMs ?? 420;
  const current = { ...run, stages: run.stages.map((s) => ({ ...s, log: [...s.log] })) };

  for (let i = 0; i < current.stages.length; i++) {
    current.stages[i].status = "running";
    current.stages[i].log.push(`[${new Date().toISOString()}] Starting ${current.stages[i].name}…`);
    onUpdate({ ...current });

    await new Promise((r) => setTimeout(r, delay + Math.random() * 180));

    const ok = Math.random() > 0.04;
    current.stages[i].status = ok ? "done" : "error";
    current.stages[i].log.push(
      ok
        ? `[${new Date().toISOString()}] Completed ${current.stages[i].name} (${(Math.random() * 400 + 120).toFixed(0)}ms)`
        : `[${new Date().toISOString()}] WARN: threshold edge case — continuing with fallback`,
    );
    if (!ok) {
      current.stages[i].status = "done";
      current.stages[i].log.push(`[${new Date().toISOString()}] Recovered using robust estimator`);
    }
    onUpdate({ ...current });
  }

  current.status = "complete";
  current.completedAt = new Date().toISOString();
  onUpdate({ ...current });
  return current;
}
