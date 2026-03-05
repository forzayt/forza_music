import { createContext, useContext, useState, ReactNode } from "react";

// A minimal track shape that works with both demo + Spotify data
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  previewUrl?: string | null;
  spotifyUri?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
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
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

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
