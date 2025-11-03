import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import useOrderBook from '@/hooks/useOrderBook';
import useMarketStore from '@/stores/market/useMarketStore';
import OrderBookHeader from '@/features/OrderBook/OrderBookHeader/OrderBookHeader';

import OrderBookLoading from './OrderBookLoading/OrderBookLoading';

const OrderBookContent = lazy(
  () => import('@/features/OrderBook/OrderBookContent/OrderBookContent'),
);

const OrderBookFooter = lazy(() => import('@/features/OrderBook/OrderBookFooter/OrderBookFooter'));

const OrderBook = () => {
  const market = useMarketStore((s) => s.market);
  const { snapshotLoading, snapshotError, refetchSnapshot } = useOrderBook(market);
  const { t } = useTranslation();

  if (snapshotError) {
    return (
      <div className="flex flex-col rounded-md bg-[#181A20] p-4 md:w-[380px]">
        <div className="mb-4 text-white">{t('orderBook.snapshotError')}</div>
        <Button
          className="mt-4 bg-[#f0b90b]! font-medium text-black"
          variant="default"
          onClick={() => refetchSnapshot()}
        >
          {t('orderBook.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-md bg-[#181A20] md:w-[380px]">
      {!snapshotLoading ? (
        <Suspense fallback={<OrderBookLoading />}>
          <OrderBookHeader />
          <OrderBookContent />
          <OrderBookFooter />
        </Suspense>
      ) : (
        <OrderBookLoading />
      )}
    </div>
  );
};

export default OrderBook;
