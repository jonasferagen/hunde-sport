import { BaseProduct, BaseProductData } from './BaseProduct';
import { ProductAttribute } from './ProductAttribute';

export interface VariableProductData extends BaseProductData { }

export class VariableProduct extends BaseProduct<VariableProductData> {
    type: 'variable' = 'variable';

    constructor(data: VariableProductData) {
        if (data.type !== 'variable') {
            throw new Error('Invalid data type for VariableProduct');
        }
        super(data);
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        return this.attributes.filter((attribute) => attribute.has_variations);
    }
}
