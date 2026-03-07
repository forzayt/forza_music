const SPOTIFY_TOKEN_API = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API = 'https://api.spotify.com/v1';

let accessToken = '';
let tokenExpirationTime = 0;

export async function getAccessToken(): Promise<string> {
    if (accessToken && Date.now() < tokenExpirationTime) {
        return accessToken;
    }

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing Spotify credentials in environment variables.');
    }

    const authString = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch(SPOTIFY_TOKEN_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${authString}`,
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Spotify access token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + data.expires_in * 1000 - 60000; // Buffer of 1 minute
    return accessToken;
}

export async function spotifyFetch(endpoint: string, options: RequestInit = {}) {
    const token = await getAccessToken();
    const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_API}${endpoint}`;

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Spotify API error: ${res.statusText}`);
    }

    return res.json();
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: {
        name: string;
        id: string;
    }[];
    album: {
        name: string;
        images: { url: string; height: number; width: number }[];
    };
    duration_ms: number;
}

export async function searchSongs(query: string): Promise<SpotifyTrack[]> {
    const data = await spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=track&limit=20`);
    return data.tracks.items;
}

export async function getRecommendations(seedTrackId: string): Promise<SpotifyTrack[]> {
    const data = await spotifyFetch(`/recommendations?seed_tracks=${seedTrackId}&limit=20&market=US`);
    return data.tracks;
}

// Well‑known Spotify chart / editorial playlists
export const CHART_PLAYLISTS = {
    global50: { id: '37i9dQZEVXbMDoHDwVN2tF', label: 'Global Top 50', emoji: '🌍' },
    viral50: { id: '37i9dQZEVXbLiRSasKsNU9', label: 'Global Viral 50', emoji: '🔥' },
    trending: { id: '37i9dQZEVXbNG2KDcFcKOF', label: 'Spotify Charts', emoji: '📈' },
    newMusic: { id: '37i9dQZF1DX4JAvHpjipBk', label: 'New Music Friday', emoji: '🆕' },
    hiphop: { id: '37i9dQZF1DX0XUsuxWHRQd', label: 'RapCaviar', emoji: '🎤' },
    pop: { id: '37i9dQZF1DXcBWIGoYBM5M', label: 'Today\'s Top Hits', emoji: '⭐' },
} as const;

export type ChartKey = keyof typeof CHART_PLAYLISTS;

export async function getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    const data = await spotifyFetch(
        `/playlists/${playlistId}/tracks?limit=50&fields=items(track(id,name,artists,album,duration_ms))`
    );
    // The tracks endpoint wraps items in { track: SpotifyTrack }
    return (data.items as Array<{ track: SpotifyTrack | null }>)
        .map(i => i.track)
        .filter((t): t is SpotifyTrack => !!t && !!t.id);
}
