import OrderBookContent from "@/components/OrderBook/OrderBookContent/OrderBookContent";
import OrderBookFooter from "@/components/OrderBook/OrderBookFooter/OrderBookFooter";
import OrderBookHeader from "@/components/OrderBook/OrderBookHeader/OrderBookHeader";
import useGetOrderBook from "@/hooks/useGetOrderBook";

const OrderBook = () => {
  useGetOrderBook("btcusdt");
  return (
    <>
      <OrderBookHeader />
      <OrderBookContent />
      <OrderBookFooter />
    </>
  );
};

export default OrderBook;
