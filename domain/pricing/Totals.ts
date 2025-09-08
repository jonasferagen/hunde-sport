// @domain/pricing/Totals.ts
import { Currency } from "./Currency";
import { Money } from "./Money";
import type { CurrencyHeader } from "./types";

type NormalizedTotals = {
  currency: Currency;
  total: Money;
  tax: Money;
  items: Money;
  itemsTax: Money;
  shipping: Money;
  shippingTax: Money;
  discount: Money;
  discountTax: Money;
};
// API shape (mirrors backend)
export type TotalsData = CurrencyHeader & {
  total_price: string;
  total_tax: string;
  total_items: string;
  total_items_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_discount: string;
  total_discount_tax: string;
};

export class Totals {
  readonly currency: Currency;
  readonly total: Money;
  readonly tax: Money;
  readonly items: Money;
  readonly itemsTax: Money;
  readonly shipping: Money;
  readonly shippingTax: Money;
  readonly discount: Money;
  readonly discountTax: Money;

  private constructor(n: NormalizedTotals) {
    this.currency = n.currency;
    this.total = n.total;
    this.tax = n.tax;
    this.items = n.items;
    this.itemsTax = n.itemsTax;
    this.shipping = n.shipping;
    this.shippingTax = n.shippingTax;
    this.discount = n.discount;
    this.discountTax = n.discountTax;
    Object.freeze(this);
  }

  static create(data: TotalsData): Totals {
    const currency = Currency.create(data);

    // Your samples look like **minor** strings ("15900"). If they are major ("159.00"),
    // replace parseInt with a scale by 10^minorUnit.
    const p = (s: string) => Number.parseInt(s, 10) || 0;

    return new Totals({
      currency,
      total: Money.fromMinor(p(data.total_price), currency),
      tax: Money.fromMinor(p(data.total_tax), currency),
      items: Money.fromMinor(p(data.total_items), currency),
      itemsTax: Money.fromMinor(p(data.total_items_tax), currency),
      shipping: Money.fromMinor(p(data.total_shipping), currency),
      shippingTax: Money.fromMinor(p(data.total_shipping_tax), currency),
      discount: Money.fromMinor(p(data.total_discount), currency),
      discountTax: Money.fromMinor(p(data.total_discount_tax), currency),
    });
  }

  static readonly DEFAULT = new Totals({
    currency: Currency.NOK,
    total: Money.zero(Currency.NOK),
    tax: Money.zero(Currency.NOK),
    items: Money.zero(Currency.NOK),
    itemsTax: Money.zero(Currency.NOK),
    shipping: Money.zero(Currency.NOK),
    shippingTax: Money.zero(Currency.NOK),
    discount: Money.zero(Currency.NOK),
    discountTax: Money.zero(Currency.NOK),
  });

  equals(other: Totals): boolean {
    return (
      this.currency.equals(other.currency) &&
      this.total.minor === other.total.minor &&
      this.tax.minor === other.tax.minor &&
      this.items.minor === other.items.minor &&
      this.itemsTax.minor === other.itemsTax.minor &&
      this.shipping.minor === other.shipping.minor &&
      this.shippingTax.minor === other.shippingTax.minor &&
      this.discount.minor === other.discount.minor &&
      this.discountTax.minor === other.discountTax.minor
    );
  }

  isZero(): boolean {
    return (
      this.total.minor === 0 &&
      this.items.minor === 0 &&
      this.shipping.minor === 0 &&
      this.discount.minor === 0
    );
  }

  formatItemsTotal(): string {
    const sum = this.items.add(this.itemsTax);
    return sum.format({ style: "full", omitPrefix: false });
  }

  /** Grand total (already includes tax), formatted */
  formatGrandTotal(): string {
    return this.total.format({ style: "full", omitPrefix: false });
  }
}
