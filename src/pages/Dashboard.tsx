import Sidebar from "@/components/Sidebar";
import BottomPlayer from "@/components/BottomPlayer";
import MusicCard from "@/components/MusicCard";
import TrackRow from "@/components/TrackRow";
import { tracks, recentlyPlayed, trendingNow, madeForYou, playlists } from "@/data/demoMusic";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-bold text-foreground">{title}</h2>
    <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
      Show all <ChevronRight size={14} />
    </button>
  </div>
);

const Dashboard = () => {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-60 pb-24">
        {/* Hero area */}
        <div className="relative overflow-hidden px-6 pb-6 pt-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background/50 to-background" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <h1 className="mb-6 text-3xl font-bold text-foreground">{greeting}</h1>

            {/* Quick picks grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {recentlyPlayed.slice(0, 6).map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-md bg-secondary/60 transition-colors hover:bg-secondary"
                >
                  <img src={track.cover} alt={track.title} className="h-14 w-14 object-cover" />
                  <span className="text-sm font-semibold text-foreground">{track.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-8 px-6">
          {/* Trending */}
          <section>
            <SectionHeader title="Trending Now" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {trendingNow.map((track, i) => (
                <MusicCard key={track.id} track={track} index={i} />
              ))}
            </div>
          </section>

          {/* Made for you */}
          <section>
            <SectionHeader title="Made For You" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {madeForYou.map((track, i) => (
                <MusicCard key={track.id} track={track} index={i} />
              ))}
            </div>
          </section>

          {/* All Tracks */}
          <section>
            <SectionHeader title="All Tracks" />
            <div className="rounded-xl bg-card/50 p-2">
              {tracks.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <BottomPlayer />
    </div>
  );
};

export default Dashboard;
