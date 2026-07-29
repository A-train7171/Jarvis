import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The Pocket Trainer mark: a bold, upright geometric "P" with one aggressive
 * angled point at the top-left, a dumbbell nested inside the bowl, and a subtle
 * negative-space cut through the center. Purple gradient (#8B2EFF → #5B18C9)
 * with #B65CFF highlights.
 */
function MarkSvg({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Pocket Trainer">
      <defs>
        <linearGradient id="pt-mark-grad" x1="18" y1="10" x2="82" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B65CFF" />
          <stop offset="0.45" stopColor="#8B2EFF" />
          <stop offset="1" stopColor="#5B18C9" />
        </linearGradient>
        <linearGradient id="pt-bell-grad" x1="48" y1="30" x2="72" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D9B4FF" />
          <stop offset="1" stopColor="#B65CFF" />
        </linearGradient>
      </defs>

      {/* P body with the bowl counter cut out (evenodd). The aggressive top-left
          point is the (18,14) tip. The counter reveals the background behind the mark. */}
      <path
        fillRule="evenodd"
        fill="url(#pt-mark-grad)"
        d="M 26 88 L 26 30 L 18 14 L 54 14
           C 70 14 82 24 82 38
           C 82 53 69 60 50 60
           L 44 60 L 44 88 Z
           M 47 25
           C 59 22 70 27 70 37
           C 70 47 59 51 47 49
           C 47 41 47 33 47 25 Z"
      />

      {/* Subtle negative-space cut through the center for depth */}
      <path d="M 26 52 L 44 46 L 44 50 L 26 56 Z" fill="#050505" opacity="0.5" />

      {/* Dumbbell nested in the bowl */}
      <g fill="url(#pt-bell-grad)">
        <rect x="52.5" y="35.6" width="12" height="2.8" rx="1.2" />
        <rect x="49.5" y="32.4" width="3.2" height="9.2" rx="1.4" />
        <rect x="64.3" y="32.4" width="3.2" height="9.2" rx="1.4" />
        <rect x="46.6" y="34.4" width="2.4" height="5.2" rx="1" />
        <rect x="68" y="34.4" width="2.4" height="5.2" rx="1" />
      </g>
    </svg>
  );
}

export function LogoMark({
  size = 40,
  className,
  tile,
}: {
  size?: number;
  className?: string;
  tile?: boolean;
}) {
  if (!tile) return <span className={cn("inline-flex", className)}><MarkSvg size={size} /></span>;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[22%] bg-black shadow-glow",
        className
      )}
      style={{ width: size, height: size }}
    >
      <MarkSvg size={Math.round(size * 0.72)} />
    </span>
  );
}

export function Logo({
  size = 32,
  wordmark = true,
  href = "/",
  className,
}: {
  size?: number;
  wordmark?: boolean;
  href?: string | null;
  className?: string;
}) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {wordmark && (
        <span className="flex flex-col leading-none">
          <span className="display-italic text-[0.95rem] tracking-tight text-ink-primary">
            Pocket Trainer
          </span>
          <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-ink-muted">
            Your coach. In your pocket.
          </span>
        </span>
      )}
    </span>
  );
  if (href === null) return inner;
  return (
    <Link href={href} className="inline-flex outline-none">
      {inner}
    </Link>
  );
}
