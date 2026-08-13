"use client";

import { useState } from "react";
import type { RefObject } from "react";

export function Artwork({
  mountRef,
  sizeClass,
  coverScale,
  thumbnailUrl,
}: {
  mountRef: RefObject<HTMLDivElement | null>;
  sizeClass: string;
  coverScale: string;
  thumbnailUrl: string | null;
}) {
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 select-none overflow-hidden rounded-[16px] bg-black ${sizeClass} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_8px_24px_-8px_rgba(0,0,0,0.7)]`}
    >
      {thumbnailUrl && !thumbFailed ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ transform: `scale(${coverScale})` }}
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
      <div
        ref={mountRef}
        aria-label="Video player"
        className="absolute inset-0"
        style={{ transform: `scale(${coverScale})` }}
      />
    </div>
  );
}