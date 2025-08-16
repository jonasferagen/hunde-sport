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

const parseMinor = (s?: string) => (s ? parseInt(s, 10) : 0);

export const formatWithHeader = (minor: number, h: CurrencyHeader) => {
    const { currency_minor_unit: mu, currency_decimal_separator: ds, currency_thousand_separator: ts } = h;
    const sign = minor < 0 ? '-' : '';
    const abs = Math.abs(minor);
    const intPart = Math.floor(abs / 10 ** mu).toString();
    const fracPart = (abs % 10 ** mu).toString().padStart(mu, '0');
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ts);
    return `${sign}${h.currency_prefix}${intWithSep}${mu ? ds + fracPart : ''}${h.currency_suffix}`;
};

// Cart grand total (already tax-inclusive in Store API)
export const formatCartGrandTotal = (totals: WcTotals) =>
    formatWithHeader(parseMinor(totals.total_price), totals);

// Unit price for a cart line item
export const formatItemUnitPrice = (prices: WcItemPrices) =>
    formatWithHeader(parseMinor(prices.price), prices);

// Line total (prefer discounted totals when present)
export const formatItemLineTotal = (totals: WcItemTotals, discounted = true) => {
    const base = discounted ? (totals.line_total ?? totals.line_subtotal) : totals.line_subtotal;
    const tax = discounted ? (totals.line_total_tax ?? totals.line_subtotal_tax) : totals.line_subtotal_tax;
    return formatWithHeader(parseMinor(base) + parseMinor(tax), totals);
};
