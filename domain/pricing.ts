// domain/pricing.ts
// One header shape used by both product.prices and cart totals/item prices
export type CurrencyHeader = {
    currency_code: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
};

// Product prices (from WC Store API)
export type ProductPrices = CurrencyHeader & {
    price: string;          // minor units, e.g. "24900"
    regular_price: string;  // minor units
    sale_price: string;     // minor units
    price_range: ProductPriceRange | null;
};

export type ProductPriceRange = {
    min_amount: string;     // minor units
    max_amount: string;     // minor units
};


// domain/pricing.ts

export function formatMinorWithHeader(
    minorStr: string,
    h: CurrencyHeader,
    opts?: {
        style?: 'full' | 'short';     // default = 'short'
        omitPrefix?: boolean;         // drop "kr " etc. (great for cart UI)
    }
): string {
    const style = opts?.style ?? 'short';
    const omitPrefix = opts?.omitPrefix ?? true;
    const mu = h.currency_minor_unit;
    const ds = h.currency_decimal_separator;
    const ts = h.currency_thousand_separator;

    const n = parseInt(minorStr || '0', 10);
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    const intPart = Math.floor(abs / 10 ** mu).toString();
    const fracPart = (abs % 10 ** mu).toString().padStart(mu, '0');
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ts);

    const hasFraction = mu > 0 && Number(fracPart) !== 0;

    let body: string;
    if (style === 'short') {
        if (mu > 0 && !hasFraction) {
            body = `${intWithSep}${ds}-`; // e.g. 120,- 
        } else if (mu > 0) {
            body = `${intWithSep}${ds}${fracPart}`;
        } else {
            body = intWithSep;
        }
    } else { // full
        body = mu > 0 ? `${intWithSep}${ds}${fracPart}` : intWithSep;
    }

    const prefix = omitPrefix ? '' : h.currency_prefix;
    return `${sign}${prefix}${body}${h.currency_suffix}`;
}

/**
 * Price range:
 * - If min == max: show a single price.
 * - Else: "Fra {minPrice}" (configurable label).
 */
export function formatRangeWithHeader(
    range: ProductPriceRange,
    h: CurrencyHeader,
    opts?: {
        style?: 'full' | 'short';     // default = 'short'
        fromLabel?: string;           // default = 'Fra '
        omitPrefix?: boolean;         // pass through to inner formatter
    }
): string {
    const style = opts?.style ?? 'short';
    const fromLabel = opts?.fromLabel ?? 'Fra ';
    const min = parseInt(range.min_amount || '0', 10);
    const max = parseInt(range.max_amount || '0', 10);

    if (min === max) {
        // single price
        return formatMinorWithHeader(range.min_amount, h, { style, omitPrefix: opts?.omitPrefix });
    }

    const minFormatted = formatMinorWithHeader(range.min_amount, h, { style, omitPrefix: opts?.omitPrefix });
    return `${fromLabel}${minFormatted}`;
}
