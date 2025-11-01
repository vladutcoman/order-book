import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { groupByDecimal } from "@/utils/groupByDecimal";

const OrderBookFooter = () => {
  const bids = useOrderBookStore((s) => s.bids);
  const asks = useOrderBookStore((s) => s.asks);
  const decimal = useOrderBookStore((s) => s.decimal);
  const showBuySellRatio = useOrderBookStore((s) => s.showBuySellRatio);

  const ratio = useMemo(() => {
    if (!showBuySellRatio || bids.length === 0 || asks.length === 0) {
      return null;
    }

    const groupedBids = groupByDecimal(bids, decimal);
    const groupedAsks = groupByDecimal(asks, decimal);

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
