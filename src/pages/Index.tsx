import { useQuery } from "@tanstack/react-query";
import { searchSongs, getRecommendations, SpotifyTrack } from "@/lib/spotify";
import { useSearchStore } from "@/store/searchStore";
import { usePlayerStore } from "@/store/playerStore";
import TrackCard from "@/components/TrackCard";
import { Loader2, Radio, TrendingUp, AlertCircle, Flame } from "lucide-react";

const FEATURED_SEEDS = [
    "4cOdK2wGLETKBW3PvgPWqT", // Blinding Lights – The Weeknd
    "1BxfuPKGuaTgP7aM0Chatn", // HUMBLE. – Kendrick Lamar
    "3n3Ppam7vgaVa1iaRUIOKE", // Shape of You – Ed Sheeran
];

export default function Index() {
    const { query } = useSearchStore();
    const { currentTrack } = usePlayerStore();

    const { data: searchResults, isLoading: searchLoading, error: searchError } = useQuery({
        queryKey: ["search", query],
        queryFn: () => searchSongs(query),
        enabled: query.length > 0,
    });

    const seedId = currentTrack?.id ?? FEATURED_SEEDS[Math.floor(Math.random() * FEATURED_SEEDS.length)];

    const { data: recommendations, isLoading: recLoading } = useQuery({
        queryKey: ["recommendations", seedId],
        queryFn: () => getRecommendations(seedId),
        staleTime: 1000 * 60 * 5,
    });

    return (
        <div className="page">
            {/* Search results */}
            {query && (
                <section className="section">
                    <h2 className="section-title">
                        <TrendingUp size={18} className="inline mr-2 text-green-400" />
                        Results for "{query}"
                    </h2>

                    {searchLoading && (
                        <div className="flex items-center gap-2 text-gray-400 py-6">
                            <Loader2 size={18} className="animate-spin" />
                            Searching Spotify…
                        </div>
                    )}

                    {searchError && (
                        <div className="flex items-center gap-2 text-red-400 py-4">
                            <AlertCircle size={16} />
                            Failed to search. Check your Spotify credentials.
                        </div>
                    )}

                    <div className="track-list">
                        {searchResults?.map((track: SpotifyTrack, i: number) => (
                            <TrackCard key={track.id} track={track} rank={i + 1} />
                        ))}
                    </div>
                </section>
            )}

            {/* Recommendations / Radio section */}
            <section className="section">
                <h2 className="section-title">
                    {currentTrack ? (
                        <>
                            <Radio size={18} className="inline mr-2 text-purple-400" />
                            Because you played <em className="text-white font-semibold not-italic">{currentTrack.name}</em>
                        </>
                    ) : (
                        <>
                            <Flame size={18} className="inline mr-2 text-orange-400" />
                            Discover Music
                        </>
                    )}
                </h2>

                {recLoading && (
                    <div className="flex items-center gap-2 text-gray-400 py-6">
                        <Loader2 size={18} className="animate-spin" />
                        Building your radio…
                    </div>
                )}

                <div className="track-list">
                    {recommendations?.map((track: SpotifyTrack, i: number) => (
                        <TrackCard key={track.id} track={track} rank={i + 1} />
                    ))}
                </div>
            </section>
        </div>
    );
}
