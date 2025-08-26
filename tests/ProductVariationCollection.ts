// lib/ProductVariationCollection.ts
import type { ProductVariation } from '@/domain/Product/ProductVariation';

export class ProductVariationCollection {
    private byId = new Map<number, ProductVariation>();

    constructor(variations: ProductVariation[]) {
        for (const v of variations ?? []) this.byId.set(v.id, v);
    }

    get(id: number) { return this.byId.get(id); }
    has(id: number) { return this.byId.has(id); }
    ids() { return [...this.byId.keys()]; }
    values() { return [...this.byId.values()]; }
    size() { return this.byId.size; }
}
