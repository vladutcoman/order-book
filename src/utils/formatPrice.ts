import type { OrderBookDecimal } from "@/types/orderBookTypes";


export const formatPrice = (price: number, decimal: OrderBookDecimal) => {
  // Determine decimal places based on decimal step
  if (decimal >= 1) return price.toFixed(0);
  if (decimal >= 0.1) return price.toFixed(1);
  if (decimal >= 0.01) return price.toFixed(2);
  return price.toFixed(3);
};