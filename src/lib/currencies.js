export const CURRENCY_RATES = {
  PKR: { rate: 1, symbol: "PKR ", label: "PKR (₨)", flag: "🇵🇰" },
  USD: { rate: 1 / 278.50, symbol: "$", label: "USD ($)", flag: "🇺🇸" },
  EUR: { rate: 1 / 302.20, symbol: "€", label: "EUR (€)", flag: "🇪🇺" },
  GBP: { rate: 1 / 362.40, symbol: "£", label: "GBP (£)", flag: "🇬🇧" },
  AED: { rate: 1 / 75.82, symbol: "AED ", label: "AED", flag: "🇦🇪" },
  SAR: { rate: 1 / 74.25, symbol: "SAR ", label: "SAR", flag: "🇸🇦" },
};

/**
 * Convert numeric PKR amount to formatted target currency string
 * @param {number|string} pkrAmount - Amount in PKR
 * @param {string} currency - Target currency code (PKR, USD, EUR, etc.)
 */
export function formatCurrencyPrice(pkrAmount, currency = "PKR") {
  const num = typeof pkrAmount === "number" ? pkrAmount : parseFloat(String(pkrAmount).replace(/[^0-9.]/g, "")) || 0;
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.PKR;
  const converted = num * config.rate;

  if (currency === "PKR") {
    return `PKR ${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
