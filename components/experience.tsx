"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { playablePlaylists } from "@/lib/tracks";
import { loadYouTubeApi, YouTubePlayerState } from "@/lib/youtube";
import type { YouTubeEvent, YouTubePlayer } from "@/lib/youtube";
import type { Track } from "@/lib/tracks";
import { Deck } from "@/components/player/deck";
import { PlayIcon } from "@/components/player/icons";

const POOL = playablePlaylists.flatMap((playlist) => playlist.tracks);

function shuffledBag(exclude: number): number[] {
  const pool = Array.from({ length: POOL.length }, (_, i) => i).filter(
    (i) => i !== exclude,
  );
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

type Cast = {
  YT: {
    Player: new (
      host: HTMLElement,
      options: Record<string, unknown>,
    ) => YouTubePlayer;
  };
};

function hardenIframe(iframe: HTMLIFrameElement) {
  iframe.setAttribute("allow", "autoplay; encrypted-media");
  iframe.setAttribute("tabindex", "-1");
  iframe.setAttribute("title", "");
  iframe.addEventListener("enterpictureinpicture", () => {
    void document.exitPictureInPicture().catch(() => {});
  });
}

export function Experience() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const [started, setStarted] = useState(false);
  const [poolIndex, setPoolIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = POOL[poolIndex] ?? null;
  const trackRef = useRef<Track | null>(currentTrack);
  const stateRef = useRef({ poolIndex, isPlaying });
  const historyRef = useRef<number[]>([]);
  const queueRef = useRef<number[]>([]);

  useEffect(() => {
    trackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    stateRef.current = { poolIndex, isPlaying };
  }, [poolIndex, isPlaying]);

  const nextIndex = useCallback(() => {
    if (POOL.length <= 1) return 0;
    if (queueRef.current.length === 0) {
      queueRef.current = shuffledBag(stateRef.current.poolIndex);
    }
    return queueRef.current.shift()!;
  }, []);

  const playIndex = useCallback((idx: number, autoplay: boolean) => {
    const t = POOL[idx];
    if (!t) return;
    const previous = stateRef.current.poolIndex;
    if (previous !== idx) {
      historyRef.current = [...historyRef.current.slice(-49), previous];
    }
    setPoolIndex(idx);
    setCurrentTime(0);
    setDuration(t.duration);
    const player = playerRef.current;
    if (!player || !t.videoId) return;
    if (autoplay) {
      player.loadVideoById(t.videoId);
      player.playVideo();
    } else {
      player.cueVideoById(t.videoId);
    }
  }, []);

  const start = useCallback(() => {
    setStarted(true);
    playIndex(nextIndex(), true);
  }, [nextIndex, playIndex]);

  const skip = useCallback(() => {
    playIndex(nextIndex(), true);
  }, [nextIndex, playIndex]);

  const previous = useCallback(() => {
    const idx = historyRef.current.pop();
    if (idx === undefined) return;
    queueRef.current.push(stateRef.current.poolIndex);
    playIndex(idx, true);
  }, [playIndex]);

  const handleReady = useCallback((e: YouTubeEvent) => {
    hardenIframe(e.target.getIframe());
    const real = e.target.getDuration();
    if (real && real > 0) setDuration(real);
  }, []);

  const handleStateChange = useCallback(
    (e: YouTubeEvent) => {
      switch (e.data) {
        case YouTubePlayerState.PLAYING: {
          setIsPlaying(true);
          const real = e.target.getDuration();
          if (real && real > 0) setDuration(real);
          break;
        }
        case YouTubePlayerState.PAUSED:
        case YouTubePlayerState.UNSTARTED:
        case YouTubePlayerState.CUED:
          setIsPlaying(false);
          break;
        case YouTubePlayerState.ENDED:
          skip();
          break;
      }
    },
    [skip],
  );

  const handleError = useCallback(
    (e: YouTubeEvent) => {
      const current = trackRef.current;
      if (!current?.videoId) return;
      track("player_error", { code: String(e.data), videoId: current.videoId });
      skip();
    },
    [skip],
  );

  const eventsRef = useRef({ handleReady, handleStateChange, handleError });

  useEffect(() => {
    eventsRef.current = { handleReady, handleStateChange, handleError };
  });

  useEffect(() => {
    let destroyed = false;
    let player: YouTubePlayer | null = null;

    const createPlayer = () => {
      const host = mountRef.current;
      if (!host) return;
      const w = window as unknown as Cast;
      const initialVideoId = trackRef.current?.videoId;
      player = new w.YT.Player(host, {
        videoId: initialVideoId,
        width: "320",
        height: "180",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e: YouTubeEvent) => eventsRef.current.handleReady(e),
          onStateChange: (e: YouTubeEvent) =>
            eventsRef.current.handleStateChange(e),
          onError: (e: YouTubeEvent) => eventsRef.current.handleError(e),
        },
      });
      playerRef.current = player;
    };

    loadYouTubeApi()
      .then(() => {
        if (!destroyed) createPlayer();
      })
      .catch(() => {});

    const onVisibility = () => {
      const p = playerRef.current;
      if (!p) return;
      if (
        document.visibilityState === "visible" &&
        stateRef.current.isPlaying &&
        p.getPlayerState() !== YouTubePlayerState.PLAYING
      ) {
        try {
          p.playVideo();
        } catch {
          /* browser policy may block background resume; state stays intact */
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      destroyed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      player?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime());
    }, 250);
    return () => clearInterval(id);
  }, [isPlaying]);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player || !trackRef.current?.videoId) return;
    if (stateRef.current.isPlaying) player.pauseVideo();
    else player.playVideo();
  }, []);

  const seek = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const thumbnailUrl = currentTrack?.videoId
    ? `https://i.ytimg.com/vi/${currentTrack.videoId}/hqdefault.jpg`
    : null;

  return (
    <>
      <div
        aria-hidden
        ref={mountRef}
        className="pointer-events-none fixed left-[-9999px] top-0 z-[-50] h-[180px] w-[320px] opacity-0"
      />

      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          <filter id="paint-edge">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.02"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        className={`pointer-events-none fixed inset-x-0 z-10 transition-all duration-[800ms] ease-out ${
          started ? "top-[7vh]" : "top-[20vh]"
        }`}
      >
        <div className="hero-title-wrap text-center">
          <span
            aria-hidden
            className={`hero-title hero-title-offset transition-all duration-[800ms] ease-out ${
              started
                ? "text-[clamp(3rem,7.5vw,6.5rem)]"
                : "text-[clamp(3.5rem,10vw,7.5rem)]"
            }`}
          >
            KYA SCENE
          </span>
          <h1
            className={`hero-title hero-title-front transition-all duration-[800ms] ease-out ${
              started
                ? "text-[clamp(3rem,7.5vw,6.5rem)]"
                : "text-[clamp(3.5rem,10vw,7.5rem)]"
            }`}
          >
            KYA SCENE
          </h1>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-[73%] z-10 flex -translate-y-1/2 flex-col items-center gap-6 transition-opacity duration-500 ${
          started ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-sm tracking-wide text-white/70">आज क्या बजेगा?</p>
        {POOL.length === 0 ? (
          <p className="text-sm tracking-wide text-white/60">
            गाने जल्द आ रहे हैं
          </p>
        ) : (
          <button
            type="button"
            onClick={start}
            className="flex items-center gap-2.5 rounded-[16px] border border-white/15 bg-white/[0.07] px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/[0.12]"
          >
            <PlayIcon size={16} />
            शुरू करें
          </button>
        )}
      </div>

      {started && currentTrack ? (
        <Deck
          title={currentTrack.title}
          artist={currentTrack.artist}
          side={`Cassette ${String(poolIndex + 1).padStart(2, "0")} · Side A`}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          thumbnailUrl={thumbnailUrl}
          onToggle={toggle}
          onPrev={previous}
          onNext={skip}
          onSeek={seek}
        />
      ) : null}
    </>
  );
}