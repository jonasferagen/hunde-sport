import { ProductVariation, VariableProduct } from '../Product';
import { AttributeTermDetails } from '../ProductAttribute';
import { VariationDataResolver } from './VariationDataResolver';

// The clean, canonical representation of a variation's attribute selection.
export type AttributeSelectionTuple = {
    name: string; // The attribute taxonomy slug, e.g., "pa_farge"
    value: string; // The selected term slug, e.g., "red"
};

export class VariationSelection {
    private constructor(
        private readonly resolver: VariationDataResolver,
        private readonly variations: ProductVariation[],
        public readonly selections: Record<string, string> = {}
    ) { }

    static create(product: VariableProduct, variations: ProductVariation[]): VariationSelection {
        const resolver = new VariationDataResolver(product);
        return new VariationSelection(resolver, variations || [], {});
    }

    select(taxonomy: string, slug: string | null): VariationSelection {
        const newSelections = { ...this.selections };
        if (slug) {
            newSelections[taxonomy] = slug;
        } else {
            delete newSelections[taxonomy];
        }
        return new VariationSelection(this.resolver, this.variations, newSelections);
    }

    getAvailableOptions(taxonomy: string): AttributeTermDetails[] {
        const selectionsForOthers = { ...this.selections };
        delete selectionsForOthers[taxonomy];

        const compatibleVariations = this.variations.filter((v) =>
            this.resolver.variationMatchesAttributes(v, selectionsForOthers)
        );

        const options = new Map<string, AttributeTermDetails>();
        for (const variation of compatibleVariations) {
            const term = this.resolver.getAttributeTermForVariation(variation, taxonomy);
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

        const matches = this.variations.filter((v) => this.resolver.variationMatchesAttributes(v, this.selections));
        return matches.length === 1 ? matches[0] : undefined;
    }

    private getRequiredAttributeCount(): number {
        const attributeTaxonomies = new Set<string>();
        this.variations.forEach(v => {
            this.resolver.getAttributesForVariation(v.id).forEach(attr => {
                attributeTaxonomies.add(attr.name);
            });
        });
        return attributeTaxonomies.size;
    }
}
