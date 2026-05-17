"use client";
import { Scene, TIER_META } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";
import { RarityBadge } from "@/components/scene/RarityBadge";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export function ScenePopover({ scene, distanceKm }: { scene: Scene; distanceKm?: number }) {
  const meta = TIER_META[scene.tier];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="w-[300px] overflow-hidden rounded-card glass"
    >
      <div
        className="relative h-[120px] bg-cover bg-center border-b border-white/5"
        style={{ backgroundImage: `url(${scene.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg-1 via-transparent to-transparent" />
        <div
          className="absolute inset-x-3 bottom-2 mono-meta"
          style={{ color: meta.color }}
        >
          {scene.country.toUpperCase()} · {scene.city.toUpperCase()}
        </div>
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="mono-meta text-ink-secondary">{scene.year}</div>
            <div className="cinematic-tracking text-base font-semibold leading-tight">
              {scene.filmTitle}
            </div>
          </div>
          <RarityBadge tier={scene.tier} />
        </div>
        <p className="text-[13px] text-ink-secondary line-clamp-2 mb-3">{scene.sceneDescription}</p>
        <div className="flex items-center justify-between text-[12px] text-ink-secondary mb-3">
          <div className="flex items-center gap-1.5">
            <Users size={12} />
            <span>{formatNumber(scene.captureCount)} captured</span>
          </div>
          {typeof distanceKm === "number" && (
            <div className="flex items-center gap-1.5">
              <MapPin size={12} style={{ color: meta.color }} />
              <span className="mono-meta">{distanceKm.toFixed(1)} KM AWAY</span>
            </div>
          )}
        </div>
        <Link href={`/capture/${scene.id}`} className="block">
          <Button className="w-full" variant="primary">
            Travel to Scene · +{formatNumber(scene.points)} PTS
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
