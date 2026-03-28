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
        "product-glass rounded-xl p-4",
        glow && "border-product-glow",
        className,
      )}
    >
      {children}
    </div>
  );
}
