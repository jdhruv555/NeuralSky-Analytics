"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:
    "bg-gradient-to-r from-cyan-600/90 to-indigo-600/90 text-white border border-cyan-500/30 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-500/10",
  secondary:
    "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-cyan-500/20",
  ghost: "text-slate-300 hover:text-white hover:bg-white/5",
  danger: "bg-red-500/15 text-red-200 border border-red-500/30 hover:bg-red-500/25",
};

export const ProductButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }
>(({ className, variant = "default", ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all disabled:opacity-40",
      variants[variant],
      className,
    )}
    {...props}
  />
));
ProductButton.displayName = "ProductButton";
