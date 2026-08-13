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
    id: "the-adda",
    label: "The Adda",
    tracks: [
      { id: "s1", title: "Dil Diyan Gallan", artist: "Atif Aslam", film: "Tiger Zinda Hai", year: 2017, duration: 0, videoId: "SAcpESN_Fk4" },
      { id: "s2", title: "High Rated Gabru", artist: "Guru Randhawa", duration: 0, videoId: "hjWf8A0YNSE" },
      { id: "s3", title: "Amplifier", artist: "Imran Khan", duration: 0, videoId: "uuCFRaFWjwY" },
      { id: "s4", title: "Kabira", artist: "Tochi Raina & Rekha Bhardwaj", film: "Yeh Jawaani Hai Deewani", year: 2013, duration: 0, videoId: "jHNNMj5bNQw" },
      { id: "s5", title: "Kun Faya Kun", artist: "A.R. Rahman, Javed Ali & Mohit Chauhan", film: "Rockstar", year: 2011, duration: 0, videoId: "T94PHkuydcw" },
      { id: "s6", title: "Tum Se Hi", artist: "Mohit Chauhan", film: "Jab We Met", year: 2007, duration: 0, videoId: "mt9xg0mmt28" },
      { id: "s7", title: "Pyaar Ke Pal", artist: "KK", duration: 0, videoId: "ndU9kBk3UWI" },
      { id: "s8", title: "Zingaat", artist: "Ajay-Atul", film: "Sairat", year: 2016, duration: 0, videoId: "g8bTNID9nPs" },
      { id: "s9", title: "Dooba Dooba", artist: "Silk Route", duration: 0, videoId: "epUBGOngvaU" },
      { id: "s10", title: "O Sanam", artist: "Lucky Ali", duration: 0, videoId: "cADnAAsYlqM" },
      { id: "s11", title: "Woh Chali Woh Chali", artist: "Bombay Vikings", duration: 0, videoId: "bOL3vqJ1IH0" },
      { id: "s12", title: "Made In India", artist: "Alisha Chinai", duration: 0, videoId: "_rGo1s6iEjc" },
      { id: "s13", title: "Baba Deewana", artist: "Baba Sehgal", film: "Main Bhi Madonna", duration: 0, videoId: "SgZBe16-C6o" },
      { id: "s14", title: "Ho Jayegi Balle Balle", artist: "Daler Mehndi", duration: 0, videoId: "V39meB3T2ek" },
      { id: "s15", title: "Best Indian LoFi Vol. 2 (Saibo · Iktara · Tum Mile · Raanjhanaa)", artist: "Sony Music India", duration: 0, videoId: "0m1VFNQFVew" },
      { id: "s16", title: "Best #LoFi Songs Collection (Dil Se Re · Chura Liya · …)", artist: "Ishtar Music", duration: 0, videoId: "hMFYC2lKVC8" },
      { id: "s17", title: "Ghazal-e-LoFi Vol. 1 (Chithi Na Koi Sandesh · Tum Itna Jo…)", artist: "Jagjit Singh · Saregama", duration: 0, videoId: "3t3JSH-yXas" },
    ],
  },
];

export const playablePlaylists: Playlist[] = playlists
  .map((playlist) => ({
    ...playlist,
    tracks: playlist.tracks.filter((track) => track.videoId !== ""),
  }))
  .filter((playlist) => playlist.tracks.length > 0);
