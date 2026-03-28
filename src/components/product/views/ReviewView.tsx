"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, Flag, Download } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import type { ReviewStatus } from "@/types/product";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductBadge } from "@/components/product/ui/Badge";
import { ProductButton } from "@/components/product/ui/Button";
import { exportAnomaliesCSV } from "@/lib/product/export";

export default function ReviewView() {
  const anomalies = useProductStore((s) => s.anomalies);
  const updateReview = useProductStore((s) => s.updateReview);
  const [filter, setFilter] = useState<ReviewStatus | "all">("all");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const rows = useMemo(() => {
    if (filter === "all") return anomalies;
    return anomalies.filter((a) => a.review_status === filter);
  }, [anomalies, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">HITL</p>
          <h2 className="text-2xl font-semibold text-white mt-1">Detections review queue</h2>
        </div>
        <ProductButton
          variant="secondary"
          className="text-xs"
          onClick={() => {
            exportAnomaliesCSV(anomalies.filter((a) => a.review_status !== "Pending"));
            toast.success("Exported reviewed subset");
          }}
        >
          <Download className="w-3.5 h-3.5" /> Export selected logic
        </ProductButton>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "Pending", "Reviewed", "Confirmed", "Rejected"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg border ${
              filter === s ? "border-violet-500/40 bg-violet-500/10 text-violet-100" : "border-white/10 text-slate-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((a) => (
          <ProductCard key={a.id}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm text-cyan-200">{a.observation_id}</span>
                  <ProductBadge kind={a.severity}>{a.severity}</ProductBadge>
                  <ProductBadge kind={a.review_status}>{a.review_status}</ProductBadge>
                  <span className="text-[10px] text-slate-500">Prio: {a.priority}</span>
                  {a.assignee && <span className="text-[10px] text-slate-500">@{a.assignee}</span>}
                </div>
                <p className="text-xs text-slate-400 mt-2">{a.signal_summary}</p>
                <textarea
                  className="mt-3 w-full bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-xs min-h-[64px]"
                  placeholder="Analyst notes…"
                  value={notes[a.id] ?? a.notes}
                  onChange={(e) => setNotes((m) => ({ ...m, [a.id]: e.target.value }))}
                  onBlur={() => {
                    const v = notes[a.id];
                    if (v !== undefined) updateReview(a.id, { notes: v });
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <ProductButton
                  variant="secondary"
                  className="text-xs py-1.5"
                  onClick={() => {
                    updateReview(a.id, { review_status: "Confirmed" });
                    toast.success("Confirmed");
                  }}
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </ProductButton>
                <ProductButton
                  variant="danger"
                  className="text-xs py-1.5"
                  onClick={() => {
                    updateReview(a.id, { review_status: "Rejected" });
                    toast.message("Rejected");
                  }}
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </ProductButton>
                <ProductButton
                  variant="ghost"
                  className="text-xs py-1.5"
                  onClick={() => {
                    updateReview(a.id, { review_status: "Reviewed", priority: "High" });
                    toast.message("Flagged for follow-up");
                  }}
                >
                  <Flag className="w-3.5 h-3.5" /> Follow-up
                </ProductButton>
              </div>
            </div>
          </ProductCard>
        ))}
      </div>
    </div>
  );
}
