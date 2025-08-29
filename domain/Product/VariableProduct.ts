// domain/Product/VariableProduct.ts
import { capitalize, cleanHtml, normalizeAttribute } from "@/lib/format";

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
  taxonomy: string; // e.g. "pa_farge"
  has_variations: boolean;
};

export type Term = {
  key: string; // slug, e.g. "karamell"
  label: string; // e.g. "Karamell"
  attribute: string; // attribute key (normalized), e.g. "farge"
};

export type Variation = {
  key: number; // variation id
  options: { term: string; attribute: string }[];
};

/** ---- Class ---- */
export class VariableProduct extends BaseProduct {
  readonly rawAttributes: RawAttribute[];
  readonly rawVariations: RawVariationRef[];

  /** Precomputed normalized views */
  readonly attributes: Map<string, Attribute>;
  readonly terms: Map<string, Term>;
  readonly variations: Variation[];

  readonly attributeOrder: string[]; // normalized attr keys in Store order
  readonly termOrderByAttribute?: Map<string, string[]>; // per-attr term keys in Store order
  readonly variationOrder?: number[]; // variation ids in Store order

  constructor(data: VariableProductData) {
    if (data.type !== "variable") {
      throw new Error("Invalid data type for VariableProduct");
    }
    super(data);

    this.rawAttributes = (data.attributes ?? []).filter(
      (a) => a.has_variations
    );

    this.rawVariations = data.variations ?? [];

    // compute once
    const attributes = buildAttributes(this.rawAttributes);
    const terms = buildTerms(this.rawAttributes);
    const variations = buildVariants(this.rawVariations, attributes, terms);

    // ---- POST-STEP: prune globally-unused terms & empty attributes ----

    // 1) Collect used term slugs per attribute from the parsed variations
    const usedTermsByAttr = new Map<string, Set<string>>();
    for (const v of variations) {
      for (const { attribute, term } of v.options) {
        if (!usedTermsByAttr.has(attribute))
          usedTermsByAttr.set(attribute, new Set());
        usedTermsByAttr.get(attribute)!.add(term); // term is the term slug
      }
    }

    // 2) Filter the flat terms map to only those that appear in at least one variation
    const filteredTerms = new Map(
      Array.from(terms.entries()).filter(([slug, term]) => {
        const used = usedTermsByAttr.get(term.attribute);
        return used?.has(slug) ?? false;
      })
    );

    // 3) Optionally drop attributes that ended up with zero used terms
    const filteredAttributes = new Map(
      Array.from(attributes.entries()).filter(([attrKey]) => {
        return (usedTermsByAttr.get(attrKey)?.size ?? 0) > 0;
      })
    );

    // 4) Rebuild attribute order to match the original store order but only keep attrs that survived
    const filteredAttributeOrder = this.rawAttributes
      .map((a) => normalizeAttribute(cleanHtml(a.name)))
      .filter((attrKey) => filteredAttributes.has(attrKey));

    // 5) Build per-attribute term order from the raw order, filtered to used terms
    const termOrderByAttribute = new Map<string, string[]>();
    for (const ra of this.rawAttributes) {
      const attrKey = normalizeAttribute(cleanHtml(ra.name));
      if (!filteredAttributes.has(attrKey)) continue;
      const used = usedTermsByAttr.get(attrKey) ?? new Set<string>();
      const order = (ra.terms ?? [])
        .map((t) => t.slug)
        .filter((slug) => used.has(slug));
      termOrderByAttribute.set(attrKey, order);
    }

    // 6) (Optional) keep raw variation id order for later use
    const variationOrder = (this.rawVariations ?? []).map((v) => v.id);

    // 7) Assign the pruned/derived structures
    this.attributes = filteredAttributes;
    this.terms = filteredTerms;
    this.variations = variations;
    this.attributeOrder = filteredAttributeOrder;
    this.termOrderByAttribute = termOrderByAttribute;
    this.variationOrder = variationOrder;
  }
}

/** ---- Pure helpers (used by the constructor) ---- */
function buildAttributes(raw: RawAttribute[]): Map<string, Attribute> {
  return new Map(
    (raw ?? []).map((a) => {
      const display = cleanHtml(a.name);
      const key = normalizeAttribute(display);
      return [
        key,
        {
          key,
          label: capitalize(display),
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
    const attrKey = normalizeAttribute(cleanHtml(attr.name));
    for (const t of attr.terms ?? []) {
      out.push([
        t.slug,
        {
          key: t.slug,
          label: capitalize(cleanHtml(t.name)),
          attribute: attrKey,
        },
      ]);
    }
  }
  return new Map(out);
}

function buildVariants(
  raw: RawVariationRef[],
  attributes: Map<string, Attribute>,
  terms: Map<string, Term>
): Variation[] {
  return (raw ?? []).map((v) => ({
    key: v.id,
    options: (v.attributes ?? []).map(({ name, value }) => {
      const attrKey = normalizeAttribute(cleanHtml(name)); // "farge", "størrelse"
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
