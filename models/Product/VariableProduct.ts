import { Product, ProductData } from "./Product";
import { ProductVariation } from "./ProductVariation";

export class VariableProduct extends Product {

    private variationsData: ProductVariation[] = [];

    constructor(data: ProductData) {
        if (data.type !== 'variable') {
            throw new Error('Cannot construct VariableProduct with type other than "variable".');
        }
        super(data);
    }

    hasVariations(): boolean {
        return true;
    }

    setVariationsData(variations: ProductVariation[]) {
        this.variationsData = variations.map((variation) => {
            const originalVariationRef = this.variations.find((ref) => ref.id === variation.id);
            if (originalVariationRef) {
                variation.variation_attributes = originalVariationRef.attributes;
            }
            return variation;
        });
    }

}
