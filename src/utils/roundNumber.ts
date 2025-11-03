export const roundNumber = (
  value: number,
  locale = 'en-US',
  opts?: { significantDigits?: number },
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: opts?.significantDigits ?? 6,
  });
  return formatter.format(value);
};
