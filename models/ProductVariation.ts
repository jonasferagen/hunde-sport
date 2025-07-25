import { Product, ProductData } from "./Product";

export class ProductVariation extends Product {
    constructor(data: ProductData) {
        if (data.type !== 'variation') {
            throw new Error('Cannot construct ProductVariation with type other than "variation".');
        }
        super(data);
        this.type = 'variation';
    }
}
