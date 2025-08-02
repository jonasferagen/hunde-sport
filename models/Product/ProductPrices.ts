export interface ProductPrices {
    currency_code: string;
    currency_symbol: string;
    price: string;
    regular_price: string;
    sale_price: string;
    price_range: { min_amount: string; max_amount: string } | null;
}

