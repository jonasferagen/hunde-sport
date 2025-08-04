import { formatPrice } from "@/utils/helpers";
import { Product, ProductData } from "./Product";
import { ProductAttribute } from "./ProductAttribute";
import { ProductAttributeTerm } from "./ProductAttributeTerm";
import { ProductVariation } from "./ProductVariation";

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

            return attributes.every((selectedAttr: ProductAttribute) =>
                variation.attributes.some(
                    (variationAttr: any) => {

                        console.warn(typeof variationAttr);

                        return variationAttr.name === selectedAttr.name && variationAttr.value === selectedAttr.option;
                    }
                )
            );
        });

        const foundIds = new Set(filteredVariationReferences.map((v) => v.id));
        return this.variationsData.filter((v) => foundIds.has(v.id));
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        const variationAttributes = this.attributes.filter((attribute) => attribute.variation);
        const allVariationRefAttributes = this.variations.flatMap((v: any) => v.attributes);

        return variationAttributes
            .map((attribute) => attribute.withAvailableTerms(allVariationRefAttributes))
            .filter((attribute) => attribute.terms.length > 0);
    }

    getAttributeOptions(attributeName: string, selectedOptions: { [key: string]: string }) {
        const otherSelectedOptions = { ...selectedOptions };
        delete otherSelectedOptions[attributeName];

        const otherAttributes = Object.entries(otherSelectedOptions).map(
            ([name, option]) => { console.log(option, '---'); return new ProductAttribute({ id: 0, name, option }) }
        );

        //   console.log('---', option, '---');

        const compatibleVariations = this.variationsData.filter((variation) =>
            variation.matchesAttributes(otherAttributes)
        );

        const attribute = this.attributes.find((attr) => attr.name === attributeName);
        if (!attribute) {
            return [];
        }

        return attribute.terms.map((term: ProductAttributeTerm) => {
            const potentialMatches = compatibleVariations.filter((variation) =>
                variation.hasAttribute(attributeName, term.slug)
            );

            const isAvailable = potentialMatches.length > 0;
            let displayPrice = '';
            let inStock = false;

            if (isAvailable) {
                const prices = potentialMatches.map((v) => Number(v.prices.price));
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                displayPrice =
                    minPrice === maxPrice
                        ? formatPrice(minPrice.toString())
                        : `Fra ${formatPrice(minPrice.toString())}`;

                inStock = potentialMatches.some((v) => v.is_in_stock);
            }

            return { ...term, isAvailable, displayPrice, inStock };
        });
    }
}
