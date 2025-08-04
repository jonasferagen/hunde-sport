import { Product, ProductData } from "./Product";
import { ProductAttribute } from "./ProductAttribute";
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

    getVariations(): ProductVariation[] {
        return this.variationsData;
    }

    getDefaultVariation(): ProductVariation | undefined {
        const defaultAttributes: { [key: string]: string } = {};

        this.attributes.forEach((attribute) => {
            if (attribute.variation) {
                const defaultTerm = attribute.terms.find((term: any) => term.default);
                if (defaultTerm) {
                    defaultAttributes[attribute.name] = defaultTerm.slug;
                }
            }
        });

        if (Object.keys(defaultAttributes).length > 0) {
            return this.variationsData.find((variation) =>
                variation.matchesAttributes(defaultAttributes)
            );
        }

        return undefined;
    }

    findVariations(attributes: ProductAttribute[]): ProductVariation[] {
        if (attributes.length === 0) {
            return [];
        }

        const filteredVariationReferences = this.variations.filter((variation) => {
            if (variation.attributes.length !== attributes.length) {
                return false;
            }

            return attributes.every((selectedAttr) =>
                variation.attributes.some(
                    (variationAttr: any) =>
                        variationAttr.name === selectedAttr.name && variationAttr.value === selectedAttr.option
                )
            );
        });

        const foundIds = new Set(filteredVariationReferences.map((v) => v.id));
        return this.variationsData.filter((v) => foundIds.has(v.id));
    }
}
