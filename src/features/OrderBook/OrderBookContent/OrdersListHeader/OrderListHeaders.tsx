import { useTranslation } from "react-i18next";

const OrderListHeaders = () => {
  const { t } = useTranslation();

  return (
    <div className="grid px-4 grid-cols-3 gap-2 text-sm text-muted-foreground pb-1">
      <div className="text-left text-[12px] font-normal line-height-[18px]">
        {t("orderList.price")}
      </div>
      <div className="text-right text-[12px] font-normal line-height-[18px]">
        {t("orderList.amount")}
      </div>
      <div className="text-right text-[12px] font-normal line-height-[18px]">
        {t("orderList.total")}
      </div>
    </div>
  );
};

export default OrderListHeaders;
