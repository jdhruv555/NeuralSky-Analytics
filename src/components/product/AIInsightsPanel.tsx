"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { generateInsights } from "@/lib/product/insights";
import { useProductStore } from "@/store/useProductStore";
import { cn } from "@/lib/utils";

export function AIInsightsPanel({ className }: { className?: string }) {
  const anomalies = useProductStore((s) => s.anomalies);
  const observations = useProductStore((s) => s.observations);

  const insights = useMemo(
    () => generateInsights(anomalies, observations),
    [anomalies, observations],
  );

  return (
    <div className={cn("product-glass-strong rounded-xl border border-violet-500/15 overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-violet-600/10 to-cyan-600/10">
        <Sparkles className="w-4 h-4 text-violet-300" />
        <span className="text-sm font-semibold text-white">AI Insights</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 ml-auto">
          Heuristic layer
        </span>
      </div>
      <ul className="divide-y divide-white/[0.05] max-h-[420px] overflow-y-auto">
        {insights.map((ins, i) => (
          <motion.li
            key={ins.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="px-4 py-3 hover:bg-white/[0.02]"
          >
            <p className="text-xs font-medium text-slate-100">{ins.title}</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ins.detail}</p>
            <span
              className={cn(
                "inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide",
                ins.severity === "critical" && "text-red-400",
                ins.severity === "warning" && "text-amber-400",
                ins.severity === "info" && "text-cyan-400/90",
              )}
            >
              {ins.severity}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
