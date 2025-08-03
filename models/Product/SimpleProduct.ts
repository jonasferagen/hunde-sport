import { Product, ProductData } from "./Product";

export class SimpleProduct extends Product {
    constructor(data: ProductData) {
        if (data.type !== 'simple') {
            throw new Error('Cannot construct SimpleProduct with type other than "simple".');
        }
        super(data);
    }

    hasVariations(): boolean {
        return false;
    }

}
