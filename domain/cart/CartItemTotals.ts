// @domain/cart/ItemTotals.ts
import { Currency } from "@/domain/pricing/Currency";
import { Money } from "@/domain/pricing/Money";
import type { CartItemTotalsData } from "@/domain/pricing/types";

type NormalizedCartItemTotals = {
  currency: Currency;
  lineTotal: Money;
  lineTotalTax: Money;
  lineSubtotal: Money;
  lineSubtotalTax: Money;
};

export class CartItemTotals {
  readonly currency: Currency;
  readonly lineTotal: Money;
  readonly lineTotalTax: Money;
  readonly lineSubtotal: Money;
  readonly lineSubtotalTax: Money;

  private constructor(n: NormalizedCartItemTotals) {
    this.currency = n.currency;
    this.lineTotal = n.lineTotal;
    this.lineTotalTax = n.lineTotalTax;
    this.lineSubtotal = n.lineSubtotal;
    this.lineSubtotalTax = n.lineSubtotalTax;
    Object.freeze(this);
  }

  static create(data: CartItemTotalsData): CartItemTotals {
    const currency = Currency.create(data);
    const p = (s: string) => Number.parseInt(s, 10) || 0;
    return new CartItemTotals({
      currency,
      lineTotal: Money.fromMinor(p(data.line_total), currency),
      lineTotalTax: Money.fromMinor(p(data.line_total_tax), currency),
      lineSubtotal: Money.fromMinor(p(data.line_subtotal), currency),
      lineSubtotalTax: Money.fromMinor(p(data.line_subtotal_tax), currency),
    });
  }

  /** Discounted (if available) else fallback to subtotal; always tax-inclusive. */
  amountWithTax(discounted = true): Money {
    if (
      discounted &&
      (this.lineTotal.minor !== 0 || this.lineTotalTax.minor !== 0)
    ) {
      return this.lineTotal.add(this.lineTotalTax);
    }
    return this.lineSubtotal.add(this.lineSubtotalTax);
  }

  format(discounted = true): string {
    return this.amountWithTax(discounted).format({
      style: "full",
      omitPrefix: false,
    });
  }
}
