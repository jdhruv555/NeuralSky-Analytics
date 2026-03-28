"use client";

import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/product/ui/Card";
import { ProductButton } from "@/components/product/ui/Button";

export default function SettingsView() {
  const settings = useProductStore((s) => s.settings);
  const updateSettings = useProductStore((s) => s.updateSettings);
  const resetDemo = useProductStore((s) => s.resetDemo);

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-500/80 font-semibold">Control plane</p>
        <h2 className="text-2xl font-semibold text-white mt-1">Settings & integrations</h2>
        <p className="text-sm text-slate-400 mt-2">
          Auth-ready workspace profile, detection thresholds, and integration toggles (mock endpoints).
        </p>
      </div>

      <ProductCard glow>
        <p className="text-sm font-medium text-white mb-4">Workspace / profile</p>
        <div className="space-y-3">
          <label className="block text-xs text-slate-500">
            Workspace name
            <input
              className="mt-1 w-full bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-sm"
              value={settings.workspaceName}
              onChange={(e) => updateSettings({ workspaceName: e.target.value })}
            />
          </label>
          <label className="block text-xs text-slate-500">
            Display name
            <input
              className="mt-1 w-full bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-sm"
              value={settings.profileName}
              onChange={(e) => updateSettings({ profileName: e.target.value })}
            />
          </label>
          <label className="block text-xs text-slate-500">
            Email (auth placeholder)
            <input
              className="mt-1 w-full bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-sm"
              value={settings.email}
              onChange={(e) => updateSettings({ email: e.target.value })}
            />
          </label>
        </div>
      </ProductCard>

      <ProductCard>
        <p className="text-sm font-medium text-white mb-4">Detection thresholds</p>
        <div className="space-y-4">
          <label className="block text-xs text-slate-500">
            Z-score threshold · {settings.anomalyZThreshold.toFixed(2)}
            <input
              type="range"
              min={1.5}
              max={4}
              step={0.05}
              className="w-full mt-2 accent-cyan-500"
              value={settings.anomalyZThreshold}
              onChange={(e) => updateSettings({ anomalyZThreshold: Number(e.target.value) })}
            />
          </label>
          <label className="block text-xs text-slate-500">
            Isolation sensitivity · {settings.isolationSensitivity.toFixed(2)}
            <input
              type="range"
              min={0.3}
              max={1}
              step={0.01}
              className="w-full mt-2 accent-violet-500"
              value={settings.isolationSensitivity}
              onChange={(e) => updateSettings({ isolationSensitivity: Number(e.target.value) })}
            />
          </label>
          <label className="block text-xs text-slate-500">
            Classification sensitivity · {settings.classificationSensitivity.toFixed(2)}
            <input
              type="range"
              min={0.3}
              max={1}
              step={0.01}
              className="w-full mt-2 accent-emerald-500"
              value={settings.classificationSensitivity}
              onChange={(e) => updateSettings({ classificationSensitivity: Number(e.target.value) })}
            />
          </label>
        </div>
      </ProductCard>

      <ProductCard>
        <p className="text-sm font-medium text-white mb-4">Telescope feeds</p>
        <ul className="space-y-2">
          {settings.telescopeFeeds.map((f) => (
            <li
              key={f.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/[0.06] rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm text-white">{f.name}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate max-w-md">{f.endpoint}</p>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={f.active}
                  onChange={(e) =>
                    updateSettings({
                      telescopeFeeds: settings.telescopeFeeds.map((x) =>
                        x.id === f.id ? { ...x, active: e.target.checked } : x,
                      ),
                    })
                  }
                />
                Active
              </label>
            </li>
          ))}
        </ul>
      </ProductCard>

      <ProductCard>
        <p className="text-sm font-medium text-white mb-4">Integrations</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {(
            [
              ["observatoryApi", "Observatory API"],
              ["telescopeFeed", "Telescope feed ingest"],
              ["webhooks", "Webhook alerts"],
              ["emailAlerts", "Email notifications"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 border border-white/[0.06] rounded-lg px-3 py-2 cursor-pointer hover:bg-white/[0.02]">
              <input
                type="checkbox"
                checked={settings.integrations[key]}
                onChange={(e) =>
                  updateSettings({
                    integrations: { ...settings.integrations, [key]: e.target.checked },
                  })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <label className="block text-xs text-slate-500 mt-4">
          Webhook URL
          <input
            className="mt-1 w-full bg-[#0c1222] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono"
            value={settings.webhookUrl}
            onChange={(e) => updateSettings({ webhookUrl: e.target.value })}
          />
        </label>
      </ProductCard>

      <ProductCard>
        <p className="text-sm font-medium text-white mb-2">Danger zone</p>
        <ProductButton
          variant="danger"
          onClick={() => {
            resetDemo();
            toast.success("Reset to bundled survey data");
          }}
        >
          Reset workspace to seed data
        </ProductButton>
      </ProductCard>
    </div>
  );
}
