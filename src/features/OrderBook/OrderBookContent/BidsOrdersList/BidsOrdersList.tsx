import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type { ProcessedOrder } from "@/types/orderBookTypes";
import { groupByDecimal } from "@/utils/groupByDecimal";
import { roundNumber } from "@/utils/roundNumber";
import { formatNumber } from "@/utils/formatNumber";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";

const BidsOrdersList = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const bids = useOrderBookStore((s) => s.bids);

  const allBids = useMemo(() => {
    if (bids.length === 0) {
      return [];
    }

    const groupedBids = groupByDecimal(bids, decimal);

    const bidsArray: ProcessedOrder[] = Array.from(groupedBids.entries())
      .map(([price, quantity]) => ({
        price,
        quantity,
        total: price * quantity,
      }))
      .sort((a, b) => b.price - a.price);

    return bidsArray;
  }, [bids, decimal]);

  if (bids.length === 0) {
    return <div className="p-4">Loading order book...</div>;
  }

  return (
    <>
      <VirtualizedList
        items={allBids}
        estimateSize={24}
        maxHeight="600px"
        className="px-0"
      >
        {(bid, index) => (
          <div
            key={`bid-${bid.price}-${index}`}
            className="grid grid-cols-3 gap-2 text-sm"
          >
            <div className="text-green-500">{formatNumber(bid.price)}</div>
            <div>{formatNumber(bid.quantity)}</div>
            <div>
              {rounding ? roundNumber(bid.total) : formatNumber(bid.total)}
            </div>
          </div>
        )}
      </VirtualizedList>
    </>
  );
};

export default BidsOrdersList;
