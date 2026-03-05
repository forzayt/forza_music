import { Home, Search, Library, Heart, PlusCircle, Radio, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useSpotifyAuth } from "@/context/SpotifyAuthContext";
import { useEffect, useState } from "react";
import { spotify, SpotifyPlaylist, getImageUrl } from "@/lib/spotify";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Search" },
  { icon: Library, label: "Library" },
];

const Sidebar = () => {
  const { accessToken, user, logout } = useSpotifyAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    spotify.getUserPlaylists(accessToken, 20)
      .then((res) => setPlaylists(res.items))
      .catch(console.error);
  }, [accessToken]);

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 z-40 flex h-[calc(100vh-80px)] w-60 flex-col gap-2 p-2"
    >
      {/* Main nav */}
      <div className="rounded-xl bg-card p-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <item.icon size={22} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Library */}
      <div className="flex flex-1 flex-col rounded-xl bg-card p-4 overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Library size={22} />
            <span className="text-sm font-semibold">Your Library</span>
          </div>
          <PlusCircle size={18} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
        </div>

        <div className="mb-3 flex gap-2">
          {["Playlists", "Artists"].map((t) => (
            <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
          {/* Liked Songs */}
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-indigo-800 to-[#1DB954]">
              <Heart size={16} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Liked Songs</p>
              <p className="text-xs text-muted-foreground">Playlist</p>
            </div>
          </button>

          {/* Your Episodes */}
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
              <Radio size={16} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Your Episodes</p>
              <p className="text-xs text-muted-foreground">Podcast</p>
            </div>
          </button>

          {/* Real user playlists */}
          {playlists.map((pl) => (
            <motion.a
              key={pl.id}
              href={pl.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 2 }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/40 transition-colors"
            >
              {pl.images?.[0]?.url ? (
                <img src={pl.images[0].url} alt={pl.name} className="h-10 w-10 rounded-md object-cover flex-shrink-0" />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-secondary">
                  <Library size={14} className="text-muted-foreground" />
                </div>
              )}
              <div className="text-left min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{pl.name}</p>
                <p className="text-xs text-muted-foreground">{pl.tracks.total} songs</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* User info + logout at bottom */}
      {user && (
        <div className="rounded-xl bg-card p-3 flex items-center gap-3">
          {user.images?.[0]?.url ? (
            <img
              src={user.images[0].url}
              alt={user.display_name}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954] text-sm font-bold text-black">
              {user.display_name?.[0] ?? "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">{user.display_name}</p>
            <p className="truncate text-[10px] text-muted-foreground capitalize">{user.product}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
