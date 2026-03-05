import { Home, Search, Library, Heart, PlusCircle, Radio } from "lucide-react";
import { playlists } from "@/data/demoMusic";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Search" },
  { icon: Library, label: "Library" },
];

const Sidebar = () => (
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
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-md gradient-primary">
            <Heart size={16} className="text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Liked Songs</p>
            <p className="text-xs text-muted-foreground">128 songs</p>
          </div>
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
            <Radio size={16} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Your Episodes</p>
            <p className="text-xs text-muted-foreground">12 episodes</p>
          </div>
        </button>
        {playlists.map((pl) => (
          <button
            key={pl.id}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/40 transition-colors"
          >
            <img src={pl.cover} alt={pl.name} className="h-10 w-10 rounded-md object-cover" />
            <div className="text-left min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{pl.name}</p>
              <p className="text-xs text-muted-foreground">{pl.count} songs</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </motion.aside>
);

export default Sidebar;
