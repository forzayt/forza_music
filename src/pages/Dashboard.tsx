import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import BottomPlayer from "@/components/BottomPlayer";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, TrendingUp, Clock, Disc3 } from "lucide-react";
import { useSpotifyAuth } from "@/context/SpotifyAuthContext";
import {
  spotify,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyAlbum,
  RecentlyPlayedItem,
  SpotifyPlaylist,
  getImageUrl,
  msToTime,
} from "@/lib/spotify";

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, icon: Icon }: { title: string; icon?: React.ElementType }) => (
  <div className="mb-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={18} className="text-[#1DB954]" />}
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
    </div>
    <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
      Show all <ChevronRight size={14} />
    </button>
  </div>
);

// ─── Track Card ───────────────────────────────────────────────────────────────
const TrackCard = ({ track, index }: { track: SpotifyTrack; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.03, y: -4 }}
    className="group cursor-pointer rounded-xl bg-card/60 p-3 transition-colors hover:bg-card"
  >
    <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
      <img
        src={getImageUrl(track.album.images)}
        alt={track.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] shadow-lg">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-black ml-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
    <p className="truncate text-sm font-semibold text-foreground">{track.name}</p>
    <p className="truncate text-xs text-muted-foreground">{track.artists.map((a) => a.name).join(", ")}</p>
  </motion.div>
);

// ─── Artist Card ──────────────────────────────────────────────────────────────
const ArtistCard = ({ artist, index }: { artist: SpotifyArtist; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.03, y: -4 }}
    className="group cursor-pointer rounded-xl bg-card/60 p-3 transition-colors hover:bg-card"
  >
    <div className="relative mb-3 aspect-square overflow-hidden rounded-full">
      <img
        src={getImageUrl(artist.images)}
        alt={artist.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <p className="truncate text-center text-sm font-semibold text-foreground">{artist.name}</p>
    <p className="truncate text-center text-xs text-muted-foreground">Artist</p>
  </motion.div>
);

// ─── Album Card ───────────────────────────────────────────────────────────────
const AlbumCard = ({ album, index }: { album: SpotifyAlbum; index: number }) => (
  <motion.a
    href={album.external_urls.spotify}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.03, y: -4 }}
    className="group cursor-pointer rounded-xl bg-card/60 p-3 block transition-colors hover:bg-card"
  >
    <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
      <img
        src={getImageUrl(album.images)}
        alt={album.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <p className="truncate text-sm font-semibold text-foreground">{album.name}</p>
    <p className="truncate text-xs text-muted-foreground">{album.artists.map((a) => a.name).join(", ")}</p>
  </motion.a>
);

// ─── Recent Track Row ─────────────────────────────────────────────────────────
const RecentRow = ({ item, index }: { item: RecentlyPlayedItem; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.04 }}
    className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-secondary/40"
  >
    <span className="w-5 text-right text-xs text-muted-foreground">{index + 1}</span>
    <img
      src={getImageUrl(item.track.album.images)}
      alt={item.track.name}
      className="h-10 w-10 rounded-md object-cover"
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-foreground">{item.track.name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {item.track.artists.map((a) => a.name).join(", ")}
      </p>
    </div>
    <span className="text-xs text-muted-foreground tabular-nums">
      {msToTime(item.track.duration_ms)}
    </span>
  </motion.div>
);

// ─── Quick Pick Tile ──────────────────────────────────────────────────────────
const QuickPick = ({ pl }: { pl: SpotifyPlaylist }) => (
  <motion.a
    href={pl.external_urls.spotify}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.02 }}
    className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-md bg-secondary/60 transition-colors hover:bg-secondary"
  >
    <img
      src={getImageUrl(pl.images)}
      alt={pl.name}
      className="h-14 w-14 object-cover flex-shrink-0"
    />
    <span className="truncate text-sm font-semibold text-foreground pr-3">{pl.name}</span>
  </motion.a>
);

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-xl bg-card/60 p-3 animate-pulse">
    <div className="mb-3 aspect-square rounded-lg bg-secondary/60" />
    <div className="mb-1.5 h-3 w-3/4 rounded bg-secondary/60" />
    <div className="h-3 w-1/2 rounded bg-secondary/40" />
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { accessToken, user } = useSpotifyAuth();

  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>([]);
  const [newReleases, setNewReleases] = useState<SpotifyAlbum[]>([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  })();

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [
          tracksRes,
          artistsRes,
          recentRes,
          releasesRes,
          featuredRes,
        ] = await Promise.allSettled([
          spotify.getTopTracks(accessToken, "short_term", 8),
          spotify.getTopArtists(accessToken, "medium_term", 8),
          spotify.getRecentlyPlayed(accessToken, 10),
          spotify.getNewReleases(accessToken, 8),
          spotify.getFeaturedPlaylists(accessToken, 6),
        ]);

        if (cancelled) return;

        if (tracksRes.status === "fulfilled") setTopTracks(tracksRes.value.items);
        if (artistsRes.status === "fulfilled") setTopArtists(artistsRes.value.items);
        if (recentRes.status === "fulfilled") setRecentlyPlayed(recentRes.value.items);
        if (releasesRes.status === "fulfilled") setNewReleases(releasesRes.value.albums.items);
        if (featuredRes.status === "fulfilled") setFeaturedPlaylists(featuredRes.value.playlists.items);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-60 pb-24">
        {/* Hero */}
        <div className="relative overflow-hidden px-6 pb-6 pt-8">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/10 via-background/50 to-background" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <h1 className="mb-1 text-3xl font-bold text-foreground">
              {greeting}{user?.display_name ? `, ${user.display_name.split(" ")[0]}` : ""}
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">Here's what's been happening on your Spotify.</p>

            {/* Featured Playlists quick picks */}
            {loading ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 overflow-hidden rounded-md bg-secondary/60 animate-pulse h-14" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {featuredPlaylists.slice(0, 6).map((pl) => (
                  <QuickPick key={pl.id} pl={pl} />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-8 px-6">
          {/* Top Tracks */}
          <section>
            <SectionHeader title="Your Top Tracks" icon={TrendingUp} />
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : topTracks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {topTracks.map((track, i) => (
                  <TrackCard key={track.id} track={track} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No top tracks yet — start listening on Spotify!</p>
            )}
          </section>

          {/* Top Artists */}
          <section>
            <SectionHeader title="Your Top Artists" icon={Disc3} />
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : topArtists.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                {topArtists.map((artist, i) => (
                  <ArtistCard key={artist.id} artist={artist} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No top artists yet.</p>
            )}
          </section>

          {/* Recently Played */}
          <section>
            <SectionHeader title="Recently Played" icon={Clock} />
            {loading ? (
              <div className="space-y-1 rounded-xl bg-card/50 p-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 animate-pulse">
                    <div className="h-4 w-4 rounded bg-secondary/60" />
                    <div className="h-10 w-10 rounded-md bg-secondary/60" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-48 rounded bg-secondary/60" />
                      <div className="h-3 w-32 rounded bg-secondary/40" />
                    </div>
                    <div className="h-3 w-10 rounded bg-secondary/40" />
                  </div>
                ))}
              </div>
            ) : recentlyPlayed.length > 0 ? (
              <div className="rounded-xl bg-card/50 p-2">
                {recentlyPlayed.map((item, i) => (
                  <RecentRow key={`${item.track.id}-${item.played_at}`} item={item} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recently played tracks.</p>
            )}
          </section>

          {/* New Releases */}
          <section>
            <SectionHeader title="New Releases" />
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : newReleases.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {newReleases.map((album, i) => (
                  <AlbumCard key={album.id} album={album} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No new releases available.</p>
            )}
          </section>
        </div>
      </main>
      <BottomPlayer />
    </div>
  );
};

export default Dashboard;
