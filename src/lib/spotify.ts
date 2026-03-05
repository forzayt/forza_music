// ─── Spotify Auth Config ──────────────────────────────────────────────────────
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string;

const SCOPES = [
    "user-read-private",
    "user-read-email",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-recently-played",
    "user-top-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read",
    "streaming",
].join(" ");

// ─── PKCE Helpers ─────────────────────────────────────────────────────────────
function generateCodeVerifier(length = 128): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((b) => chars[b % chars.length])
        .join("");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

// ─── Auth URL Builder ─────────────────────────────────────────────────────────
export async function buildAuthUrl(): Promise<string> {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    sessionStorage.setItem("pkce_verifier", verifier);

    const params = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        code_challenge_method: "S256",
        code_challenge: challenge,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// ─── Token Exchange ───────────────────────────────────────────────────────────
export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const verifier = sessionStorage.getItem("pkce_verifier");
    if (!verifier) throw new Error("Missing PKCE verifier");

    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: verifier,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error_description || "Token exchange failed");
    }

    const data: TokenResponse = await res.json();
    sessionStorage.removeItem("pkce_verifier");
    return data;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!res.ok) throw new Error("Token refresh failed");
    return res.json();
}

// ─── API Helpers ──────────────────────────────────────────────────────────────
async function spotifyFetch<T>(endpoint: string, token: string): Promise<T> {
    const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
    return res.json();
}

// ─── Spotify Types ────────────────────────────────────────────────────────────
export interface SpotifyUser {
    id: string;
    display_name: string;
    email: string;
    images: { url: string; width: number; height: number }[];
    country: string;
    product: string;
    followers: { total: number };
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: { id: string; name: string }[];
    album: {
        id: string;
        name: string;
        images: { url: string; width: number; height: number }[];
    };
    duration_ms: number;
    preview_url: string | null;
    uri: string;
    popularity: number;
    external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    tracks: { total: number };
    owner: { display_name: string };
    external_urls: { spotify: string };
}

export interface SpotifyArtist {
    id: string;
    name: string;
    images: { url: string }[];
    followers: { total: number };
    genres: string[];
    popularity: number;
    external_urls: { spotify: string };
}

export interface RecentlyPlayedItem {
    track: SpotifyTrack;
    played_at: string;
}

export interface SpotifyAlbum {
    id: string;
    name: string;
    images: { url: string }[];
    artists: { name: string }[];
    release_date: string;
    total_tracks: number;
    external_urls: { spotify: string };
}

// ─── API Calls ────────────────────────────────────────────────────────────────
export const spotify = {
    getMe: (token: string) =>
        spotifyFetch<SpotifyUser>("/me", token),

    getTopTracks: (token: string, timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 20) =>
        spotifyFetch<{ items: SpotifyTrack[] }>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, token),

    getTopArtists: (token: string, timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 10) =>
        spotifyFetch<{ items: SpotifyArtist[] }>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`, token),

    getRecentlyPlayed: (token: string, limit = 20) =>
        spotifyFetch<{ items: RecentlyPlayedItem[] }>(`/me/player/recently-played?limit=${limit}`, token),

    getUserPlaylists: (token: string, limit = 20) =>
        spotifyFetch<{ items: SpotifyPlaylist[] }>(`/me/playlists?limit=${limit}`, token),

    getNewReleases: (token: string, limit = 8) =>
        spotifyFetch<{ albums: { items: SpotifyAlbum[] } }>(`/browse/new-releases?limit=${limit}`, token),

    getFeaturedPlaylists: (token: string, limit = 6) =>
        spotifyFetch<{ playlists: { items: SpotifyPlaylist[] } }>(`/browse/featured-playlists?limit=${limit}`, token),

    getPlaylistTracks: (token: string, playlistId: string) =>
        spotifyFetch<{ items: { track: SpotifyTrack }[] }>(`/playlists/${playlistId}/tracks?limit=50`, token),

    getCurrentlyPlaying: (token: string) =>
        spotifyFetch<{ item: SpotifyTrack; is_playing: boolean; progress_ms: number } | null>("/me/player/currently-playing", token),

    getLikedSongs: (token: string, limit = 50) =>
        spotifyFetch<{ items: { track: SpotifyTrack }[]; total: number }>(`/me/tracks?limit=${limit}`, token),
};

// ─── Formatter Helpers ────────────────────────────────────────────────────────
export function msToTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function getImageUrl(images: { url: string }[] | undefined, fallback = ""): string {
    return images?.[0]?.url ?? fallback;
}
