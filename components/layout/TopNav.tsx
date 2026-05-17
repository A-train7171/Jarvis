"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/map", label: "Map" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-divider/60 glass">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-cinematic text-ink-primary">
              SetLocate
            </span>
            <span className="rounded-md bg-accent-primary px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
              GO
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-btn px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-white/8 text-ink-primary"
                    : "text-ink-secondary hover:text-ink-primary hover:bg-white/5"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="mono-meta text-ink-secondary">v0.1 · BETA</div>
      </div>
    </header>
  );
}
