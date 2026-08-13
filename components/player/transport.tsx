"use client";

import { PauseIcon, PlayIcon, SkipIcon } from "@/components/player/icons";

const GHOST =
  "flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.06] text-white/80 backdrop-blur transition-all duration-200 hover:border-white/25 hover:bg-white/[0.12] hover:text-white";

export function Transport({
  isPlaying,
  onToggle,
  onPrev,
  onNext,
}: {
  isPlaying: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <button
        type="button"
        aria-label="Previous track"
        onClick={onPrev}
        className={GHOST}
      >
        <SkipIcon size={18} forward={false} />
      </button>
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={onToggle}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] border border-white/15 bg-white/[0.08] text-white shadow-[0_0_26px_-8px_rgba(255,138,60,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/[0.14] hover:shadow-[0_0_34px_-6px_rgba(255,138,60,0.8)]"
      >
        {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
      </button>
      <button type="button" aria-label="Next track" onClick={onNext} className={GHOST}>
        <SkipIcon size={18} />
      </button>
    </div>
  );
}