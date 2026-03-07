import { useRef, useEffect, useState, useCallback } from "react";
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Radio, Loader2, AlertCircle
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { getStreamUrl } from "@/lib/piped";

export default function BottomPlayer() {
  const {
    currentTrack, isPlaying, queue, volume,
    playNext, playPrev, setIsPlaying, setVolume,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve the stream URL when the current track changes
  useEffect(() => {
    if (!currentTrack) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setStreamUrl(null);

    getStreamUrl(currentTrack.id)
      .then((url) => {
        if (!cancelled) setStreamUrl(url);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load audio.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [currentTrack?.id]);

  // When stream URL is available, load and play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    audio.src = streamUrl;
    audio.load();
    if (isPlaying) audio.play().catch(() => { });
  }, [streamUrl]);

  // Sync play/pause from state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;
    if (isPlaying) audio.play().catch(() => { });
    else audio.pause();
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
    setDuration(audio.duration || 0);
  }, []);

  const handleEnded = useCallback(() => {
    if (queue.length > 0) playNext();
    else setIsPlaying(false);
  }, [queue, playNext, setIsPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setProgress(time);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const artUrl = currentTrack?.album.images?.[1]?.url || currentTrack?.album.images?.[0]?.url;

  if (!currentTrack) return null;

  return (
    <footer className="bottom-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => setError("Playback error. Try next track.")}
      />

      {/* Progress bar */}
      <div className="bottom-player__progress-bar">
        <span className="bottom-player__time">{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          step={0.5}
          onChange={handleSeek}
          className="bottom-player__seek"
        />
        <span className="bottom-player__time">{formatTime(duration)}</span>
      </div>

      <div className="bottom-player__controls">
        {/* Track info */}
        <div className="bottom-player__track">
          {artUrl && <img src={artUrl} alt="" className="bottom-player__art" />}
          <div className="bottom-player__meta">
            <p className="bottom-player__title">{currentTrack.name}</p>
            <p className="bottom-player__artist">
              {currentTrack.artists.map((a) => a.name).join(", ")}
            </p>
            {error && (
              <p className="bottom-player__error">
                <AlertCircle size={11} className="inline mr-1" />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="bottom-player__buttons">
          <button className="ctrl-btn" onClick={playPrev} title="Previous">
            <SkipBack size={20} />
          </button>

          <button
            className="ctrl-btn ctrl-btn--play"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={loading}
            title={isPlaying ? "Pause" : "Play"}
          >
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} fill="currentColor" />
            )}
          </button>

          <button className="ctrl-btn" onClick={playNext} title="Next">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Volume + Queue indicator */}
        <div className="bottom-player__right">
          {queue.length > 0 && (
            <div className="bottom-player__queue-badge" title={`${queue.length} in queue`}>
              <Radio size={13} />
              <span>{queue.length}</span>
            </div>
          )}
          <button
            className="ctrl-btn"
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
            title={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="bottom-player__volume"
          />
        </div>
      </div>
    </footer>
  );
}
