// lib/ProductVariationCollection.ts
import type { ProductVariation } from "./ProductVariationOptions";

export class ProductVariationCollection {
    private byId: Map<number, ProductVariation>;

    constructor(variations: ProductVariation[]) {
        this.byId = new Map(variations.map(v => [v.id, v]));
    }

    get(id: number): ProductVariation | undefined {
        return this.byId.get(id);
    }

    has(id: number): boolean {
        return this.byId.has(id);
    }

    size(): number {
        return this.byId.size;
    }

    ids(): number[] {
        return Array.from(this.byId.keys());
    }

    values(): ProductVariation[] {
        return Array.from(this.byId.values());
    }
}
