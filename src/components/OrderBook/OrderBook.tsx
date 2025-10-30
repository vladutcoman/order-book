import OrderBookContent from "@/components/OrderBook/OrderBookContent/OrderBookContent";
import OrderBookFooter from "@/components/OrderBook/OrderBookFooter/OrderBookFooter";
import OrderBookHeader from "@/components/OrderBook/OrderBookHeader/OrderBookHeader";
import useGetOrderBook from "@/hooks/useGetOrderBook";

const OrderBook = () => {
  useGetOrderBook("btcusdt");
  return (
    <div className="flex flex-col">
      <OrderBookHeader />
      <OrderBookContent />
      <OrderBookFooter />
    </div>
  );
};

export default OrderBook;
