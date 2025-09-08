// @domain/pricing/Currency.ts
import type { CurrencyHeader } from "./types";

type NormalizedCurrency = CurrencyHeader;

export class Currency {
  readonly code: string;
  readonly minorUnit: number;
  readonly prefix: string;
  readonly suffix: string;
  readonly decimalSeparator: string;
  readonly thousandSeparator: string;

  private constructor(c: NormalizedCurrency) {
    this.code = c.currency_code;
    this.minorUnit = c.currency_minor_unit;
    this.prefix = c.currency_prefix;
    this.suffix = c.currency_suffix;
    this.decimalSeparator = c.currency_decimal_separator;
    this.thousandSeparator = c.currency_thousand_separator;
    Object.freeze(this);
  }

  static create(h: CurrencyHeader): Currency {
    return new Currency(h);
  }

  static readonly NOK = new Currency({
    currency_code: "NOK",
    currency_minor_unit: 2,
    currency_prefix: "kr ",
    currency_suffix: "",
    currency_decimal_separator: ",",
    currency_thousand_separator: ".",
  });

  static isEqual(a: Currency, b: Currency): boolean {
    return (
      a === b ||
      (a.code === b.code &&
        a.minorUnit === b.minorUnit &&
        a.prefix === b.prefix &&
        a.suffix === b.suffix &&
        a.decimalSeparator === b.decimalSeparator &&
        a.thousandSeparator === b.thousandSeparator)
    );
  }

  formatMinor(minor: number): string {
    const factor = 10 ** this.minorUnit;
    const major = (minor / factor).toFixed(this.minorUnit);
    // Minimal formatter; replace separators if needed
    const withSep = major.replace(".", this.decimalSeparator);
    return `${this.prefix}${withSep}${this.suffix}`;
  }
}
