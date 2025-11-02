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

  const allAsks = useMemo(() => {
    if (asks.length === 0) {
      return [];
    }

    const groupedAsks = groupByDecimal(asks, decimal);

    const asksArray: ProcessedOrder[] = Array.from(groupedAsks.entries())
      .map(([price, quantity]) => ({
        price,
        quantity,
        total: price * quantity,
      }))
      .sort((a, b) => b.price - a.price);

    return asksArray;
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
        {(ask) => <OrdersListRow order={ask} type="ask" rounding={rounding} />}
      </VirtualizedList>
      <TickerCurrentPrice />
    </>
  );
};

export default AsksOrdersList;
