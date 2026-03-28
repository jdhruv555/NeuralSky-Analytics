"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductButton } from "@/components/product/ui/Button";
import { ProductBadge } from "@/components/product/ui/Badge";

export default function ProjectsView() {
  const projects = useProductStore((s) => s.projects);
  const datasets = useProductStore((s) => s.datasets);
  const createProject = useProductStore((s) => s.createProject);
  const [name, setName] = useState("");
  const [tel, setTel] = useState("VLT-UT4");
  const [src, setSrc] = useState("Survey");

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Orchestration</p>
        <h2 className="text-2xl font-semibold text-white mt-1">Projects & runs</h2>
      </div>

      <ProductCard glow>
        <p className="text-sm font-medium text-white mb-3">Create project</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Telescope"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
          <input
            className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Source mode"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
        </div>
        <ProductButton
          className="mt-4"
          onClick={() => {
            if (!name.trim()) {
              toast.error("Name required");
              return;
            }
            createProject(name.trim(), tel, src);
            setName("");
            toast.success("Project created");
          }}
        >
          Create project
        </ProductButton>
      </ProductCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <ProductCard key={p.id} glow>
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {p.telescope} · {p.source}
                </p>
              </div>
              <ProductBadge kind={p.runStatus === "running" ? "Pending" : p.runStatus === "complete" ? "Confirmed" : "Low"}>
                {p.runStatus}
              </ProductBadge>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="border border-white/[0.06] rounded-md px-2 py-1.5">
                <dt className="text-slate-500">Observations</dt>
                <dd className="text-slate-200">{p.observationCount}</dd>
              </div>
              <div className="border border-white/[0.06] rounded-md px-2 py-1.5">
                <dt className="text-slate-500">Anomalies</dt>
                <dd className="text-slate-200">{p.anomaliesFound}</dd>
              </div>
              <div className="border border-white/[0.06] rounded-md px-2 py-1.5 col-span-2">
                <dt className="text-slate-500">Datasets linked</dt>
                <dd className="text-slate-400">
                  {p.datasetIds.length ? p.datasetIds.join(", ") : "None (assign from upload)"}
                </dd>
              </div>
            </dl>
          </ProductCard>
        ))}
      </div>

      <ProductCard>
        <p className="text-sm font-medium text-white mb-2">Uploaded datasets</p>
        <ul className="text-xs text-slate-400 space-y-1">
          {datasets.length === 0 && <li>No datasets yet.</li>}
          {datasets.map((d) => (
            <li key={d.id} className="flex justify-between border-b border-white/[0.04] py-2">
              <span>{d.name}</span>
              <span>{d.rowCount} rows</span>
            </li>
          ))}
        </ul>
      </ProductCard>
    </div>
  );
}
