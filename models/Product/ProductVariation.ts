import { Product, ProductData } from "./Product";

export class ProductVariation extends Product {
    type: 'variation' = 'variation';
    variation_attributes: { name: string; value: string }[] = [];

    constructor(data: ProductData) {
        if (data.type !== 'variation') {
            throw new Error('Cannot construct ProductVariation with type other than "variation".');
        }
        super(data);
    }

    hasVariations(): boolean {
        return false;
    }

    isPurchasable(): boolean {
        return this.isInStock();
    }
}
