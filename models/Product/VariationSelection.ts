import { ProductVariation } from './ProductVariation';

export class VariationSelection {
    private selections: { [key: string]: string };

    constructor(selections: { [key: string]: string }) {
        this.selections = selections;
    }

    getCompatibleVariations(allVariations: ProductVariation[]): ProductVariation[] {
        return allVariations.filter((variation) => variation.matchesAttributes(this.selections));
    }

    forAttribute(attributeName: string): VariationSelection {
        const newSelections = { ...this.selections };
        delete newSelections[attributeName];
        return new VariationSelection(newSelections);
    }
}
