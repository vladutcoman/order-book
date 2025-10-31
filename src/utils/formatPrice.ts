import type { OrderBookDecimal } from "@/types/orderBookTypes";
import { formatNumber } from "./formatNumber";

export const formatPrice = (price: number, decimal: OrderBookDecimal) => {
  // Determine decimal places based on decimal step
  if (decimal >= 1)
    return formatNumber(price, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  if (decimal >= 0.1)
    return formatNumber(price, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  if (decimal >= 0.01)
    return formatNumber(price, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return formatNumber(price, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};
