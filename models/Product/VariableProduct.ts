import { Product, ProductData } from "./Product";
import { ProductAttribute } from "./ProductAttribute";
import { ApiVariationAttribute, AttributeSelectionTuple, ProductVariation } from "./ProductVariation";
import { VariationSelection } from "./VariationSelection";

export interface VariableProductData extends ProductData {
    variations: { id: number; attributes: ApiVariationAttribute[] }[];
}

export class VariableProduct extends Product {

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

    getDefaultVariation(): ProductVariation | undefined {
        if (this.areVariationsLoading) {
            return undefined;
        }

        const defaultAttributes: { [key: string]: string } = {};

        this.attributes.forEach((attribute) => {
            if (attribute.variation) {
                const defaultTerm = attribute.terms.find((term: ProductAttributeTerm) => term.isDefault);
                if (defaultTerm) {
                    defaultAttributes[attribute.name] = defaultTerm.slug;
                }
            }
        });


        if (Object.keys(defaultAttributes).length > 0) {
            return this.variationsData.find((variation: ProductVariation) =>
                variation.matchesAttributes(defaultAttributes)
            );
        }

        return undefined;
    }

    findVariations(selections: AttributeSelectionTuple[]): ProductVariation[] {
        if (this.areVariationsLoading || this.variationsData.length === 0) {
            return [];
        }

        return this.variationsData.filter((variation: ProductVariation) => {
            return selections.every((selection: AttributeSelectionTuple) =>
                variation.variation_attributes.some(
                    (variationAttr: AttributeSelectionTuple) =>
                        variationAttr.name === selection.name && variationAttr.option === selection.option
                )
            );
        });
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        if (this.areVariationsLoading) {
            return [];
        }
        return this.attributes.filter((attribute) => attribute.variation);
    }

    getAttributeOptions(attributeTaxonomy: string, selection: VariationSelection) {
        if (this.areVariationsLoading) {
            return [];
        }

        const selectionForOthers = selection.forAttribute(attributeTaxonomy);
        const compatibleVariations = selectionForOthers.getCompatibleVariations(this.variationsData);
        const attribute = this.attributes.find((attribute: ProductAttribute) => attribute.taxonomy === attributeTaxonomy);
        if (!attribute) {
            return [];
        }

        return attribute.getOptionsDetails(compatibleVariations);
    }
}
