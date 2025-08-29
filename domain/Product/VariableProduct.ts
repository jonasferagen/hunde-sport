// domain/Product/VariableProduct.ts
import { capitalize, cleanHtml } from "@/lib/format";
import { intersectSets } from "@/lib/util";

import { BaseProduct, BaseProductData } from "./BaseProduct";

/** ---- Raw shapes from Store API ---- */
type RawAttributeTerm = { id: number; name: string; slug: string };
export type RawAttribute = {
  id: number;
  name: string; // e.g. "Farge", "Størrelse"
  taxonomy: string; // e.g. "pa_farge", "pa_storrelse"
  has_variations: boolean;
  terms: RawAttributeTerm[];
};

export type RawVariationRef = {
  id: number; // variation id
  attributes: { name: string; value: string }[];
};

export interface VariableProductData extends BaseProductData {
  type: "variable";
  parent: 0;
  attributes: RawAttribute[];
  variations: RawVariationRef[];
}

/** ---- Normalized domain types ---- */
export type Attribute = {
  key: string; // normalized display name, e.g. "farge"
  label: string; // e.g. "Farge"
  taxonomy: string;
  has_variations: boolean;
};

export type Term = {
  key: string; // slug, e.g. "karamell"
  label: string; // e.g. "Karamell"
  attribute: string; // normalized attribute key, e.g. "farge"
};

export type Variation = {
  key: number; // variation id
  options: { term: string; attribute: string }[];
};

/** ---- Class ---- */
const EMPTY_SET: ReadonlySet<number> = Object.freeze(new Set<number>());

export class VariableProduct extends BaseProduct {
  readonly rawAttributes: RawAttribute[];
  readonly rawVariations: RawVariationRef[];

  /** Precomputed normalized views (no pruning) */
  readonly attributes: Map<string, Attribute>;
  readonly terms: Map<string, Term>;
  readonly variations: Variation[];

  /** Store order helpers */
  readonly attributeOrder: string[]; // normalized attr keys in Store order
  readonly termOrderByAttribute: Map<string, string[]>; // per-attr term slugs in Store order
  readonly variationOrder: number[]; // variation ids in Store order

  /** Internal indices (not exposed) */
  private readonly _termToVarSet: Map<string, ReadonlySet<number>>;
  private readonly _variationIdSet: ReadonlySet<number>;

  constructor(data: VariableProductData) {
    if (data.type !== "variable")
      throw new Error("Invalid data type for VariableProduct");
    super(data);

    // Keep only attributes that participate in variations
    this.rawAttributes = (data.attributes ?? []).filter(
      (a) => a.has_variations
    );
    this.rawVariations = data.variations ?? [];

    // Normalize once
    this.attributes = buildAttributes(this.rawAttributes);
    this.terms = buildTerms(this.rawAttributes);
    this.variations = buildVariations(
      this.rawVariations,
      this.attributes,
      this.terms
    );
    this.attributeOrder = this.rawAttributes.map((a) =>
      attrKeyFromName(a.name)
    );
    this.variationOrder = (this.rawVariations ?? []).map((v) => v.id);

    // per-attribute term order in Woo order (slugs), keyed by our attr key
    this.termOrderByAttribute = new Map<string, string[]>();
    for (const ra of this.rawAttributes) {
      const ak = attrKeyFromName(ra.name);
      this.termOrderByAttribute.set(
        ak,
        (ra.terms ?? []).map((t) => t.slug)
      );
    }

    // Internal indices
    const termToVarSet = new Map<string, ReadonlySet<number>>();
    const allIds = new Set<number>();

    for (const v of this.variations) {
      allIds.add(v.key);
      for (const { term } of v.options) {
        if (!termToVarSet.has(term)) termToVarSet.set(term, new Set<number>());
        (termToVarSet.get(term) as Set<number>).add(v.key);
      }
    }
    // Freeze sets so callers can safely treat them as immutable
    for (const [slug, set] of termToVarSet.entries()) {
      termToVarSet.set(
        slug,
        Object.freeze(new Set<number>(set)) as ReadonlySet<number>
      );
    }
    const variationIdSet = Object.freeze(
      new Set<number>(allIds)
    ) as ReadonlySet<number>;

    // Assign

    this._termToVarSet = termToVarSet;
    this._variationIdSet = variationIdSet;
  }

  /** ---- Convenience getters (public) ---- */

  /** All variation IDs in store order. */
  get variationIds(): number[] {
    return this.variationOrder;
  }

  /** All variation IDs as a (frozen) Set. */
  get variationIdSet(): ReadonlySet<number> {
    return this._variationIdSet;
  }

  /** Lookup attribute by normalized key. */
  getAttribute(key: string): Attribute | undefined {
    return this.attributes.get(key);
  }

  /** Lookup term by slug. */
  getTerm(slug: string): Term | undefined {
    return this.terms.get(slug);
  }

  /** Term order (slugs) for an attribute (store order). */
  getTermOrder(attrKey: string): readonly string[] {
    return this.termOrderByAttribute.get(attrKey) ?? [];
  }

  /** Variation Set for a given term slug (empty if none). */
  getVariationSetForTerm(termSlug: string): ReadonlySet<number> {
    return this._termToVarSet.get(termSlug) ?? EMPTY_SET;
  }

  /** Union of variation sets for all terms under an attribute (store order). */
  getVariationSetForAttribute(attrKey: string): ReadonlySet<number> {
    const out = new Set<number>();
    const slugs = this.getTermOrder(attrKey);
    for (const slug of slugs) {
      const s = this._termToVarSet.get(slug);
      if (s) for (const id of s) out.add(id);
    }
    return Object.freeze(out) as ReadonlySet<number>;
  }

  getVariationId(termSlugs: string[]): number | undefined {
    if (termSlugs.length !== this.attributeOrder.length) return undefined;
    const sets = termSlugs.map((slug) => this.getVariationSetForTerm(slug));
    if (sets.some((s) => s.size === 0)) return undefined;
    const intersection = intersectSets<number>(...sets);
    if (intersection.size !== 1) return undefined;
    return intersection.values().next().value as number;
  }
}

// helpers
function attrKeyFromName(name: string): string {
  // preserve diacritics, normalize case only
  return cleanHtml(name).toLocaleLowerCase();
}

function buildAttributes(raw: RawAttribute[]): Map<string, Attribute> {
  return new Map(
    (raw ?? []).map((a) => {
      const key = attrKeyFromName(a.name); // e.g. "størrelse", "farge"
      const label = key; // normalized label (lowercase; UI can capitalize)
      return [
        key,
        {
          key,
          label,
          taxonomy: a.taxonomy,
          has_variations: a.has_variations,
        },
      ] as const;
    })
  );
}

function buildTerms(raw: RawAttribute[]): Map<string, Term> {
  const out: [string, Term][] = [];
  for (const attr of raw ?? []) {
    const attrKey = attrKeyFromName(attr.name); // link terms to the attr *key*
    for (const t of attr.terms ?? []) {
      out.push([
        t.slug, // identity = slug
        {
          key: t.slug,
          label: capitalize(cleanHtml(t.name)), // display label
          attribute: attrKey, // points to "størrelse"/"farge"
        },
      ]);
    }
  }
  return new Map(out);
}

// Map variation rows to our attribute key reliably (case-insensitive, diacritics preserved)
function buildVariations(
  raw: RawVariationRef[],
  attributes: Map<string, Attribute>,
  terms: Map<string, Term>
): Variation[] {
  return (raw ?? []).map((v) => ({
    key: v.id,
    options: (v.attributes ?? []).map(({ name, value }) => {
      const attrKey = attrKeyFromName(name); // e.g. "Størrelse" | "størrelse" -> "størrelse"
      if (!attributes.has(attrKey)) {
        throw new Error(
          `Unknown attribute key in variation: ${name} -> ${attrKey}`
        );
      }
      const term = terms.get(value);
      if (!term) {
        throw new Error(`Unknown term slug in variation: ${value}`);
      }
      return { term: term.key, attribute: attrKey };
    }),
  }));
}
