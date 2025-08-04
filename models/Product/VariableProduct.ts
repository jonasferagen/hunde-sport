import { Product, ProductData } from "./Product";
import { ProductAttribute } from "./ProductAttribute";
import { ProductAttributeTerm } from "./ProductAttributeTerm";
import { AttributeSelectionTuple, ProductVariation } from "./ProductVariation";
import { VariationSelection } from "./VariationSelection";

export class VariableProduct extends Product {

    private variationsData: ProductVariation[] = [];
    public attributes: ProductAttribute[] = [];

    constructor(data: ProductData) {
        if (data.type !== 'variable') {
            throw new Error('Cannot construct VariableProduct with type other than "variable".');
        }
        super(data);
        this.attributes = data.attributes.map((attr) => new ProductAttribute(attr));
    }

    hasVariations(): boolean {
        return true;
    }

    getVariationsData(): ProductVariation[] {
        return this.variationsData;
    }


    setVariationsData(incomingVariations: ProductVariation[]) {
        const variationRefMap = new Map(this.variations.map((ref: any) => [ref.id, ref.attributes]));
        const processedVariations = incomingVariations.map((variation) => {
            const attributes = variationRefMap.get(variation.id);
            if (attributes) {
                variation.variation_attributes = attributes;
            }
            return variation;
        });
        this.variationsData = processedVariations;
    }


    getDefaultVariation(): ProductVariation | undefined {
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
        if (selections.length === 0) {
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
        const variationAttributes = this.attributes.filter((attribute: ProductAttribute) => attribute.variation);
        const allVariationRefAttributes = this.variationsData.flatMap((v: ProductVariation) => v.variation_attributes);

        return variationAttributes
            .map((attribute: ProductAttribute) => attribute.withAvailableTerms(allVariationRefAttributes))
            .filter((attribute: ProductAttribute) => attribute.terms.length > 0);
    }

    getAttributeOptions(attributeName: string, selection: VariationSelection) {
        const selectionForOthers = selection.forAttribute(attributeName);
        const compatibleVariations = selectionForOthers.getCompatibleVariations(this.variationsData);

        const attribute = this.attributes.find((attribute: ProductAttribute) => attribute.name === attributeName);
        if (!attribute) {
            return [];
        }

        return attribute.getOptionsDetails(compatibleVariations);
    }
}
