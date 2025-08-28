// domain/Product/helpers/VariationSelector.ts
import { VariableProduct } from "../VariableProduct";
import { VariableProductHelper } from "./VariableProductHelper";

export type AttributeKey = string; // e.g. "farge", "størrelse"
export type TermKey = string; // e.g. "karamell", "l"

// One option line in your UI list
export type Option = {
  term: { key: TermKey; label: string; attribute: AttributeKey }; // from product.terms
  enabled: boolean;
  variationIds: number[]; // for price ranges, availability, etc.
};

export class VariationSelector {
  private helper: VariableProductHelper;
  private selection = new Map<AttributeKey, TermKey | null>(); // null = nothing selected

  constructor(private product: VariableProduct) {
    this.helper = new VariableProductHelper(product);
    // initialize known attributes with null
    for (const key of product.attributes.keys()) this.selection.set(key, null);
  }

  /** Read-only view for your UI to bind to */
  getSelection(): ReadonlyMap<AttributeKey, TermKey | null> {
    return this.selection;
  }

  /** Set or clear a selection for an attribute */
  select(attr: AttributeKey, term: TermKey | null) {
    if (!this.product.attributes.has(attr)) return;
    this.selection.set(attr, term);
  }

  /** Current candidate variants given selection across all attributes */
  getCurrentVariantIds(): number[] {
    // start with “all variants” then intersect per selected (attr,term)
    let ids: Set<number> | null = null;

    for (const [attr, term] of this.selection) {
      if (!term) continue;
      const subset = new Set(
        this.helper.getVariantIdsForAttributeTerm(attr, term)
      );
      ids = ids ? intersect(ids, subset) : subset;
      if (ids.size === 0) break;
    }
    return [...(ids ?? new Set(this.product.variants.map((v) => v.key)))];
  }

  /** Unambiguous selected variation (only when fully determined) */
  getSelectedVariationId(): number | undefined {
    const ids = this.getCurrentVariantIds();
    return ids.length === 1 ? ids[0] : undefined;
  }

  /**
   * Options for one attribute:
   * - enabled if there exists at least one variant with (this attr, term) AND compatible with the rest of the selection
   * - variationIds = exact intersection set (used for price range)
   */
  getOptionsForAttribute(attr: AttributeKey): Option[] {
    // build candidate set excluding this attribute’s own selection
    let candidate: Set<number> | null = null;
    for (const [a, t] of this.selection) {
      if (a === attr || !t) continue;
      const subset = new Set(this.helper.getVariantIdsForAttributeTerm(a, t));
      candidate = candidate ? intersect(candidate, subset) : subset;
      if (candidate.size === 0) break;
    }

    // each term for this attribute
    const terms = [...this.product.terms.values()].filter(
      (t) => t.attribute === attr
    );
    return terms.map((t) => {
      const baseSet = new Set(
        this.helper.getVariantIdsForAttributeTerm(attr, t.key)
      );
      const finalSet = candidate ? intersect(baseSet, candidate) : baseSet;
      return {
        term: t,
        enabled: finalSet.size > 0,
        variationIds: [...finalSet],
      };
    });
  }

  /** Convenience for UI: all attributes with their options (usually 1–2 attributes) */
  getAllAttributeOptions(): {
    attribute: { key: AttributeKey; label: string };
    options: Option[];
  }[] {
    return [...this.product.attributes.values()].map((a) => ({
      attribute: { key: a.key, label: a.label },
      options: this.getOptionsForAttribute(a.key),
    }));
  }
}

function intersect(a: Set<number>, b: Set<number>): Set<number> {
  const out = new Set<number>();
  // iterate the smaller one for perf
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) out.add(x);
  return out;
}
