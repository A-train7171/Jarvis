"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Zap, Check, Crosshair, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Scene } from "@/types";
import { usePlayer } from "@/lib/store";
import { RarityBadge } from "./RarityBadge";
import { formatCoord } from "@/lib/utils";
import { CaptureBurst } from "./CaptureBurst";

export function SceneDrawer({
  scene,
  onClose,
}: {
  scene: Scene | null;
  onClose: () => void;
}) {
  const captured = usePlayer((s) =>
    scene ? s.capturedIds.includes(scene.id) : false
  );
  const capture = usePlayer((s) => s.capture);
  const [burst, setBurst] = useState(false);

  // simulated "distance" — randomized per scene, deterministic by id
  const distance = useMemo(() => {
    if (!scene) return 0;
    const seed = scene.id
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return ((seed * 37) % 400) + 20; // 20–420m
  }, [scene]);

  const inRange = scene ? distance <= scene.captureRadiusMeters : false;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <AnimatePresence>
        {scene && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-bg-base/40 backdrop-blur-[2px]"
            />
            <motion.aside
              key="drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-40 max-h-[88dvh] overflow-y-auto rounded-t-xl border-t border-line bg-bg-elevated shadow-lift md:inset-y-0 md:right-0 md:left-auto md:h-dvh md:w-[440px] md:max-h-none md:rounded-none md:border-l md:border-t-0"
            >
              <div className="relative">
                <div className="relative h-56 w-full overflow-hidden bg-bg-surface md:h-64">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-elevated via-bg-elevated/30 to-transparent" />
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg-base/70 text-ink-primary backdrop-blur transition-colors hover:bg-bg-base"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute left-3 top-3">
                    <RarityBadge rarity={scene.rarity} />
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">
                    {scene.movie} · {scene.year}
                  </div>
                  <h2 className="mt-1 text-2xl font-semibold leading-tight">
                    {scene.title}
                  </h2>
                  <div className="mt-1 text-sm text-ink-secondary">
                    dir. {scene.director}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
                    {scene.description}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <Meta label="Location" value={`${scene.city}, ${scene.country}`} />
                    <Meta label="Reward" value={`${scene.xp} XP`} accent />
                    <Meta
                      label="Coordinates"
                      value={formatCoord(...scene.coordinates)}
                      mono
                    />
                    <Meta
                      label="Capture radius"
                      value={`${scene.captureRadiusMeters} m`}
                      mono
                    />
                  </dl>

                  <div className="mt-5 rounded-md border border-line bg-bg-surface p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 text-ink-secondary">
                        <Crosshair size={13} className="text-accent" />
                        Simulated distance
                      </span>
                      <span className="font-mono tabular-nums text-ink-primary">
                        {distance} m
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-base">
                      <div
                        className={
                          "h-full transition-all " +
                          (inRange ? "bg-success" : "bg-accent")
                        }
                        style={{
                          width: `${Math.min(100, Math.max(6, 100 - (distance / 500) * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-ink-muted">
                      {inRange
                        ? "You're inside the capture radius."
                        : `Get within ${scene.captureRadiusMeters} m to capture.`}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    {captured ? (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success"
                      >
                        <Check size={16} strokeWidth={3} /> Already in your collection
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const ok = capture(scene);
                          if (ok) setBurst(true);
                        }}
                        disabled={!inRange}
                        className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                      >
                        <Zap size={16} />
                        {inRange ? "Capture scene" : "Out of range"}
                      </button>
                    )}
                    <Link
                      href={`/scene/${scene.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line px-4 py-2.5 text-xs text-ink-secondary transition-colors hover:border-ink-muted hover:text-ink-primary"
                    >
                      View full details <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CaptureBurst
        show={burst}
        xp={scene?.xp ?? 0}
        onDone={() => setBurst(false)}
      />
    </>
  );
}

function Meta({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-ink-muted">
        {label}
      </dt>
      <dd
        className={
          "mt-0.5 text-sm " +
          (mono ? "font-mono " : "") +
          (accent ? "text-accent" : "text-ink-primary")
        }
      >
        {value}
      </dd>
    </div>
  );
}

