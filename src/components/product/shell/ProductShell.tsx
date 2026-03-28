"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getClientSessionMock } from "@/lib/auth/placeholder";

const nav = [
  { href: "/product", label: "Overview" },
  { href: "/product/upload", label: "Survey upload" },
  { href: "/product/explorer", label: "Observation explorer" },
  { href: "/product/anomalies", label: "Anomaly center" },
  { href: "/product/analytics", label: "Signal analytics" },
  { href: "/product/sky-map", label: "Sky map" },
  { href: "/product/review", label: "Review queue" },
  { href: "/product/projects", label: "Projects & runs" },
  { href: "/product/reports", label: "Reports & export" },
  { href: "/product/settings", label: "Settings" },
];

export default function ProductShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = getClientSessionMock();

  return (
    <div className="product-shell flex min-h-screen text-slate-200">
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-slate-800/90 bg-[#0a0e14] lg:flex">
        <div className="border-b border-slate-800/90 p-5">
          <Link href="/" className="block space-y-2">
            <Image
              src="/neuralsky-logo.png"
              alt="NeuralSky"
              width={160}
              height={48}
              className="h-10 w-auto object-left object-contain"
            />
            <span className="block text-xs font-medium text-slate-500">Product workspace</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {nav.map((item) => {
            const active =
              item.href === "/product"
                ? pathname === "/product"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-slate-800/80 text-slate-100"
                    : "text-slate-500 hover:bg-slate-900/80 hover:text-slate-200",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/90 p-4 space-y-3 text-xs text-slate-500">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-600">Workspace</p>
            <p className="mt-0.5 truncate text-slate-400">{session.workspaceId}</p>
            <p className="mt-1 truncate">{session.name}</p>
          </div>
          <Link
            href="/"
            className="block w-full rounded-md border border-slate-700/80 py-2 text-center text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
          >
            Marketing site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#070a10]/95 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 lg:px-8">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Product</p>
              <h1 className="mt-0.5 text-base font-semibold text-slate-100 lg:text-[15px]">
                Space data analytics
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="hidden sm:inline">Feeds operational</span>
              <span
                className="hidden h-1.5 w-1.5 rounded-full bg-emerald-500/90 sm:inline"
                aria-hidden
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-8 lg:px-10">{children}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-slate-800/90 bg-[#070a10]/98 py-2 text-[10px] text-slate-500 backdrop-blur-md lg:hidden">
        {nav.slice(0, 6).map((item) => {
          const active =
            item.href === "/product"
              ? pathname === "/product"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "max-w-[20%] truncate px-1 py-1 text-center",
                active ? "text-slate-200" : "text-slate-600",
              )}
            >
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
