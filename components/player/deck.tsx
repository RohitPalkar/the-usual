"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon, SkipIcon } from "@/components/player/icons";

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
  const [thumbFailed, setThumbFailed] = useState(false);

  const total = duration > 0 ? duration : 1;
  const frac = Math.min(1, Math.max(0, currentTime / total));

  return (
    <div className="deck" aria-label={`Now playing ${title} by ${artist}`}>
      <span
        aria-hidden
        className={`deck-led ${isPlaying ? "on" : ""}`}
      />

      <div className="flex items-stretch gap-3">
        <div className="deck-well shrink-0">
          <div className="deck-cassette">
            {thumbnailUrl && !thumbFailed ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ transform: "scale(0.3111)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked i.ytimg.com, intentionally not proxied */}
                <img
                  key={thumbnailUrl}
                  src={thumbnailUrl}
                  alt=""
                  className="artwork-fade h-[180px] w-[320px] max-w-none object-cover"
                  onError={() => setThumbFailed(true)}
                />
              </div>
            ) : null}
          </div>
          <div className="deck-label" lang="hi">
            पुराने नगमे
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="deck-eyebrow">Now Playing</p>
          <p className="deck-title truncate">{title}</p>
          <p className="deck-artist truncate">{artist}</p>
          <p className="deck-meta truncate">{side}</p>
        </div>

        <div className="deck-transport shrink-0">
          <button
            type="button"
            aria-label="Previous track"
            onClick={onPrev}
            className="deck-skip"
          >
            <SkipIcon size={13} forward={false} />
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={onToggle}
            className="deck-play"
          >
            {isPlaying ? <PauseIcon size={15} /> : <PlayIcon size={15} />}
          </button>
          <button
            type="button"
            aria-label="Next track"
            onClick={onNext}
            className="deck-skip"
          >
            <SkipIcon size={13} />
          </button>
        </div>
      </div>

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
    </div>
  );
}
