// formatPrice.ts
import type { CurrencyHeader, ProductPriceRange, ProductPrices } from "./types";

/** Dot-paths whose leaf is a string
 *
 * Allows for accessing (for example) price_range.min_amount
 *
 */
type StringFieldPath<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Record<string, any>
      ? `${K}.${StringFieldPath<T[K]>}`
      : never;
}[keyof T & string];

/** Runtime safe getter for "a.b.c" */
function getPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<any>((acc, key) => (acc == null ? acc : acc[key]), obj);
}

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

  const n = Number(minorStr ?? 0);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const base = 10 ** mu;

  const intPart = Math.floor(abs / base).toString();
  const fracPart = (abs % base).toString().padStart(mu, "0");
  const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ts);
  const hasFraction = mu > 0 && Number(fracPart) !== 0;

  const body =
    style === "short"
      ? mu > 0
        ? hasFraction
          ? `${intWithSep}${ds}${fracPart}`
          : `${intWithSep}${ds}-`
        : intWithSep
      : mu > 0
        ? `${intWithSep}${ds}${fracPart}`
        : intWithSep;

  const prefix = omitPrefix ? "" : h.currency_prefix;
  return `${sign}${prefix}${body}${h.currency_suffix}`;
}

// Overloads
export function formatPrice<T extends CurrencyHeader>(
  obj: T,
  opts?: {
    style?: "full" | "short";
    omitPrefix?: boolean;
    /** Accept dot paths whose leaf is a string */
    field?: StringFieldPath<T>;
  }
): string;
export function formatPrice(
  minorStr: string,
  header: CurrencyHeader,
  opts?: { style?: "full" | "short"; omitPrefix?: boolean }
): string;

// Impl
export function formatPrice(a: any, b?: any, c?: any): string {
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
    const raw = getPath(obj, field);

    // Be defensive: coerce only if it's a string-like value, else treat as "0"
    const minor =
      typeof raw === "string"
        ? raw
        : typeof raw === "number"
          ? String(raw)
          : "0";

    return formatMinorWithHeader(minor, obj, opts);
  }
  return formatMinorWithHeader(a as string, b as CurrencyHeader, c);
}

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
