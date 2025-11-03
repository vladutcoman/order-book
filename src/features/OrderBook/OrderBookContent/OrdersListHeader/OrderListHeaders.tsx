import { useTranslation } from 'react-i18next';

const OrderListHeaders = () => {
  const { t } = useTranslation();

  return (
    <div className="text-muted-foreground grid grid-cols-3 gap-2 px-4 pb-1 text-sm">
      <div className="line-height-[18px] text-left text-[12px] font-normal">
        {t('orderList.price')}
      </div>
      <div className="line-height-[18px] text-right text-[12px] font-normal">
        {t('orderList.amount')}
      </div>
      <div className="line-height-[18px] text-right text-[12px] font-normal">
        {t('orderList.total')}
      </div>
    </div>
  );
};

export default OrderListHeaders;
