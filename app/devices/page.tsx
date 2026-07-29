"use client";

import { useState } from "react";
import { Watch, Activity, HeartPulse, Footprints, Waves, Smartphone, Plug, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
}

const INTEGRATIONS: Integration[] = [
  { id: "apple-health", name: "Apple Health", desc: "Steps, workouts, heart rate", icon: HeartPulse, accent: "#f5455c" },
  { id: "google-fit", name: "Google Fit", desc: "Activity & move minutes", icon: Activity, accent: "#3fb6f5" },
  { id: "whoop", name: "WHOOP", desc: "Recovery, strain & sleep", icon: Waves, accent: "#2fd27a" },
  { id: "garmin", name: "Garmin", desc: "Runs, rides & HRV", icon: Watch, accent: "#8b2eff" },
  { id: "strava", name: "Strava", desc: "Import your cardio", icon: Footprints, accent: "#f5a524" },
  { id: "phone", name: "Phone motion", desc: "Built-in step counter", icon: Smartphone, accent: "#b65cff" },
];

export default function DevicesPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ "apple-health": true });

  return (
    <div className="animate-fade-up">
      <PageHeader title="Apps & Devices" subtitle="Bring your health data into one place." />

      <Card glow className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple/10 text-purple">
          <Plug size={20} />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink-primary">
            {Object.values(connected).filter(Boolean).length} connected
          </div>
          <div className="text-[12px] text-ink-muted">Recovery and activity sharpen your plan.</div>
        </div>
      </Card>

      <div className="space-y-3">
        {INTEGRATIONS.map((it) => {
          const on = !!connected[it.id];
          const Icon = it.icon;
          return (
            <Card key={it.id} className="flex items-center gap-3 p-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${it.accent}1f`, color: it.accent }}
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink-primary">{it.name}</span>
                  {on && <Badge tone="success">Linked</Badge>}
                </div>
                <div className="truncate text-[12px] text-ink-muted">{it.desc}</div>
              </div>
              <Button
                size="sm"
                variant={on ? "secondary" : "primary"}
                onClick={() => setConnected((c) => ({ ...c, [it.id]: !on }))}
                className={cn(on && "text-ink-muted")}
              >
                {on ? "Disconnect" : "Connect"}
              </Button>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-muted">
        You control what&apos;s shared. Connections are managed on your device and can be revoked any time.
      </p>
    </div>
  );
}
