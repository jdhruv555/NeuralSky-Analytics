"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import type { PanelExplanation } from "@/components/product/dashboard/explanations";

type Props = {
  panel: PanelExplanation;
  className?: string;
};

/** Text-only trigger + modal — minimal chrome, readable copy. */
export function ExplainDialog({ panel, className }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            "text-xs text-slate-500 hover:text-slate-300 underline-offset-2 hover:underline transition-colors",
            className,
          )}
        >
          About
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[min(100vw-2rem,28rem)] max-h-[85vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-700/80 bg-[#0f1419] p-6 shadow-2xl outline-none focus:outline-none">
          <Dialog.Title className="text-base font-semibold text-slate-100 pr-8">{panel.title}</Dialog.Title>
          <Dialog.Description className="mt-3 text-sm text-slate-400 leading-relaxed">{panel.summary}</Dialog.Description>
          <ul className="mt-4 list-disc pl-4 space-y-2 text-sm text-slate-300 leading-relaxed">
            {panel.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <Dialog.Close asChild>
            <button
              type="button"
              className="mt-6 w-full rounded-lg border border-slate-600/60 bg-slate-800/50 py-2.5 text-sm text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
