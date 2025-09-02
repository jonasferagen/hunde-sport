import type { ProductData } from "@/domain/product/Product";
import { slugKey } from "@/lib/formatters";
import { freezeMap, freezeSet } from "@/lib/util";

import type {
  Attribute,
  AttrKey,
  Term,
  TermKey,
  Variation,
  VariationOptionData,
} from "./types";

// Build a stable combo key in attribute order: "attr1=termA|attr2=termB"
export function makeComboKey(
  order: readonly AttrKey[],
  combo: readonly TermKey[]
) {
  // assume lengths match; validated by caller
  return order.map((ak, i) => `${ak}=${combo[i]}`).join("|");
}

// Validate a variation's options against attributes & terms maps.
// Returns normalized options in product attribute order, or null if invalid.
export function normalizeVariationOptions(
  order: readonly AttrKey[],
  attrs: ReadonlyMap<AttrKey, Attribute>,
  terms: Map<TermKey, Term>,
  options: readonly VariationOptionData[]
): VariationOptionData[] | null {
  // Quick index by attr for the variation row
  const byAttr = new Map<AttrKey, TermKey>();
  for (const o of options) {
    if (!attrs.has(o.attribute)) return null; // unknown attribute
    if (!terms.has(o.term)) return null; // unknown term
    const t = terms.get(o.term)!;
    if (t.attribute !== o.attribute) return null; // mismatched term/attr
    byAttr.set(o.attribute, o.term);
  }
  // Normalize into full ordered combo; require all attributes present
  const ordered: VariationOptionData[] = [];
  for (const ak of order) {
    const termKey = byAttr.get(ak);
    if (!termKey) return null;
    ordered.push({ attribute: ak, term: termKey });
  }
  return ordered;
}

export function normalizeAttributesAndTerms(data: ProductData) {
  const attributes = new Map<string, Attribute>();
  const terms = new Map<string, Term>();
  const order: string[] = [];

  for (const a of (data as any).attributes ?? []) {
    // Prefer taxonomy -> strip "pa_" for a stable ascii key; fallback to name
    const taxKey =
      typeof a.taxonomy === "string" && a.taxonomy.startsWith("pa_")
        ? a.taxonomy.slice(3)
        : null;
    const ak = slugKey(taxKey ?? a.slug ?? a.key ?? a.name);
    if (!ak) continue;

    if (!attributes.has(ak)) {
      attributes.set(ak, {
        key: ak,
        label: a.name ?? a.label ?? ak,
        taxonomy: a.taxonomy ?? `pa_${ak}`,
        has_variations: !!a.variation || !!a.has_variations,
      });
      order.push(ak);
    }

    // preload terms from attribute.terms
    for (const t of a.terms ?? []) {
      const tk = slugKey(t.slug ?? t.name);
      if (!tk) continue;
      if (!terms.has(tk)) {
        terms.set(tk, { key: tk, label: t.name ?? tk, attribute: ak });
      }
    }
  }

  return {
    attributeOrder: Object.freeze(order),
    attributes,
    terms, // NOTE: this is a mutable Map here; we'll freeze when publishing
  };
}
export function normalizeRawVariations(data: ProductData): Variation[] {
  const raw = ((data as any).variations ?? []) as any[];
  return raw.map((rv) => ({
    key: rv.id ?? rv.key,
    options: (rv.options ?? rv.attributes ?? [])
      .map((o: any) => ({
        attribute: slugKey(o.attribute ?? o.name ?? o.slug), // "Størrelse" -> "storrelse"
        term: slugKey(o.term ?? o.option ?? o.value), // already slugs like "xss", but normalize anyway
      }))
      .filter((o: VariationOptionData) => o.attribute && o.term),
  }));
}

// unchanged logic, but accepts a MUTABLE terms map (in case a dataset lacks terms)
export function normalizeAndDedupeVariations(
  order: readonly AttrKey[],
  attributes: ReadonlyMap<AttrKey, Attribute>,
  terms: Map<TermKey, Term>, // <-- mutable
  rawVariations: readonly Variation[]
) {
  const comboToId = new Map<string, number>();
  const acc: Variation[] = [];

  const ensureTerm = (attr: AttrKey, termKey: TermKey) => {
    if (!terms.has(termKey)) {
      terms.set(termKey, { key: termKey, label: termKey, attribute: attr });
    }
  };

  for (const v of rawVariations) {
    const ordered = normalizeVariationOptions(
      order,
      attributes,
      terms,
      v.options
    );
    if (!ordered) continue;

    // If your dataset always preloads terms, this is a no-op. Still useful for resilience.
    for (const o of ordered) ensureTerm(o.attribute, o.term);

    const comboKey = makeComboKey(
      order,
      ordered.map((o) => o.term)
    );
    if (comboToId.has(comboKey)) continue; // drop duplicate combos, keep first

    acc.push({ key: v.key, options: ordered });
    comboToId.set(comboKey, v.key);
  }

  return {
    variations: Object.freeze(acc),
    comboToId: freezeMap(comboToId),
  };
}
export function buildSetsByAttr(
  order: readonly AttrKey[],
  variations: readonly Variation[]
): ReadonlyMap<AttrKey, ReadonlySet<TermKey>> {
  const map = new Map<AttrKey, Set<TermKey>>();
  for (const ak of order) map.set(ak, new Set<TermKey>());
  for (const v of variations)
    for (const o of v.options) map.get(o.attribute)!.add(o.term);
  return freezeMap(
    new Map([...map].map(([k, set]) => [k, freezeSet(set)] as const))
  );
}
