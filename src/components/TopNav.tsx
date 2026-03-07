import { useState } from "react";
import { Search, Music2 } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";

export default function TopNav() {
    const { setQuery } = useSearchStore();
    const [input, setInput] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) setQuery(input.trim());
    };

    return (
        <header className="topnav">
            <div className="topnav-logo">
                <Music2 size={22} className="topnav-logo-icon" />
                <span className="topnav-logo-text">Forza</span>
            </div>

            <form className="topnav-search" onSubmit={handleSearch}>
                <Search size={16} className="topnav-search-icon" />
                <input
                    type="text"
                    placeholder="Search songs, artists…"
                    className="topnav-search-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </form>
        </header>
    );
}
