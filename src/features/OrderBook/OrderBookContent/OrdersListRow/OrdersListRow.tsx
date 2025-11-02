import type { ProcessedOrder } from "@/types/orderBookTypes";
import { formatNumber } from "@/utils/formatNumber";
import { roundNumber } from "@/utils/roundNumber";

interface OrdersListRowProps {
  order: ProcessedOrder;
  type: "bid" | "ask";
  rounding: boolean;
}

const OrdersListRow = ({ order, type, rounding }: OrdersListRowProps) => {
  const priceColor = type === "bid" ? "text-green-500" : "text-destructive";

  return (
    <div className="grid grid-cols-3 gap-2 text-sm px-4">
      <div
        className={`text-left text-[12px] fonr-[400] line-height-[18px] ${priceColor}`}
      >
        {formatNumber(order.price)}
      </div>
      <div className="text-right text-[12px] fonr-[400] line-height-[18px]">
        {formatNumber(order.quantity)}
      </div>
      <div className="text-right text-[12px] fonr-[400] line-height-[18px]">
        {rounding ? roundNumber(order.total) : formatNumber(order.total)}
      </div>
    </div>
  );
};

export default OrdersListRow;
