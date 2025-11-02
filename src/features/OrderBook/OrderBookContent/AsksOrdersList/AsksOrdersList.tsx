import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type { ProcessedOrder } from "@/types/orderBookTypes";
import { groupByDecimal } from "@/utils/groupByDecimal";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";

const AsksOrdersList = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const asks = useOrderBookStore((s) => s.asks);

  const { allAsks, maxTotal, maxCumulativeTotal } = useMemo(() => {
    if (asks.length === 0) {
      return { allAsks: [], maxTotal: 0, maxCumulativeTotal: 0 };
    }

    const groupedAsks = groupByDecimal(asks, decimal);

    const asksArray: ProcessedOrder[] = Array.from(groupedAsks.entries())
      .map(([price, quantity]) => ({
        price,
        quantity,
        total: price * quantity,
      }))
      .sort((a, b) => a.price - b.price); // Sort lowest to highest (best ask first)

    // Calculate cumulative totals for cumulative visualization
    // For asks: cumulative from best ask (lowest price) upward to current price level
    let askCumulative = 0;
    const asksWithCumulativeCalculated = asksArray.map((ask) => {
      askCumulative += ask.total;
      return { ...ask, cumulativeTotal: askCumulative };
    });
    // Reverse for display (highest to lowest)
    const asksWithCumulative = asksWithCumulativeCalculated.reverse();

    // Calculate max values for depth visualization
    const maxTotal = Math.max(
      ...asksWithCumulativeCalculated.map((a) => a.total),
      0,
    );
    const maxCumulativeTotal = Math.max(
      ...asksWithCumulative.map((a) => a.cumulativeTotal),
      0,
    );

    return {
      allAsks: asksWithCumulative,
      maxTotal,
      maxCumulativeTotal,
    };
  }, [asks, decimal]);

  if (asks.length === 0) {
    return <div className="p-4">Loading order book...</div>;
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
          />
        )}
      </VirtualizedList>
      <TickerCurrentPrice />
    </>
  );
};

export default AsksOrdersList;
