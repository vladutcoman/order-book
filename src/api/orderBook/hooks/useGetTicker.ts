import { useQuery } from '@tanstack/react-query';

import type { TickerData } from '../types';

const fetchTicker = async (symbol: string): Promise<TickerData> => {
  const response = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ticker: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    symbol: data.symbol,
    lastPrice: data.lastPrice,
    priceChangePercent: data.priceChangePercent,
    highPrice: data.highPrice,
    lowPrice: data.lowPrice,
    volume: data.volume,
  };
};

const useGetTicker = (symbol: string = 'btcusdt') => {
  return useQuery({
    queryKey: ['ticker', symbol],
    queryFn: () => fetchTicker(symbol),
    enabled: !!symbol,
    refetchInterval: 1000,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export default useGetTicker;
