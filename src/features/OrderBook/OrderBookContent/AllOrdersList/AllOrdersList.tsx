import { useMemo, useRef, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { processOrderBook } from "@/utils/processOrderBook";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import OrdersListRowSkeleton from "../OrdersListRowSkeleton/OrdersListRowSkeleton";
import OrderListHeaders from "../OrdersListHeader/OrderListHeaders";

const ANIMATION_DURATION = 800;

const AllOrdersList = () => {
  // Batch Zustand subscriptions to prevent multiple re-renders
  const { decimal, rounding, bids, asks, changedPrices, animationsEnabled } =
    useOrderBookStore(
      useShallow((s) => ({
        decimal: s.decimal,
        rounding: s.rounding,
        bids: s.bids,
        asks: s.asks,
        changedPrices: s.changedPrices,
        animationsEnabled: s.animationsEnabled,
      })),
    );

  // Use ref to track current time for animation checks (updates only when changedPrices changes)
  const timeRef = useRef(Date.now());
  useEffect(() => {
    timeRef.current = Date.now();
  }, [changedPrices]);

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
  // Use ref-based time check to avoid calling Date.now() on every render
  const isPriceRecentlyChanged = useMemo(() => {
    if (!animationsEnabled) return () => false;
    return (price: string) => {
      const timestamp = changedPrices.get(price);
      if (!timestamp) return false;
      return timeRef.current - timestamp < ANIMATION_DURATION;
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
        {processedAsks.map((ask) => (
          <OrdersListRow
            key={`ask-${ask.price}`}
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
        {processedBids.map((bid) => (
          <OrdersListRow
            key={`bid-${bid.price}`}
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
