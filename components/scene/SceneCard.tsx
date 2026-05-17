"use client";
import Link from "next/link";
import { Scene, TIER_META } from "@/lib/mockData";
import { Card } from "@/components/ui/Card";
import { RarityBadge } from "@/components/scene/RarityBadge";
import { MapPin } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function SceneCard({ scene, distanceKm }: { scene: Scene; distanceKm?: number }) {
  const meta = TIER_META[scene.tier];
  return (
    <Link href={`/capture/${scene.id}`} className="group block">
      <Card className="overflow-hidden w-[260px] flex-shrink-0">
        <div
          className="relative h-[140px] bg-cover bg-center"
          style={{ backgroundImage: `url(${scene.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-bg-1 via-bg-1/30 to-transparent" />
          <div className="absolute top-2 left-2"><RarityBadge tier={scene.tier} /></div>
          <div className="absolute bottom-2 right-2 mono-meta text-ink-primary">
            +{formatNumber(scene.points)} PTS
          </div>
        </div>
        <div className="p-3">
          <div className="mono-meta text-ink-secondary mb-1">{scene.year}</div>
          <div className="cinematic-tracking text-[15px] font-semibold leading-tight group-hover:text-accent-primary transition-colors line-clamp-1">
            {scene.filmTitle}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-ink-secondary">
            <MapPin size={12} style={{ color: meta.color }} />
            <span className="line-clamp-1">{scene.city}, {scene.country}</span>
            {typeof distanceKm === "number" && (
              <span className="mono-meta ml-auto">{distanceKm.toFixed(1)} KM</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
