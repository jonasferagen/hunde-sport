
import { BaseProduct, BaseProductData } from "./BaseProduct";
import { ProductAttribute } from "./ProductAttribute";

export class VariableProduct extends BaseProduct<BaseProductData> {
    readonly type: 'variable' = 'variable';

    constructor(data: BaseProductData) {
        if (data.type !== 'variable') {
            throw new Error('Invalid data type for VariableProduct');
        }
        super(data);

    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        return this.attributes.filter((attribute) => attribute.has_variations);
    }
}

