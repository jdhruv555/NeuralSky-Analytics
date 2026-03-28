"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Compass,
  FolderKanban,
  Home,
  Layers,
  LineChart,
  Map,
  Settings,
  Upload,
  ClipboardList,
  Sparkles,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductButton } from "@/components/product/ui/Button";
import { getClientSessionMock } from "@/lib/auth/placeholder";

const nav = [
  { href: "/product", label: "Overview", icon: Home },
  { href: "/product/upload", label: "Survey Upload", icon: Upload },
  { href: "/product/explorer", label: "Observation Explorer", icon: Compass },
  { href: "/product/anomalies", label: "Anomaly Center", icon: AlertTriangle },
  { href: "/product/analytics", label: "Signal Analytics", icon: LineChart },
  { href: "/product/sky-map", label: "Sky Map", icon: Map },
  { href: "/product/review", label: "Review Queue", icon: ClipboardList },
  { href: "/product/projects", label: "Projects & Runs", icon: FolderKanban },
  { href: "/product/reports", label: "Reports & Export", icon: BarChart3 },
  { href: "/product/settings", label: "Settings", icon: Settings },
];

export default function ProductShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = getClientSessionMock();

  return (
    <div className="product-shell product-grid-bg flex min-h-screen text-slate-200">
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-white/[0.06] bg-[#060a12]/90 backdrop-blur-xl">
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/90 font-bold">
                NeuralSky
              </p>
              <p className="text-sm font-semibold text-white tracking-tight">Product</p>
            </div>
          </Link>
          <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
            Space data analytics · Surveys · Anomaly detection
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {nav.map((item) => {
            const active =
              item.href === "/product"
                ? pathname === "/product"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-cyan-500/10 text-cyan-100 border border-cyan-500/25 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]",
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", active && "text-cyan-300")} />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-dot" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06] space-y-3">
          <div className="product-glass rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Workspace</p>
            <p className="text-xs font-medium text-slate-200 truncate">{session.workspaceId}</p>
            <p className="text-[11px] text-slate-500 mt-1">{session.name}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <ProductButton variant="secondary" className="w-full text-xs py-2">
                <Layers className="w-3.5 h-3.5" /> Site
              </ProductButton>
            </Link>
            <ProductButton variant="ghost" className="px-2 py-2" title="Sign out (demo)">
              <LogOut className="w-4 h-4 opacity-60" />
            </ProductButton>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050810]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 lg:px-8 py-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-500/90 font-bold">
                NeuralSky Product
              </p>
              <h1 className="text-lg font-semibold text-white truncate">
                Space Data Analytics · Telescopic Surveys & Anomaly Detection
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs text-emerald-200/90">Feeds healthy</span>
              </div>
              <ProductButton variant="secondary" className="text-xs py-2">
                <Activity className="w-3.5 h-3.5" /> Quick run
              </ProductButton>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">{children}</div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#050810]/95 backdrop-blur-xl flex justify-around py-2 px-1 safe-area-pb">
        {nav.slice(0, 5).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 min-w-0 flex-1">
              <Icon className={cn("w-5 h-5", active ? "text-cyan-400" : "text-slate-500")} />
              <span className={cn("text-[9px] truncate", active ? "text-cyan-200" : "text-slate-500")}>
                {item.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
