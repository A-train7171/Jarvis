import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Film, Calendar, User, type LucideIcon } from "lucide-react";
import { getSceneById, scenes } from "@/lib/mockData";
import { RarityBadge } from "@/components/RarityBadge";
import { formatCoord } from "@/lib/utils";
import { CaptureClient } from "./CaptureClient";

export function generateStaticParams() {
  return scenes.map((s) => ({ id: s.id }));
}

export default function SceneDetail({ params }: { params: { id: string } }) {
  const scene = getSceneById(params.id);
  if (!scene) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-4">
      <Link
        href="/map"
        className="inline-flex items-center gap-1.5 text-xs text-ink-secondary transition-colors hover:text-ink-primary"
      >
        <ArrowLeft size={12} /> Back to map
      </Link>

      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-bg-elevated">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scene.imageUrl}
            alt={scene.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-bg-elevated/20 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <RarityBadge rarity={scene.rarity} />
            <span className="rounded-full border border-line bg-bg-base/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-ink-secondary backdrop-blur">
              {scene.country}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">
            {scene.movie}
          </div>
          <h1 className="mt-1 text-3xl font-semibold leading-tight tracking-tight">
            {scene.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-secondary">
            {scene.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
            <Field icon={Film} label="Film" value={scene.movie} />
            <Field icon={Calendar} label="Year" value={`${scene.year}`} />
            <Field icon={User} label="Director" value={scene.director} />
            <Field icon={MapPin} label="City" value={scene.city} />
          </dl>

          <div className="mt-6 rounded-md border border-line bg-bg-surface p-4">
            <div className="text-[10px] uppercase tracking-widest text-ink-muted">
              Coordinates
            </div>
            <div className="mt-1 font-mono text-sm text-ink-primary">
              {formatCoord(...scene.coordinates)}
            </div>
          </div>

          <div className="mt-6">
            <CaptureClient sceneId={scene.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-ink-muted">
        <Icon size={11} /> {label}
      </div>
      <div className="mt-0.5 text-sm text-ink-primary">{value}</div>
    </div>
  );
}
