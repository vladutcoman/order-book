import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import VirtualizedList from '@/components/VirtualizedList/VirtualizedList';
import useOrderHighlight from '@/hooks/useOrderHighlight';
import usePriceChangeAnimation from '@/hooks/usePriceChangeAnimation';
import useOrderBookStore from '@/stores/orderBook/useOrderBookStore';
import { processOrderBook } from '@/utils/processOrderBook';

import OrdersListRow from '../OrdersListRow/OrdersListRow';
import OrdersListRowSkeleton from '../OrdersListRowSkeleton/OrdersListRowSkeleton';
import TickerCurrentPrice from '../TickerCurrentPrice/TickerCurrentPrice';

const BidsOrdersList = () => {
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);

  const { decimal, rounding, bids, changedPrices, animationsEnabled } = useOrderBookStore(
    useShallow((s) => ({
      decimal: s.decimal,
      rounding: s.rounding,
      bids: s.bids,
      changedPrices: s.changedPrices,
      animationsEnabled: s.animationsEnabled,
    })),
  );

  const { allBids, maxTotal, maxCumulativeTotal } = useMemo(() => {
    const result = processOrderBook(bids, decimal, 'bid');
    return {
      allBids: result.orders,
      maxTotal: result.maxTotal,
      maxCumulativeTotal: result.maxCumulativeTotal,
    };
  }, [bids, decimal]);

  const highlightedPrices = useOrderHighlight(allBids, hoveredPrice, 'bid');
  const isPriceRecentlyChanged = usePriceChangeAnimation(changedPrices, animationsEnabled);

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
    <div className="flex h-[600px] flex-col gap-2">
      <TickerCurrentPrice />
      <VirtualizedList items={allBids} estimateSize={24} maxHeight="600px" className="px-0">
        {(bid) => (
          <OrdersListRow
            order={bid}
            type="bid"
            rounding={rounding}
            maxTotal={maxTotal}
            cumulativeTotal={bid.cumulativeTotal}
            maxCumulativeTotal={maxCumulativeTotal}
            isChanged={isPriceRecentlyChanged(bid.price.toString())}
            isHighlighted={highlightedPrices.has(bid.price)}
            onMouseEnter={() => setHoveredPrice(bid.price)}
            onMouseLeave={() => setHoveredPrice(null)}
          />
        )}
      </VirtualizedList>
    </div>
  );
};

export default BidsOrdersList;
