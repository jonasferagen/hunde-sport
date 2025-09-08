export type CurrencyHeader = {
  currency_code: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
};

export type ProductPrices = CurrencyHeader & {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range?: {
    min_amount?: string;
    max_amount?: string;
  };
};

export type ProductPriceRange = {
  min: ProductPrices;
  max: ProductPrices;
};

// @domain/pricing/types.ts (or cart/types)
export type CartItemTotalsData = CurrencyHeader & {
  line_total: string; // discounted base excl. tax
  line_total_tax: string; // tax for discounted base
  line_subtotal: string; // undiscounted base excl. tax
  line_subtotal_tax: string; // tax for undiscounted base
};
