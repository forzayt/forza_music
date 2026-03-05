import { createContext, useContext, useState, ReactNode } from "react";
import { Track, tracks } from "@/data/demoMusic";

interface PlayerContextType {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  togglePlay: () => void;
  setTrack: (track: Track) => void;
  setProgress: (p: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be within PlayerProvider");
  return ctx;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        togglePlay: () => setIsPlaying((p) => !p),
        setTrack: (t) => { setCurrentTrack(t); setIsPlaying(true); },
        setProgress,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
