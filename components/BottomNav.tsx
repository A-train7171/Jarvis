"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Library, User, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/map", label: "Map", icon: Map },
  { href: "/collection", label: "Collection", icon: Library },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-30 border-t border-line glass">
      <div className="mx-auto flex max-w-6xl items-stretch justify-around">
        {items.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] uppercase tracking-widest transition-colors",
                active
                  ? "text-accent"
                  : "text-ink-muted hover:text-ink-secondary"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
