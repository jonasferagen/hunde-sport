import { BaseProduct, BaseProductData } from './BaseProduct';
import { ProductAttribute, ProductAttributeData } from './ProductAttribute';
import { ApiVariationAttribute, AttributeSelectionTuple, ProductVariation } from './ProductVariation';
import { VariationSelection } from './VariationSelection';

export interface VariableProductData extends BaseProductData {
    attributes: ProductAttributeData[];
    variations: { id: number; attributes: ApiVariationAttribute[] }[];
}

export class VariableProduct extends BaseProduct<VariableProductData> {

    variations: { id: number; attributes: ApiVariationAttribute[] }[] = [];
    private variationsData: ProductVariation[] = [];
    public attributes: ProductAttribute[] = [];
    public areVariationsLoading = true;

    constructor(data: VariableProductData) {
        if (data.type !== 'variable') {
            throw new Error('Cannot construct VariableProduct with type other than "variable".');
        }
        super(data);
        this.attributes = data.attributes.map((attr) => new ProductAttribute(attr));
        this.variations = data.variations;
    }

    hasVariations(): boolean {
        return this.variations.length > 0;
    }

    getVariationsData(): ProductVariation[] {
        return this.variationsData;
    }

    setVariationsData(incomingVariations: ProductVariation[]) {
        const variationRefMap = new Map<number, ApiVariationAttribute[]>(this.variations.map((ref) => [ref.id, ref.attributes]));

        const processedVariations = incomingVariations.map((variation) => {
            const rawAttributes = variationRefMap.get(variation.id);

            if (rawAttributes) {
                variation.variation_attributes = rawAttributes
                    .map((rawAttr: ApiVariationAttribute): AttributeSelectionTuple | null => {
                        const parentAttribute = this.attributes.find((attr) => attr.name === rawAttr.name);
                        if (parentAttribute) {
                            return {
                                name: parentAttribute.taxonomy, // The correct taxonomy slug, e.g., 'pa_farge'
                                option: rawAttr.value, // The term slug, e.g., 'svart'
                            };
                        }
                        return null;
                    })
                    .filter((attr): attr is AttributeSelectionTuple => attr !== null);
            }
            return variation;
        });

        this.variationsData = processedVariations;
    }

    setVariationsLoading(isLoading: boolean) {
        this.areVariationsLoading = isLoading;
    }

    createSelectionManager(): VariationSelection {
        return new VariationSelection({}, this.variationsData, this.attributes);
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        if (this.areVariationsLoading) {
            return [];
        }
        return this.attributes.filter((attribute) => attribute.variation);
    }
}
