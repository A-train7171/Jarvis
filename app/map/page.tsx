"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { getSceneById } from "@/lib/mockData";
import { SceneDrawer } from "@/components/SceneDrawer";
import { Loader2 } from "lucide-react";

const MapView = dynamic(
  () => import("@/components/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-bg-elevated text-ink-muted">
        <Loader2 className="animate-spin" size={18} />
      </div>
    ),
  }
);

export default function MapPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const scene = selected ? getSceneById(selected) ?? null : null;

  return (
    <div className="relative h-[calc(100dvh-7rem)] w-full overflow-hidden">
      <MapView onSelect={setSelected} />
      <SceneDrawer scene={scene} onClose={() => setSelected(null)} />
    </div>
  );
}
