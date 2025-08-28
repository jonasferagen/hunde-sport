import { cleanHtml } from "@/lib/helpers";

import { BaseProduct, BaseProductData } from "../BaseProduct";
import {
  ProductAttributeTaxonomy,
  ProductAttributeTerm,
} from "../ProductAttribute";

export interface VariableProductData extends BaseProductData {
  attributes: any[];
  variations: any[];
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
// types you already have
type Taxonomy = ProductAttributeTaxonomy; // { name, label }
type Term = ProductAttributeTerm; // { taxonomy, slug, label, ... }
type Variation = {
  id: number;
  attributes: { name: string; value?: string; option?: string }[];
};

const norm = (s?: string) =>
  String(s ?? "")
    .trim()
    .toLowerCase();
const termKey = (tax: string, slug: string) => `${tax}::${slug}` as const;

export class VariableProduct extends BaseProduct {
  // existing raw data

  // you already added these:
  taxonomies: Map<string, Taxonomy>; // taxonomy name -> taxonomy
  terms: Map<string, Term[]>; // taxonomy name -> terms[]

  // new normalized indexes:
  /** variation id -> variation (or slim subset) */
  variationById: Map<number, Variation>;
  /** `${taxonomy}::${slug}` -> Set of variation ids that contain that term */
  termKeyToVariationIds: Map<string, Set<number>>;
  /** attr.name (norm) -> taxonomy name */
  nameToTaxonomy: Map<string, string>;

  attributes = [];
  variations = [];

  constructor(data: VariableProductData) {
    super(data);
    if (data.type !== "variable") throw new Error("Invalid data type");

    // taxonomies + terms (you already do this; now also attach taxonomy object on each term)
    const vAttr = data.attributes.filter((a) => a.has_variations);
    this.taxonomies = new Map();
    this.terms = new Map();
    for (const a of vAttr) {
      const taxonomy: Taxonomy = {
        name: a.taxonomy,
        label: cap(cleanHtml(a.name)),
      };
      this.taxonomies.set(a.taxonomy, taxonomy);
      const termList: Term[] = (a.terms ?? []).map((t: any) => ({
        taxonomy,
        slug: norm(t.slug),
        label: cap(cleanHtml(t.name)),
        // keep raw if you like: name: t.name
      }));
      this.terms.set(a.taxonomy, termList);
    }

    // name -> taxonomy (Woo quirk)
    this.nameToTaxonomy = new Map();
    for (const a of this.attributes) {
      this.nameToTaxonomy.set(norm(a.name), a.taxonomy);
    }

    // Build variation index + term index
    this.variationById = new Map();
    this.termKeyToVariationIds = new Map();

    for (const v of this.variations) {
      this.variationById.set(v.id, v);

      for (const attr of v.attributes ?? []) {
        const tax = this.nameToTaxonomy.get(norm(attr.name)) ?? norm(attr.name);
        const slug = norm((attr as any).value ?? (attr as any).option ?? "");
        if (!tax || !slug) continue;

        const key = termKey(tax, slug);
        if (!this.termKeyToVariationIds.has(key))
          this.termKeyToVariationIds.set(key, new Set());
        this.termKeyToVariationIds.get(key)!.add(v.id);
      }
    }
  }
}
