import type { OrderBookDecimal } from "@/types/orderBookTypes";

const formatPrice = (price: number, decimal: OrderBookDecimal): string => {
  let decimalPlaces: number;

  if (decimal === 1 || decimal === 10 || decimal === 50 || decimal === 100) {
    decimalPlaces = 0;
  } else if (decimal === 0.1) {
    decimalPlaces = 1;
  } else if (decimal === 0.01) {
    decimalPlaces = 2;
  } else {
    decimalPlaces = 2;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(price);
};

export default formatPrice;
