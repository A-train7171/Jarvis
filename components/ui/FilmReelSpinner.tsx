import { cn } from "@/lib/utils";

export function FilmReelSpinner({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn("text-accent-primary", className)}
      style={{ animation: "spin 1.4s linear infinite" }}
    >
      <rect x="3" y="3" width="26" height="26" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <circle cx="9" cy="9" r="2" fill="currentColor" />
      <circle cx="23" cy="9" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="23" cy="23" r="2" fill="currentColor" opacity="0.35" />
      <circle cx="9" cy="23" r="2" fill="currentColor" opacity="0.15" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}
