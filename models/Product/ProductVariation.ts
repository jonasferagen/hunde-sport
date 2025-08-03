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
        return Object.entries(selectedAttributes).every(([key, value]) => {
            // If the value is empty, it means no option is selected for this attribute, so we can ignore it.
            if (!value) {
                return true;
            }
            return this.variation_attributes.some(
                (variationAttr) => variationAttr.name === key && variationAttr.value === value
            );
        });
    }
}
