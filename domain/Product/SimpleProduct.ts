import { BaseProduct, BaseProductData } from "./BaseProduct";
import { ProductAttribute } from "./ProductAttribute";

export class SimpleProduct extends BaseProduct<BaseProductData> {
    readonly type: 'simple' = 'simple';

    constructor(data: BaseProductData) {
        if (data.type !== 'simple') {
            throw new Error('Invalid data type for SimpleProduct');
        }
        super(data);
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        return this.attributes.filter((attribute) => attribute.has_variations);
    }
}

