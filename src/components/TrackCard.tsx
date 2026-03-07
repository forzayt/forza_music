import { Track } from "@/lib/audius";
import { usePlayerStore } from "@/store/playerStore";
import { Play, Plus, Clock } from "lucide-react";

interface TrackCardProps {
    track: Track;
    rank?: number;
}

function formatDuration(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function TrackCard({ track, rank }: TrackCardProps) {
    const { playTrack, addToQueue, currentTrack, isPlaying } = usePlayerStore();
    const isActive = currentTrack?.id === track.id;
    const artUrl = track.album.images?.[1]?.url || track.album.images?.[0]?.url;

    return (
        <div
            className={`track-card ${isActive ? "track-card--active" : ""}`}
            onClick={() => playTrack(track)}
        >
            {rank != null && (
                <span className="track-card__rank">{rank}</span>
            )}

            <div className="track-card__art-wrap">
                {artUrl ? (
                    <img src={artUrl} alt={track.album.name} className="track-card__art" />
                ) : (
                    <div className="track-card__art track-card__art--placeholder" />
                )}
                <div className="track-card__play-overlay">
                    {isActive && isPlaying ? (
                        <span className="track-card__playing-bars">
                            <span /><span /><span />
                        </span>
                    ) : (
                        <Play size={18} fill="white" strokeWidth={0} />
                    )}
                </div>
            </div>

            <div className="track-card__info">
                <p className="track-card__name">{track.name}</p>
                <p className="track-card__artist">{track.artists.map((a) => a.name).join(", ")}</p>
            </div>

            <span className="track-card__duration">
                <Clock size={12} className="inline mr-1 opacity-50" />
                {formatDuration(track.duration_ms)}
            </span>

            <button
                className="track-card__queue-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    addToQueue(track);
                }}
                title="Add to queue"
            >
                <Plus size={16} />
            </button>
        </div>
    );
}
