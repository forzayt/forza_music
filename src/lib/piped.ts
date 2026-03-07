// Use proxy in dev to avoid CORS; direct in production (needs CORS-enabled instance or your own proxy)
const PIPED_API = import.meta.env.DEV ? '/api/piped' : 'https://pipedapi.leptons.xyz';
const streamCache = new Map<string, string>();

export interface Track {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
}

interface PipedSearchItem {
  type?: string;
  title?: string;
  name?: string;
  url?: string;
  thumbnailUrl?: string;
  thumbnail?: string;
  uploaderName?: string;
  uploader?: string;
  duration?: number;
}

function parseVideoId(url: string): string {
  const match = url?.match(/[?&]v=([^&]+)/);
  return match ? match[1] : url?.replace('/watch?v=', '') ?? '';
}

function mapPipedToTrack(item: PipedSearchItem): Track | null {
  const videoId = parseVideoId(item.url ?? '');
  if (!videoId) return null;
  const title = item.title ?? item.name ?? '';
  if (!title) return null;
  return {
    id: videoId,
    name: title,
    artists: [{ name: item.uploaderName ?? item.uploader ?? 'Unknown', id: '' }],
    album: {
      name: '',
      images: [{ url: item.thumbnailUrl ?? item.thumbnail ?? '' }],
    },
    duration_ms: (item.duration ?? 0) * 1000,
  };
}

export async function searchSongs(query: string): Promise<Track[]> {
  const res = await fetch(
    `${PIPED_API}/search?q=${encodeURIComponent(query)}&filter=music_songs`
  );
  if (!res.ok) throw new Error('Piped search failed');
  const data = await res.json();
  const items = (data.items ?? []) as PipedSearchItem[];
  return items
    .filter((i) => i.type === 'stream' || i.url?.includes('/watch'))
    .map(mapPipedToTrack)
    .filter((t): t is Track => !!t)
    .slice(0, 20);
}

export async function getRecommendations(_seedTrackId?: string): Promise<Track[]> {
  return searchSongs('top hits trending music');
}

export async function getStreamUrl(trackId: string): Promise<string> {
  if (streamCache.has(trackId)) return streamCache.get(trackId)!;

  const res = await fetch(`${PIPED_API}/streams/${trackId}`);
  if (!res.ok) throw new Error('Failed to get stream');
  const data = await res.json();
  const streams = data.audioStreams ?? [];
  if (!streams.length) throw new Error('No audio stream found');

  const best = streams.sort((a: { bitrate?: number }, b: { bitrate?: number }) =>
    (a.bitrate ?? 0) - (b.bitrate ?? 0)
  ).pop();
  const url = best.url;
  streamCache.set(trackId, url);
  return url;
}
