const SYMBOL_TO_CODE = {
  "€": "EUR",
  $: "USD",
  "£": "GBP",
};

/**
 * Normalize stored currency values to an ISO code.
 * Some older orders saved a symbol (€/$) instead of EUR/USD.
 */
export function resolveCurrencyCode(currency, fallback = "EUR") {
  if (!currency || typeof currency !== "string") return fallback;

  const trimmed = currency.trim();
  if (!trimmed) return fallback;

  if (SYMBOL_TO_CODE[trimmed]) return SYMBOL_TO_CODE[trimmed];

  if (/^[A-Za-z]{3}$/.test(trimmed)) return trimmed.toUpperCase();

  return fallback;
}

export function orderCurrency(order, fallback = "EUR") {
  return resolveCurrencyCode(
    order?.currency || order?.eventId?.eventCurrency || fallback,
    fallback
  );
}

export default function currencySymbolGenerator(currencyCode) {
  const code = resolveCurrencyCode(currencyCode);

  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    });
    const parts = formatter.formatToParts(1);
    const currencySymbol = parts.find((part) => part.type === "currency")?.value;
    return currencySymbol || "€";
  } catch {
    return "€";
  }
}

export function formatMoney(amount, currencyCode = "EUR") {
  const symbol = currencySymbolGenerator(currencyCode);
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return `${symbol}${amount ?? 0}`;
  }
  return `${symbol}${value}`;
}
