// adapters/woocommerce/cartPricing.ts
import { formatPrice } from "@/domain/pricing/format";
import type { CurrencyHeader } from "@/domain/pricing/types";

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

// ------- Formatters (pure functions that use domain formatting)
export const formatCartItemsTotal = (totals: WcTotals) => {
  const base = Number(totals.total_items || "0");
  const tax = Number(totals.total_items_tax || "0");
  const sum = String(base + tax);
  return formatPrice(sum, totals, { style: "full", omitPrefix: false });
};

export const formatCartGrandTotal = (totals: WcTotals) =>
  formatPrice(totals, {
    field: "total_price",
    style: "full",
    omitPrefix: false,
  });

export const formatItemUnitPrice = (prices: WcItemPrices) =>
  formatPrice(prices, { field: "price", style: "full", omitPrefix: false });

export const formatItemLineTotal = (
  totals: WcItemTotals,
  discounted = true
) => {
  const field = discounted
    ? totals.line_total
      ? "line_total"
      : "line_subtotal"
    : "line_subtotal";

  const base = Number(totals[field] ?? "0");
  const taxField =
    field === "line_total" ? "line_total_tax" : "line_subtotal_tax";
  const tax = Number(totals[taxField] ?? "0");

  return formatPrice(String(base + tax), totals, {
    style: "full",
    omitPrefix: false,
  });
};
