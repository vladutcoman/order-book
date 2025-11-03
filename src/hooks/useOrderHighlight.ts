import { useMemo } from "react";
import type { ProcessedOrder } from "@/types/orderBookTypes";

/**
 * Custom hook to calculate which order prices should be highlighted
 * @param orders - Array of processed orders
 * @param hoveredPrice - The price of the currently hovered row (null if nothing is hovered)
 * @param type - "ask" or "bid" to determine highlight direction
 * @returns Set of prices that should be highlighted
 */
const useOrderHighlight = (
  orders: ProcessedOrder[],
  hoveredPrice: number | null,
  type: "ask" | "bid",
): Set<number> => {
  return useMemo(() => {
    if (!hoveredPrice) {
      return new Set<number>();
    }

    const highlighted = new Set<number>();

    orders.forEach((order) => {
      if (type === "ask") {
        // For asks: highlight all rows BELOW (lower prices, closer to center)
        // Highlight all asks with price <= hovered price (rows below)
        if (order.price <= hoveredPrice) {
          highlighted.add(order.price);
        }
      } else {
        // For bids: highlight all rows ABOVE (higher prices, closer to center)
        // Highlight all bids with price >= hovered price (rows above)
        if (order.price >= hoveredPrice) {
          highlighted.add(order.price);
        }
      }
    });

    return highlighted;
  }, [orders, hoveredPrice, type]);
};

export default useOrderHighlight;
