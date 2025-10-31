export const groupByDecimal = (
  orders: [string, string][],
  step: number,
): Map<number, number> => {
  const grouped = new Map<number, number>();

  for (const [priceStr, quantityStr] of orders) {
    const price = parseFloat(priceStr);
    const quantity = parseFloat(quantityStr);

    // Round price to nearest step bucket
    const bucket = Math.floor(price / step);
    const groupedPrice = bucket * step;

    const existing = grouped.get(groupedPrice) || 0;
    grouped.set(groupedPrice, existing + quantity);
  }

  return grouped;
};
