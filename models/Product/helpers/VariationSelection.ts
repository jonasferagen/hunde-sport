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
        if (slug) {
            newSelections[attributeName] = slug;
        } else {
            delete newSelections[attributeName];
        }
        return new VariationSelection(this.product, this.variations, newSelections);
    }

    getAvailableOptions(attributeName: string): AttributeTermDetails[] {
        const selectionsForOthers = { ...this.selections };
        delete selectionsForOthers[attributeName];

        const compatibleVariations = this.variations.filter((v) =>
            VariationDataResolver.variationMatchesAttributes(v, selectionsForOthers)
        );

        const options = new Map<string, AttributeTermDetails>();
        for (const variation of compatibleVariations) {
            const term = VariationDataResolver.getAttributeTermForVariation(
                variation,
                attributeName,
                this.product.attributes
            );
            if (term && !options.has(term.slug)) {
                options.set(term.slug, term);
            }
        }
        return Array.from(options.values());
    }

    getSelectedOption(attributeName: string): string | null {
        return this.selections[attributeName] || null;
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
                attributeNames.add(attr.name);
            });
        });
        return attributeNames.size;
    }
}
