
import { Product, VariableProduct } from '@/types';
import React from 'react';
import { useProductVariations } from '@/hooks/data/Product';

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
    min: ProductPrices;
    max: ProductPrices;
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
        throw new Error("No prices provided");
    }

    // Keep only valid, non-zero prices
    const valid = prices.filter((p) => {
        const n = Number(p.price);
        return Number.isFinite(n) && n !== 0;
    });

    // If no valid prices, fall back to the first element
    const list = valid.length > 0 ? valid : [prices[0]];

    // Seed min/max with the first item to avoid nulls
    let min = list[0];
    let max = list[0];

    for (let i = 1; i < list.length; i++) {
        const p = list[i];
        const n = Number(p.price);
        if (n < Number(min.price)) {
            min = p;
        }
        if (n > Number(max.price)) {
            max = p;
        }
    }

    return { min, max };
}




export type ProductPricing = {
    isLoading: boolean;
    isFree: boolean;                 // true if purchasable range is 0–0
    priceRange: ProductPriceRange;
};


export function useProductPricing(product: Product): ProductPricing {

    const variable = product as VariableProduct;
    const { items: productVariations = [], isLoading } = useProductVariations(variable);

    const priceRange = React.useMemo(() => {
        const prices = productVariations.map(v => v.prices);
        return getProductPriceRange(prices.length ? prices : [product.prices]);
    }, [productVariations, product.prices]);

    const isFree = priceRange.min.price === '0' && priceRange.max.price === '0';


    return {
        isLoading,
        isFree,
        priceRange,
    };
}

