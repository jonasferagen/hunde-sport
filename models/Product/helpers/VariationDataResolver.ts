import { AttributeTermDetails } from '../ProductAttribute';
import { ApiVariationAttribute, AttributeSelectionTuple, ProductVariation } from '../ProductVariation';
import { VariableProduct } from '../VariableProduct';

/**
 * A helper class to resolve variation data in the context of a parent VariableProduct.
 * This class handles the logic of mapping raw variation attributes to their full taxonomy
 * and provides methods to query variation details.
 */
export class VariationDataResolver {
    private readonly product: VariableProduct;
    private readonly variationRefMap: Map<number, ApiVariationAttribute[]>;

    constructor(product: VariableProduct) {
        this.product = product;
        this.variationRefMap = new Map<number, ApiVariationAttribute[]>(
            product.variations.map((ref) => [ref.id, ref.attributes])
        );
    }

    /**
     * Gets the fully resolved attributes for a given variation ID.
     * @param variationId The ID of the variation.
     * @returns An array of {@link AttributeSelectionTuple}.
     */
    public getAttributesForVariation(variationId: number): AttributeSelectionTuple[] {
        const rawAttributes = this.variationRefMap.get(variationId);
        if (!rawAttributes) {
            return [];
        }

        return rawAttributes
            .map((rawAttr): AttributeSelectionTuple | null => {
                const parentAttribute = this.product.attributes.find((attr) => attr.name === rawAttr.name);
                if (parentAttribute) {
                    return {
                        name: parentAttribute.taxonomy,
                        value: rawAttr.value,
                    };
                }
                return null;
            })
            .filter((attr): attr is AttributeSelectionTuple => attr !== null);
    }

    /**
     * Checks if a variation is compatible with a given set of user selections.
     * @param variation The product variation to check.
     * @param selections A record of selected taxonomy/term pairs.
     * @returns True if the variation matches the selections.
     */
    public variationMatchesAttributes(variation: ProductVariation, selections: Record<string, string>): boolean {
        const attributes = this.getAttributesForVariation(variation.id);
        return Object.entries(selections).every(([taxonomy, slug]) => {
            return attributes.some((attr) => attr.name === taxonomy && attr.value === slug);
        });
    }

    /**
     * Gets the full attribute term details for a given variation and taxonomy.
     * @param variation The product variation.
     * @param taxonomy The taxonomy to get the term for (e.g., 'pa_color').
     * @returns The {@link AttributeTermDetails} or undefined if not found.
     */
    public getAttributeTermForVariation(variation: ProductVariation, taxonomy: string): AttributeTermDetails | undefined {
        const attributes = this.getAttributesForVariation(variation.id);
        const variationOption = attributes.find(attr => attr.name === taxonomy);
        if (!variationOption) {
            return undefined;
        }

        const parentAttribute = this.product.attributes.find(attr => attr.taxonomy === taxonomy);
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
