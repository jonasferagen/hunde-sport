import { AttributeTermDetails } from './ProductAttribute';
import { ProductVariation } from './ProductVariation';

export class VariationSelection {
    constructor(
        private readonly variations: ProductVariation[],
        public readonly selections: Record<string, string> = {}
    ) { }

    select(taxonomy: string, slug: string | null): VariationSelection {
        const newSelections = { ...this.selections };
        if (slug) {
            newSelections[taxonomy] = slug;
        } else {
            delete newSelections[taxonomy];
        }
        return new VariationSelection(this.variations, newSelections);
    }

    getAvailableOptions(taxonomy: string): AttributeTermDetails[] {
        const selectionsForOthers = { ...this.selections };
        delete selectionsForOthers[taxonomy];

        const compatibleVariations = this.variations.filter((v) => v.matchesAttributes(selectionsForOthers));

        const options = new Map<string, AttributeTermDetails>();
        for (const variation of compatibleVariations) {
            const term = variation.getAttributeTerm(taxonomy);
            if (term && !options.has(term.slug)) {
                options.set(term.slug, term);
            }
        }
        return Array.from(options.values());
    }

    getSelectedOption(taxonomy: string): string | null {
        return this.selections[taxonomy] || null;
    }

    getSelectedVariation(): ProductVariation | undefined {
        const requiredAttributeCount = this.getRequiredAttributeCount();
        if (Object.keys(this.selections).length < requiredAttributeCount) {
            return undefined;
        }

        const matches = this.variations.filter((v) => v.matchesAttributes(this.selections));
        return matches.length === 1 ? matches[0] : undefined;
    }

    private getRequiredAttributeCount(): number {
        const attributeTaxonomies = new Set<string>();
        this.variations.forEach(v => {
            v.variation_attributes.forEach(attr => {
                attributeTaxonomies.add(attr.name);
            });
        });
        return attributeTaxonomies.size;
    }
}
