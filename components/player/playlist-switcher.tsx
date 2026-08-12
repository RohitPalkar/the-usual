"use client";

import { playlists } from "@/lib/tracks";

export function PlaylistSwitcher({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Playlists" className="flex items-center gap-2">
      {playlists.map((playlist, i) => (
        <button
          key={playlist.id}
          type="button"
          onClick={() => onSelect(i)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur transition ${
            i === active
              ? "bg-white/20 text-white ring-1 ring-white/25"
              : "bg-black/25 text-white/50 hover:bg-white/10 hover:text-white/80"
          }`}
        >
          {playlist.label}
        </button>
      ))}
    </nav>
  );
}