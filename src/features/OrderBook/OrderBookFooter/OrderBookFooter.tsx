import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import useGetOrderBook from "@/hooks/useGetOrderBook";
import useMarketStore from "@/stores/market/useMarketStore";

const OrderBookFooter = () => {
  const market = useMarketStore((s) => s.market);
  const bids = useOrderBookStore((s) => s.bids);
  const asks = useOrderBookStore((s) => s.asks);
  const decimal = useOrderBookStore((s) => s.decimal);
  const showBuySellRatio = useOrderBookStore((s) => s.showBuySellRatio);

  useGetOrderBook(market);

  const ratio = useMemo(() => {
    if (!showBuySellRatio || bids.length === 0 || asks.length === 0) {
      return null;
    }

    // Use the same grouping logic as OrderBookContent
    const groupByDecimal = (
      orders: [string, string][],
      step: number,
    ): Map<number, number> => {
      const grouped = new Map<number, number>();

      for (const [priceStr, quantityStr] of orders) {
        const price = parseFloat(priceStr);
        const quantity = parseFloat(quantityStr);

        const bucket = Math.floor(price / step);
        const groupedPrice = bucket * step;

        const existing = grouped.get(groupedPrice) || 0;
        grouped.set(groupedPrice, existing + quantity);
      }

      return grouped;
    };

    // Group by decimal step
    const groupedBids = groupByDecimal(bids, decimal);
    const groupedAsks = groupByDecimal(asks, decimal);

    // Convert to arrays and get top 17
    const bidsArray = Array.from(groupedBids.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 17);

    const asksArray = Array.from(groupedAsks.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 17);

    const totalBuyVolume = bidsArray.reduce(
      (sum, [, quantity]) => sum + quantity,
      0,
    );
    const totalSellVolume = asksArray.reduce(
      (sum, [, quantity]) => sum + quantity,
      0,
    );

    const totalVolume = totalBuyVolume + totalSellVolume;

    if (totalVolume === 0) {
      return null;
    }

    const buyPercentage = (totalBuyVolume / totalVolume) * 100;
    const sellPercentage = (totalSellVolume / totalVolume) * 100;

    return {
      buy: buyPercentage,
      sell: sellPercentage,
    };
  }, [bids, asks, decimal, showBuySellRatio]);

  if (!ratio) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-2 py-2 text-sm border-t">
      <span className="text-green-500">B {ratio.buy.toFixed(2)}%</span>
      <span className="text-destructive">{ratio.sell.toFixed(2)}% S</span>
    </div>
  );
};

export default OrderBookFooter;
