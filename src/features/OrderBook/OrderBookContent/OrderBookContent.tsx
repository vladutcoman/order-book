import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import AllOrdersList from "./AllOrdersList/AllOrdersList";
import BidsOrdersList from "./BidsOrdersList/BidsOrdersList";
import AsksOrdersList from "./AsksOrdersList/AsksOrdersList";

const OrderBookContent = () => {
  const tab = useOrderBookStore((s) => s.tab);

  return (
    <div className="flex flex-col gap-2 px-2 pb-6">
      <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground pb-1">
        <div>Price (USDT)</div>
        <div>Amount</div>
        <div>Total</div>
      </div>
      {tab === "both" ? (
        <AllOrdersList />
      ) : tab === "bids" ? (
        <BidsOrdersList />
      ) : (
        <AsksOrdersList />
      )}
    </div>
  );
};

export default OrderBookContent;
