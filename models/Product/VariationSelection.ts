import { AttributeTermDetails, ProductAttribute } from './ProductAttribute';
import { ProductVariation } from './ProductVariation';

export class VariationSelection {
    constructor(
        public readonly selections: Record<string, string>,
        private readonly variations: ProductVariation[],
        private readonly attributes: ProductAttribute[]
    ) { }

    select(taxonomy: string, slug: string | null): VariationSelection {
        const newSelections = { ...this.selections };
        if (slug) {
            newSelections[taxonomy] = slug;
        } else {
            delete newSelections[taxonomy];
        }
        return new VariationSelection(newSelections, this.variations, this.attributes);
    }

    getAvailableOptions(taxonomy: string): AttributeTermDetails[] {
        const attribute = this.attributes.find((attr) => attr.taxonomy === taxonomy);
        if (!attribute) return [];

        const selectionsForOthers = { ...this.selections };
        delete selectionsForOthers[taxonomy];

        const compatibleVariations = this.variations.filter((v) => v.matchesAttributes(selectionsForOthers));

        return attribute.getOptionsDetails(compatibleVariations);
    }

    getSelectedVariation(): ProductVariation | undefined {
        const requiredAttributeCount = this.attributes.filter((attr) => attr.variation).length;
        if (Object.keys(this.selections).length < requiredAttributeCount) {
            return undefined;
        }

        const matches = this.variations.filter((v) => v.matchesAttributes(this.selections));
        return matches.length === 1 ? matches[0] : undefined;
    }
}
