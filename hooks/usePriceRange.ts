import { Product } from '@/models/Product';
import { useMemo } from 'react';

interface PriceRange {
    min: number;
    max: number;
}

export const calculatePriceRange = (products: Product[] | undefined | null): PriceRange | null => {
    if (!products || products.length === 0) {
        return null;
    }

    const prices = products.map((p) => p.price).filter((p) => p > 0);

    if (prices.length === 0) {
        return null;
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
};

export const usePriceRange = (products: Product[] | undefined | null) => {
    const priceRange = useMemo(() => calculatePriceRange(products), [products]);

    return priceRange;
};
