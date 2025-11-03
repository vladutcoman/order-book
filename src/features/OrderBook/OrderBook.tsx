import { Suspense, lazy } from "react";
import OrderBookHeader from "@/features/OrderBook/OrderBookHeader/OrderBookHeader";
import useOrderBook from "@/hooks/useOrderBook";
import useMarketStore from "@/stores/market/useMarketStore";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import OrderBookLoading from "./OrderBookLoading/OrderBookLoading";

const OrderBookContent = lazy(
  () => import("@/features/OrderBook/OrderBookContent/OrderBookContent"),
);

const OrderBookFooter = lazy(
  () => import("@/features/OrderBook/OrderBookFooter/OrderBookFooter"),
);

const OrderBook = () => {
  const market = useMarketStore((s) => s.market);
  const { snapshotLoading, snapshotError, refetchSnapshot } =
    useOrderBook(market);
  const { t } = useTranslation();

  if (snapshotError) {
    return (
      <div className="flex p-4 flex-col bg-[#181A20] rounded-md md:w-[380px]">
        <div className="text-white mb-4">{t("orderBook.snapshotError")}</div>
        <Button
          className="mt-4 bg-[#f0b90b]! text-black font-medium"
          variant="default"
          onClick={() => refetchSnapshot()}
        >
          {t("orderBook.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#181A20] rounded-md md:w-[380px]">
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
