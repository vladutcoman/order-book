import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import useMarketStore from "@/stores/market/useMarketStore";
import useGetTicker from "@/api/orderBook/hooks/useGetTicker";

const useCurrentPrice = (): number | null => {
  const market = useMarketStore((state) => state.market);
  const firstBid = useOrderBookStore((state) =>
    state.bids.length > 0 ? state.bids[0] : null,
  );
  const firstAsk = useOrderBookStore((state) =>
    state.asks.length > 0 ? state.asks[0] : null,
  );

  const { data: ticker } = useGetTicker(market);

  const currentPrice = useMemo(() => {
    if (ticker?.lastPrice) {
      return parseFloat(ticker.lastPrice);
    }

    if (firstBid && firstAsk) {
      const bestBid = parseFloat(firstBid[0]);
      const bestAsk = parseFloat(firstAsk[0]);
      return (bestBid + bestAsk) / 2;
    }

    return null;
  }, [ticker?.lastPrice, firstBid, firstAsk]);

  return currentPrice;
};

export default useCurrentPrice;
