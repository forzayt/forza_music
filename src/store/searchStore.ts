import { create } from 'zustand';

interface SearchStore {
    query: string;
    setQuery: (q: string) => void;
    clearQuery: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    query: '',
    setQuery: (q) => set({ query: q }),
    clearQuery: () => set({ query: '' }),
}));
