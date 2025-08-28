export type ProductAttribute = {
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
