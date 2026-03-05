import { Track } from "@/context/PlayerContext";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

const TrackRow = ({ track, index }: { track: Track; index: number }) => {
  const { setTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const isActive = currentTrack?.id === track.id;

  const handleClick = () => {
    if (isActive) togglePlay();
    else setTrack(track);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={handleClick}
      className={`group flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/60 ${isActive ? "bg-secondary/40" : ""
        }`}
    >
      <span className="w-6 text-center text-sm text-muted-foreground group-hover:hidden">
        {index + 1}
      </span>
      <span className="hidden w-6 text-center group-hover:block">
        {isActive && isPlaying ? (
          <Pause size={14} className="mx-auto text-primary" />
        ) : (
          <Play size={14} className="mx-auto text-foreground" />
        )}
      </span>
      <img src={track.cover} alt={track.title} className="h-10 w-10 rounded-md object-cover" />
      <div className="flex-1 min-w-0">
        <p className={`truncate text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
          {track.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
      </div>
      <span className="text-xs text-muted-foreground">{track.album}</span>
      <span className="w-12 text-right text-xs text-muted-foreground">{track.duration}</span>
    </motion.div>
  );
};

export default TrackRow;
