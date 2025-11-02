import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { processOrderBook } from "@/utils/processOrderBook";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import OrdersListRowSkeleton from "../OrdersListRowSkeleton/OrdersListRowSkeleton";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";

const ANIMATION_DURATION = 800;

const BidsOrdersList = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const bids = useOrderBookStore((s) => s.bids);
  const changedPrices = useOrderBookStore((s) => s.changedPrices);
  const animationsEnabled = useOrderBookStore((s) => s.animationsEnabled);

  const { allBids, maxTotal, maxCumulativeTotal } = useMemo(() => {
    const result = processOrderBook(bids, decimal, "bid");
    return {
      allBids: result.orders,
      maxTotal: result.maxTotal,
      maxCumulativeTotal: result.maxCumulativeTotal,
    };
  }, [bids, decimal]);

  // Check if a price was recently changed (within animation duration)
  const isPriceRecentlyChanged = useMemo(() => {
    if (!animationsEnabled) return () => false;
    return (price: string) => {
      const timestamp = changedPrices.get(price);
      if (!timestamp) return false;
      return Date.now() - timestamp < ANIMATION_DURATION;
    };
  }, [changedPrices, animationsEnabled]);

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
            isChanged={isPriceRecentlyChanged(bid.price.toString())}
          />
        )}
      </VirtualizedList>
    </>
  );
};

export default BidsOrdersList;
