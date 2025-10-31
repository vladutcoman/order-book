import OrderBookContent from "@/features/OrderBook/OrderBookContent/OrderBookContent";
import OrderBookFooter from "@/features/OrderBook/OrderBookFooter/OrderBookFooter";
import OrderBookHeader from "@/features/OrderBook/OrderBookHeader/OrderBookHeader";
import useGetOrderBook from "@/hooks/useGetOrderBook";
import useMarketStore from "@/stores/market/useMarketStore";

const OrderBook = () => {
  const market = useMarketStore((s) => s.market);
  useGetOrderBook(market);
  return (
    <div className="flex flex-col">
      <OrderBookHeader />
      <OrderBookContent />
      <OrderBookFooter />
    </div>
  );
};

export default OrderBook;
