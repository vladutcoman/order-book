import type {
  OrderBookDecimal,
  OrderBookDepthVisualization,
  OrderBookTab,
  ChangedPrices,
} from "@/types/orderBookTypes";
import type { DepthUpdate } from "@/api/orderBook/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  changedPrices: ChangedPrices; // Track prices that changed (grouped by decimal) with timestamp

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
  clearChangedPrices: () => void;
  cleanupExpiredChangedPrices: (animationDuration: number) => void;
}

const useOrderBookStore = create<OrderBookStore>()(
  persist(
    (set, get) => ({
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
      changedPrices: {},

      setTab: (tab) => set({ tab }),
      setDecimal: (decimal) => set({ decimal }),
      setDepthVisualization: (depthVisualization) =>
        set({ depthVisualization }),
      setDisplayAvgSum: (displayAvgSum) => set({ displayAvgSum }),
      setShowBuySellRatio: (showBuySellRatio) => set({ showBuySellRatio }),
      setAnimationsEnabled: (animationsEnabled) => {
        set({ animationsEnabled });
        // Clear changed prices when animations are disabled
        if (!animationsEnabled) {
          get().clearChangedPrices();
        }
      },
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
        const newChangedPrices: ChangedPrices = { ...state.changedPrices };
        const now = Date.now();

        // Helper to group price by decimal step
        const groupPrice = (price: string): string => {
          const priceNum = parseFloat(price);
          const bucket = Math.floor(priceNum / state.decimal);
          const groupedPrice = bucket * state.decimal;
          return groupedPrice.toString();
        };

        // Track changed prices for bids
        for (const [price, quantity] of update.b) {
          const groupedPrice = groupPrice(price);
          if (parseFloat(quantity) === 0) {
            bidsMap.delete(price);
            newChangedPrices[groupedPrice] = now;
          } else {
            const oldQuantity = bidsMap.get(price);
            bidsMap.set(price, quantity);
            // Only mark as changed if quantity actually changed
            if (oldQuantity !== quantity) {
              newChangedPrices[groupedPrice] = now;
            }
          }
        }

        // Track changed prices for asks
        for (const [price, quantity] of update.a) {
          const groupedPrice = groupPrice(price);
          if (parseFloat(quantity) === 0) {
            asksMap.delete(price);
            newChangedPrices[groupedPrice] = now;
          } else {
            const oldQuantity = asksMap.get(price);
            asksMap.set(price, quantity);
            // Only mark as changed if quantity actually changed
            if (oldQuantity !== quantity) {
              newChangedPrices[groupedPrice] = now;
            }
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
          changedPrices: newChangedPrices,
        });
      },

      clearChangedPrices: () => set({ changedPrices: {} }),

      cleanupExpiredChangedPrices: (animationDuration) => {
        const state = get();
        const now = Date.now();
        const cleaned: ChangedPrices = {};

        // Keep only entries that are still within animation duration
        for (const [price, timestamp] of Object.entries(state.changedPrices)) {
          if (now - timestamp < animationDuration) {
            cleaned[price] = timestamp;
          }
        }

        // Only update if something was removed
        if (
          Object.keys(cleaned).length !==
          Object.keys(state.changedPrices).length
        ) {
          set({ changedPrices: cleaned });
        }
      },

      reset: () =>
        set({
          bids: [],
          asks: [],
          lastUpdateId: 0,
          changedPrices: {},
        }),
    }),
    {
      name: "order-book-storage",
      partialize: (state) => ({
        tab: state.tab,
        decimal: state.decimal,
        depthVisualization: state.depthVisualization,
        displayAvgSum: state.displayAvgSum,
        showBuySellRatio: state.showBuySellRatio,
        animationsEnabled: state.animationsEnabled,
        rounding: state.rounding,
      }),
    },
  ),
);

export default useOrderBookStore;
