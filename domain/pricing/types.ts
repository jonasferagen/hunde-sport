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
};

export type ProductPriceRange = {
  min: ProductPrices;
  max: ProductPrices;
};
