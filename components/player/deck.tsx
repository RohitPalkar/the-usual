"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon, SkipIcon } from "@/components/player/icons";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function Deck({
  title,
  artist,
  side,
  isPlaying,
  currentTime,
  duration,
  thumbnailUrl,
  onToggle,
  onPrev,
  onNext,
  onSeek,
}: {
  title: string;
  artist: string;
  side: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  thumbnailUrl: string | null;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
}) {
  const [thumbFailedUrl, setThumbFailedUrl] = useState<string | null>(null);

  const total = duration > 0 ? duration : 1;
  const frac = Math.min(1, Math.max(0, currentTime / total));
  const showThumb = thumbnailUrl !== null && thumbFailedUrl !== thumbnailUrl;

  return (
    <div className="deck" aria-label={`Now playing ${title} by ${artist}`}>
      <span aria-hidden className={`deck-led ${isPlaying ? "on" : ""}`} />

      <div className="flex items-center gap-3">
        <div className="deck-well shrink-0">
          <div className="deck-cassette">
            {showThumb ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ transform: "scale(0.3111)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked i.ytimg.com, intentionally not proxied */}
                <img
                  key={thumbnailUrl}
                  src={thumbnailUrl ?? undefined}
                  alt=""
                  className="artwork-fade h-[180px] w-[320px] max-w-none object-cover"
                  onError={() => setThumbFailedUrl(thumbnailUrl)}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="deck-eyebrow">Now Playing</p>
          <p className="deck-title truncate">{title}</p>
          <p className="deck-artist truncate">{artist}</p>
          <p className="deck-meta truncate">{side}</p>

          <div
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(total)}
            aria-valuenow={Math.round(currentTime)}
            className="deck-progress"
            onPointerDown={(e) => {
              if (total <= 0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              if (rect.width <= 0) return;
              const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
              onSeek((x / rect.width) * total);
            }}
          >
            <div className="deck-track">
              <div className="deck-fill" style={{ width: `${frac * 100}%` }} />
              <span className="deck-knob" style={{ left: `${frac * 100}%` }} />
            </div>
          </div>
          <div className="deck-times" aria-hidden>
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>

        <div className="deck-transport shrink-0">
          <button
            type="button"
            aria-label="Previous track"
            onClick={onPrev}
            className="deck-skip"
          >
            <SkipIcon size={12} forward={false} />
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={onToggle}
            className="deck-play"
          >
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
          </button>
          <button
            type="button"
            aria-label="Next track"
            onClick={onNext}
            className="deck-skip"
          >
            <SkipIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
