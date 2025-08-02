import { Product, ProductData } from "./Product";

export class VariableProduct extends Product {
    constructor(data: ProductData) {
        if (data.type !== 'variable') {
            throw new Error('Cannot construct VariableProduct with type other than "variable".');
        }
        super(data);
        this.type = 'variable';
    }

    hasVariations(): boolean {
        return true;
    }

    isPurchasable(): boolean {
        return false;
    }
}
