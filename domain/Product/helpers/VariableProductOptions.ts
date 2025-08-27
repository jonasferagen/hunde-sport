// lib/VariableProductOptions.ts
import { TermSelection } from '@/components/features/product/product-variation/ProductVariationSelect';
import { ProductAttribute } from '@/domain/Product/ProductAttribute';
import type { VariableProduct } from '@/domain/Product/VariableProduct';
import type { ProductPriceRange } from '@/types';

const norm = (s: string) => String(s ?? '').trim().toLowerCase();
const cap  = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export type Taxonomy = {
  name: string;   // e.g. "pa_storrelse"
  label: string;  // e.g. "Størrelse"
};

export type Term = Readonly<{
  taxonomy: Taxonomy;
  slug: string;
  label: string;
}>;

export type SelectOption = {
  variationIds: number[];
  term: Term;
  productPriceRange?: ProductPriceRange; // (computed in component)
  enabled?: boolean; // <-- new
};

type VariationAny = {
  id: number;
  attributes: Array<{ name: string; value?: string; option?: string }>;
};

export class VariableProductOptions {
  constructor() {}

  static create(product: VariableProduct): SelectOption[] {
    const attributes: ProductAttribute[] = product.attributes ?? [];
    const variations: VariationAny[] = (product.variations ?? []) as VariationAny[];

    const nameToTaxonomy: Record<string, string> = {};
    const taxonomyToAttribute: Record<string, ProductAttribute> = {};
    const variationByAttr: Record<string, Record<string, number[]>> = {};

    for (const a of attributes) {
      nameToTaxonomy[norm(a.name)] = a.taxonomy;
      taxonomyToAttribute[a.taxonomy] = a;
    }

    for (const v of variations) {
      for (const attr of v.attributes ?? []) {
        const taxonomy = nameToTaxonomy[norm(attr.name)] ?? norm(attr.name);
        const raw = (attr as any).value ?? (attr as any).option ?? '';
        const slug = norm(raw);
        if (!taxonomy || !slug) continue;

        variationByAttr[taxonomy] ??= {};
        variationByAttr[taxonomy][slug] ??= [];
        variationByAttr[taxonomy][slug].push(v.id);
      }
    }

    const out: SelectOption[] = [];
    for (const [taxonomyName, attr] of Object.entries(taxonomyToAttribute)) {
      if (!attr.has_variations) continue;

      const taxonomy: Taxonomy = { name: taxonomyName, label: cap(attr.name) };

      for (const t of attr.terms ?? []) {
        const slug = norm(t.slug);
        const variationIds = variationByAttr[taxonomyName]?.[slug] ?? [];
        out.push({
          term: { taxonomy, slug, label: cap(t.name) },
          variationIds,
          enabled: true, // default; will be recomputed
        });
      }
    }
    return out;
  }

  static group(options: SelectOption[]) {
    const taxonomies = options.map(opt => opt.term.taxonomy);
    const uniqueTaxonomies = Array.from(new Set(taxonomies));
    return uniqueTaxonomies.map(taxonomy => ({
      taxonomy,
      options: options.filter(opt => opt.term.taxonomy === taxonomy),
    }));
  }

  // --- Enabled recompute (single source of truth) ---
  private static intersectIds(sets: Array<Set<number>>): Set<number> {
    if (sets.length === 0) return new Set<number>();
    let acc = sets[0];
    for (let i = 1; i < sets.length; i++) {
      acc = new Set([...acc].filter(id => sets[i].has(id)));
    }
    return acc;
  }

  /** Returns a new array where each option has `enabled` set based on the selection.
   * Rules:
   * - 0 terms: all options enabled (with any variations).
   * - 1 term: all options in the selected taxonomy enabled; other taxonomy only those compatible.
   * - 2 terms: only options compatible with the intersection enabled (both taxonomies).
   * Throws if a non-empty selection yields no matching variations.
   */
  static withEnabled(options: SelectOption[], selection: TermSelection): SelectOption[] {
    const selected = Array.from(selection.values()).filter((t): t is Term => t !== null);

    // 0 terms: enable everything that participates in any variation
    if (selected.length === 0) {
      return options.map(o => ({ ...o, enabled: (o.variationIds?.length ?? 0) > 0 }));
    }

    // Lookup selected options & collect their variation sets
    const findOpt = (term: Term) =>
      options.find(o =>
        o.term.taxonomy.name === term.taxonomy.name &&
        o.term.slug === term.slug
      );

    const selectedSets = selected.map(term => {
      const opt = findOpt(term);
      if (!opt) {
        throw new Error(`No options found for term: ${term.taxonomy.name}=${term.slug}`);
      }
      return new Set(opt.variationIds);
    });

    // Intersection across all selected terms
    const matchingIds = this.intersectIds(selectedSets);
    if (matchingIds.size === 0) {
      throw new Error('No options matched the provided selection.');
    }

    if (selected.length === 1) {
      const selectedTax = selected[0].taxonomy.name;
      return options.map(o => {
        const sameTax = o.term.taxonomy.name === selectedTax;
        const compatible = o.variationIds.some(id => matchingIds.has(id));
        return { ...o, enabled: sameTax ? true : compatible };
      });
    }

    // 2 terms (or more): enabled iff participates in the intersection
    return options.map(o => ({
      ...o,
      enabled: o.variationIds.some(id => matchingIds.has(id)),
    }));
  }

  // Returns the unique variation id implied by the current selection, or undefined
  static resolveSelectedVariationId(options: SelectOption[], selection: TermSelection): number | undefined {
    const selected = Array.from(selection.values()).filter((t): t is Term => t !== null);
    if (selected.length === 0) return undefined;

    const findOpt = (term: Term) =>
      options.find(o =>
        o.term.taxonomy.name === term.taxonomy.name &&
        o.term.slug === term.slug
      );

    const selectedSets = selected.map(term => {
      const opt = findOpt(term);
      return opt ? new Set(opt.variationIds) : new Set<number>();
    });

    if (selectedSets.some(s => s.size === 0)) return undefined;

    const matchingIds = this.intersectIds(selectedSets);
    if (matchingIds.size !== 1) return undefined;

    return [...matchingIds][0];
  }
}
