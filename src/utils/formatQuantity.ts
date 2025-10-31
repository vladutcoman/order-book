import { formatNumber } from "./formatNumber";

export const formatQuantity = (quantity: number) => {
  return formatNumber(quantity, {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  });
};
