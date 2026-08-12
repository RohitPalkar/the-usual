export function PlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.86l11.2-6.86a1 1 0 0 0 0-1.72L9.54 4.28A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export function PauseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="4.5" width="4" height="15" rx="1.2" />
      <rect x="14" y="4.5" width="4" height="15" rx="1.2" />
    </svg>
  );
}

export function SkipIcon({ size = 18, forward = true }: { size?: number; forward?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={forward ? undefined : { transform: "scaleX(-1)" }}
    >
      <path d="M6.5 5.6 13.9 12l-7.4 6.4V5.6ZM5 4.8v14.4c0 .7.83 1.1 1.36.64l8.9-7.7a.9.9 0 0 0 0-1.36l-8.9-7.7A.83.83 0 0 0 5 4.8Z" />
    </svg>
  );
}