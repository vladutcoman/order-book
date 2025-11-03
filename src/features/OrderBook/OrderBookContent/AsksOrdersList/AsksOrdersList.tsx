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

const AsksOrdersList = () => {
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);

  const { decimal, rounding, asks, changedPrices, animationsEnabled } = useOrderBookStore(
    useShallow((s) => ({
      decimal: s.decimal,
      rounding: s.rounding,
      asks: s.asks,
      changedPrices: s.changedPrices,
      animationsEnabled: s.animationsEnabled,
    })),
  );

  const { allAsks, maxTotal, maxCumulativeTotal } = useMemo(() => {
    const result = processOrderBook(asks, decimal, 'ask');
    return {
      allAsks: result.orders,
      maxTotal: result.maxTotal,
      maxCumulativeTotal: result.maxCumulativeTotal,
    };
  }, [asks, decimal]);

  const highlightedPrices = useOrderHighlight(allAsks, hoveredPrice, 'ask');
  const isPriceRecentlyChanged = usePriceChangeAnimation(changedPrices, animationsEnabled);

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
    <div className="flex h-[600px] flex-col gap-2">
      <VirtualizedList items={allAsks} estimateSize={24} maxHeight="600px" className="px-0">
        {(ask) => (
          <OrdersListRow
            order={ask}
            type="ask"
            rounding={rounding}
            maxTotal={maxTotal}
            cumulativeTotal={ask.cumulativeTotal}
            maxCumulativeTotal={maxCumulativeTotal}
            isChanged={isPriceRecentlyChanged(ask.price.toString())}
            isHighlighted={highlightedPrices.has(ask.price)}
            onMouseEnter={() => setHoveredPrice(ask.price)}
            onMouseLeave={() => setHoveredPrice(null)}
          />
        )}
      </VirtualizedList>
      <TickerCurrentPrice />
    </div>
  );
};

export default AsksOrdersList;
