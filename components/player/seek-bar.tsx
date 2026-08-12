"use client";

import { useRef, useState } from "react";

export function SeekBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [scrub, setScrub] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const total = duration > 0 ? duration : 1;
  const shown = Math.min(scrub ?? currentTime, total);
  const pct = Math.min(100, Math.max(0, (shown / total) * 100));

  const posFor = (e: React.PointerEvent) => {
    const rail = railRef.current;
    if (!rail) return shown;
    const rect = rail.getBoundingClientRect();
    if (rect.width <= 0) return shown;
    const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
    return (x / rect.width) * total;
  };

  return (
    <div
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(total)}
      aria-valuenow={Math.round(shown)}
      className="group relative flex h-6 w-full cursor-pointer touch-none items-center"
      onPointerDown={(e) => {
        if (total <= 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        draggingRef.current = true;
        setDragging(true);
        setScrub(posFor(e));
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) setScrub(posFor(e));
      }}
      onPointerUp={(e) => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        setDragging(false);
        const target = posFor(e);
        setScrub(null);
        onSeek(target);
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
        setDragging(false);
        setScrub(null);
      }}
    >
      <div
        ref={railRef}
        className="h-[3px] w-full overflow-hidden rounded-full bg-white/15"
      >
        <div
          className="seek-fill h-full rounded-full bg-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={`absolute h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.6)] transition-opacity ${
          dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ left: `calc(${pct}% - 5px)` }}
      />
    </div>
  );
}