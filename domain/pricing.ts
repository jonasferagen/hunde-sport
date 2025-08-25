// domain/pricing.ts
import { ProductVariation } from "@/types";

/** --- Shared types --- */
export type CurrencyHeader = {
    currency_code: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
};

export type ProductPrices = CurrencyHeader & {
    price: string;         // effective price, minor units
    regular_price: string; // minor units
    sale_price: string;    // minor units
};

/** Normalized range: one header + min/max amounts (minor-unit strings) */
export type ProductPriceRange = {
    min: ProductPrices | null;
    max: ProductPrices | null;
};




export function formatPrice(
    prices: ProductPrices,
    opts?: {
        style?: "full" | "short";
        omitPrefix?: boolean;
        field?: keyof Pick<ProductPrices, "price" | "regular_price" | "sale_price">;
    }
): string {
    const field = opts?.field ?? "price";
    const minorStr = prices[field] ?? "0";
    const style = opts?.style ?? "short";
    const omitPrefix = opts?.omitPrefix ?? true;

    const {
        currency_minor_unit,
        currency_decimal_separator,
        currency_thousand_separator,
        currency_prefix,
        currency_suffix,
    } = prices;

    const n = parseInt(minorStr || "0", 10);
    const sign = n < 0 ? "-" : "";
    const abs = Math.abs(n);
    const base = 10 ** currency_minor_unit;

    const intPart = Math.floor(abs / base).toString();
    const fracPart = (abs % base).toString().padStart(currency_minor_unit, "0");
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, currency_thousand_separator);
    const hasFraction = currency_minor_unit > 0 && Number(fracPart) !== 0;

    let body: string;
    if (style === "short") {
        if (currency_minor_unit > 0 && !hasFraction) body = `${intWithSep}${currency_decimal_separator}-`; // e.g. 120,- 
        else if (currency_minor_unit > 0) body = `${intWithSep}${currency_decimal_separator}${fracPart}`;
        else body = intWithSep;
    } else {
        body = currency_minor_unit > 0 ? `${intWithSep}${currency_decimal_separator}${fracPart}` : intWithSep;
    }

    const effectivePrefix = omitPrefix ? "" : currency_prefix;
    return `${sign}${effectivePrefix}${body}${currency_suffix}`;
}

/**
 * Price range:
 * - If min == max: show single price.
 * - Else: "Fra {min}" (configurable label).
 */
export function formatPriceRange(
    range: ProductPriceRange,
    opts?: { style?: "full" | "short"; fromLabel?: string; omitPrefix?: boolean }
): string {
    const style = opts?.style ?? "short";
    const fromLabel = opts?.fromLabel ?? "Fra ";

    console.log(range.min);

    const { min, max } = range;
    if (!min || !max) return ""; // nothing purchasable

    if (min === max) {
        return formatPrice(min, { style, omitPrefix: opts?.omitPrefix });
    }

    const minFormatted = formatPrice(min, { style, omitPrefix: opts?.omitPrefix });
    return `${fromLabel}${minFormatted}`;
}


/**
 * Compute min/max from a list of ProductPrices.
 * - Ignores zero/empty prices (sold out/unavailable).
 * - Always returns min/max (throws if input array is empty).
 */
export function getProductPriceRange(prices: ProductPrices[]): {
    min: ProductPrices;
    max: ProductPrices;
} {
    if (prices.length === 0) {
        throw new Error("getProductPriceRange called with empty prices array");
    }

    let min: ProductPrices | null = null;
    let max: ProductPrices | null = null;

    for (const p of prices) {
        const priceNum = Number(p.price);
        if (!priceNum) continue; // skip "0" or invalid

        if (min === null || priceNum < Number(min.price)) {
            min = p;
        }
        if (max === null || priceNum > Number(max.price)) {
            max = p;
        }
    }

    // If all prices were "0" / unavailable → fall back to first element
    if (min === null || max === null) {
        min = max = prices[0];
    }
    return { min, max };
}
