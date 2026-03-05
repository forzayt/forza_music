import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import {
    spotify,
    SpotifyUser,
    TokenResponse,
    refreshAccessToken,
} from "@/lib/spotify";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null; // unix ms
    user: SpotifyUser | null;
}

interface SpotifyAuthContextType extends AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
    setTokens: (tokens: TokenResponse) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const SpotifyAuthContext = createContext<SpotifyAuthContextType | null>(null);

const STORAGE_KEY = "forza_auth";

function loadAuth(): AuthState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        /* ignore */
    }
    return { accessToken: null, refreshToken: null, expiresAt: null, user: null };
}

function saveAuth(state: AuthState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearAuth() {
    localStorage.removeItem(STORAGE_KEY);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const SpotifyAuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthState>(loadAuth);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!auth.accessToken;

    // On mount – validate/refresh token if needed
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            try {
                if (auth.accessToken && auth.expiresAt) {
                    const bufferMs = 60_000; // refresh 1 min early
                    if (Date.now() > auth.expiresAt - bufferMs && auth.refreshToken) {
                        // Token expired – refresh
                        const tokens = await refreshAccessToken(auth.refreshToken);
                        const expiresAt = Date.now() + tokens.expires_in * 1000;
                        const user = await spotify.getMe(tokens.access_token);
                        const next: AuthState = {
                            accessToken: tokens.access_token,
                            refreshToken: tokens.refresh_token ?? auth.refreshToken,
                            expiresAt,
                            user,
                        };
                        setAuth(next);
                        saveAuth(next);
                    } else if (!auth.user && auth.accessToken) {
                        // Token valid but no user – fetch user
                        const user = await spotify.getMe(auth.accessToken);
                        const next = { ...auth, user };
                        setAuth(next);
                        saveAuth(next);
                    }
                }
            } catch {
                // Token invalid – clear
                clearAuth();
                setAuth({ accessToken: null, refreshToken: null, expiresAt: null, user: null });
            } finally {
                setIsLoading(false);
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = useCallback(async () => {
        const { buildAuthUrl } = await import("@/lib/spotify");
        window.location.href = await buildAuthUrl();
    }, []);

    const logout = useCallback(() => {
        clearAuth();
        setAuth({ accessToken: null, refreshToken: null, expiresAt: null, user: null });
    }, []);

    const setTokens = useCallback(async (tokens: TokenResponse) => {
        setIsLoading(true);
        try {
            const expiresAt = Date.now() + tokens.expires_in * 1000;
            const user = await spotify.getMe(tokens.access_token);
            const next: AuthState = {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt,
                user,
            };
            setAuth(next);
            saveAuth(next);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <SpotifyAuthContext.Provider
            value={{ ...auth, isAuthenticated, isLoading, login, logout, setTokens }}
        >
            {children}
        </SpotifyAuthContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useSpotifyAuth = () => {
    const ctx = useContext(SpotifyAuthContext);
    if (!ctx) throw new Error("useSpotifyAuth must be used within SpotifyAuthProvider");
    return ctx;
};
