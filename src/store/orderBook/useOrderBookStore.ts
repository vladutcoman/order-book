import type {
  OrderBookDecimal,
  OrderBookDepthVisualization,
  OrderBookTab,
} from "@/types/orderBookTypes";
import { create } from "zustand";

interface OrderBookStore {
  tab: OrderBookTab;
  decimal: OrderBookDecimal;
  depthVisualization: OrderBookDepthVisualization;
  displayAvgSum: boolean;
  showBuySellRatio: boolean;
  animationsEnabled: boolean;
  rounding: boolean;

  setTab: (tab: OrderBookTab) => void;
  setDecimal: (decimal: OrderBookDecimal) => void;
  setDepthVisualization: (
    depthVisualization: OrderBookDepthVisualization,
  ) => void;
  setDisplayAvgSum: (displayAvgSum: boolean) => void;
  setShowBuySellRatio: (showBuySellRatio: boolean) => void;
  setAnimationsEnabled: (animationsEnabled: boolean) => void;
  setRounding: (rounding: boolean) => void;
}

const useOrderBookStore = create<OrderBookStore>((set) => ({
  tab: "both",
  decimal: 0.001,
  depthVisualization: "amount",
  displayAvgSum: false,
  showBuySellRatio: false,
  animationsEnabled: true,
  rounding: false,

  setTab: (tab) => set({ tab }),
  setDecimal: (decimal) => set({ decimal }),
  setDepthVisualization: (depthVisualization) => set({ depthVisualization }),
  setDisplayAvgSum: (displayAvgSum) => set({ displayAvgSum }),
  setShowBuySellRatio: (showBuySellRatio) => set({ showBuySellRatio }),
  setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
  setRounding: (rounding) => set({ rounding }),
}));

export default useOrderBookStore;
