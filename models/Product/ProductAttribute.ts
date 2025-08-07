export interface ProductAttributeData {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: ProductAttributeTermData[];
}

export interface AttributeTermDetails extends ProductAttributeTerm {
  isPurchasable: boolean;
  displayPrice: string;
  inStock: boolean;
}

export class ProductAttribute {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: ProductAttributeTerm[];

  constructor(data: ProductAttributeData) {
    this.id = data.id;
    this.name = data.name;
    this.taxonomy = data.taxonomy;
    this.has_variations = data.has_variations;
    this.terms = data.terms.map((termData) => new ProductAttributeTerm(termData));
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
  default?: boolean;

  constructor(data: ProductAttributeTermData) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.default = data.default;
  }
}
