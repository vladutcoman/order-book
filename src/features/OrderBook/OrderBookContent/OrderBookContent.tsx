import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type { ProcessedOrder } from "@/types/orderBookTypes";
import { groupByDecimal } from "@/utils/groupByDecimal";
import { roundNumber } from "@/utils/roundNumber";
import { formatNumber } from "@/utils/formatNumber";
import TickerCurrentPrice from "./TickerCurrentPrice/TickerCurrentPrice";

const OrderBookContent = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const bids = useOrderBookStore((s) => s.bids);
  const asks = useOrderBookStore((s) => s.asks);

  const { processedBids, processedAsks } = useMemo(() => {
    if (bids.length === 0 && asks.length === 0) {
      return { processedBids: [], processedAsks: [] };
    }

    const groupedBids = groupByDecimal(bids, decimal);
    const groupedAsks = groupByDecimal(asks, decimal);

    // Convert to arrays and sort
    const bidsArray: ProcessedOrder[] = Array.from(groupedBids.entries())
      .map(([price, quantity]) => ({
        price,
        quantity,
        total: price * quantity,
      }))
      .sort((a, b) => b.price - a.price);

    const asksArray: ProcessedOrder[] = Array.from(groupedAsks.entries())
      .map(([price, quantity]) => ({
        price,
        quantity,
        total: price * quantity,
      }))
      .sort((a, b) => a.price - b.price);

    return {
      processedBids: bidsArray.slice(0, 17),
      processedAsks: asksArray.slice(0, 17).reverse(),
    };
  }, [bids, asks, decimal]);

  if (bids.length === 0 && asks.length === 0) {
    return <div className="p-4">Loading order book...</div>;
  }

  return (
    <div className="flex flex-col gap-2 px-4 pb-2">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground pb-1">
          <div>Price (USDT)</div>
          <div>Amount</div>
          <div>Total</div>
        </div>
        {processedAsks.map((ask, index) => (
          <div
            key={`ask-${ask.price}-${index}`}
            className="grid grid-cols-3 gap-2 text-sm"
          >
            <div className="text-destructive">{formatNumber(ask.price)}</div>
            <div>{formatNumber(ask.quantity)}</div>
            <div>
              {rounding ? roundNumber(ask.total) : formatNumber(ask.total)}
            </div>
          </div>
        ))}
      </div>

      <TickerCurrentPrice />

      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground pb-1">
          <div>Price (USDT)</div>
          <div>Amount</div>
          <div>Total</div>
        </div>
        {processedBids.map((bid, index) => (
          <div
            key={`bid-${bid.price}-${index}`}
            className="grid grid-cols-3 gap-2 text-sm"
          >
            <div className="text-green-500">{formatNumber(bid.price)}</div>
            <div>{formatNumber(bid.quantity)}</div>
            <div>
              {rounding ? roundNumber(bid.total) : formatNumber(bid.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBookContent;
