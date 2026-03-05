import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Shuffle, Repeat, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

const BottomPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, progress, setProgress } = usePlayer();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border"
    >
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center gap-4 px-4">
        {/* Track Info */}
        <div className="flex min-w-[200px] items-center gap-3">
          <AnimatePresence mode="wait">
            {currentTrack ? (
              <motion.img
                key={currentTrack.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="h-12 w-12 rounded-lg object-cover"
                whileHover={{ scale: 1.05 }}
              />
            ) : (
              <motion.div
                key="empty"
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary"
              >
                <Music2 size={20} className="text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="min-w-0">
            {currentTrack ? (
              <>
                <p className="truncate text-sm font-semibold text-foreground">{currentTrack.title}</p>
                <p className="truncate text-xs text-muted-foreground">{currentTrack.artist}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-muted-foreground">No track selected</p>
                <p className="text-xs text-muted-foreground/60">Pick something to play</p>
              </>
            )}
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <Shuffle size={16} />
            </button>
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <SkipBack size={20} />
            </button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              disabled={!currentTrack}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-40"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </motion.button>
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <SkipForward size={20} />
            </button>
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <Repeat size={16} />
            </button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {currentTrack ? "0:00" : "--:--"}
            </span>
            <Slider
              value={[progress]}
              onValueChange={(v) => setProgress(v[0])}
              max={100}
              step={1}
              className="flex-1"
              disabled={!currentTrack}
            />
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {currentTrack?.duration ?? "--:--"}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex min-w-[200px] items-center justify-end gap-3">
          <Volume2 size={18} className="text-muted-foreground" />
          <Slider value={[70]} max={100} step={1} className="w-24" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/player")}
            className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Maximize2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomPlayer;
