import type {
  OrderBookDecimal,
  ProcessedOrderBookResult,
} from "@/types/orderBookTypes";
import { groupByDecimal } from "./groupByDecimal";

/**
 * Processes raw order book data into a format ready for display
 * @param rawOrders - Array of [price, quantity] tuples
 * @param decimal - Decimal grouping step size
 * @param type - "bid" or "ask" - determines sorting and cumulative direction
 * @param limit - Optional limit for number of orders to return (default: unlimited)
 * @returns Processed orders with cumulative totals and max values
 */
export const processOrderBook = (
  rawOrders: [string, string][],
  decimal: OrderBookDecimal,
  type: "bid" | "ask",
  limit?: number,
): ProcessedOrderBookResult => {
  if (rawOrders.length === 0) {
    return {
      orders: [],
      maxTotal: 0,
      maxCumulativeTotal: 0,
    };
  }

  // Group orders by decimal step
  const grouped = groupByDecimal(rawOrders, decimal);

  // Create ProcessedOrder array
  const ordersArray = Array.from(grouped.entries())
    .map(([price, quantity]) => ({
      price,
      quantity,
      total: price * quantity,
    }))
    .sort((a, b) => (type === "bid" ? b.price - a.price : a.price - b.price));

  // Apply limit if specified
  const limitedOrders = limit ? ordersArray.slice(0, limit) : ordersArray;

  // Calculate cumulative totals
  // For bids: accumulate from best bid (highest price) downward
  // For asks: accumulate from best ask (lowest price) upward, then reverse for display
  let cumulative = 0;
  const ordersWithCumulative = limitedOrders.map((order) => {
    cumulative += order.total;
    return { ...order, cumulativeTotal: cumulative };
  });

  // For asks, reverse after calculating cumulative (for display: highest to lowest)
  const finalOrders =
    type === "ask" ? ordersWithCumulative.reverse() : ordersWithCumulative;

  // Calculate max values
  const maxTotal = Math.max(...limitedOrders.map((order) => order.total), 0);
  const maxCumulativeTotal = Math.max(
    ...ordersWithCumulative.map((order) => order.cumulativeTotal),
    0,
  );

  return {
    orders: finalOrders,
    maxTotal,
    maxCumulativeTotal,
  };
};
