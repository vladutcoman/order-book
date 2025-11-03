import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import useOrderBookStore from '@/stores/orderBook/useOrderBookStore';

import AllOrdersList from './AllOrdersList/AllOrdersList';
import AsksOrdersList from './AsksOrdersList/AsksOrdersList';
import BidsOrdersList from './BidsOrdersList/BidsOrdersList';
import OrderListHeaders from './OrdersListHeader/OrderListHeaders';

const ANIMATION_DURATION = 800;

const OrderBookContent = () => {
  const { tab, cleanupExpiredChangedPrices, animationsEnabled } = useOrderBookStore(
    useShallow((state) => ({
      tab: state.tab,
      cleanupExpiredChangedPrices: state.cleanupExpiredChangedPrices,
      animationsEnabled: state.animationsEnabled,
    })),
  );

  // Cleanup expired animation entries periodically
  useEffect(() => {
    if (!animationsEnabled) return;

    const interval = setInterval(() => {
      cleanupExpiredChangedPrices(ANIMATION_DURATION);
    }, ANIMATION_DURATION / 2);

    return () => clearInterval(interval);
  }, [cleanupExpiredChangedPrices, animationsEnabled]);

  return (
    <div className="flex flex-col gap-2 pb-6">
      <OrderListHeaders />
      {tab === 'both' ? (
        <AllOrdersList />
      ) : tab === 'bids' ? (
        <BidsOrdersList />
      ) : (
        <AsksOrdersList />
      )}
    </div>
  );
};

export default OrderBookContent;
