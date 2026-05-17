import Link from "next/link";
import { MapPin } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  const icon = size === "lg" ? 22 : size === "sm" ? 14 : 18;
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 font-semibold tracking-tight"
    >
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white shadow-glow">
        <MapPin size={icon} strokeWidth={2.5} />
      </span>
      <span className={`${text} text-ink-primary`}>
        SetLocate
        <span className="ml-1 rounded-sm bg-ink-primary px-1.5 py-0.5 text-[0.6em] font-bold uppercase tracking-widest text-bg-base">
          GO
        </span>
      </span>
    </Link>
  );
}
