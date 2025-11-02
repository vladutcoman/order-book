import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { processOrderBook } from "@/utils/processOrderBook";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import OrdersListRowSkeleton from "../OrdersListRowSkeleton/OrdersListRowSkeleton";
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

  const isLoading = bids.length === 0;

  if (isLoading) {
    return (
      <>
        <TickerCurrentPrice />
        <div className="max-h-[600px] overflow-y-auto px-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <OrdersListRowSkeleton key={`bid-skeleton-${index}`} />
          ))}
        </div>
      </>
    );
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
