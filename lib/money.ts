// lib/money.ts
export type CurrencyMeta = {
    code: string;           // e.g. "NOK"
    minorUnit: number;      // e.g. 2
    locale?: string;        // default "nb-NO"
};

export type Money = { minor: number; currency: string };

export const toMinor = (v: string | number | null | undefined, minorUnit: number): number => {
    if (v == null || v === '') return 0;
    return Math.round(Number(v) * Math.pow(10, minorUnit));
};

export const fromMajor = (amount: number, currency: string, minorUnit: number): Money => ({
    minor: Math.round(amount * Math.pow(10, minorUnit)),
    currency,
});

export const formatMoney = (m: Money, minorUnit: number, locale = 'nb-NO') =>
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: m.currency,
        minimumFractionDigits: minorUnit,
        maximumFractionDigits: minorUnit,
    }).format(m.minor / Math.pow(10, minorUnit));
