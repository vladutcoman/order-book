import type { Market } from "@/types/marketTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MarketStore {
  market: Market;
  setMarket: (market: Market) => void;
}

const useMarketStore = create<MarketStore>()(
  persist(
    (set) => ({
      market: "btcusdt",
      setMarket: (market) => set({ market }),
    }),
    {
      name: "market-storage",
      partialize: (state) => ({ market: state.market }),
    },
  ),
);

export default useMarketStore;
