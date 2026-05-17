"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scenes } from "@/lib/mockData";
import { usePlayer } from "@/lib/store";
import { SceneCard } from "@/components/SceneCard";
import { Library, ArrowRight } from "lucide-react";

export default function CollectionPage() {
  const capturedIds = usePlayer((s) => s.capturedIds);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const captured = scenes.filter((s) => capturedIds.includes(s.id));
  const remaining = scenes.filter((s) => !capturedIds.includes(s.id));
  const total = scenes.length;
  const pct = mounted ? Math.round((captured.length / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">
            Your Reel
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Collection
          </h1>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl tabular-nums">
            {mounted ? captured.length : "—"}
            <span className="text-ink-muted"> / {total}</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-ink-muted">
            scenes captured · {pct}%
          </div>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {mounted && captured.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-line bg-bg-elevated p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-surface text-ink-muted">
            <Library size={20} />
          </div>
          <div className="mt-4 text-sm font-semibold">Your collection is empty</div>
          <p className="mx-auto mt-1 max-w-sm text-xs text-ink-secondary">
            Open the world map, walk into a scene, and capture it to start your
            reel.
          </p>
          <Link
            href="/map"
            className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-accent-hover"
          >
            Open map <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <>
          {captured.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-xs uppercase tracking-widest text-ink-muted">
                Captured
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {captured.map((s) => (
                  <SceneCard key={s.id} scene={s} captured />
                ))}
              </div>
            </section>
          )}

          {remaining.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-xs uppercase tracking-widest text-ink-muted">
                Still to find
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {remaining.map((s) => (
                  <SceneCard key={s.id} scene={s} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
