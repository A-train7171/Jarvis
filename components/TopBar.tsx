"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Flame,
  User,
  CalendarDays,
  Users,
  Watch,
  Settings,
  Info,
  Hammer,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./Logo";
import { usePT } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";

const MENU: { href: string; label: string; icon: LucideIcon; desc: string }[] = [
  { href: "/profile", label: "Profile", icon: User, desc: "Your goals, stats & progress" },
  { href: "/schedule", label: "Schedule", icon: CalendarDays, desc: "Plan your training week" },
  { href: "/feed", label: "Community Feed", icon: Users, desc: "See what others are doing" },
  { href: "/builder", label: "Workout Builder", icon: Hammer, desc: "Design a custom session" },
  { href: "/devices", label: "Apps & Devices", icon: Watch, desc: "Connect wearables & health data" },
  { href: "/settings", label: "Settings", icon: Settings, desc: "Units, notifications, privacy" },
  { href: "/about", label: "About", icon: Info, desc: "Our mission & health principles" },
];

export function TopBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const streak = usePT((s) => s.streak);
  const hydrated = useHydrated();

  if (pathname?.startsWith("/session")) return null;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg-overlay backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          <Logo size={30} />
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-surface/50 px-3 py-1.5 text-[13px] font-semibold text-ink-primary"
              title="Current streak"
            >
              <Flame size={15} className="text-warn" />
              <span className="stat-number">{hydrated ? streak : 0}</span>
            </span>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg-surface/50 text-ink-secondary transition-colors hover:border-purple/50 hover:text-white"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col border-l border-line bg-bg-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Logo size={30} href={null} />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-secondary hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
                {MENU.map(({ href, label, icon: Icon, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-colors hover:border-line hover:bg-bg-surface/50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink-primary">{label}</span>
                      <span className="block truncate text-xs text-ink-muted">{desc}</span>
                    </span>
                  </Link>
                ))}
              </nav>
              <div className="border-t border-line px-5 py-4 text-[11px] leading-relaxed text-ink-muted">
                Pocket Trainer offers general fitness education, not medical advice.
                Always consult a professional for health decisions.
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
