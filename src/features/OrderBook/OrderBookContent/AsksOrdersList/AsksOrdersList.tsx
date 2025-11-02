import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import { processOrderBook } from "@/utils/processOrderBook";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";

const AsksOrdersList = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const asks = useOrderBookStore((s) => s.asks);

  const { allAsks, maxTotal, maxCumulativeTotal } = useMemo(() => {
    const result = processOrderBook(asks, decimal, "ask");
    return {
      allAsks: result.orders,
      maxTotal: result.maxTotal,
      maxCumulativeTotal: result.maxCumulativeTotal,
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
