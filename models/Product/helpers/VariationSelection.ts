import { ProductVariation, VariableProduct } from '../Product';
import { AttributeTermDetails } from '../ProductAttribute';
import { VariationDataResolver } from './VariationDataResolver';

export class VariationSelection {
    private constructor(
        private readonly product: VariableProduct,
        private readonly variations: ProductVariation[],
        public readonly selections: Record<string, string> = {}
    ) { }

    static create(product: VariableProduct, variations: ProductVariation[]): VariationSelection {
        return new VariationSelection(product, variations || [], {});
    }

    select(attributeName: string, slug: string | null): VariationSelection {
        const newSelections = { ...this.selections };
        const key = attributeName.toLowerCase();
        if (slug) {
            newSelections[key] = slug;
        } else {
            delete newSelections[key];
        }
        return new VariationSelection(this.product, this.variations, newSelections);
    }

    getAvailableOptions(attributeName: string): AttributeTermDetails[] {
        const parentAttribute = this.product.attributes.find(
            (attr) => attr.name.toLowerCase() === attributeName.toLowerCase()
        );

        if (!parentAttribute) {
            return [];
        }

        const selectionsForOthers = { ...this.selections };
        delete selectionsForOthers[attributeName.toLowerCase()];

        return parentAttribute.terms.map((term) => {

            const potentialSelection = {
                ...selectionsForOthers,
                [attributeName.toLowerCase()]: term.name,
            };

            const firstMatchingVariation = this.variations.find((v) =>
                VariationDataResolver.variationMatchesAttributes(v, potentialSelection)
            );

            const isAvailable = !!firstMatchingVariation;

            return {
                ...term,
                isAvailable,
                displayPrice: firstMatchingVariation?.prices.price || '',
                inStock: isAvailable,
            };
        });
    }

    getSelectedOption(attributeName: string): string | null {
        return this.selections[attributeName.toLowerCase()] || null;
    }

    getSelectedVariation(): ProductVariation | undefined {
        const requiredAttributeCount = this.getRequiredAttributeCount();
        if (Object.keys(this.selections).length < requiredAttributeCount) {
            return undefined;
        }

        const matches = this.variations.filter((v) => VariationDataResolver.variationMatchesAttributes(v, this.selections));
        return matches.length === 1 ? matches[0] : undefined;
    }

    private getRequiredAttributeCount(): number {
        const attributeNames = new Set<string>();
        this.variations.forEach(v => {
            v.getParsedVariation().forEach(attr => {
                attributeNames.add(attr.name.toLowerCase());
            });
        });
        return attributeNames.size;
    }
}
