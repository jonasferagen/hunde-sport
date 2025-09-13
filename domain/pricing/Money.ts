// @/domain/pricing/Money.ts
import { Currency } from "./Currency";

export type MoneyFormatOptions = {
  style?: "full" | "short"; // short shows "-" for zero decimals
  omitPrefix?: boolean; // omit currency_prefix
};

export class Money {
  readonly minor: number;
  readonly currency: Currency;

  private constructor(minor: number, currency: Currency) {
    this.minor = minor | 0;
    this.currency = currency;
    Object.freeze(this);
  }

  static fromMinor(minor: number, currency: Currency): Money {
    return new Money(minor | 0, currency);
  }

  static zero(currency: Currency): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    if (!Currency.isEqual(this.currency, other.currency)) {
      throw new Error("Money.add: currency mismatch");
    }
    return new Money(this.minor + other.minor, this.currency);
  }

  format(opts?: MoneyFormatOptions): string {
    const style = opts?.style ?? "short";
    const omitPrefix = opts?.omitPrefix ?? true;

    const { minorUnit, decimalSeparator, thousandSeparator, prefix, suffix } = this.currency; // assumes Currency exposes these

    const n = this.minor;
    const sign = n < 0 ? "-" : "";
    const abs = Math.abs(n);
    const base = 10 ** minorUnit;

    const intPart = Math.floor(abs / base).toString();
    const fracPart = (abs % base).toString().padStart(minorUnit, "0");
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    const hasFraction = minorUnit > 0 && Number(fracPart) !== 0;

    const body =
      style === "short"
        ? minorUnit > 0
          ? hasFraction
            ? `${intWithSep}${decimalSeparator}${fracPart}`
            : `${intWithSep}${decimalSeparator}-`
          : intWithSep
        : minorUnit > 0
          ? `${intWithSep}${decimalSeparator}${fracPart}`
          : intWithSep;

    const pre = omitPrefix ? "" : prefix;
    return `${sign}${pre}${body}${suffix}`;
  }
}
