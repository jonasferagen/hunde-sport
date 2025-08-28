import React from "react";

import { VariableProduct } from "@/domain/Product/VariableProduct";
import { useProductVariations } from "@/hooks/data/Product";

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
  price: string; // effective price, minor units
  regular_price: string; // minor units
  sale_price: string; // minor units
};

/** Normalized range: one header + min/max amounts (minor-unit strings) */
export type ProductPriceRange = {
  min: ProductPrices;
  max: ProductPrices;
};

type StringKeys<T> = {
  [K in keyof T]-?: T[K] extends string ? K : never;
}[keyof T];

function formatMinorWithHeader(
  minorStr: string,
  h: CurrencyHeader,
  opts?: { style?: "full" | "short"; omitPrefix?: boolean }
): string {
  const style = opts?.style ?? "short";
  const omitPrefix = opts?.omitPrefix ?? true;

  const mu = h.currency_minor_unit;
  const ds = h.currency_decimal_separator;
  const ts = h.currency_thousand_separator;

  const n = parseInt(minorStr || "0", 10);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const base = 10 ** mu;

  const intPart = Math.floor(abs / base).toString();
  const fracPart = (abs % base).toString().padStart(mu, "0");
  const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ts);
  const hasFraction = mu > 0 && Number(fracPart) !== 0;

  let body: string;
  if (style === "short") {
    if (mu > 0 && !hasFraction) body = `${intWithSep}${ds}-`;
    else if (mu > 0) body = `${intWithSep}${ds}${fracPart}`;
    else body = intWithSep;
  } else {
    body = mu > 0 ? `${intWithSep}${ds}${fracPart}` : intWithSep;
  }

  const prefix = omitPrefix ? "" : h.currency_prefix;
  return `${sign}${prefix}${body}${h.currency_suffix}`;
}

// ---------- Overloads
export function formatPrice<T extends CurrencyHeader>(
  obj: T,
  opts?: {
    style?: "full" | "short";
    omitPrefix?: boolean;
    field?: StringKeys<T>;
  }
): string;
export function formatPrice(
  minorStr: string,
  header: CurrencyHeader,
  opts?: { style?: "full" | "short"; omitPrefix?: boolean }
): string;

// ---------- Implementation
export function formatPrice(a: any, b?: any, c?: any): string {
  // form: (objWithHeader, { field })
  if (
    a &&
    typeof a === "object" &&
    "currency_code" in a &&
    "currency_minor_unit" in a
  ) {
    const obj = a as CurrencyHeader & Record<string, unknown>;
    const opts = (b ?? {}) as {
      style?: "full" | "short";
      omitPrefix?: boolean;
      field?: string;
    };
    const field = opts.field ?? "price";
    const minor = (obj as any)[field] ?? "0";
    return formatMinorWithHeader(minor, obj, opts);
  }
  // form: (minorStr, header, opts)
  return formatMinorWithHeader(a as string, b as CurrencyHeader, c);
}

/**
 * Compute min/max from a list of ProductPrices.
 * - Ignores zero/empty prices (sold out/unavailable).
 * - Always returns min/max (throws if input array is empty).
 */
export function getProductPriceRange(
  prices: ProductPrices[]
): ProductPriceRange {
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
  isFree: boolean; // true if purchasable range is 0–0
  priceRange: ProductPriceRange;
};

export function useProductPricing(product: VariableProduct): ProductPricing {
  const variable = product as VariableProduct;
  const { items: productVariations = [], isLoading } =
    useProductVariations(variable);

  const priceRange = React.useMemo(() => {
    const prices = productVariations.map((v) => v.prices);
    return getProductPriceRange(prices.length ? prices : [product.prices]);
  }, [productVariations, product.prices]);

  const isFree = priceRange.min.price === "0" && priceRange.max.price === "0";

  return {
    isLoading,
    isFree,
    priceRange,
  };
}
