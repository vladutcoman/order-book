import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type { ProcessedOrder } from "@/types/orderBookTypes";
import { groupByDecimal } from "@/utils/groupByDecimal";
import { roundNumber } from "@/utils/roundNumber";
import { formatNumber } from "@/utils/formatNumber";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";

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
        {(ask, index) => (
          <div
            key={`ask-${ask.price}-${index}`}
            className="grid grid-cols-3 gap-2 text-sm"
          >
            <div className="text-destructive">{formatNumber(ask.price)}</div>
            <div>{formatNumber(ask.quantity)}</div>
            <div>
              {rounding ? roundNumber(ask.total) : formatNumber(ask.total)}
            </div>
          </div>
        )}
      </VirtualizedList>
    </>
  );
};

export default AsksOrdersList;
