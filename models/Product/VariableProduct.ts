import { BaseProduct, BaseProductData } from './BaseProduct';
import { ProductAttribute } from './ProductAttribute';
import { ApiVariationAttribute } from './ProductVariation';

export interface VariableProductData extends BaseProductData {
    attributes: ProductAttribute[];
    variations: { id: number; attributes: ApiVariationAttribute[] }[];
}

export class VariableProduct extends BaseProduct<VariableProductData> {
    type: 'variable' = 'variable';
    variations: { id: number; attributes: ApiVariationAttribute[] }[] = [];
    public attributes: ProductAttribute[] = [];

    constructor(data: VariableProductData) {
        if (data.type !== 'variable') {
            throw new Error('Invalid data type for VariableProduct');
        }
        super(data);
        this.attributes = data.attributes;
        this.variations = data.variations;
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        return this.attributes.filter((attribute) => attribute.variation);
    }


}
