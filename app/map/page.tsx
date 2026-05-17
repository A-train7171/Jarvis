"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { scenes, Scene } from "@/lib/mockData";
import { SceneCard } from "@/components/scene/SceneCard";
import { ScenePopover } from "@/components/scene/ScenePopover";
import { XPPill } from "@/components/game/XPPill";
import { Pill } from "@/components/ui/Pill";
import { Search, Filter, X } from "lucide-react";

const SceneMap = dynamic(() => import("@/components/scene/SceneMap").then(m => m.SceneMap), { ssr: false });

export default function MapPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Scene | null>(null);
  const filtered = scenes.filter((s) =>
    [s.filmTitle, s.city, s.country].some((v) => v.toLowerCase().includes(query.toLowerCase()))
  );
  const nearby = [...filtered].sort((a, b) => b.captureCount - a.captureCount).slice(0, 10);

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <SceneMap scenes={filtered} onSelect={(s) => setSelected(s)} />

      {/* Top floating bar */}
      <div className="absolute inset-x-0 top-0 z-10 p-3 md:p-4">
        <div className="mx-auto max-w-5xl flex items-center gap-2">
          <div className="flex-1 glass rounded-full h-11 flex items-center gap-2.5 px-4">
            <Search size={15} className="text-ink-secondary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH SCENES, FILMS, CITIES"
              className="mono-meta bg-transparent flex-1 outline-none placeholder:text-ink-secondary/70 text-ink-primary"
            />
            <button className="text-ink-secondary hover:text-ink-primary"><Filter size={15} /></button>
          </div>
          <div className="hidden md:block">
            <XPPill />
          </div>
        </div>
      </div>

      {/* Mobile XP */}
      <div className="absolute top-16 right-3 z-10 md:hidden">
        <XPPill />
      </div>

      {/* Legend */}
      <div className="absolute top-3 left-3 z-10 hidden md:block">
        <Pill><span className="mono-meta">{filtered.length} SCENES IN VIEW</span></Pill>
      </div>

      {/* Selected scene popover */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="absolute z-20 left-1/2 -translate-x-1/2 top-20 md:top-auto md:bottom-[260px] md:left-6 md:translate-x-0"
          >
            <div className="relative">
              <button
                aria-label="Close"
                onClick={() => setSelected(null)}
                className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full glass hover:bg-white/10"
              >
                <X size={14} />
              </button>
              <ScenePopover scene={selected} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom rail */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-4 md:pb-6">
        <div className="px-4 md:px-6 mb-2 flex items-center justify-between">
          <div className="mono-meta text-ink-secondary glass rounded-full px-3 py-1.5">
            NEARBY SCENES
          </div>
          <div className="mono-meta text-ink-secondary glass rounded-full px-3 py-1.5">
            SWIPE →
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 md:px-6 pb-2">
            {nearby.map((s, i) => (
              <SceneCard key={s.id} scene={s} distanceKm={1.2 + i * 3.4} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
