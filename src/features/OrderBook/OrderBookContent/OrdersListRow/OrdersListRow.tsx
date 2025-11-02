import type { ProcessedOrder } from "@/types/orderBookTypes";
import { formatNumber } from "@/utils/formatNumber";
import { roundNumber } from "@/utils/roundNumber";
import DepthVisualization from "../DepthVisualization/DepthVisualization";

interface OrdersListRowProps {
  order: ProcessedOrder;
  type: "bid" | "ask";
  rounding: boolean;
  maxTotal?: number;
  cumulativeTotal?: number;
  maxCumulativeTotal?: number;
}

const OrdersListRow = ({
  order,
  type,
  rounding,
  maxTotal,
  cumulativeTotal,
  maxCumulativeTotal,
}: OrdersListRowProps) => {
  const priceColor = type === "bid" ? "text-green-500" : "text-destructive";

  return (
    <div className="grid grid-cols-3 gap-2 text-sm px-4 relative">
      <DepthVisualization
        order={order}
        type={type}
        maxTotal={maxTotal}
        cumulativeTotal={cumulativeTotal}
        maxCumulativeTotal={maxCumulativeTotal}
      />
      <div
        className={`text-left text-[12px] fonr-[400] line-height-[18px] ${priceColor} relative z-10`}
      >
        {formatNumber(order.price)}
      </div>
      <div className="text-right text-[12px] fonr-[400] line-height-[18px] relative z-10 py-1">
        <span className="relative z-10">{formatNumber(order.quantity)}</span>
      </div>
      <div className="text-right text-[12px] fonr-[400] line-height-[18px] relative z-10 py-1">
        <span className="relative z-10">
          {rounding ? roundNumber(order.total) : formatNumber(order.total)}
        </span>
      </div>
    </div>
  );
};

export default OrdersListRow;
