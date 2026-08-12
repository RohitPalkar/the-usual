"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { playlists } from "@/lib/tracks";
import type { Track } from "@/lib/tracks";
import { loadYouTubeApi, YouTubePlayerState } from "@/lib/youtube";
import type { YouTubeEvent, YouTubePlayer } from "@/lib/youtube";
import { Disc } from "@/components/player/disc";
import { LiveBadge } from "@/components/player/live-badge";
import { PlaylistSwitcher } from "@/components/player/playlist-switcher";
import { SeekBar } from "@/components/player/seek-bar";
import { TimeText } from "@/components/player/time";
import { Transport } from "@/components/player/transport";

const DESKTOP_SCALE = "0.4444";
const MOBILE_SCALE = "0.3556";

type Cast = {
  YT: {
    Player: new (
      host: HTMLElement,
      options: Record<string, unknown>,
    ) => YouTubePlayer;
  };
};

export function Player() {
  const desktopMount = useRef<HTMLDivElement | null>(null);
  const mobileMount = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(playlists[0].tracks[0].duration);

  const stateRef = useRef({ playlistIndex, trackIndex, isPlaying });

  useEffect(() => {
    stateRef.current = { playlistIndex, trackIndex, isPlaying };
  }, [playlistIndex, trackIndex, isPlaying]);

  const currentTrack: Track = playlists[playlistIndex].tracks[trackIndex];
  const trackRef = useRef<Track>(currentTrack);

  useEffect(() => {
    trackRef.current = currentTrack;
  }, [currentTrack]);

  const goToTrack = useCallback((pl: number, ti: number, autoplay: boolean) => {
    const t = playlists[pl].tracks[ti];
    if (!t) return;
    setPlaylistIndex(pl);
    setTrackIndex(ti);
    setCurrentTime(0);
    setDuration(t.duration);
    const player = playerRef.current;
    if (!player) return;
    if (!t.videoId) return;
    if (autoplay) {
      player.loadVideoById(t.videoId);
      player.playVideo();
    } else {
      player.cueVideoById(t.videoId);
    }
  }, []);

  const advance = useCallback(
    (dir: 1 | -1) => {
      const { playlistIndex: pl, trackIndex: ti } = stateRef.current;
      const list = playlists[pl];
      const next = (ti + dir + list.tracks.length) % list.tracks.length;
      goToTrack(pl, next, true);
    },
    [goToTrack],
  );

  const handleReady = useCallback((e: YouTubeEvent) => {
    const player = e.target;
    const real = player.getDuration();
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
          advance(1);
          break;
      }
    },
    [advance],
  );

  const handleError = useCallback(
    (e: YouTubeEvent) => {
      const current = trackRef.current;
      if (!current.videoId) return;
      track("player_error", { code: String(e.data), videoId: current.videoId });
      advance(1);
    },
    [advance],
  );

  const eventsRef = useRef({ handleReady, handleStateChange, handleError });

  useEffect(() => {
    eventsRef.current = { handleReady, handleStateChange, handleError };
  });

  useEffect(() => {
    let destroyed = false;
    let player: YouTubePlayer | null = null;
    const mq = window.matchMedia("(min-width: 640px)");

    const createPlayer = () => {
      const host = mq.matches ? desktopMount.current : mobileMount.current;
      if (!host) return;
      const w = window as unknown as Cast;
      player = new w.YT.Player(host, {
        videoId: trackRef.current.videoId,
        width: "320",
        height: "180",
        playerVars: { autoplay: 0, controls: 1, rel: 0, playsinline: 1 },
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

    const reparent = () => {
      const source = mq.matches ? mobileMount.current : desktopMount.current;
      const target = mq.matches ? desktopMount.current : mobileMount.current;
      const embed = source?.querySelector("iframe");
      if (target && embed) target.appendChild(embed);
    };
    mq.addEventListener("change", reparent);

    return () => {
      destroyed = true;
      mq.removeEventListener("change", reparent);
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
    if (!player || !trackRef.current.videoId) return;
    if (stateRef.current.isPlaying) player.pauseVideo();
    else player.playVideo();
  }, []);

  const seek = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const selectPlaylist = useCallback(
    (i: number) => {
      if (i === stateRef.current.playlistIndex) return;
      goToTrack(i, 0, false);
    },
    [goToTrack],
  );

  const meta = [currentTrack.artist, currentTrack.film, currentTrack.year ? String(currentTrack.year) : null]
    .filter(Boolean)
    .join(" · ");

  const thumbnailUrl = currentTrack.videoId
    ? `https://i.ytimg.com/vi/${currentTrack.videoId}/hqdefault.jpg`
    : null;

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 pb-[calc(100px+max(1rem,env(safe-area-inset-bottom)))]"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div className="flex w-full max-w-xl items-center justify-between">
        <PlaylistSwitcher active={playlistIndex} onSelect={selectPlaylist} />
        <LiveBadge />
      </div>

      <div className="player-glass hidden w-full max-w-xl items-center gap-5 rounded-full p-3 pr-5 sm:flex">
        <Disc
          mountRef={desktopMount}
          isPlaying={isPlaying}
          sizeClass="h-20 w-20"
          coverScale={DESKTOP_SCALE}
          thumbnailUrl={thumbnailUrl}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-white">
            {currentTrack.title}
          </p>
          <p className="mt-0.5 truncate text-[12.5px] leading-snug text-white/70">
            {meta}
          </p>
          <div className="mt-1 h-6">
            <SeekBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
            />
          </div>
          <div className="flex justify-between">
            <TimeText currentTime={currentTime} duration={duration} />
          </div>
        </div>
        <Transport
          isPlaying={isPlaying}
          onToggle={toggle}
          onPrev={() => advance(-1)}
          onNext={() => advance(1)}
        />
      </div>

      <div className="player-glass w-full max-w-xl rounded-[26px] px-4 pb-3 pt-4 sm:hidden">
        <div className="flex items-center gap-4">
          <Disc
            mountRef={mobileMount}
            isPlaying={isPlaying}
            sizeClass="h-16 w-16"
            coverScale={MOBILE_SCALE}
            thumbnailUrl={thumbnailUrl}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-semibold leading-tight text-white">
              {currentTrack.title}
            </p>
            <p className="mt-1 truncate text-[12px] leading-snug text-white/70">
              {meta}
            </p>
          </div>
        </div>
        <div className="mt-2 h-6">
          <SeekBar currentTime={currentTime} duration={duration} onSeek={seek} />
        </div>
        <div className="mt-1 grid grid-cols-[auto_1fr_auto] items-center">
          <TimeText currentTime={currentTime} duration={duration} />
          <div className="justify-self-center">
            <Transport
              isPlaying={isPlaying}
              onToggle={toggle}
              onPrev={() => advance(-1)}
              onNext={() => advance(1)}
            />
          </div>
          <div className="w-[92px]" aria-hidden />
        </div>
      </div>
    </section>
  );
}