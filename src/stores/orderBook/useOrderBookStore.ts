import type {
  OrderBookDecimal,
  OrderBookDepthVisualization,
  OrderBookTab,
} from "@/types/orderBookTypes";
import type { DepthUpdate } from "@/api/orderBook/types";
import { create } from "zustand";

interface OrderBookStore {
  tab: OrderBookTab;
  decimal: OrderBookDecimal;
  depthVisualization: OrderBookDepthVisualization;
  displayAvgSum: boolean;
  showBuySellRatio: boolean;
  animationsEnabled: boolean;
  rounding: boolean;

  bids: [string, string][]; // [price, quantity]
  asks: [string, string][]; // [price, quantity]
  lastUpdateId: number;

  setTab: (tab: OrderBookTab) => void;
  setDecimal: (decimal: OrderBookDecimal) => void;
  setDepthVisualization: (
    depthVisualization: OrderBookDepthVisualization,
  ) => void;
  setDisplayAvgSum: (displayAvgSum: boolean) => void;
  setShowBuySellRatio: (showBuySellRatio: boolean) => void;
  setAnimationsEnabled: (animationsEnabled: boolean) => void;
  setRounding: (rounding: boolean) => void;
  setBidsAndAsks: (
    bids: [string, string][],
    asks: [string, string][],
    lastUpdateId: number,
  ) => void;
  applyUpdate: (update: DepthUpdate) => void;
  reset: () => void;
}

const useOrderBookStore = create<OrderBookStore>((set, get) => ({
  tab: "both",
  decimal: 0.01,
  depthVisualization: "amount",
  displayAvgSum: false,
  showBuySellRatio: false,
  animationsEnabled: true,
  rounding: false,

  bids: [],
  asks: [],
  lastUpdateId: 0,

  setTab: (tab) => set({ tab }),
  setDecimal: (decimal) => set({ decimal }),
  setDepthVisualization: (depthVisualization) => set({ depthVisualization }),
  setDisplayAvgSum: (displayAvgSum) => set({ displayAvgSum }),
  setShowBuySellRatio: (showBuySellRatio) => set({ showBuySellRatio }),
  setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
  setRounding: (rounding) => set({ rounding }),

  setBidsAndAsks: (bids, asks, lastUpdateId) =>
    set({ bids, asks, lastUpdateId }),

  // Apply WebSocket update
  applyUpdate: (update) => {
    const state = get();

    // Simple validation - only ignore if update is older than current
    if (update.u <= state.lastUpdateId) {
      return;
    }

    const bidsMap = new Map(state.bids.map(([p, q]) => [p, q]));
    const asksMap = new Map(state.asks.map(([p, q]) => [p, q]));

    for (const [price, quantity] of update.b) {
      if (parseFloat(quantity) === 0) {
        bidsMap.delete(price);
      } else {
        bidsMap.set(price, quantity);
      }
    }

    for (const [price, quantity] of update.a) {
      if (parseFloat(quantity) === 0) {
        asksMap.delete(price);
      } else {
        asksMap.set(price, quantity);
      }
    }

    const newBids = Array.from(bidsMap.entries()).sort(
      (a, b) => parseFloat(b[0]) - parseFloat(a[0]),
    ) as [string, string][];

    const newAsks = Array.from(asksMap.entries()).sort(
      (a, b) => parseFloat(a[0]) - parseFloat(b[0]),
    ) as [string, string][];

    set({
      bids: newBids,
      asks: newAsks,
      lastUpdateId: update.u,
    });
  },

  reset: () => set({ bids: [], asks: [], lastUpdateId: 0 }),
}));

export default useOrderBookStore;
