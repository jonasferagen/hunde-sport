import { Product, ProductData } from "./Product";

export class ProductVariation extends Product {
    type: 'variation' = 'variation';
    variation_attributes: { name: string; value: string }[] = [];

    constructor(data: ProductData) {
        if (data.type !== 'variation') {
            throw new Error('Cannot construct ProductVariation with type other than "variation".');
        }
        super(data);
    }

    /**
     * Generates a descriptive name for the variation based on its attributes.
     * @param parentProduct The parent product, used to look up attribute term names.
     * @returns A string of concatenated attribute names (e.g., "Red, Large").
     */
    getVariationName(parentProduct: Product): string {
        if (!this.variation_attributes || this.variation_attributes.length === 0) {
            return '';
        }

        return this.variation_attributes
            .map((variationAttr) => {
                const parentAttribute = parentProduct.attributes.find((attr) => attr.name === variationAttr.name);
                return parentAttribute?.terms.find((t) => t.slug === variationAttr.value)?.name;
            })
            .filter((name): name is string => !!name)
            .join(' ');
    }

    hasVariations(): boolean {
        return false;
    }

    isPurchasable(): boolean {
        return this.isInStock();
    }

    /**
     * Checks if the variation matches a given set of selected attributes.
     * @param selectedAttributes A dictionary of attribute names and their selected option slugs.
     * @returns True if the variation's attributes match the selected attributes, false otherwise.
     */
    matchesAttributes(selectedAttributes: { [key: string]: string }): boolean {
        // For each attribute in the potential selection (e.g., { color: 'red', size: 'large' }),
        // we must find a matching attribute in this specific variation.
        return Object.entries(selectedAttributes).every(([key, value]) => {
            // If a value is not set for an attribute, we don't need to match it.
            if (!value) {
                return true;
            }

            // Check if this variation has an attribute that matches the key-value pair.
            return this.variation_attributes.some(
                (variationAttr) => variationAttr.name === key && variationAttr.value === value
            );
        });
    }
}
