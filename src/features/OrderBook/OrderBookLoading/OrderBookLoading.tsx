import { useTranslation } from 'react-i18next';

import { Skeleton } from '@/components/ui/skeleton';

const OrderBookLoading = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 pt-2 pb-4">
      <div className="border-border flex items-center justify-between border-b px-4 pb-3">
        <h2 className="text-lg text-[14px] font-semibold">{t('orderBook.title')}</h2>
      </div>
      <div className="flex h-[860px] flex-col gap-2 px-4">
        {Array.from({ length: 34 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
};

export default OrderBookLoading;
