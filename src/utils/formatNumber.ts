export const formatNumber = (number: number, options: Intl.NumberFormatOptions = {}) => {
  return new Intl.NumberFormat("en-US", options).format(number);
};