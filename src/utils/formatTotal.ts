import { formatNumber } from "./formatNumber";

export const formatTotal = (total: number) => {
  // Format total as USDT value with commas for thousands and 5 decimal places
  return formatNumber(total, {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  });
};
