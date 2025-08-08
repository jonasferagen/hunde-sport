export interface ProductPrices {
    currency_code: string;
    currency_symbol: string;
    price: string;
    regular_price: string;
    sale_price: string;
    price_range: ProductPriceRange | null;
}

export interface ProductPriceRange {
    min_amount: string;
    max_amount: string;
}
