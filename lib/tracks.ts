// These tracks are commercial recordings owned by their respective labels.
// Before playing them on the site, confirm each videoId points to the rights
// holder's OWN YouTube upload with embedding enabled, and that you may use it.
// Adding a song is a one-line change; leave videoId empty until then.
//
// FRESH LIST: add your new songs below, then give them to the assistant so the
// videoIds can be verified before they go live.

export type Track = {
  id: string;
  title: string;
  artist: string;
  film?: string;
  year?: number;
  duration: number;
  videoId: string;
};

export type Playlist = {
  id: string;
  label: string;
  tracks: Track[];
};

export const playlists: Playlist[] = [
  // {
  //   id: "the-adda",
  //   label: "The Adda",
  //   tracks: [
  //     { id: "b1", title: "Dooba Dooba", artist: "Silk Route", duration: 0, videoId: "" },
  //   ],
  // },
];

export const playablePlaylists: Playlist[] = playlists
  .map((playlist) => ({
    ...playlist,
    tracks: playlist.tracks.filter((track) => track.videoId !== ""),
  }))
  .filter((playlist) => playlist.tracks.length > 0);
