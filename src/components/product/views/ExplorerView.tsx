"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import type { Observation, SourceType } from "@/types/product";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductBadge } from "@/components/product/ui/Badge";
import { ProductButton } from "@/components/product/ui/Button";

const SOURCES: SourceType[] = [
  "Pulsar",
  "Galaxy",
  "Quasar",
  "Unknown Source",
  "Transient Event",
  "Candidate Anomaly",
];

export default function ExplorerView() {
  const observations = useProductStore((s) => s.observations);
  const [q, setQ] = useState("");
  const [telescope, setTelescope] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [snMin, setSnMin] = useState("");
  const [snMax, setSnMax] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 12;
  const [detail, setDetail] = useState<Observation | null>(null);

  const telescopes = useMemo(() => {
    const s = new Set(observations.map((o) => o.telescope_id));
    return Array.from(s);
  }, [observations]);

  const filtered = useMemo(() => {
    return observations.filter((o) => {
      if (q && !`${o.observation_id} ${o.telescope_id}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (telescope !== "all" && o.telescope_id !== telescope) return false;
      if (source !== "all" && o.source_type !== source) return false;
      if (snMin && o.signal_to_noise < Number(snMin)) return false;
      if (snMax && o.signal_to_noise > Number(snMax)) return false;
      return true;
    });
  }, [observations, q, telescope, source, snMin, snMax]);

  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const miniChart = useMemo(() => {
    if (!detail) return [];
    return [
      { i: 0, v: detail.flux * 0.9 },
      { i: 1, v: detail.flux * 1.05 },
      { i: 2, v: detail.flux },
      { i: 3, v: detail.flux * 1.12 },
      { i: 4, v: detail.flux * 0.95 },
    ];
  }, [detail]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Explorer</p>
        <h2 className="text-2xl font-semibold text-white mt-1">Observation explorer</h2>
      </div>

      <ProductCard>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full bg-[#0c1222] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm"
              placeholder="Search observation / telescope…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <select
            className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-xs"
            value={telescope}
            onChange={(e) => setTelescope(e.target.value)}
          >
            <option value="all">All telescopes</option>
            {telescopes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className="bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-xs"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="all">All source types</option>
            {SOURCES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            className="w-24 bg-[#0c1222] border border-white/10 rounded-lg px-2 py-2 text-xs"
            placeholder="SNR min"
            value={snMin}
            onChange={(e) => setSnMin(e.target.value)}
          />
          <input
            className="w-24 bg-[#0c1222] border border-white/10 rounded-lg px-2 py-2 text-xs"
            placeholder="SNR max"
            value={snMax}
            onChange={(e) => setSnMax(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">RA / Dec</th>
                <th className="px-3 py-2">Flux</th>
                <th className="px-3 py-2">SNR</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Tel</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-white/[0.04] hover:bg-white/[0.02] cursor-pointer"
                  onClick={() => setDetail(o)}
                >
                  <td className="px-3 py-2 font-mono text-cyan-200/90">{o.observation_id}</td>
                  <td className="px-3 py-2 text-slate-400">{o.timestamp.slice(0, 16)}</td>
                  <td className="px-3 py-2">
                    {o.ra.toFixed(2)}°, {o.dec.toFixed(2)}°
                  </td>
                  <td className="px-3 py-2">{o.flux.toFixed(3)}</td>
                  <td className="px-3 py-2">{o.signal_to_noise.toFixed(1)}</td>
                  <td className="px-3 py-2">
                    <ProductBadge className="!normal-case tracking-normal">{o.source_type}</ProductBadge>
                  </td>
                  <td className="px-3 py-2 text-slate-400">{o.telescope_id}</td>
                  <td className="px-3 py-2 text-right">
                    <ProductButton variant="ghost" className="text-[11px] py-1">
                      Open
                    </ProductButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <span>
            {filtered.length} rows · page {page + 1}/{totalPages}
          </span>
          <div className="flex gap-2">
            <ProductButton variant="secondary" className="text-xs py-1" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Prev
            </ProductButton>
            <ProductButton
              variant="secondary"
              className="text-xs py-1"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </ProductButton>
          </div>
        </div>
      </ProductCard>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <ProductCard className="w-full" glow>
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] uppercase text-slate-500">Observation</p>
                <h3 className="text-lg font-semibold text-white font-mono">{detail.observation_id}</h3>
              </div>
              <ProductButton variant="ghost" className="text-xs" onClick={() => setDetail(null)}>
                Close
              </ProductButton>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {[
                ["Timestamp", detail.timestamp],
                ["RA / Dec", `${detail.ra}° / ${detail.dec}°`],
                ["Brightness", String(detail.brightness)],
                ["Flux", String(detail.flux)],
                ["SNR", String(detail.signal_to_noise)],
                ["λ (nm)", String(detail.wavelength)],
                ["Exposure (s)", String(detail.exposure_time)],
                ["Telescope", detail.telescope_id],
                ["Anomaly score", detail.anomaly_score?.toFixed(3) ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="border border-white/[0.06] rounded-md px-2 py-1.5">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-slate-200 font-mono">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="i" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(34,211,238,0.2)" }} />
                  <Line type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} dot={false} name="Flux slice" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Synthetic slice for demo — full time-series in production pipelines.</p>
          </ProductCard>
          </div>
        </div>
      )}
    </div>
  );
}
