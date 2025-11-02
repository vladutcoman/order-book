import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { processOrderBook } from "@/utils/processOrderBook";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";

const BidsOrdersList = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const bids = useOrderBookStore((s) => s.bids);

  const { allBids, maxTotal, maxCumulativeTotal } = useMemo(() => {
    const result = processOrderBook(bids, decimal, "bid");
    return {
      allBids: result.orders,
      maxTotal: result.maxTotal,
      maxCumulativeTotal: result.maxCumulativeTotal,
    };
  }, [bids, decimal]);

  if (bids.length === 0) {
    return <div className="p-4">Loading order book...</div>;
  }

  return (
    <>
      <TickerCurrentPrice />
      <VirtualizedList
        items={allBids}
        estimateSize={24}
        maxHeight="600px"
        className="px-0"
      >
        {(bid) => (
          <OrdersListRow
            order={bid}
            type="bid"
            rounding={rounding}
            maxTotal={maxTotal}
            cumulativeTotal={bid.cumulativeTotal}
            maxCumulativeTotal={maxCumulativeTotal}
          />
        )}
      </VirtualizedList>
    </>
  );
};

export default BidsOrdersList;
