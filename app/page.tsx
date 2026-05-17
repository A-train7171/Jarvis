import Link from "next/link";
import { ArrowRight, Sparkles, MapPin, Trophy, type LucideIcon } from "lucide-react";
import { scenes } from "@/lib/mockData";
import { SceneCard } from "@/components/SceneCard";

export default function HomePage() {
  const featured = scenes.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-xl border border-line bg-bg-elevated px-6 py-12 sm:px-10 sm:py-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-0"
          style={{
            background:
              "radial-gradient(600px 300px at 80% 10%, rgba(255,77,46,0.18), transparent 60%), radial-gradient(500px 280px at 10% 90%, rgba(255,77,46,0.10), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-surface/80 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink-secondary backdrop-blur">
            <Sparkles size={12} className="text-accent" /> A new way to explore from
            SetLocate
          </div>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            The world is a film set.
            <br />
            <span className="text-accent">Go find it.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-secondary sm:text-base">
            SetLocate GO turns iconic filming locations into a real-world treasure
            hunt. Walk into the frame, capture the scene, and build a collection of
            the places that made the movies.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-hover"
            >
              Open the map <ArrowRight size={16} />
            </Link>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-bg-surface/60 px-4 py-2.5 text-sm text-ink-primary transition-colors hover:border-ink-muted"
            >
              View collection
            </Link>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-line pt-6">
            <Stat icon={MapPin} label="Scenes seeded" value={`${scenes.length}`} />
            <Stat icon={Sparkles} label="Continents" value="6" />
            <Stat icon={Trophy} label="Capture XP" value="~6.3K" />
          </dl>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Featured scenes</h2>
          <Link
            href="/map"
            className="text-xs text-ink-secondary hover:text-ink-primary"
          >
            See all on map →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {featured.map((s) => (
            <SceneCard key={s.id} scene={s} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-12 rounded-xl border border-line bg-bg-elevated p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          <Step
            n={1}
            title="Spot scenes nearby"
            body="Open the world map to see filming locations dropped exactly where movies were shot."
          />
          <Step
            n={2}
            title="Walk into the frame"
            body="Step inside the capture radius — the same coordinates the camera once stood on."
          />
          <Step
            n={3}
            title="Build your reel"
            body="Tap capture to add the scene to your collection. Stack XP and level up your eye."
          />
        </ol>
      </section>
    </div>
  );
}

function Stat({
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
      <Icon size={14} className="text-accent" />
      <div className="mt-1 font-mono text-xl tabular-nums text-ink-primary">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-ink-muted">
        {label}
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="rounded-lg border border-line bg-bg-surface p-4">
      <div className="font-mono text-xs text-accent">0{n}</div>
      <div className="mt-1 font-semibold text-ink-primary">{title}</div>
      <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{body}</p>
    </li>
  );
}
