import { BaseProduct, BaseProductData } from './BaseProduct';
import { ProductAttribute, ProductAttributeTerm } from "./ProductAttribute";

// The clean, canonical representation of a variation's attribute selection.
export type AttributeSelectionTuple = {
    name: string; // The attribute taxonomy slug, e.g., "pa_farge"
    option: string; // The selected term slug, e.g., "red"
};

// The raw representation of an attribute as it comes from the initial product API response.
export type ApiVariationAttribute = {
    name: string; // The attribute's "nice" name, e.g., "Farge"
    value: string; // The selected term slug, e.g., "red"
};

export interface ProductVariationData extends BaseProductData {
    attributes: { id: number; name: string; option: string }[];
}

export class ProductVariation extends BaseProduct<ProductVariationData> {
    type: 'variation' = 'variation';
    variation_attributes: AttributeSelectionTuple[] = [];

    constructor(data: ProductVariationData) {
        if (data.type !== 'variation') {
            throw new Error('Cannot construct ProductVariation with type other than "variation".');
        }
        super(data);
        // Note: The raw attributes from the API response for a variation do not contain the taxonomy slug.
        // The parent VariableProduct is responsible for mapping these to the correct AttributeSelectionTuple.
        // This is a placeholder until the parent provides the full context.
        this.variation_attributes = data.attributes.map(attr => ({ name: attr.name, option: attr.option }));
    }

    /**
     * Generates a descriptive name for the variation based on its attributes.
     * @param attributes The parent product's attributes, used to look up attribute term names.
     * @returns A string of concatenated attribute names (e.g., "Red, Large").
     */
    getVariationName(attributes: ProductAttribute[]): string {
        if (!this.variation_attributes || this.variation_attributes.length === 0) {
            return '';
        }

        return this.variation_attributes
            .map((variationAttr: AttributeSelectionTuple) => {
                const parentAttribute = attributes.find((attr) => attr.taxonomy === variationAttr.name);
                return parentAttribute?.terms.find((t: ProductAttributeTerm) => t.slug === variationAttr.option)?.name;
            })
            .filter(Boolean)
            .join(', ');
    }

    /**
     * Checks if this variation matches a given set of attribute selections.
     * @param selections An object where keys are attribute taxonomies and values are term slugs.
     * @returns True if the variation satisfies all selections, false otherwise.
     */
    matchesAttributes(selections: { [key: string]: string }): boolean {
        const selectionEntries = Object.entries(selections);

        if (selectionEntries.length === 0) {
            return true;
        }

        return selectionEntries.every(([name, option]) =>
            this.variation_attributes.some((variationAttr) => variationAttr.name === name && variationAttr.option === option)
        );
    }

    /**
     * Checks if the variation has a specific attribute-option pair.
     * @param name The attribute taxonomy (e.g., 'pa_color').
     * @param option The term slug (e.g., 'red').
     * @returns True if the attribute-option pair exists, false otherwise.
     */
    hasAttribute(name: string, option: string): boolean {
        return this.variation_attributes.some(
            (variationAttr: AttributeSelectionTuple) => variationAttr.name === name && variationAttr.option === option
        );
    }
}
