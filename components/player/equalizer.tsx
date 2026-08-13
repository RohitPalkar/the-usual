"use client";

const BARS = Array.from({ length: 28 }, (_, i) => ({
  duration: `${(0.7 + ((i * 37) % 9) / 10).toFixed(2)}s`,
  delay: `${((i * 13) % 7) / 10}s`,
}));

export function Equalizer({
  currentTime,
  duration,
  isPlaying,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (seconds: number) => void;
}) {
  const total = duration > 0 ? duration : 1;
  const frac = Math.min(1, Math.max(0, currentTime / total));
  const activeCount = Math.round(frac * BARS.length);

  return (
    <div
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(total)}
      aria-valuenow={Math.round(currentTime)}
      className="flex h-6 flex-1 touch-none cursor-pointer items-center gap-[3px] px-1"
      onPointerDown={(e) => {
        if (total <= 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.width <= 0) return;
        const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
        onSeek((x / rect.width) * total);
      }}
    >
      {BARS.map((bar, i) => {
        const active = i < activeCount;
        return (
          <span
            key={i}
            className={`h-full w-[2px] rounded-full transition-colors duration-300 ${
              active
                ? "bg-accent/90 shadow-[0_0_6px_rgba(255,138,60,0.5)]"
                : "bg-white/15"
            }`}
            style={{
              transformOrigin: "center",
              transform: isPlaying ? undefined : "scaleY(0.3)",
              animation: isPlaying
                ? `eq ${bar.duration} ${bar.delay} ease-in-out infinite`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}