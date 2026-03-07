const AUDIUS_GATEWAY = 'https://api.audius.co';
const APP_NAME = 'ForzaMusic';

let cachedHost: string | null = null;

export async function getHost(): Promise<string> {
  if (cachedHost) return cachedHost;
  const res = await fetch(AUDIUS_GATEWAY);
  const { data } = await res.json();
  const hosts = data as string[];
  cachedHost = hosts[Math.floor(Math.random() * hosts.length)];
  return cachedHost;
}

export interface Track {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
}

interface AudiusTrack {
  id: string;
  title: string;
  user?: { id: string; name: string; handle?: string };
  artwork?: { '150x150'?: string; '480x480'?: string; '1000x1000'?: string };
  duration?: number;
}

function mapAudiusToTrack(a: AudiusTrack): Track {
  const art = a.artwork?.['480x480'] || a.artwork?.['150x150'] || '';
  return {
    id: a.id,
    name: a.title,
    artists: [{ name: a.user?.name ?? 'Unknown', id: a.user?.id ?? '' }],
    album: { name: a.user?.handle ?? '', images: art ? [{ url: art }] : [] },
    duration_ms: (a.duration ?? 0) * 1000,
  };
}

export async function searchSongs(query: string): Promise<Track[]> {
  const host = await getHost();
  const res = await fetch(
    `${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=${APP_NAME}`
  );
  if (!res.ok) throw new Error('Audius search failed');
  const data = await res.json();
  const items = (data.data ?? data) as AudiusTrack[];
  return items.filter((t) => t?.id && t?.title).map(mapAudiusToTrack);
}

export async function getRecommendations(_seedTrackId?: string): Promise<Track[]> {
  const host = await getHost();
  const res = await fetch(`${host}/v1/tracks/trending?app_name=${APP_NAME}`);
  if (!res.ok) throw new Error('Audius trending failed');
  const data = await res.json();
  const items = (data.data ?? data) as AudiusTrack[];
  return items.filter((t) => t?.id && t?.title).map(mapAudiusToTrack);
}

export async function getStreamUrl(trackId: string): Promise<string> {
  const host = await getHost();
  return `${host}/v1/tracks/${trackId}/stream?app_name=${APP_NAME}`;
}
