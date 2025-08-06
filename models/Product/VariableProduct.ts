import { BaseProduct, BaseProductData } from './BaseProduct';
import { ProductAttribute } from './ProductAttribute';
import { ApiVariationAttribute, AttributeSelectionTuple, ProductVariation } from './ProductVariation';
import { VariationSelection } from './VariationSelection';

export interface VariableProductData extends BaseProductData {
    attributes: ProductAttribute[];
    variations: { id: number; attributes: ApiVariationAttribute[] }[];
}

export class VariableProduct extends BaseProduct<VariableProductData> {
    type: 'variable' = 'variable';
    variations: { id: number; attributes: ApiVariationAttribute[] }[] = [];
    private variationsData: ProductVariation[] = [];
    public attributes: ProductAttribute[] = [];

    constructor(data: VariableProductData) {
        if (data.type !== 'variable') {
            throw new Error('Invalid data type for VariableProduct');
        }
        super(data);
        this.attributes = data.attributes;
        this.variations = data.variations;
    }

    setVariationsData(variations: ProductVariation[]): void {
        const variationRefMap = new Map<number, ApiVariationAttribute[]>(this.variations.map((ref) => [ref.id, ref.attributes]));

        variations.forEach(variation => {
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
            variation.parentAttributes = this.attributes;
        });

        this.variationsData = variations;
    }

    getVariationsData(): ProductVariation[] {
        return this.variationsData;
    }

    createSelectionManager(): VariationSelection {
        if (this.variationsData.length === 0) {
            console.warn('Variation data is not loaded yet, but createSelectionManager was called.');
        }
        return new VariationSelection(this.variationsData);
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        return this.attributes.filter((attribute) => attribute.variation);
    }

    canPurchase(): { canPurchase: boolean; reason: string | undefined } {
        return { canPurchase: false, reason: 'Velg en variant' };
    }
}
