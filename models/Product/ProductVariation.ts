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
}
