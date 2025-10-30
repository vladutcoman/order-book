import type { OrderBookTab } from "@/types/orderBookTypes";
import { create } from "zustand";

interface OrderBookStore {
  tab: OrderBookTab;
  setTab: (tab: OrderBookTab) => void;
}

const useOrderBookStore = create<OrderBookStore>((set) => ({
  tab: "both",
  setTab: (tab) => set({ tab }),
}));

export default useOrderBookStore;