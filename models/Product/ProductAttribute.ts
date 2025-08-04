import { formatPrice } from '@/utils/helpers';
import { ProductAttributeTerm, ProductAttributeTermData } from './ProductAttributeTerm';
import { AttributeSelectionTuple, ProductVariation } from './ProductVariation';

export interface ProductAttributeData {
  id: number;
  name: string;
  slug: string;
  variation: boolean;
  options: string[];
  option?: string;
  position: number;
  visible: boolean;
  taxonomy: string;
  has_variations: boolean;
  terms: ProductAttributeTermData[];
}

export class ProductAttribute {
  id: number;
  name: string;
  slug: string;
  variation: boolean;
  options: string[];
  option?: string;
  position: number;
  visible: boolean;
  taxonomy: string;
  has_variations: boolean;
  terms: ProductAttributeTerm[];

  constructor(data: ProductAttributeData) {
    this.id = data.id;
    this.name = data.name;
    this.taxonomy = data.taxonomy;
    this.has_variations = data.has_variations;
    this.terms = data.terms.map((termData) => new ProductAttributeTerm(termData));
    this.options = data.options;
    this.variation = data.variation;
    this.visible = data.visible;
    this.position = data.position;
    this.slug = data.slug;
  }

  get label(): string {
    return this.name;
  }

  withAvailableTerms(allVariationAttributes: AttributeSelectionTuple[]): ProductAttribute {
    const availableTerms = this.terms.filter((term: ProductAttributeTerm) =>
      allVariationAttributes.some(
        (varAttr: AttributeSelectionTuple) => varAttr.name === this.taxonomy && varAttr.option === term.slug
      )
    );

    const newAttributeData: ProductAttributeData = {
      ...this,
      terms: availableTerms.map((term: ProductAttributeTerm) => ({ ...term, default: term.isDefault })),
    };

    return new ProductAttribute(newAttributeData);
  }

  getOptionsDetails(compatibleVariations: ProductVariation[]) {
    return this.terms.map((term: ProductAttributeTerm) => {
      const potentialMatches = compatibleVariations.filter((variation: ProductVariation) =>
        variation.hasAttribute(this.name, term.slug)
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
