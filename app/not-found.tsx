import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-muted">
        404
      </div>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Scene not found
      </h1>
      <p className="mt-2 text-sm text-ink-secondary">
        That location is off the map. Head back and try another scene.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-accent-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
