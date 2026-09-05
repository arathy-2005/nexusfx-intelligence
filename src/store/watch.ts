import { create } from "zustand";
import { persist } from "zustand/middleware";

type WatchState = {
  watchlist: string[];
  favorites: string[];
  toggleWatch: (symbol: string) => void;
  toggleFavorite: (symbol: string) => void;
};

export const useWatchStore = create<WatchState>()(
  persist(
    (set, get) => ({
      watchlist: ["EURUSD", "GBPUSD", "XAUUSD"],
      favorites: ["EURUSD", "BTCUSD"],
      toggleWatch: (symbol) => {
        const has = get().watchlist.includes(symbol);
        set({
          watchlist: has ? get().watchlist.filter((s) => s !== symbol) : [...get().watchlist, symbol],
        });
      },
      toggleFavorite: (symbol) => {
        const has = get().favorites.includes(symbol);
        set({
          favorites: has ? get().favorites.filter((s) => s !== symbol) : [...get().favorites, symbol],
        });
      },
    }),
    { name: "nfx-watch" },
  ),
);
