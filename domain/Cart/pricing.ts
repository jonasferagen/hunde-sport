import { CurrencyHeader } from "../pricing";

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
    price: string;                 // unit price (minor units, e.g. "24900")
    regular_price?: string;
    sale_price?: string;
    price_range?: unknown;
    raw_prices?: { precision: number; price: string; regular_price?: string; sale_price?: string };
};

export type WcItemTotals = CurrencyHeader & {
    line_subtotal: string;         // minor units
    line_subtotal_tax: string;     // minor units
    line_total?: string;           // minor units (discounted)
    line_total_tax?: string;       // minor units (discounted)
};

import { formatMinorWithHeader } from "../pricing";

// Cart grand total (already tax-inclusive in Store API)
export const formatCartGrandTotal = (totals: WcTotals) =>
    formatMinorWithHeader(totals.total_price, totals, { style: 'full', omitPrefix: false });

// Unit price for a cart line item
export const formatItemUnitPrice = (prices: WcItemPrices) =>
    formatMinorWithHeader(prices.price, prices, { style: 'short' });

// Line total (prefer discounted totals when present)
export const formatItemLineTotal = (totals: WcItemTotals, discounted = true) => {
    const base = discounted ? (totals.line_total ?? totals.line_subtotal) : totals.line_subtotal;
    const tax = discounted ? (totals.line_total_tax ?? totals.line_subtotal_tax) : totals.line_subtotal_tax;
    const total = parseInt(base, 10) + parseInt(tax, 10);
    return formatMinorWithHeader(total.toString(), totals, { style: 'full', omitPrefix: false });
};
