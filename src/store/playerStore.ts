import { create } from 'zustand';
import { Track, getRecommendations } from '../lib/piped';

interface PlayerState {
    currentTrack: Track | null;
    queue: Track[];
    history: Track[];
    isPlaying: boolean;
    volume: number;
    playTrack: (track: Track) => void;
    addToQueue: (track: Track) => void;
    playNext: () => void;
    playPrev: () => void;
    setIsPlaying: (playing: boolean) => void;
    setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentTrack: null,
    queue: [],
    history: [],
    isPlaying: false,
    volume: 1,

    playTrack: async (track: Track) => {
        set((state) => ({
            history: state.currentTrack ? [...state.history, state.currentTrack] : state.history,
            currentTrack: track,
            isPlaying: true,
            queue: [],
        }));

        // Start fetching suggestions based on the newly played track
        try {
            const recommendations = await getRecommendations(track.id);
            set((state) => {
                // Only update if the user hasn't switched songs again
                if (state.currentTrack?.id === track.id) {
                    return { queue: recommendations };
                }
                return state;
            });
        } catch (err) {
            console.error('Failed to fill autodiscover queue:', err);
        }
    },

    addToQueue: (track: Track) => {
        set((state) => ({ queue: [...state.queue, track] }));
    },

    playNext: async () => {
        const state = get();
        if (state.queue.length > 0) {
            const nextTrack = state.queue[0];
            const newQueue = state.queue.slice(1);

            set((s) => ({
                history: s.currentTrack ? [...s.history, s.currentTrack] : s.history,
                currentTrack: nextTrack,
                queue: newQueue,
                isPlaying: true,
            }));

            // Top off the queue if it's running low
            if (newQueue.length < 5) {
                try {
                    const recommendations = await getRecommendations(nextTrack.id);
                    // filter out what we already have in queue to avoid repeats (simple unique check)
                    set((s) => {
                        if (s.currentTrack?.id === nextTrack.id) {
                            const existingIds = new Set(s.queue.map(t => t.id));
                            const newRecs = recommendations.filter(t => !existingIds.has(t.id));
                            return { queue: [...s.queue, ...newRecs] };
                        }
                        return s;
                    });
                } catch (err) {
                    console.error('Failed to top off queue', err);
                }
            }
        }
    },

    playPrev: () => {
        const state = get();
        if (state.history.length > 0) {
            const prevTrack = state.history[state.history.length - 1];
            const newHistory = state.history.slice(0, -1);

            set((s) => ({
                currentTrack: prevTrack,
                history: newHistory,
                queue: s.currentTrack ? [s.currentTrack, ...s.queue] : s.queue,
                isPlaying: true,
            }));
        }
    },

    setIsPlaying: (playing: boolean) => {
        set({ isPlaying: playing });
    },

    setVolume: (volume: number) => {
        set({ volume });
    },
}));
