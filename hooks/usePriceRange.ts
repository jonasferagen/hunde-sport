import { Product } from '@/models/Product';
import { useMemo } from 'react';

interface PriceRange {
    min: number;
    max: number;
}

export const calculatePriceRange = (productVariations: Product[] | undefined | null): PriceRange | null => {
    if (!productVariations || productVariations.length === 0) {
        return null;
    }

    const prices = productVariations.map((p) => p.price).filter((p) => p > 0);

    if (prices.length === 0) {
        return null;
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
};

export const usePriceRange = (productVariations: Product[] | undefined | null) => {
    const priceRange = useMemo(() => calculatePriceRange(productVariations), [productVariations]);

    return priceRange;
};
