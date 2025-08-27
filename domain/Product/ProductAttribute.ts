import { cleanHtml } from "@/lib/helpers";

export interface _ProductAttributeData {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: _ProductAttributeTermData[];
}

export class ProductAttribute {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: _ProductAttributeTerm[];

  constructor(data: _ProductAttributeData) {
    this.id = data.id;
    this.name = cleanHtml(data.name);
    this.taxonomy = data.taxonomy;
    this.has_variations = data.has_variations;
    this.terms = data.terms.map(
      (termData) => new _ProductAttributeTerm(termData)
    );
  }
}

export interface _ProductAttributeTermData {
  id: number;
  name: string;
  slug: string;
  default?: boolean;
}

export class _ProductAttributeTerm {
  id: number;
  name: string;
  slug: string;
  default?: boolean;

  constructor(data: _ProductAttributeTermData) {
    this.id = data.id;
    this.name = cleanHtml(data.name);
    this.slug = data.slug;
    this.default = data.default;
  }
}

export type _ProductAttribute = {
  name: string;
  taxonomy: ProductAttributeTaxonomy;
  has_variations: boolean;
  terms: ProductAttributeTerm[];
};

export type ProductAttributeTaxonomy = { name: string; label: string };
export type ProductAttributeTerm = {
  taxonomy: ProductAttributeTaxonomy;
  slug: string;
  label: string;
  default?: boolean;
};
