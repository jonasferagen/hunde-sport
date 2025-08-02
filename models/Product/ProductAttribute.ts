
export interface ProductAttributeTerm {
  id: number;
  name: string;
  slug: string;
  default: boolean;
}

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
  terms: ProductAttributeTerm[];
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
    this.terms = data.terms;
    this.options = data.options;
    this.variation = data.variation;
    this.visible = data.visible;
    this.position = data.position;
    this.slug = data.slug;
  }

  get label(): string {
    return this.name;
  }
}
