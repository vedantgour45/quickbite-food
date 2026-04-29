export const formatPrice = (value: number): string => {
  const rounded = Math.round(value * 100) / 100;
  return `₹${rounded.toFixed(2)}`;
};

export const formatPriceWhole = (value: number): string =>
  `₹${Math.round(value)}`;

export const formatTime = (isoOrTime: string): string => {
  if (!isoOrTime) return '';
  const date = new Date(isoOrTime);
  if (Number.isNaN(date.getTime())) return isoOrTime;
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
