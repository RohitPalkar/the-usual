// Playlists are placeholders. Before adding a song, confirm you have the right to
// use it — e.g. the rights holder's own upload with embedding enabled. Swap in
// your own video IDs; adding a song is a one-line change.

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
  {
    id: "side-a",
    label: "Side A",
    tracks: [
      { id: "a1", title: "Your Song 1", artist: "Your Artist", film: "Your Film", year: 1990, duration: 240, videoId: "" },
      { id: "a2", title: "Your Song 2", artist: "Your Artist", film: "Your Film", year: 1992, duration: 250, videoId: "" },
      { id: "a3", title: "Your Song 3", artist: "Your Artist", film: "Your Film", year: 1995, duration: 230, videoId: "" },
      { id: "a4", title: "Your Song 4", artist: "Your Artist", film: "Your Film", year: 1997, duration: 260, videoId: "" },
    ],
  },
  {
    id: "side-b",
    label: "Side B",
    tracks: [
      { id: "b1", title: "Your Song 5", artist: "Your Artist", film: "Your Film", year: 1990, duration: 240, videoId: "" },
      { id: "b2", title: "Your Song 6", artist: "Your Artist", film: "Your Film", year: 1992, duration: 250, videoId: "" },
      { id: "b3", title: "Your Song 7", artist: "Your Artist", film: "Your Film", year: 1995, duration: 230, videoId: "" },
    ],
  },
  {
    id: "side-c",
    label: "Side C",
    tracks: [
      { id: "c1", title: "Your Song 8", artist: "Your Artist", film: "Your Film", year: 1990, duration: 240, videoId: "" },
      { id: "c2", title: "Your Song 9", artist: "Your Artist", film: "Your Film", year: 1992, duration: 250, videoId: "" },
    ],
  },
];