"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Salad, Dumbbell, ScanLine, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/nutrition", label: "Nutrition", icon: Salad },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/form", label: "Form", icon: ScanLine },
  { href: "/coach", label: "Coach", icon: Sparkles },
];

export function TabBar() {
  const pathname = usePathname();
  // Immersive during an active workout session.
  if (pathname?.startsWith("/session")) return null;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="pointer-events-auto mx-3 flex w-full max-w-md items-stretch justify-around gap-1 rounded-[26px] border border-line bg-bg-overlay px-2 py-2 shadow-lift backdrop-blur-xl">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-medium transition-colors",
                active ? "text-white" : "text-ink-muted hover:text-ink-secondary"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-2xl transition-all",
                  active && "bg-purple-gradient shadow-glow-sm"
                )}
              >
                <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className={cn("tracking-wide", active && "text-ink-secondary")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
