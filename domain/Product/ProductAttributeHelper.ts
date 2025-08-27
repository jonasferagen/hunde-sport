// VariableProductOptions.ts (leaned)

import {
  TermOption,
  TermOptionGroup,
  TermSelection,
} from "@/stores/useProductVariationStore";
import {
  ProductAttribute,
  ProductAttributeTaxonomy as Taxonomy,
  ProductAttributeTerm as Term,
} from "@/types";

import { VariableProduct } from "./VariableProduct";

const norm = (s: string) =>
  String(s ?? "")
    .trim()
    .toLowerCase();
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

type VariationAny = {
  id: number;
  attributes: { name: string; value?: string; option?: string }[];
};

export class ProductAttributeHelper {
  static create(product: VariableProduct): TermOption[] {
    const attributes: ProductAttribute[] = product.attributes ?? [];
    const variations: VariationAny[] = (product.variations ??
      []) as VariationAny[];

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
        const raw = (attr as any).value ?? (attr as any).option ?? "";
        const slug = norm(raw);
        if (!taxonomy || !slug) continue;

        variationByAttr[taxonomy] ??= {};
        (variationByAttr[taxonomy][slug] ??= []).push(v.id);
      }
    }

    const out: TermOption[] = [];
    for (const [taxonomyName, attr] of Object.entries(taxonomyToAttribute)) {
      if (!attr.has_variations) continue;

      const taxonomy: Taxonomy = {
        name: taxonomyName,
        label: cap(attr.name),
      };
      for (const t of attr.terms ?? []) {
        const slug = norm(t.slug);
        out.push({
          term: { taxonomy, slug, label: cap(t.name) },
          variationIds: variationByAttr[taxonomyName]?.[slug] ?? [],
          enabled: true,
        });
      }
    }
    return out;
  }

  static groupByTaxonomy(options: TermOption[]): TermOptionGroup[] {
    const map = new Map<string, TermOptionGroup>();
    for (const o of options) {
      const key = o.term.taxonomy.name;
      let g = map.get(key);
      if (!g) {
        g = { taxonomy: o.term.taxonomy, options: [] };
        map.set(key, g);
      }
      g.options.push(o);
    }
    return [...map.values()];
  }

  // ----- shared internals -----
  private static intersectIds(sets: Set<number>[]): Set<number> {
    if (!sets.length) return new Set();
    return sets.slice(1).reduce((acc, s) => {
      const out = new Set<number>();
      acc.forEach((id) => {
        if (s.has(id)) out.add(id);
      });
      return out;
    }, new Set(sets[0]));
  }

  private static selectedSets(
    options: TermOption[],
    selection: TermSelection
  ): Set<number>[] {
    const selected = Array.from(selection.values()).filter(
      (t): t is Term => t !== null
    );

    return selected.map((term) => {
      const opt = options.find(
        (o) =>
          o.term.taxonomy.name === term.taxonomy.name &&
          o.term.slug === term.slug
      );

      return opt ? new Set(opt.variationIds) : new Set<number>();
    });
  }

  /** Apply enabled flags based on selection rules. */
  static withEnabled(
    options: TermOption[],
    selection: TermSelection
  ): TermOption[] {
    const sets = this.selectedSets(options, selection);
    if (sets.length === 0) {
      return options.map((o) => ({
        ...o,
        enabled: (o.variationIds?.length ?? 0) > 0,
      }));
    }

    const matching = this.intersectIds(sets);
    if (matching.size === 0) {
      // up to you: throw or simply disable all. Keeping previous behavior:
      throw new Error("No options matched the provided selection.");
    }

    if (sets.length === 1) {
      const selectedTax = Array.from(selection.values()).find(Boolean)!.taxonomy
        .name;
      return options.map((o) => ({
        ...o,
        enabled:
          o.term.taxonomy.name === selectedTax
            ? true
            : o.variationIds.some((id) => matching.has(id)),
      }));
    }

    // 2+ terms
    return options.map((o) => ({
      ...o,
      enabled: o.variationIds.some((id) => matching.has(id)),
    }));
  }

  /** Unique variation id implied by selection, or undefined. */
  static resolveSelectedVariationId(
    options: TermOption[],
    selection: TermSelection
  ): number | undefined {
    const sets = this.selectedSets(options, selection);

    if (!sets.length || sets.some((s) => s.size === 0)) return undefined;

    const matching = this.intersectIds(sets);
    if (matching.size !== 1) return undefined;

    return matching.values().next().value as number;
  }
}
