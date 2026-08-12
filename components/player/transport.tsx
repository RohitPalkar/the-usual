"use client";

import { PauseIcon, PlayIcon, SkipIcon } from "@/components/player/icons";

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
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        aria-label="Previous track"
        onClick={onPrev}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <SkipIcon size={20} forward={false} />
      </button>
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={onToggle}
        className="btn-play flex h-[52px] w-[52px] items-center justify-center rounded-full text-white ring-1 ring-white/25 transition-transform hover:scale-105 active:scale-95"
      >
        {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
      </button>
      <button
        type="button"
        aria-label="Next track"
        onClick={onNext}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <SkipIcon size={20} />
      </button>
    </div>
  );
}