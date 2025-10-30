import type { Market } from "@/types/market/marketTypes";
import { create } from "zustand";

interface MarketStore {
  market: Market;
  setMarket: (market: Market) => void;
}

const useMarketStore = create<MarketStore>((set) => ({
  market: "btcusdt",
  setMarket: (market) => set({ market }),
}));

export default useMarketStore;