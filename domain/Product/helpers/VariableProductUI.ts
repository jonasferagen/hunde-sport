import { VariableProduct } from "../VariableProduct";

export type AttributeKey = string; // e.g. "farge", "størrelse"
export type TermKey = string; // e.g. "karamell", "l"

// your UI option line
export type Option = {
  term: { key: TermKey; label: string; attribute: AttributeKey };
  enabled: boolean;
  variationIds: number[];
};

// A tiny index for fast lookups: (attribute, term) -> variant IDs
export function buildVariantIndex(vp: VariableProduct) {
  const byAttrTerm = new Map<AttributeKey, Map<TermKey, Set<number>>>();
  const allIds = vp.variants.map((v) => v.key);

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

  const getIdsFor = (attr: AttributeKey, term: TermKey): number[] => [
    ...(byAttrTerm.get(attr)?.get(term) ?? new Set<number>()),
  ];

  return {
    allVariantIds: allIds,
    getIdsFor,
    getTermsForAttribute(
      attr: AttributeKey
    ): { key: TermKey; label: string; attribute: AttributeKey }[] {
      // Pull terms directly from vp (source of truth)
      return [...vp.terms.values()].filter((t) => t.attribute === attr);
    },
  };
}

// Build options for every attribute given current selection.
// selection: Map<attributeKey, termKey|null>
export function getAllAttributeOptions(
  vp: VariableProduct,
  selection: ReadonlyMap<AttributeKey, TermKey | null>
): { attribute: { key: AttributeKey; label: string }; options: Option[] }[] {
  const idx = buildVariantIndex(vp);

  // Precompute the candidate set from "other" attributes’ selections once per attribute
  const attributes = [...vp.attributes.values()]; // [{ key, label, taxonomy, has_variations }]

  return attributes.map((a) => {
    // Build candidate set from selections excluding this attribute
    let candidate: Set<number> | null = null;
    for (const [attr, term] of selection) {
      if (!term || attr === a.key) continue;
      const subset = new Set(idx.getIdsFor(attr, term));
      candidate = candidate ? intersect(candidate, subset) : subset;
      if (candidate.size === 0) break;
    }

    // Build options for this attribute
    const terms = idx.getTermsForAttribute(a.key);
    const options: Option[] = terms.map((term) => {
      const base = new Set(idx.getIdsFor(a.key, term.key));
      const final = candidate ? intersect(base, candidate) : base;
      return {
        term,
        enabled: final.size > 0,
        variationIds: [...final],
      };
    });

    return { attribute: { key: a.key, label: a.label }, options };
  });
}

function intersect(a: Set<number>, b: Set<number>): Set<number> {
  const out = new Set<number>();
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) out.add(x);
  return out;
}
