export default function truncateDecimalPlace(
  num: number,
  decimalPlaces: number
) {
  const factor = Math.pow(10, decimalPlaces);
  return Number(Math.floor(num * factor) / factor);
}
