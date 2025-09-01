import type { CurrencyHeader } from "./types";

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

  const n = Number(minorStr ?? 0); // safer than parseInt for negatives / empty
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

// overloads
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

// impl
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
    const minor = (obj as any)[field] ?? "0";
    return formatMinorWithHeader(minor as string, obj, opts);
  }
  return formatMinorWithHeader(a as string, b as CurrencyHeader, c);
}
