import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type { ProcessedOrder } from "@/types/orderBookTypes";
import { groupByDecimal } from "@/utils/groupByDecimal";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";

const BidsOrdersList = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const bids = useOrderBookStore((s) => s.bids);

  const { allBids, maxTotal, maxCumulativeTotal } = useMemo(() => {
    if (bids.length === 0) {
      return { allBids: [], maxTotal: 0, maxCumulativeTotal: 0 };
    }

    const groupedBids = groupByDecimal(bids, decimal);

    const bidsArray: ProcessedOrder[] = Array.from(groupedBids.entries())
      .map(([price, quantity]) => ({
        price,
        quantity,
        total: price * quantity,
      }))
      .sort((a, b) => b.price - a.price);

    // Calculate cumulative totals for cumulative visualization
    let bidCumulative = 0;
    const bidsWithCumulative = bidsArray.map((bid) => {
      bidCumulative += bid.total;
      return { ...bid, cumulativeTotal: bidCumulative };
    });

    // Calculate max values for depth visualization
    const maxTotal = Math.max(...bidsArray.map((b) => b.total), 0);
    const maxCumulativeTotal = Math.max(
      ...bidsWithCumulative.map((b) => b.cumulativeTotal),
      0,
    );

    return {
      allBids: bidsWithCumulative,
      maxTotal,
      maxCumulativeTotal,
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
