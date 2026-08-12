"use client";

import { useLiveCount } from "@/lib/live-count";

export function LiveBadge() {
  const count = useLiveCount();

  return (
    <p className="flex items-center gap-2 font-mono text-[10px] tabular-nums text-white/60">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
      </span>
      LIVE · {count.toLocaleString("en-IN")}
    </p>
  );
}