import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
}

export const tracks: Track[] = [
  { id: "1", title: "Neon Highways", artist: "Synthwave Collective", album: "Night Drive", cover: album1, duration: "3:42" },
  { id: "2", title: "Chrome Waves", artist: "Digital Mirage", album: "Liquid Metal", cover: album2, duration: "4:15" },
  { id: "3", title: "Rainy Afternoon", artist: "Lo-Fi Dreamers", album: "Window Stories", cover: album3, duration: "2:58" },
  { id: "4", title: "Moonlit Soul", artist: "Velvet Echo", album: "Golden Hour", cover: album4, duration: "5:01" },
  { id: "5", title: "Desert Bloom", artist: "Sunset Nomads", album: "Horizon", cover: album5, duration: "3:33" },
  { id: "6", title: "Color Burst", artist: "Neon Palette", album: "Splash", cover: album6, duration: "4:07" },
];

export const playlists = [
  { id: "p1", name: "Chill Vibes", count: 24, cover: album3 },
  { id: "p2", name: "Night Drive", count: 18, cover: album1 },
  { id: "p3", name: "Focus Flow", count: 32, cover: album2 },
  { id: "p4", name: "Workout Energy", count: 15, cover: album6 },
];

export const recentlyPlayed = [tracks[2], tracks[0], tracks[4], tracks[3], tracks[1], tracks[5]];
export const trendingNow = [tracks[0], tracks[5], tracks[3], tracks[1]];
export const madeForYou = [tracks[4], tracks[2], tracks[5], tracks[0]];
