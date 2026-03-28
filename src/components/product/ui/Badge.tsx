"use client";

import { cn } from "@/lib/utils";

const severityColors: Record<string, string> = {
  Low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Medium: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  High: "bg-orange-500/15 text-orange-200 border-orange-500/30",
  Critical: "bg-red-500/20 text-red-200 border-red-500/40",
  Pending: "bg-cyan-500/10 text-cyan-200 border-cyan-500/25",
  Reviewed: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
  Confirmed: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  Rejected: "bg-slate-600/30 text-slate-400 border-slate-500/25",
};

export function ProductBadge({
  children,
  className,
  kind,
}: {
  children: React.ReactNode;
  className?: string;
  kind?: keyof typeof severityColors;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        kind && severityColors[kind],
        !kind && "bg-white/5 border-white/10 text-slate-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

