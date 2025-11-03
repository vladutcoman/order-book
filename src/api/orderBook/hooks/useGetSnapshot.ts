import { useQuery } from '@tanstack/react-query';

import type { SnapshotData, SnapshotError } from '../types';

const fetchSnapshot = async (symbol: string): Promise<SnapshotData> => {
  const response = await fetch(
    `https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=1000`,
  );

  if (!response.ok) {
    const errorData: SnapshotError = await response.json();
    throw new Error(`Failed to fetch snapshot: ${errorData.msg || response.statusText}`);
  }

  return response.json();
};

const useGetSnapshot = (symbol: string = 'btcusdt', enabled: boolean = true) => {
  return useQuery({
    queryKey: ['orderBookSnapshot', symbol],
    queryFn: () => fetchSnapshot(symbol),
    enabled,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export default useGetSnapshot;
export type { SnapshotData, SnapshotError };
