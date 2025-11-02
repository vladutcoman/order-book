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
