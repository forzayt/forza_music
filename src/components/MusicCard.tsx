import { Track } from "@/data/demoMusic";
import { usePlayer } from "@/context/PlayerContext";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

const MusicCard = ({ track, index = 0 }: { track: Track; index?: number }) => {
  const { setTrack, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack.id === track.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => setTrack(track)}
      className="group relative cursor-pointer rounded-xl bg-secondary/50 p-3 transition-all duration-300 hover:bg-secondary"
    >
      <div className="relative mb-3 overflow-hidden rounded-lg">
        <img
          src={track.cover}
          alt={track.title}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/40"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg glow-primary"
          >
            <Play size={22} className="ml-0.5" />
          </motion.button>
        </motion.div>
        {isActive && isPlaying && (
          <div className="absolute bottom-2 right-2 flex items-end gap-0.5">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 16, 4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                className="w-1 rounded-full bg-primary"
              />
            ))}
          </div>
        )}
      </div>
      <h3 className="truncate text-sm font-semibold text-foreground">{track.title}</h3>
      <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
    </motion.div>
  );
};

export default MusicCard;
