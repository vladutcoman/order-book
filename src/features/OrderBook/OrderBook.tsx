import OrderBookContent from "@/features/OrderBook/OrderBookContent/OrderBookContent";
import OrderBookFooter from "@/features/OrderBook/OrderBookFooter/OrderBookFooter";
import OrderBookHeader from "@/features/OrderBook/OrderBookHeader/OrderBookHeader";
import useGetOrderBook from "@/hooks/useGetOrderBook";
import { useTranslation } from "react-i18next";

const OrderBook = () => {
  const { t } = useTranslation();
  useGetOrderBook("btcusdt");
  return (
    <div className="flex flex-col">
      <h1>{t("hello")}</h1>
      <OrderBookHeader />
      <OrderBookContent />
      <OrderBookFooter />
    </div>
  );
};

export default OrderBook;
