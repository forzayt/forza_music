import { motion } from "framer-motion";
import { useSpotifyAuth } from "@/context/SpotifyAuthContext";
import { Music2 } from "lucide-react";

const Login = () => {
    const { login, isLoading } = useSpotifyAuth();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
            {/* Animated blurred blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-[#1DB954]/20 blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], x: [0, -50, 0], y: [0, 40, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, 60, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1DB954]/10 blur-[100px]"
                />
            </div>

            {/* Noise texture overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: "200px 200px",
                }}
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-2xl"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1DB954] shadow-lg shadow-[#1DB954]/40">
                        <Music2 size={32} className="text-black" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black tracking-tight text-white">Forza Music</h1>
                        <p className="mt-1 text-sm text-white/50">Your Spotify, beautifully reimagined</p>
                    </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px w-full bg-white/10" />

                {/* Login Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex w-full flex-col items-center gap-4"
                >
                    <p className="text-center text-sm text-white/60">
                        Connect your Spotify account to get personalized music, recent plays, and your playlists.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(29,185,84,0.45)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={login}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-3 rounded-full bg-[#1DB954] py-3.5 text-sm font-bold text-black transition-all disabled:opacity-60"
                    >
                        {isLoading ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block h-5 w-5 rounded-full border-2 border-black/30 border-t-black"
                            />
                        ) : (
                            <>
                                {/* Spotify Icon */}
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                                Continue with Spotify
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Footer note */}
                <p className="text-center text-[11px] text-white/30">
                    By continuing, you agree to Spotify's Terms of Service. Forza Music does not store your credentials.
                </p>
            </motion.div>

            {/* Floating notes decoration */}
            {["♪", "♫", "♩", "♬"].map((note, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                        opacity: [0, 0.15, 0],
                        y: -120,
                        x: [0, (i % 2 === 0 ? 1 : -1) * 20, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 1.2,
                        ease: "easeOut",
                    }}
                    style={{ left: `${20 + i * 18}%`, bottom: "15%" }}
                    className="pointer-events-none absolute text-4xl text-white"
                >
                    {note}
                </motion.span>
            ))}
        </div>
    );
};

export default Login;
