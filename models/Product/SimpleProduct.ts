import { BaseProduct, BaseProductData } from './BaseProduct';
import { ProductVariation } from './ProductVariation';

export interface SimpleProductData extends BaseProductData { }

export class SimpleProduct extends BaseProduct<SimpleProductData> {
    constructor(data: SimpleProductData) {
        if (data.type !== 'simple') {
            throw new Error('Cannot construct SimpleProduct with type other than "simple".');
        }
        super(data);
    }

    hasVariations(): boolean {
        return false;
    }

    get productVariation(): ProductVariation | undefined {
        return undefined;
    }
}
