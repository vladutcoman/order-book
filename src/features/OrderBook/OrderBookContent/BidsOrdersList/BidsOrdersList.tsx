import { useMemo } from "react";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type { ProcessedOrder } from "@/types/orderBookTypes";
import { groupByDecimal } from "@/utils/groupByDecimal";
import VirtualizedList from "@/components/VirtualizedList/VirtualizedList";
import OrdersListRow from "../OrdersListRow/OrdersListRow";
import TickerCurrentPrice from "../TickerCurrentPrice/TickerCurrentPrice";

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
      <TickerCurrentPrice />
      <VirtualizedList
        items={allBids}
        estimateSize={24}
        maxHeight="600px"
        className="px-0"
      >
        {(bid) => <OrdersListRow order={bid} type="bid" rounding={rounding} />}
      </VirtualizedList>
    </>
  );
};

export default BidsOrdersList;
