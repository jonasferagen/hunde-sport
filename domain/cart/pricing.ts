import { CurrencyHeader, formatPrice } from "../pricing";

// types from your message
export type WcTotals = CurrencyHeader & {
  total_price: string;
  total_tax: string;
  total_items: string;
  total_items_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_discount: string;
  total_discount_tax: string;
};

export type WcItemPrices = CurrencyHeader & {
  price: string;
  regular_price?: string;
  sale_price?: string;
  price_range?: unknown;
  raw_prices?: {
    precision: number;
    price: string;
    regular_price?: string;
    sale_price?: string;
  };
};

export type WcItemTotals = CurrencyHeader & {
  line_subtotal: string;
  line_subtotal_tax: string;
  line_total?: string;
  line_total_tax?: string;
};

// If you want to format “items + items_tax” specifically (no single field exists):
export const formatCartItemsTotal = (totals: WcTotals) => {
  const sum = (
    parseInt(totals.total_items || "0", 10) +
    parseInt(totals.total_items_tax || "0", 10)
  ).toString();
  return formatPrice(sum, totals, { style: "full", omitPrefix: false });
};

// Grand total (already a field)
export const formatCartGrandTotal = (totals: WcTotals) =>
  formatPrice(totals, {
    field: "total_price",
    style: "full",
    omitPrefix: false,
  });

// Unit price
export const formatItemUnitPrice = (prices: WcItemPrices) =>
  formatPrice(prices, { field: "price", style: "full", omitPrefix: false });

// Line total (prefer discounted totals when present)
export const formatItemLineTotal = (
  totals: WcItemTotals,
  discounted = true
) => {
  const field = discounted
    ? totals.line_total
      ? "line_total"
      : "line_subtotal"
    : "line_subtotal";
  // Include tax: pick matching tax field and add with second signature
  const base = totals[field] ?? "0";
  const taxField =
    field === "line_total" ? "line_total_tax" : "line_subtotal_tax";
  const tax = totals[taxField] ?? "0";
  const sum = (parseInt(base, 10) + parseInt(tax, 10)).toString();
  return formatPrice(sum, totals, { style: "full", omitPrefix: false });
};
