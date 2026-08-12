// These tracks are commercial recordings owned by their respective labels.
// Before playing them on the site, confirm each videoId points to the rights
// holder's OWN YouTube upload with embedding enabled, and that you may use it.
// Adding a song is a one-line change; leave videoId empty until then.

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
    id: "the-arrival",
    label: "The Arrival",
    tracks: [
      { id: "a1", title: "Yeh Shaam Mastani", artist: "Kishore Kumar", film: "Kati Patang", year: 1970, duration: 0, videoId: "" },
      { id: "a2", title: "Musafir Hoon Yaaron", artist: "Kishore Kumar", film: "Parichay", year: 1972, duration: 0, videoId: "" },
      { id: "a3", title: "Gulabi Aankhen", artist: "Mohammed Rafi", film: "The Train", year: 1970, duration: 0, videoId: "" },
      { id: "a4", title: "Neele Neele Ambar Par", artist: "Kishore Kumar", film: "Kalaakaar", year: 1983, duration: 0, videoId: "" },
    ],
  },
  {
    id: "the-adda",
    label: "The Adda",
    tracks: [
      { id: "b1", title: "Dooba Dooba", artist: "Silk Route", duration: 0, videoId: "epUBGOngvaU" },
      { id: "b2", title: "Woh Chali Woh Chali", artist: "Bombay Vikings", film: "Pyaar Mein Kabhi Kabhi", year: 1999, duration: 0, videoId: "bOL3vqJ1IH0" },
      { id: "b3", title: "Pyar Ke Pal", artist: "KK", duration: 0, videoId: "NUqlCJTYu6I" },
      { id: "b4", title: "Tanha Dil", artist: "Shaan", duration: 0, videoId: "" },
      { id: "b5", title: "Made In India", artist: "Alisha Chinai", duration: 0, videoId: "_rGo1s6iEjc" },
      { id: "b6", title: "Baba Deewana", artist: "Baba Sehgal", film: "Main Bhi Madonna", duration: 0, videoId: "SgZBe16-C6o" },
      { id: "b7", title: "Ho Jayegi Balle Balle", artist: "Daler Mehndi", duration: 0, videoId: "V39meB3T2ek" },
      { id: "b8", title: "O Sanam", artist: "Lucky Ali", duration: 0, videoId: "cADnAAsYlqM" },
      { id: "b9", title: "Lover Girl", artist: "Alisha Chinai", duration: 0, videoId: "0eEHVJXCT1k" },
    ],
  },
  {
    id: "last-call",
    label: "Last Call",
    tracks: [
      { id: "c1", title: "Dil Chahta Hai", artist: "Shankar Mahadevan", film: "Dil Chahta Hai", year: 2001, duration: 0, videoId: "" },
      { id: "c2", title: "Aaj Jaane Ki Zid Na Karo", artist: "Farida Khanum", duration: 0, videoId: "" },
      { id: "c3", title: "Hoshwalon Ko Khabar Kya", artist: "Jagjit Singh", duration: 0, videoId: "" },
      { id: "c4", title: "Khoya Khoya Chand", artist: "Mikey McCleary", duration: 0, videoId: "E0JzJbXd7xY" },
      { id: "c5", title: "Aao Milo Chalo", artist: "Shaan & Ustad Sultan Khan", duration: 0, videoId: "" },
    ],
  },
];

export const playablePlaylists: Playlist[] = playlists
  .map((playlist) => ({
    ...playlist,
    tracks: playlist.tracks.filter((track) => track.videoId !== ""),
  }))
  .filter((playlist) => playlist.tracks.length > 0);