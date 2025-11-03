export type OrderBookTab = "bids" | "asks" | "both";

export type OrderBookDecimal = 0.01 | 0.1 | 1 | 10 | 50 | 100;

export type OrderBookDepthVisualization = "amount" | "cumulative";

export interface ProcessedOrder {
  price: number;
  quantity: number;
  total: number;
  cumulativeTotal?: number;
}

export interface ProcessedOrderWithCumulative {
  price: number;
  quantity: number;
  total: number;
  cumulativeTotal: number;
}

export interface ProcessedOrderBookResult {
  orders: ProcessedOrderWithCumulative[];
  maxTotal: number;
  maxCumulativeTotal: number;
}
/**
 * Changed prices tracking - maps price (as string) to timestamp (as number)
 * Used to track which prices changed for animation highlighting
 */
export type ChangedPrices = Record<string, number>;
