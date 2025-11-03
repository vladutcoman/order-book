import type { OrderBookDecimal, ProcessedOrderBookResult } from '@/types/orderBookTypes';

import { groupByDecimal } from './groupByDecimal';

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
  type: 'bid' | 'ask',
  limit?: number,
): ProcessedOrderBookResult => {
  if (rawOrders.length === 0) {
    return {
      orders: [],
      maxTotal: 0,
      maxCumulativeTotal: 0,
    };
  }

  const grouped = groupByDecimal(rawOrders, decimal);

  const ordersArray = Array.from(grouped.entries())
    .map(([price, quantity]) => ({
      price,
      quantity,
      total: price * quantity,
    }))
    .sort((a, b) => (type === 'bid' ? b.price - a.price : a.price - b.price));

  const limitedOrders = limit ? ordersArray.slice(0, limit) : ordersArray;

  // Calculate cumulative totals
  let cumulative = 0;
  const ordersWithCumulative = limitedOrders.map((order) => {
    cumulative += order.total;
    return { ...order, cumulativeTotal: cumulative };
  });

  const finalOrders = type === 'ask' ? ordersWithCumulative.reverse() : ordersWithCumulative;

  const maxTotal =
    limitedOrders.length > 0
      ? limitedOrders.reduce((max, order) => Math.max(max, order.total), 0)
      : 0;
  const maxCumulativeTotal =
    ordersWithCumulative.length > 0
      ? ordersWithCumulative.reduce((max, order) => Math.max(max, order.cumulativeTotal), 0)
      : 0;

  return {
    orders: finalOrders,
    maxTotal,
    maxCumulativeTotal,
  };
};
