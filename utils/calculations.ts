export function calculatePercentageAmount(
  baseAmount: number,
  percentage: number
): string {
  return ((baseAmount * percentage) / 100).toFixed(2);
}

export function validateAmountInput(value: string): boolean {
  return value === "" || /^\d*\.?\d*$/.test(value);
}

export function formatCurrency(
  amount: number | string,
  currency: string = "USD"
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "USD", // Default to USD for now
  }).format(numAmount);
}

export function calculateFeePercentage(
  amount: number,
  feeRate: number = 0.015
): number {
  return amount * feeRate;
}