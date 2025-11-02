import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type { ProcessedOrder } from "@/types/orderBookTypes";
import { groupByDecimal } from "@/utils/groupByDecimal";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import OrderListHeaders from "../OrdersListHeader/OrderListHeaders";

const AllOrdersList = () => {
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
    <>
      <div className="flex flex-col">
        {processedAsks.map((ask, index) => (
          <OrdersListRow
            key={`ask-${ask.price}-${index}`}
            order={ask}
            type="ask"
            rounding={rounding}
          />
        ))}
      </div>

      <TickerCurrentPrice />

      <div className="flex flex-col">
        <OrderListHeaders />
        {processedBids.map((bid, index) => (
          <OrdersListRow
            key={`bid-${bid.price}-${index}`}
            order={bid}
            type="bid"
            rounding={rounding}
          />
        ))}
      </div>
    </>
  );
};

export default AllOrdersList;
