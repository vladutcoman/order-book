import { useMemo, useRef, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { processOrderBook } from "@/utils/processOrderBook";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import OrdersListRowSkeleton from "../OrdersListRowSkeleton/OrdersListRowSkeleton";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";

const ANIMATION_DURATION = 800;

const AsksOrdersList = () => {
  // Batch Zustand subscriptions to prevent multiple re-renders
  const { decimal, rounding, asks, changedPrices, animationsEnabled } =
    useOrderBookStore(
      useShallow((s) => ({
        decimal: s.decimal,
        rounding: s.rounding,
        asks: s.asks,
        changedPrices: s.changedPrices,
        animationsEnabled: s.animationsEnabled,
      })),
    );

  // Use ref to track current time for animation checks
  const timeRef = useRef(Date.now());
  useEffect(() => {
    timeRef.current = Date.now();
  }, [changedPrices]);

  const { allAsks, maxTotal, maxCumulativeTotal } = useMemo(() => {
    const result = processOrderBook(asks, decimal, "ask");
    return {
      allAsks: result.orders,
      maxTotal: result.maxTotal,
      maxCumulativeTotal: result.maxCumulativeTotal,
    };
  }, [asks, decimal]);

  // Check if a price was recently changed (within animation duration)
  const isPriceRecentlyChanged = useMemo(() => {
    if (!animationsEnabled) return () => false;
    return (price: string) => {
      const timestamp = changedPrices.get(price);
      if (!timestamp) return false;
      return timeRef.current - timestamp < ANIMATION_DURATION;
    };
  }, [changedPrices, animationsEnabled]);

  const isLoading = asks.length === 0;

  if (isLoading) {
    return (
      <>
        <div className="max-h-[600px] overflow-y-auto px-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <OrdersListRowSkeleton key={`ask-skeleton-${index}`} />
          ))}
        </div>
        <TickerCurrentPrice />
      </>
    );
  }

  return (
    <>
      <VirtualizedList
        items={allAsks}
        estimateSize={24}
        maxHeight="600px"
        className="px-0"
      >
        {(ask) => (
          <OrdersListRow
            order={ask}
            type="ask"
            rounding={rounding}
            maxTotal={maxTotal}
            cumulativeTotal={ask.cumulativeTotal}
            maxCumulativeTotal={maxCumulativeTotal}
            isChanged={isPriceRecentlyChanged(ask.price.toString())}
          />
        )}
      </VirtualizedList>
      <TickerCurrentPrice />
    </>
  );
};

export default AsksOrdersList;
