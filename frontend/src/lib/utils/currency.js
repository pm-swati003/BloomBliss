export function formatINR(n) {
  const val = Number(n);
  if (isNaN(val) || n === null || n === undefined) {
    return "₹0.00";
  }
  return `₹${val.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
