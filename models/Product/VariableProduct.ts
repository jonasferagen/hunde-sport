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


    constructor(data: VariableProductData) {
        if (data.type !== 'variable') {
            throw new Error('Cannot construct VariableProduct with type other than "variable".');
        }
        super(data);
        this.attributes = data.attributes.map((attr) => new ProductAttribute(attr));
        this.variations = data.variations;
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


    createSelectionManager(): VariationSelection {
        return new VariationSelection({}, this.variationsData, this.attributes);
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        return this.attributes.filter((attribute) => attribute.variation);
    }

    private selectedProductVariation: ProductVariation | undefined;

    setSelectedVariation(variation: ProductVariation | undefined) {
        this.selectedProductVariation = variation;
    }

    get productVariation(): ProductVariation | undefined {
        return this.selectedProductVariation;
    }

    public clone(): VariableProduct {
        const newProduct = new VariableProduct(this);
        newProduct.setSelectedVariation(this.productVariation);
        newProduct.variationsData = this.variationsData;
        return newProduct;
    }

    canPurchase(): { canPurchase: boolean; reason: string | undefined } {
        if (!this.productVariation) {
            return { canPurchase: false, reason: "Velg en variant" };
        }
        return this.productVariation.canPurchase();
    }
}


