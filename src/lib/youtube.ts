import { SpotifyTrack } from './spotify';

const PIPED_API = 'https://pipedapi.kavin.rocks';

// Simple LRU/in-memory cache for resolved stream URLs to avoid re-fetching
const streamCache = new Map<string, string>();

export async function getAudioStreamForTrack(track: SpotifyTrack): Promise<string> {
    const cacheKey = track.id;
    if (streamCache.has(cacheKey)) {
        return streamCache.get(cacheKey)!;
    }

    const query = `${track.name} ${track.artists[0]?.name} official audio`;

    // 1. Search for video using Piped API
    const searchRes = await fetch(`${PIPED_API}/search?q=${encodeURIComponent(query)}&filter=music_songs`);
    if (!searchRes.ok) {
        throw new Error('Failed to reach Piped Search API');
    }

    const searchData = await searchRes.json();
    const firstResult = searchData.items?.[0]; // get the first result
    if (!firstResult) {
        throw new Error('No YouTube match found for track.');
    }

    const videoId = firstResult.url.replace('/watch?v=', '');

    // 2. Extract stream URL using Piped API
    const streamRes = await fetch(`${PIPED_API}/streams/${videoId}`);
    if (!streamRes.ok) {
        throw new Error('Failed to reach Piped Stream API');
    }

    const streamData = await streamRes.json();
    const audioStreams = streamData.audioStreams;

    if (!audioStreams || audioStreams.length === 0) {
        throw new Error('No valid audio streams found for track.');
    }

    // Pick the highest bitrate audio stream (webm/m4a)
    // Sorted by bitrate ascending, so we pick the last one
    const bestStream = audioStreams.sort((a: any, b: any) => a.bitrate - b.bitrate).pop();
    const streamUrl = bestStream.url;

    streamCache.set(cacheKey, streamUrl);

    return streamUrl;
}
