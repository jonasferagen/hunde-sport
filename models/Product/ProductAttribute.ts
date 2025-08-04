import { ProductAttributeTerm, ProductAttributeTermData } from './ProductAttributeTerm';


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

  withAvailableTerms(allVariationAttributes: { name: string; value: string }[]): ProductAttribute {
    const availableTerms = this.terms.filter((term) =>
      allVariationAttributes.some(
        (varAttr) => varAttr.name === this.name && varAttr.value === term.slug
      )
    );

    const newAttributeData: ProductAttributeData = {
      ...this,
      terms: availableTerms.map((term: ProductAttributeTerm) => ({ ...term, default: term.isDefault })),
    };

    return new ProductAttribute(newAttributeData);
  }
}
