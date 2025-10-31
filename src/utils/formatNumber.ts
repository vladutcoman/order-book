export const formatNumber = (
  number: number,
) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(number);
};
