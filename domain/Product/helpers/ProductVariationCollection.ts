// lib/ProductVariationCollection.ts
import type { ProductVariation } from '@/domain/Product/ProductVariation';
import { getProductPriceRange } from '@/types';

type WithIdAndPrices = Pick<ProductVariation, 'id' | 'prices'>;

export class ProductVariationCollection<T extends WithIdAndPrices = WithIdAndPrices> {
    private byId = new Map<number, T>();

    constructor(variations: T[]) {
        for (const v of variations ?? []) this.byId.set(v.id, v);
    }

    get(id: number) { return this.byId.get(id); }
    has(id: number) { return this.byId.has(id); }
    ids() { return [...this.byId.keys()]; }
    values() { return [...this.byId.values()]; }
    size() { return this.byId.size; }

    /** Compute a price range for a set of variation IDs */
    priceRangeForVariationIds(ids: number[]) {
        const unique = Array.from(new Set(ids));
        const prices = unique
            .map(id => this.byId.get(id))
            .filter((v): v is T => !!v && !!v.prices)
            .map(v => v.prices);

        if (prices.length === 0) return null as ReturnType<typeof getProductPriceRange> | null;
        return getProductPriceRange(prices);
    }
}
