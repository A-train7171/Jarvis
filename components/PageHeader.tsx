"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  return (
    <div className="mb-6 flex items-center gap-3">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-bg-surface/50 text-ink-secondary transition-colors hover:border-purple/50 hover:text-white"
      >
        <ChevronLeft size={19} />
      </button>
      <div>
        <h1 className="display-italic text-2xl leading-none text-ink-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-ink-secondary">{subtitle}</p>}
      </div>
    </div>
  );
}
