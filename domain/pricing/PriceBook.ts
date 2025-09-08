// @domain/pricing/PriceBook.ts
import { Currency } from "./Currency";
import { Money } from "./Money";
import type { ProductPriceRange, ProductPrices } from "./types";

export class PriceBook {
  readonly currency: Currency;
  readonly price: Money; // current price (API "price")
  readonly regular: Money; // regular
  readonly sale: Money; // sale
  readonly rangeMin?: Money; // optional
  readonly rangeMax?: Money; // optional

  private constructor(args: {
    currency: Currency;
    price: Money;
    regular: Money;
    sale: Money;
    rangeMin?: Money;
    rangeMax?: Money;
  }) {
    this.currency = args.currency;
    this.price = args.price;
    this.regular = args.regular;
    this.sale = args.sale;
    this.rangeMin = args.rangeMin;
    this.rangeMax = args.rangeMax;
    Object.freeze(this);
  }

  static from(prices: ProductPrices): PriceBook {
    const currency = Currency.create(prices);
    const p = (s?: string) => (s ? Number.parseInt(s, 10) || 0 : 0);

    return new PriceBook({
      currency,
      price: Money.fromMinor(p(prices.price), currency),
      regular: Money.fromMinor(p(prices.regular_price), currency),
      sale: Money.fromMinor(p(prices.sale_price), currency),
      rangeMin: prices.price_range?.min_amount
        ? Money.fromMinor(p(prices.price_range.min_amount), currency)
        : undefined,
      rangeMax: prices.price_range?.max_amount
        ? Money.fromMinor(p(prices.price_range.max_amount), currency)
        : undefined,
    });
  }

  /** Business rule from your component: on-sale flag + sensible numbers */
  isSaleValid(isOnSale: boolean): boolean {
    return (
      isOnSale &&
      this.sale.minor > 0 &&
      this.regular.minor > 0 &&
      this.sale.minor < this.regular.minor
    );
  }

  /** Convenience formatters (full style, with prefix) */
  fmtPrice() {
    return this.price.format();
  }
  fmtRegular() {
    return this.regular.format();
  }
  fmtSale() {
    return this.sale.format();
  }

  /** Range labels; `short=true` matches your current “Fra …” */
  fmtRange(short = true): string | null {
    if (!this.rangeMin) return null;
    if (!this.rangeMax || this.rangeMin.minor === this.rangeMax.minor) {
      return this.rangeMin.format();
    }
    return short
      ? `Fra ${this.rangeMin.format()}`
      : `${this.rangeMin.format()} – ${this.rangeMax!.format()}`;
  }
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
