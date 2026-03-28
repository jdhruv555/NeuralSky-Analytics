"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, FileJson, FileSpreadsheet, Play, Terminal } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductButton } from "@/components/product/ui/Button";
import { ProductBadge } from "@/components/product/ui/Badge";
import { PIPELINE_STAGE_NAMES } from "@/lib/product/pipeline";
import { cn } from "@/lib/utils";

export default function UploadView() {
  const datasets = useProductStore((s) => s.datasets);
  const projects = useProductStore((s) => s.projects);
  const pipelineRuns = useProductStore((s) => s.pipelineRuns);
  const addDatasetFromFile = useProductStore((s) => s.addDatasetFromFile);
  const runPipelineForDataset = useProductStore((s) => s.runPipelineForDataset);
  const assignDatasetToProject = useProductStore((s) => s.assignDatasetToProject);

  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id ?? "");
  const [logsOpen, setLogsOpen] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const file = files[0];
      const name = file.name.toLowerCase();
      let kind: "csv" | "json" | "fits" = "csv";
      if (name.endsWith(".json")) kind = "json";
      if (name.endsWith(".fits") || name.endsWith(".fts") || name.endsWith(".txt")) kind = "fits";

      setBusy(file.name);
      const text = await file.text();
      const res = await addDatasetFromFile(file.name, kind, text, setProgress);
      setBusy(null);
      setProgress(0);
      if (res.error || !res.dataset) {
        toast.error(res.error ?? "Upload failed");
        return;
      }
      toast.success(`Ingested ${res.dataset.rowCount} rows`);
    },
    [addDatasetFromFile],
  );

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Ingestion</p>
        <h2 className="text-2xl font-semibold text-white mt-1">Survey upload & pipeline</h2>
        <p className="text-sm text-slate-400 mt-2">
          CSV, JSON, or mock FITS blocks. Parsed rows merge into the observation store and fuel downstream
          detection.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
          drag ? "border-cyan-400/60 bg-cyan-500/10" : "border-white/10 bg-white/[0.02]",
        )}
      >
        <Upload className="w-10 h-10 mx-auto text-cyan-400/80 mb-4" />
        <p className="text-slate-200 font-medium">Drop files or choose</p>
        <p className="text-xs text-slate-500 mt-2 mb-4">
          .csv · .json · mock FITS (pipe-separated blocks) · try{" "}
          <a href="/sample-survey.csv" className="text-cyan-400 hover:underline" download>
            sample-survey.csv
          </a>
        </p>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".csv,.json,.txt,.fits,.fts"
          onChange={(e) => onFiles(e.target.files)}
        />
        <ProductButton variant="secondary" type="button" onClick={() => fileRef.current?.click()}>
          Browse
        </ProductButton>
        {busy && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono truncate">{busy}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProductCard>
          <FileSpreadsheet className="w-6 h-6 text-cyan-400 mb-2" />
          <p className="text-sm font-medium text-white">CSV</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Headers: observation_id, timestamp, ra, dec, brightness, flux, signal_to_noise, wavelength,
            exposure_time, source_type, telescope_id
          </p>
        </ProductCard>
        <ProductCard>
          <FileJson className="w-6 h-6 text-violet-400 mb-2" />
          <p className="text-sm font-medium text-white">JSON</p>
          <p className="text-[11px] text-slate-500 mt-1">Array of objects or {"{ observations: [] }"}.</p>
        </ProductCard>
        <ProductCard>
          <Terminal className="w-6 h-6 text-emerald-400 mb-2" />
          <p className="text-sm font-medium text-white">Mock FITS</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Blocks separated by --- with lines like{" "}
            <code className="text-cyan-500/90">ra|12.5</code>
          </p>
        </ProductCard>
      </div>

      <ProductCard glow>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <p className="text-sm font-medium text-white">Run processing pipeline</p>
            <p className="text-xs text-slate-500 mt-1">
              Assign dataset to a project, then execute staged analytics (simulated with live logs).
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {datasets.length === 0 && (
            <p className="text-sm text-slate-500">Upload a dataset to enable pipeline runs.</p>
          )}
          {datasets.map((d) => (
            <div
              key={d.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-white/[0.06] px-4 py-3"
            >
              <div>
                <p className="text-sm text-white font-medium">{d.name}</p>
                <p className="text-[11px] text-slate-500">
                  {d.rowCount} rows · {new Date(d.uploadedAt).toLocaleString()} · {d.validation}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ProductBadge>{d.processingStatus}</ProductBadge>
                <ProductButton
                  variant="secondary"
                  className="text-xs py-1.5"
                  disabled={d.processingStatus === "processing"}
                  onClick={() => {
                    assignDatasetToProject(d.id, selectedProject);
                    runPipelineForDataset(d.id, selectedProject);
                    toast.message("Pipeline started");
                  }}
                >
                  <Play className="w-3.5 h-3.5" /> Run pipeline
                </ProductButton>
              </div>
            </div>
          ))}
        </div>

        {logsOpen && pipelineRuns.length > 0 && (
          <div className="mt-6 rounded-lg border border-white/[0.06] bg-black/40 overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:bg-white/[0.03]"
              onClick={() => setLogsOpen((v) => !v)}
            >
              <Terminal className="w-4 h-4" /> Latest pipeline logs
            </button>
            <div className="max-h-[280px] overflow-y-auto font-mono text-[10px] text-slate-400 p-3 space-y-3">
              {pipelineRuns
                .slice(-3)
                .reverse()
                .map((run) => (
                  <div key={run.id}>
                    <p className="text-cyan-500/90 mb-1">Run {run.id}</p>
                    {run.stages.map((s) => (
                      <div key={s.name} className="mb-2">
                        <span
                          className={cn(
                            "text-[10px] uppercase",
                            s.status === "done" && "text-emerald-400",
                            s.status === "running" && "text-amber-400",
                            s.status === "error" && "text-red-400",
                            s.status === "pending" && "text-slate-600",
                          )}
                        >
                          {s.name}
                        </span>
                        {s.log.map((l, i) => (
                          <p key={i} className="text-slate-500 pl-2 border-l border-white/10">
                            {l}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}
      </ProductCard>

      <ProductCard>
        <p className="text-sm font-medium text-white mb-2">Stage reference</p>
        <div className="flex flex-wrap gap-2">
          {PIPELINE_STAGE_NAMES.map((n) => (
            <span
              key={n}
              className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-400"
            >
              {n}
            </span>
          ))}
        </div>
      </ProductCard>
    </div>
  );
}
