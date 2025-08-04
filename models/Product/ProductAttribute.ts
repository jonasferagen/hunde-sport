import { formatPrice } from '@/utils/helpers';
import { ProductVariation } from './ProductVariation';

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

export interface AttributeTermDetails extends ProductAttributeTerm {
  isAvailable: boolean;
  displayPrice: string;
  inStock: boolean;
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

  getOptionsDetails(compatibleVariations: ProductVariation[]): AttributeTermDetails[] {
    return this.terms.map((term: ProductAttributeTerm) => {
      const potentialMatches = compatibleVariations.filter((variation: ProductVariation) =>
        variation.hasAttribute(this.taxonomy, term.slug)
      );

      const isAvailable = potentialMatches.length > 0;

      if (!isAvailable) {
        return { ...term, isAvailable: false, displayPrice: '', inStock: false };
      }

      const prices = potentialMatches.map((v) => Number(v.prices.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const displayPrice = minPrice === maxPrice
        ? formatPrice(minPrice.toString())
        : `Fra ${formatPrice(minPrice.toString())}`;

      const inStock = potentialMatches.some((v) => v.isInStock);

      return { ...term, isAvailable, displayPrice, inStock };
    });
  }
}

export interface ProductAttributeTermData {
  id: number;
  name: string;
  slug: string;
  default?: boolean;
}

export class ProductAttributeTerm {
  id: number;
  name: string;
  slug: string;
  isDefault: boolean;

  constructor(data: ProductAttributeTermData) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.isDefault = data.default || false;
  }
}
