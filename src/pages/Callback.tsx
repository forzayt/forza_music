import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "@/lib/spotify";
import { useSpotifyAuth } from "@/context/SpotifyAuthContext";
import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

const Callback = () => {
    const { setTokens } = useSpotifyAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error || !code) {
            navigate("/login", { replace: true });
            return;
        }

        (async () => {
            try {
                const tokens = await exchangeCodeForToken(code);
                await setTokens(tokens);
                navigate("/", { replace: true });
            } catch (err) {
                console.error("Auth error:", err);
                navigate("/login", { replace: true });
            }
        })();
    }, [navigate, setTokens]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-6">
            {/* Animated spinner */}
            <div className="relative h-20 w-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-[#1DB954]/30 border-t-[#1DB954]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Music2 size={28} className="text-[#1DB954]" />
                </div>
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-white/50"
            >
                Connecting to Spotify…
            </motion.p>
        </div>
    );
};

export default Callback;
