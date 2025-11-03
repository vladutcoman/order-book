import { memo } from 'react';

import type { ProcessedOrder } from '@/types/orderBookTypes';
import { cn } from '@/lib/utils';
import useOrderBookStore from '@/stores/orderBook/useOrderBookStore';
import { formatNumber } from '@/utils/formatNumber';
import formatPrice from '@/utils/formatPrice';
import { roundNumber } from '@/utils/roundNumber';

import DepthVisualization from '../DepthVisualization/DepthVisualization';

interface OrdersListRowProps {
  order: ProcessedOrder;
  type: 'bid' | 'ask';
  rounding: boolean;
  maxTotal?: number;
  cumulativeTotal?: number;
  maxCumulativeTotal?: number;
  isChanged?: boolean;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const OrdersListRow = memo(
  ({
    order,
    type,
    rounding,
    maxTotal,
    cumulativeTotal,
    maxCumulativeTotal,
    isChanged = false,
    isHighlighted = false,
    onMouseEnter,
    onMouseLeave,
  }: OrdersListRowProps) => {
    const decimal = useOrderBookStore((state) => state.decimal);
    const priceColor = type === 'bid' ? 'text-green-500' : 'text-destructive';

    const animationClass = isChanged
      ? type === 'bid'
        ? 'animate-flash-green'
        : 'animate-flash-red'
      : '';

    return (
      <div
        className={cn(
          'relative mx-4 grid cursor-pointer grid-cols-3 gap-2 text-sm transition-colors',
          animationClass,
          isHighlighted && 'bg-gray-500/10',
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <DepthVisualization
          order={order}
          type={type}
          maxTotal={maxTotal}
          cumulativeTotal={cumulativeTotal}
          maxCumulativeTotal={maxCumulativeTotal}
        />
        <div
          className={`fonr-[400] line-height-[18px] text-left text-[12px] ${priceColor} relative z-10`}
        >
          {formatPrice(order.price, decimal)}
        </div>
        <div className="fonr-[400] line-height-[18px] relative z-10 py-1 text-right text-[12px]">
          <span className="relative z-10">{formatNumber(order.quantity)}</span>
        </div>
        <div className="fonr-[400] line-height-[18px] relative z-10 py-1 text-right text-[12px]">
          <span className="relative z-10">
            {rounding ? roundNumber(order.total) : formatNumber(order.total)}
          </span>
        </div>
      </div>
    );
  },
);

export default OrdersListRow;
