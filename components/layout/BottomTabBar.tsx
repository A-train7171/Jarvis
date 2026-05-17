"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-divider/60 glass md:hidden">
      <div className="grid grid-cols-3">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium transition-colors",
                active ? "text-accent-primary" : "text-ink-secondary"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              <span className="mono-meta">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
