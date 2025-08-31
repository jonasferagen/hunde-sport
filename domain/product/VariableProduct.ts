import { capitalize, cleanHtml } from "@/lib/format";
import { intersectSets } from "@/lib/util";

import { Product, type ProductData } from "./Product";

export type AttributeTermData = { id: number; name: string; slug: string };
export type AttributeData = {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: AttributeTermData[];
};
export type VariationRefData = {
  id: number;
  attributes: { name: string; value: string }[];
};

export type Attribute = {
  key: string;
  label: string;
  taxonomy: string;
  has_variations: boolean;
};
export type Term = { key: string; label: string; attribute: string };
export type Variation = {
  key: number;
  options: { term: string; attribute: string }[];
};

const EMPTY_SET: ReadonlySet<number> = Object.freeze(new Set<number>());

export class VariableProduct extends Product {
  readonly rawAttributes: AttributeData[];
  readonly rawVariations: VariationRefData[];
  readonly attributes: Map<string, Attribute>;
  readonly terms: Map<string, Term>;
  readonly variations: Variation[];
  readonly attributeOrder: string[];
  readonly termOrderByAttribute: Map<string, string[]>;
  readonly variationOrder: number[];
  private readonly _termToVarSet: Map<string, ReadonlySet<number>>;
  private readonly _variationIdSet: ReadonlySet<number>;

  private constructor(
    base: ReturnType<typeof Product.mapBase> & {
      attributes: AttributeData[];
      variations: VariationRefData[];
    }
  ) {
    if (base.type !== "variable")
      throw new Error("Invalid data type for VariableProduct");
    super(base);

    this.rawAttributes = (base.attributes ?? []).filter(
      (a) => a.has_variations
    );
    this.rawVariations = base.variations ?? [];

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

    this.variations = buildVariations(
      this.rawVariations,
      this.attributes,
      this.terms
    );

    this.variationOrder = this.variations.map((v) => v.key);

    this.termOrderByAttribute = new Map<string, string[]>();
    for (const ra of this.rawAttributes) {
      const ak = attrKeyFromName(ra.name);
      this.termOrderByAttribute.set(
        ak,
        (ra.terms ?? []).map((t) => t.slug)
      );
    }

    const termToVarSet = new Map<string, ReadonlySet<number>>();
    const allIds = new Set<number>();
    for (const v of this.variations) {
      allIds.add(v.key);
      for (const { term } of v.options) {
        if (!termToVarSet.has(term)) termToVarSet.set(term, new Set<number>());
        (termToVarSet.get(term) as Set<number>).add(v.key);
      }
    }
    for (const [slug, set] of termToVarSet.entries()) {
      termToVarSet.set(
        slug,
        Object.freeze(new Set<number>(set)) as ReadonlySet<number>
      );
    }
    this._termToVarSet = termToVarSet;
    this._variationIdSet = Object.freeze(
      new Set<number>(allIds)
    ) as ReadonlySet<number>;
  }

  static fromRaw(
    raw: ProductData & {
      attributes?: AttributeData[];
      variations?: VariationRefData[];
    }
  ): VariableProduct {
    if (raw.type !== "variable")
      throw new Error("fromRaw(variable) received non-variable");
    const base = Product.mapBase(raw, "variable");
    return new VariableProduct({
      ...base,
      attributes: raw.attributes ?? [],
      variations: raw.variations ?? [],
    });
  }

  // getters unchanged …
  get variationIds(): number[] {
    return this.variationOrder;
  }
  get variationIdSet(): ReadonlySet<number> {
    return this._variationIdSet;
  }
  getAttribute(key: string) {
    return this.attributes.get(key);
  }
  getTerm(slug: string) {
    return this.terms.get(slug);
  }
  getTermOrder(attrKey: string): readonly string[] {
    return this.termOrderByAttribute.get(attrKey) ?? [];
  }
  getVariationSetForTerm(termSlug: string): ReadonlySet<number> {
    return this._termToVarSet.get(termSlug) ?? EMPTY_SET;
  }
  getVariationSetForAttribute(attrKey: string): ReadonlySet<number> {
    const out = new Set<number>();
    for (const slug of this.getTermOrder(attrKey)) {
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

function attrKeyFromName(name: string): string {
  return cleanHtml(name).toLocaleLowerCase();
}
function buildAttributes(raw: AttributeData[]): Map<string, Attribute> {
  return new Map(
    (raw ?? []).map((a) => {
      const key = attrKeyFromName(a.name);
      return [
        key,
        {
          key,
          label: key,
          taxonomy: a.taxonomy,
          has_variations: a.has_variations,
        } as const,
      ];
    })
  );
}
function buildTerms(raw: AttributeData[]): Map<string, Term> {
  const out: [string, Term][] = [];
  for (const attr of raw ?? []) {
    const attrKey = attrKeyFromName(attr.name);
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

// VariableProduct.ts

function buildVariations(
  raw: VariationRefData[],
  attributes: Map<string, Attribute>,
  terms: Map<string, Term>
): Variation[] {
  const out: Variation[] = [];
  const seen = new Set<string>(); // signature -> already added

  for (const v of raw ?? []) {
    const opts: { term: string; attribute: string }[] = [];
    let valid = true;

    for (const { name, value } of v.attributes ?? []) {
      const attrKey = attrKeyFromName(name);
      if (!attributes.has(attrKey)) {
        valid = false;
        break;
      }
      const term = terms.get(value);
      if (!term) {
        valid = false;
        break;
      }
      opts.push({ term: term.key, attribute: attrKey });
    }

    if (!valid || opts.length === 0) continue;

    // build a stable, order-independent signature of the combo
    // sort by attribute key to avoid order-induced duplicates
    const sig = opts
      .slice()
      .sort((a, b) => a.attribute.localeCompare(b.attribute))
      .map(({ attribute, term }) => `${attribute}=${term}`)
      .join("|");

    if (seen.has(sig)) {
      // duplicate combo -> skip this variation id
      continue;
    }
    seen.add(sig);
    out.push({ key: v.id, options: opts });
  }

  return out;
}
