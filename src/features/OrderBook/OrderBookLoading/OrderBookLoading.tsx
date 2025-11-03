import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const OrderBookLoading = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 pt-2 pb-4">
      <div className="flex pb-3 items-center justify-between px-4 border-b border-border">
        <h2 className="text-lg font-semibold text-[14px]">
          {t("orderBook.title")}
        </h2>
      </div>
      <div className="h-[860px] flex flex-col gap-2 px-4">
        {Array.from({ length: 34 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
};

export default OrderBookLoading;
