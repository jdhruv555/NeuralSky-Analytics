"use client";

import { useMemo } from "react";
import { generateInsights } from "@/lib/product/insights";
import { useProductStore } from "@/store/useProductStore";
import { cn } from "@/lib/utils";

export function AIInsightsPanel({
  className,
  hideIntro = false,
}: {
  className?: string;
  /** When true, only the list (use with an external section title). */
  hideIntro?: boolean;
}) {
  const anomalies = useProductStore((s) => s.anomalies);
  const observations = useProductStore((s) => s.observations);

  const insights = useMemo(
    () => generateInsights(anomalies, observations),
    [anomalies, observations],
  );

  return (
    <div className={cn("rounded-lg border border-slate-800/90 bg-slate-950/35", className)}>
      {!hideIntro && (
        <div className="border-b border-slate-800/90 px-4 py-3">
          <p className="text-sm font-medium text-slate-200">Insights</p>
          <p className="mt-0.5 text-xs text-slate-500">Rule-based summaries from your current workspace data.</p>
        </div>
      )}
      <ul className={cn("divide-y divide-slate-800/80", hideIntro && "rounded-lg overflow-hidden")}>
        {insights.map((ins) => (
          <li key={ins.id} className="px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm text-slate-200">{ins.title}</p>
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                  ins.severity === "critical" && "bg-red-950/50 text-red-300/90",
                  ins.severity === "warning" && "bg-amber-950/40 text-amber-200/90",
                  ins.severity === "info" && "bg-slate-800/80 text-slate-400",
                )}
              >
                {ins.severity}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{ins.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
