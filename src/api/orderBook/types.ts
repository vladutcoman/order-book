export interface SnapshotData {
  lastUpdateId: number;
  bids: [string, string][]; // [price, quantity]
  asks: [string, string][]; // [price, quantity]
}

export interface SnapshotError {
  code: number;
  msg: string;
}

export interface DepthUpdate {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  U: number; // First update ID
  u: number; // Final update ID
  b: [string, string][]; // Bids
  a: [string, string][]; // Asks
}

export interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}
