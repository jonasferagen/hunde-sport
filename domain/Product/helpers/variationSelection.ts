import { VariableProduct } from "../VariableProduct";

export type AttributeKey = string;
export type TermKey = string;

export type VariationAttributeState = {
  selected: TermKey | null;
  variantsByTerm: Map<TermKey, number[]>;
};

export type VariationSelection = Map<AttributeKey, VariationAttributeState>;

export function buildVariationSelection(
  vp: VariableProduct,
  current: Map<AttributeKey, TermKey | null>
): VariationSelection {
  // Pre-index (attribute, term) → Set<variantId>
  const byAttrTerm = new Map<AttributeKey, Map<TermKey, Set<number>>>();
  for (const v of vp.variants) {
    for (const opt of v.options) {
      const inner =
        byAttrTerm.get(opt.attribute) ?? new Map<TermKey, Set<number>>();
      const set = inner.get(opt.term) ?? new Set<number>();
      set.add(v.key);
      inner.set(opt.term, set);
      byAttrTerm.set(opt.attribute, inner);
    }
  }

  const out: VariationSelection = new Map();

  for (const a of vp.attributes.values()) {
    // candidate set from other selected attributes
    let candidate: Set<number> | null = null;
    for (const [attr, term] of current) {
      if (!term || attr === a.key) continue;
      const subset = byAttrTerm.get(attr)?.get(term) ?? new Set<number>();
      candidate = candidate ? intersect(candidate, subset) : new Set(subset);
      if (candidate.size === 0) break;
    }

    const variantsByTerm = new Map<TermKey, number[]>();
    for (const t of vp.terms.values()) {
      if (t.attribute !== a.key) continue;
      const base = byAttrTerm.get(a.key)?.get(t.key) ?? new Set<number>();
      const final = candidate ? intersect(base, candidate) : base;
      variantsByTerm.set(t.key, [...final]);
    }

    out.set(a.key, {
      selected: current.get(a.key) ?? null,
      variantsByTerm,
    });
  }

  return out;
}

export function intersect(a: Set<number>, b: Set<number>): Set<number> {
  const out = new Set<number>();
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) out.add(x);
  return out;
}
