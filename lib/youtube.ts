export type YouTubePlayer = {
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

export type YouTubeEvent = {
  target: YouTubePlayer;
  data: number;
};

export const YouTubePlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

let apiPromise: Promise<void> | null = null;

export function loadYouTubeApi(): Promise<void> {
  if (apiPromise) return apiPromise;

  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("YouTube API is client-only"));
        return;
      }

      const w = window as unknown as {
        YT?: { Player: new (...args: unknown[]) => YouTubePlayer };
        onYouTubeIframeAPIReady?: () => void;
      };

      if (w.YT?.Player) {
        resolve();
        return;
      }

      w.onYouTubeIframeAPIReady = () => resolve();

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        w.onYouTubeIframeAPIReady = undefined;
        apiPromise = null;
        reject(new Error("Failed to load YouTube IFrame API"));
      };
      document.head.appendChild(script);
    });
  }

  return apiPromise;
}