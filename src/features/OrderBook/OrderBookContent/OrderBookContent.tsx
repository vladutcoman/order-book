import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import AllOrdersList from "./AllOrdersList/AllOrdersList";
import BidsOrdersList from "./BidsOrdersList/BidsOrdersList";
import AsksOrdersList from "./AsksOrdersList/AsksOrdersList";
import OrderListHeaders from "./OrdersListHeader/OrderListHeaders";

const OrderBookContent = () => {
  const tab = useOrderBookStore((state) => state.tab);

  return (
    <div className="flex flex-col gap-2 pb-6">
      <OrderListHeaders />
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
