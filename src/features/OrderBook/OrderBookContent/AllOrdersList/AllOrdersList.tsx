import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { processOrderBook } from "@/utils/processOrderBook";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import OrderListHeaders from "../OrdersListHeader/OrderListHeaders";

const AllOrdersList = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const bids = useOrderBookStore((s) => s.bids);
  const asks = useOrderBookStore((s) => s.asks);

  const {
    processedBids,
    processedAsks,
    maxBidTotal,
    maxAskTotal,
    maxBidCumulativeTotal,
    maxAskCumulativeTotal,
  } = useMemo(() => {
    const bidsResult = processOrderBook(bids, decimal, "bid", 17);
    const asksResult = processOrderBook(asks, decimal, "ask", 17);

    return {
      processedBids: bidsResult.orders,
      processedAsks: asksResult.orders,
      maxBidTotal: bidsResult.maxTotal,
      maxAskTotal: asksResult.maxTotal,
      maxBidCumulativeTotal: bidsResult.maxCumulativeTotal,
      maxAskCumulativeTotal: asksResult.maxCumulativeTotal,
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
            maxTotal={maxAskTotal}
            cumulativeTotal={ask.cumulativeTotal}
            maxCumulativeTotal={maxAskCumulativeTotal}
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
            maxTotal={maxBidTotal}
            cumulativeTotal={bid.cumulativeTotal}
            maxCumulativeTotal={maxBidCumulativeTotal}
          />
        ))}
      </div>
    </>
  );
};

export default AllOrdersList;
