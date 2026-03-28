"use client";

import { cn } from "@/lib/utils";

export function ProductCard({
  className,
  children,
  glow,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "product-glass rounded-lg p-4",
        glow && "border-slate-600/30 shadow-sm shadow-black/20",
        className,
      )}
    >
      {children}
    </div>
  );
}
