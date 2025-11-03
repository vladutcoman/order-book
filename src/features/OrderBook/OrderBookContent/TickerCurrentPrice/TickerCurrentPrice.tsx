import { useRef, useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import useMarketStore from "@/stores/market/useMarketStore";
import useGetTicker from "@/api/orderBook/hooks/useGetTicker";
import { formatNumber } from "@/utils/formatNumber";
import useCurrentPrice from "@/hooks/useCurrentPrice";

const TickerCurrentPrice = () => {
  const previousPriceRef = useRef<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | null>(
    null,
  );

  const market = useMarketStore((state) => state.market);
  const currentPrice = useCurrentPrice();
  const { data: ticker } = useGetTicker(market);

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
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default TickerCurrentPrice;
