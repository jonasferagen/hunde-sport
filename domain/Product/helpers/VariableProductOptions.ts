// lib/VariableProductOptions.ts
import { ProductAttribute, ProductAttributeTerm } from '@/domain/Product/ProductAttribute';
import type { VariableProduct } from '@/domain/Product/VariableProduct';

const norm = (s: string) => String(s ?? '').trim().toLowerCase();

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);


export type Term = {
  attributeLabel: string; // e.g. "Størrelse"
  taxonomy: string;       // e.g. "pa_storrelse"
  slug: string;           // e.g. "xl"
  label: string;          // e.g. "XL"
};

export type Linked = {
  variationId: number;
  term: Term | null; // "other" term only
};

export type Option = {
  term: Term;
  linked: Linked[];
};

export type OptionGroup = {
  taxonomy: string; // e.g., "pa_storrelse"
  label: string;    // capitalized, e.g. "Størrelse"
  options: Option[];
};

type VariationAny = {
  id: number;
  attributes: Array<{ name: string; value?: string; option?: string }>;
};

export class VariableProductOptions {
  private attributeMap: Record<string, ProductAttributeTerm[]> = {};
  private variationByAttribute: Record<string, Record<string, number[]>> = {};
  private variationIdToTerms: Record<number, Term[]> = {};
  private taxonomyToAttribute: Record<string, ProductAttribute> = {};
  private nameToTaxonomy: Record<string, string> = {};

  constructor(private product: VariableProduct) {
    this.buildIndex();
  }

  private buildIndex() {
    const attributes: ProductAttribute[] = this.product.attributes ?? [];
    const variations: VariationAny[] = (this.product.variations ?? []) as VariationAny[];

    this.attributeMap = attributes
      .filter(a => a.has_variations)
      .reduce<Record<string, ProductAttributeTerm[]>>((acc, a) => {
        acc[a.taxonomy] = a.terms;
        return acc;
      }, {});

    for (const a of attributes) {
      this.taxonomyToAttribute[a.taxonomy] = a;
      this.nameToTaxonomy[norm(a.name)] = a.taxonomy;
    }

    for (const v of variations) {
      const termsForThisVariation: Term[] = [];

      for (const attr of v.attributes ?? []) {
        const taxonomy = this.nameToTaxonomy[norm(attr.name)] ?? norm(attr.name);
        const raw = attr.value ?? attr.option ?? '';
        const slug = norm(raw);
        if (!taxonomy || !slug) continue;

        if (!this.variationByAttribute[taxonomy]) this.variationByAttribute[taxonomy] = {};
        if (!this.variationByAttribute[taxonomy][slug]) this.variationByAttribute[taxonomy][slug] = [];
        this.variationByAttribute[taxonomy][slug].push(v.id);

        // fallback label from raw if we don’t know better
        const attribute = this.taxonomyToAttribute[taxonomy];
        const attributeLabel = attribute ? capitalize(attribute.name) : taxonomy;

        termsForThisVariation.push({
          attributeLabel,
          taxonomy,
          slug,
          label: raw,
        });
      }

      this.variationIdToTerms[v.id] = termsForThisVariation;
    }
  }

  getOptionGroups(): OptionGroup[] {
    const groups: OptionGroup[] = [];

    for (const taxonomy of Object.keys(this.attributeMap)) {
      const attribute = this.taxonomyToAttribute[taxonomy];
      if (!attribute) continue;

      const attributeLabel = capitalize(attribute.name);

      const options: Option[] = (this.attributeMap[taxonomy] ?? []).map(termData => {
        const slug = norm(termData.slug);
        const variationIds = this.variationByAttribute[taxonomy]?.[slug] ?? [];

        const linked: Linked[] = variationIds.map(variationId => {
          const allTerms = this.variationIdToTerms[variationId] ?? [];
          const other = allTerms.find(t => t.taxonomy !== taxonomy) ?? null;
          return { variationId, term: other };
        });

        const term: Term = {
          attributeLabel,
          taxonomy,
          slug,
          label: capitalize(termData.name),
        };

        return { term, linked };
      });

      groups.push({
        taxonomy,
        label: attributeLabel,
        options,
      });
    }

    return groups;
  }

  get debug() {
    return {
      attributeMap: this.attributeMap,
      variationByAttribute: this.variationByAttribute,
      variationIdToTerms: this.variationIdToTerms,
    };
  }
}

