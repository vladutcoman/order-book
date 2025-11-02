import { useMemo, useRef, useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import useMarketStore from "@/stores/market/useMarketStore";
import useGetTicker from "@/api/orderBook/hooks/useGetTicker";
import { formatNumber } from "@/utils/formatNumber";

const TickerCurrentPrice = () => {
  const previousPriceRef = useRef<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | null>(
    null,
  );

  const market = useMarketStore((state) => state.market);
  const bids = useOrderBookStore((state) => state.bids);
  const asks = useOrderBookStore((state) => state.asks);

  const { data: ticker } = useGetTicker(market);

  const currentPrice = useMemo(() => {
    if (ticker?.lastPrice) {
      return parseFloat(ticker.lastPrice);
    }

    if (bids.length > 0 && asks.length > 0) {
      const bestBid = parseFloat(bids[0][0]);
      const bestAsk = parseFloat(asks[0][0]);
      return (bestBid + bestAsk) / 2;
    }

    return null;
  }, [ticker?.lastPrice, bids, asks]);

  // Track price direction changes
  useEffect(() => {
    if (currentPrice !== null) {
      if (previousPriceRef.current !== null) {
        if (currentPrice > previousPriceRef.current) {
          setPriceDirection("up");
        } else if (currentPrice < previousPriceRef.current) {
          setPriceDirection("down");
        }
      }
      previousPriceRef.current = currentPrice;
    }
  }, [currentPrice]);

  // Reset direction when market changes
  useEffect(() => {
    previousPriceRef.current = null;
    setPriceDirection(null);
  }, [market]);

  const priceChangePercent = ticker?.priceChangePercent
    ? parseFloat(ticker.priceChangePercent)
    : null;

  const priceColor =
    priceDirection === "up"
      ? "text-green-500"
      : priceDirection === "down"
        ? "text-destructive"
        : priceChangePercent !== null
          ? priceChangePercent >= 0
            ? "text-green-500"
            : "text-destructive"
          : "text-foreground";

  return (
    <div className="h-[36px] px-4 py-2 flex items-center justify-between">
      {currentPrice !== null ? (
        <div className="flex items-center justify-center gap-2">
          <div className={`text-[20px] font-medium ${priceColor}`}>
            {formatNumber(currentPrice)}
          </div>
          {priceDirection === "up" && (
            <ArrowUp className="size-4 text-green-500" />
          )}
          {priceDirection === "down" && (
            <ArrowDown className="size-4 text-destructive" />
          )}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center">
          Loading price...
        </div>
      )}
    </div>
  );
};

export default TickerCurrentPrice;
