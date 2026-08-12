export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function TimeText({
  currentTime,
  duration,
  className,
}: {
  currentTime: number;
  duration: number;
  className?: string;
}) {
  return (
    <p className={`text-[10.5px] tabular-nums text-white/60 ${className ?? ""}`}>
      {formatTime(currentTime)}
      <span className="mx-1 text-white/30">/</span>
      {formatTime(duration)}
    </p>
  );
}