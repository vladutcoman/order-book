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

  const {
    processedBids,
    processedAsks,
    maxBidTotal,
    maxAskTotal,
    maxBidCumulativeTotal,
    maxAskCumulativeTotal,
  } = useMemo(() => {
    if (bids.length === 0 && asks.length === 0) {
      return {
        processedBids: [],
        processedAsks: [],
        maxBidTotal: 0,
        maxAskTotal: 0,
        maxBidCumulativeTotal: 0,
        maxAskCumulativeTotal: 0,
      };
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

    const processedBidsSlice = bidsArray.slice(0, 17);
    const processedAsksSlice = asksArray.slice(0, 17);

    // Calculate cumulative totals for cumulative visualization
    // For asks: cumulative from best ask (lowest price) upward to current price level
    // We calculate on the sorted array (lowest to highest) then reverse for display
    let askCumulative = 0;
    const asksWithCumulativeCalculated = processedAsksSlice.map((ask) => {
      askCumulative += ask.total;
      return { ...ask, cumulativeTotal: askCumulative };
    });
    // Reverse for display (highest to lowest)
    const asksWithCumulative = asksWithCumulativeCalculated.reverse();

    // For bids (displayed highest to lowest): cumulative from start (best bid) to current
    let bidCumulative = 0;
    const bidsWithCumulative = processedBidsSlice.map((bid) => {
      bidCumulative += bid.total;
      return { ...bid, cumulativeTotal: bidCumulative };
    });

    // Calculate max values for depth visualization
    const maxBidTotal = Math.max(...processedBidsSlice.map((b) => b.total), 0);
    const maxAskTotal = Math.max(
      ...asksWithCumulativeCalculated.map((a) => a.total),
      0,
    );
    const maxBidCumulativeTotal = Math.max(
      ...bidsWithCumulative.map((b) => b.cumulativeTotal),
      0,
    );
    const maxAskCumulativeTotal = Math.max(
      ...asksWithCumulative.map((a) => a.cumulativeTotal),
      0,
    );

    return {
      processedBids: bidsWithCumulative,
      processedAsks: asksWithCumulative,
      maxBidTotal,
      maxAskTotal,
      maxBidCumulativeTotal,
      maxAskCumulativeTotal,
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
