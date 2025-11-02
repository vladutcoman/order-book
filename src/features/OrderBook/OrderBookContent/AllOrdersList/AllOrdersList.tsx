import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { processOrderBook } from "@/utils/processOrderBook";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import OrdersListRowSkeleton from "../OrdersListRowSkeleton/OrdersListRowSkeleton";
import OrderListHeaders from "../OrdersListHeader/OrderListHeaders";

const ANIMATION_DURATION = 800;

const AllOrdersList = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const bids = useOrderBookStore((s) => s.bids);
  const asks = useOrderBookStore((s) => s.asks);
  const changedPrices = useOrderBookStore((s) => s.changedPrices);
  const animationsEnabled = useOrderBookStore((s) => s.animationsEnabled);

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

  // Check if a price was recently changed (within animation duration)
  const isPriceRecentlyChanged = useMemo(() => {
    if (!animationsEnabled) return () => false;
    return (price: string) => {
      const timestamp = changedPrices.get(price);
      if (!timestamp) return false;
      return Date.now() - timestamp < ANIMATION_DURATION;
    };
  }, [changedPrices, animationsEnabled]);

  const isLoading = bids.length === 0 && asks.length === 0;

  if (isLoading) {
    return (
      <>
        <div className="h-[430px] overflow-y-auto flex flex-col">
          {Array.from({ length: 17 }).map((_, index) => (
            <OrdersListRowSkeleton key={`ask-skeleton-${index}`} />
          ))}
        </div>
        <TickerCurrentPrice />
        <div className="h-[430px] flex flex-col">
          <OrderListHeaders />
          {Array.from({ length: 17 }).map((_, index) => (
            <OrdersListRowSkeleton key={`bid-skeleton-${index}`} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="h-[430px] overflow-y-auto flex flex-col">
        {processedAsks.map((ask, index) => (
          <OrdersListRow
            key={`ask-${ask.price}-${index}`}
            order={ask}
            type="ask"
            rounding={rounding}
            maxTotal={maxAskTotal}
            cumulativeTotal={ask.cumulativeTotal}
            maxCumulativeTotal={maxAskCumulativeTotal}
            isChanged={isPriceRecentlyChanged(ask.price.toString())}
          />
        ))}
      </div>

      <TickerCurrentPrice />

      <div className="h-[430px] flex flex-col">
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
            isChanged={isPriceRecentlyChanged(bid.price.toString())}
          />
        ))}
      </div>
    </>
  );
};

export default AllOrdersList;
