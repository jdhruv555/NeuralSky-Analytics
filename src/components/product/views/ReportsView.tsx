"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { FileDown, Printer } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductButton } from "@/components/product/ui/Button";
import { downloadBlob, exportAnomaliesCSV, exportProjectJSON, exportReviewedCSV } from "@/lib/product/export";

export default function ReportsView() {
  const anomalies = useProductStore((s) => s.anomalies);
  const observations = useProductStore((s) => s.observations);
  const projects = useProductStore((s) => s.projects);
  const pipelineRuns = useProductStore((s) => s.pipelineRuns);

  const kpis = useMemo(
    () => ({
      obs: observations.length,
      anom: anomalies.length,
      rev: anomalies.filter((a) => a.review_status !== "Pending").length,
    }),
    [observations, anomalies],
  );

  const chartData = useMemo(
    () => projects.map((p) => ({ name: p.name.slice(0, 10), anomalies: p.anomaliesFound })),
    [projects],
  );

  const printReport = () => {
    window.print();
  };

  const downloadHtmlReport = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>NeuralSky Report</title>
    <style>body{font-family:system-ui;background:#0f172a;color:#e2e8f0;padding:32px;} h1{color:#22d3ee} table{border-collapse:collapse;width:100%} td,th{border:1px solid #334155;padding:8px;font-size:12px}</style></head><body>
    <h1>NeuralSky · Analysis report</h1>
    <p>Generated ${new Date().toISOString()}</p>
    <h2>KPIs</h2><ul><li>Observations: ${kpis.obs}</li><li>Anomalies: ${kpis.anom}</li><li>Reviewed: ${kpis.rev}</li></ul>
    <h2>Recent pipelines</h2>
    <table><thead><tr><th>Run</th><th>Status</th><th>Completed</th></tr></thead><tbody>
    ${pipelineRuns
      .slice(-5)
      .map(
        (r) =>
          `<tr><td>${r.id}</td><td>${r.status}</td><td>${r.completedAt ?? "—"}</td></tr>`,
      )
      .join("")}
    </tbody></table>
    </body></html>`;
    downloadBlob(`neuralsky-report-${Date.now()}.html`, html, "text/html");
    toast.success("HTML report downloaded");
  };

  return (
    <div className="space-y-8 print:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Export</p>
          <h2 className="text-2xl font-semibold text-white mt-1">Reports & export</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <ProductButton variant="secondary" className="text-xs" onClick={() => exportAnomaliesCSV(anomalies)}>
            <FileDown className="w-3.5 h-3.5" /> Anomaly CSV
          </ProductButton>
          <ProductButton variant="secondary" className="text-xs" onClick={() => exportReviewedCSV(anomalies)}>
            Reviewed CSV
          </ProductButton>
          <ProductButton
            variant="secondary"
            className="text-xs"
            onClick={() => {
              const p = projects[0];
              if (p) exportProjectJSON(p);
              else toast.error("No project");
            }}
          >
            Project JSON
          </ProductButton>
          <ProductButton variant="secondary" className="text-xs" onClick={downloadHtmlReport}>
            HTML report
          </ProductButton>
          <ProductButton variant="ghost" className="text-xs" onClick={printReport}>
            <Printer className="w-3.5 h-3.5" /> Print
          </ProductButton>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["Total observations", kpis.obs],
          ["Anomalies flagged", kpis.anom],
          ["Human-reviewed", kpis.rev],
        ].map(([label, val]) => (
          <ProductCard key={String(label)} glow>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
            <p className="text-3xl font-semibold text-white mt-1 tabular-nums">{val}</p>
          </ProductCard>
        ))}
      </div>

      <ProductCard className="print:border print:border-white/20">
        <p className="text-sm font-medium text-white mb-4">Snapshot · anomalies by project</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(34,211,238,0.2)" }} />
              <Bar dataKey="anomalies" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ProductCard>

      <ProductCard>
        <p className="text-sm font-medium text-white mb-2">Recent run summary</p>
        <ul className="text-xs text-slate-400 space-y-2">
          {pipelineRuns.slice(-3).reverse().map((r) => (
            <li key={r.id} className="border border-white/[0.06] rounded-lg px-3 py-2">
              <span className="text-cyan-300 font-mono">{r.id}</span> · {r.status} ·{" "}
              {r.completedAt ? new Date(r.completedAt).toLocaleString() : "in progress"}
            </li>
          ))}
          {pipelineRuns.length === 0 && <li>No pipeline runs yet — run from Survey Upload.</li>}
        </ul>
      </ProductCard>
    </div>
  );
}
