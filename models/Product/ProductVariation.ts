import { BaseProduct, BaseProductData } from './BaseProduct';

// The clean, canonical representation of a variation's attribute selection.
export type AttributeSelectionTuple = {
    name: string; // The attribute taxonomy slug, e.g., "pa_farge"
    value: string; // The selected term slug, e.g., "red"
};

// The raw representation of an attribute as it comes from the initial product API response.
export type ApiVariationAttribute = {
    name: string; // The attribute's "nice" name, e.g., "Farge"
    value: string; // The selected term slug, e.g., "red"
};

export interface ProductVariationData extends BaseProductData { }

export class ProductVariation extends BaseProduct<ProductVariationData> {
    type: 'variation' = 'variation';

    constructor(data: ProductVariationData) {
        if (data.type !== 'variation') {
            throw new Error('Cannot construct ProductVariation with type other than "variation".');
        }
        super(data);
    }
}
