import { ProductVariation } from '../Product';
import { AttributeTermDetails, ProductAttribute } from '../ProductAttribute';

/**
 * A stateless helper class to resolve variation data.
 */
export class VariationDataResolver {
    /**
     * Checks if a variation is compatible with a given set of user selections.
     * @param variation The product variation to check.
     * @param selections A record of selected attribute name/term pairs.
     * @returns True if the variation matches the selections.
     */
    public static variationMatchesAttributes(variation: ProductVariation, selections: Record<string, string>): boolean {
        const attributes = variation.getParsedVariation();

        return Object.entries(selections).every(([name, slug]) => {
            return attributes.some(attr => attr.name === name && attr.value === slug);
        });
    }

    /**
     * Gets the full attribute term details for a given variation and attribute name.
     * @param variation The product variation.
     * @param attributeName The name of the attribute to get the term for (e.g., 'Color').
     * @param parentAttributes The attributes of the parent variable product.
     * @returns The {@link AttributeTermDetails} or undefined if not found.
     */
    public static getAttributeTermForVariation(
        variation: ProductVariation,
        attributeName: string,
        parentAttributes: ProductAttribute[]
    ): AttributeTermDetails | undefined {
        const attributes = variation.getParsedVariation();
        const variationOption = attributes.find(attr => attr.name === attributeName);
        if (!variationOption) {
            return undefined;
        }

        const parentAttribute = parentAttributes.find(attr => attr.name === attributeName);
        const term = parentAttribute?.terms.find(term => term.slug === variationOption.value);

        if (!term) {
            return undefined;
        }

        return {
            ...term,
            isAvailable: variation.is_in_stock,
            displayPrice: variation.prices.price,
            inStock: variation.is_in_stock,
        };
    }
}
