import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSpotifyAuth } from "@/context/SpotifyAuthContext";
import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useSpotifyAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black gap-6">
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
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
