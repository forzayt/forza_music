import { usePlayer } from "@/context/PlayerContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Heart, Shuffle, Repeat, ListMusic, Share2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const PlayerPage = () => {
  const { currentTrack, isPlaying, togglePlay, progress, setProgress } = usePlayer();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      >
        {/* Ambient background */}
        <div className="absolute inset-0">
          <img
            src={currentTrack.cover}
            alt=""
            className="h-full w-full object-cover scale-150 blur-[100px] opacity-40"
          />
          <div className="absolute inset-0 bg-background/70" />
          {/* Animated gradient orbs */}
          <motion.div
            animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0], scale: [1, 1.2, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -60, 40, 0], y: [0, 30, -50, 0], scale: [1, 0.8, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/20 blur-[120px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-6 py-4">
          {/* Top bar */}
          <div className="flex w-full max-w-lg items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-full glass"
            >
              <ChevronDown size={22} className="text-foreground" />
            </motion.button>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Playing from
              </p>
              <p className="text-sm font-semibold text-foreground">{currentTrack.album}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="flex h-10 w-10 items-center justify-center rounded-full glass"
            >
              <Share2 size={18} className="text-foreground" />
            </motion.button>
          </div>

          {/* Album Art */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
            className="relative my-8"
          >
            <motion.div
              animate={isPlaying ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="h-72 w-72 rounded-2xl object-cover shadow-2xl sm:h-80 sm:w-80 md:h-96 md:w-96"
                style={{
                  boxShadow: "0 25px 80px -20px rgba(0,0,0,0.6)",
                }}
              />
            </motion.div>
            {/* Vinyl peek */}
            <motion.div
              animate={isPlaying ? { x: 60, rotate: 360 } : { x: 0, rotate: 0 }}
              transition={isPlaying ? { x: { duration: 0.6 }, rotate: { repeat: Infinity, duration: 3, ease: "linear" } } : { duration: 0.4 }}
              className="absolute right-0 top-1/2 -z-10 -translate-y-1/2"
            >
              <div className="h-72 w-72 rounded-full bg-gradient-to-br from-muted to-background border-4 border-border sm:h-80 sm:w-80 md:h-96 md:w-96 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-muted border-2 border-border" />
              </div>
            </motion.div>
          </motion.div>

          {/* Track info */}
          <div className="w-full max-w-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <motion.h1
                  key={currentTrack.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {currentTrack.title}
                </motion.h1>
                <p className="text-base text-muted-foreground">{currentTrack.artist}</p>
              </div>
              <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Heart size={24} className="text-primary" />
              </motion.button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <Slider
                value={[progress]}
                onValueChange={(v) => setProgress(v[0])}
                max={100}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground tabular-nums">1:18</span>
                <span className="text-xs text-muted-foreground tabular-nums">{currentTrack.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Shuffle size={20} />
              </button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-foreground">
                <SkipBack size={28} fill="currentColor" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background glow-primary"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-foreground">
                <SkipForward size={28} fill="currentColor" />
              </motion.button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Repeat size={20} />
              </button>
            </div>

            {/* Bottom extras */}
            <div className="mt-6 flex items-center justify-between">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <ListMusic size={20} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Forza Music</span>
                <div className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-xs text-gradient font-bold">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlayerPage;
