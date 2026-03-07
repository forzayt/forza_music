import { Outlet } from "react-router-dom";
import BottomPlayer from "./BottomPlayer";
import TopNav from "./TopNav";

export default function Layout() {
    return (
        <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-y-auto pb-24">
                <Outlet />
            </main>
            <BottomPlayer />
        </div>
    );
}
