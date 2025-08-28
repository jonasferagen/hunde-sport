// ProductAttributeHelper.ts
import { TermOption, TermSelection } from "@/stores/useProductVariationStore";
import type { VariableProduct } from "@/types";
import {
  ProductAttribute,
  ProductAttributeTaxonomy as Taxonomy,
  ProductAttributeTerm as Term,
} from "@/types";

const termKey = (tax: string, slug: string) => `${tax}::${slug}`;

export class ProductAttributeHelper {
  /** Build flat TermOption[] from product.terms + product.termKeyToVariationIds */
  static create(product: VariableProduct): TermOption[] {
    const out: TermOption[] = [];
    for (const [taxName, termList] of product.terms ?? new Map()) {
      for (const t of termList ?? []) {
        const key = termKey(t.taxonomy.name, t.slug);
        const ids = product.termKeyToVariationIds.get(key);
        out.push({
          term: t,
          variationIds: ids ? Array.from(ids) : [],
          enabled: true,
        });
      }
    }
    return out;
  }

  // internals
  private static intersect(sets: Set<number>[]): Set<number> {
    if (!sets.length) return new Set();
    return sets.slice(1).reduce((acc, s) => {
      const next = new Set<number>();
      acc.forEach((id) => {
        if (s.has(id)) next.add(id);
      });
      return next;
    }, new Set(sets[0]));
  }

  private static selectedSetsFromOptions(
    options: TermOption[],
    selection: TermSelection
  ): Set<number>[] {
    const terms = Array.from(selection.values()).filter((t): t is Term => !!t);
    return terms.map((term) => {
      const opt = options.find(
        (o) =>
          o.term.taxonomy.name === term.taxonomy.name &&
          o.term.slug === term.slug
      );
      return opt ? new Set(opt.variationIds) : new Set<number>();
    });
  }

  /** Non-throwing: disables all if selection yields no matches */
  static withEnabled(
    options: TermOption[],
    selection: TermSelection
  ): TermOption[] {
    const sets = this.selectedSetsFromOptions(options, selection);
    if (sets.length === 0) {
      return options.map((o) => ({
        ...o,
        enabled: (o.variationIds?.length ?? 0) > 0,
      }));
    }
    const matching = this.intersect(sets);
    if (matching.size === 0) {
      return options.map((o) => ({ ...o, enabled: false }));
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
    return options.map((o) => ({
      ...o,
      enabled: o.variationIds.some((id) => matching.has(id)),
    }));
  }

  static resolveSelectedVariationId(
    options: TermOption[],
    selection: TermSelection
  ): number | undefined {
    const sets = this.selectedSetsFromOptions(options, selection);
    if (!sets.length || sets.some((s) => s.size === 0)) return undefined;
    const matching = this.intersect(sets);
    return matching.size === 1
      ? (matching.values().next().value as number)
      : undefined;
  }
}
