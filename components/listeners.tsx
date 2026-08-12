"use client";

import { useLiveCount } from "@/lib/live-count";

export function Listeners() {
  const count = useLiveCount();

  return (
    <p className="flex items-center gap-2 font-mono text-xs tabular-nums text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      {count.toLocaleString("en-IN")} listeners now
    </p>
  );
}