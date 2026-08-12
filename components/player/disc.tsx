"use client";

import { useState } from "react";
import type { RefObject } from "react";

export function Disc({
  mountRef,
  isPlaying,
  sizeClass,
  coverScale,
  thumbnailUrl,
}: {
  mountRef: RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  sizeClass: string;
  coverScale: string;
  thumbnailUrl: string | null;
}) {
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 select-none overflow-hidden rounded-full bg-black ${sizeClass} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),inset_0_0_24px_rgba(0,0,0,0.45)]`}
    >
      <div
        className="vinyl-spin absolute inset-0"
        style={{ animationPlayState: isPlaying ? "running" : "paused" }}
      >
        {thumbnailUrl && !thumbFailed ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ transform: `scale(${coverScale})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked i.ytimg.com, intentionally not proxied */}
            <img
              src={thumbnailUrl}
              alt=""
              className="h-[180px] w-[320px] max-w-none object-cover"
              onError={() => setThumbFailed(true)}
            />
          </div>
        ) : null}
        <div
          ref={mountRef}
          aria-label="Video player"
          className="absolute inset-0"
          style={{ transform: `scale(${coverScale})` }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_58%,rgba(0,0,0,0.4)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40"
      />
    </div>
  );
}