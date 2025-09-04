import type { AttributeData, TermData, VariationData } from "./helpers/types";
import { Attribute, Term, Variation } from "./helpers/types";
import { Product, type ProductData } from "./Product";

type RelationshipMaps = {
  attributeHasTerms: ReadonlyMap<string, ReadonlySet<string>>;
  attributeHasVariations: ReadonlyMap<string, ReadonlySet<string>>;
  termHasAttributes: ReadonlyMap<string, ReadonlySet<string>>;
  termHasVariations: ReadonlyMap<string, ReadonlySet<string>>;
  variationHasTerms: ReadonlyMap<string, ReadonlySet<string>>;
  variationHasAttributes: ReadonlyMap<string, ReadonlySet<string>>;
};

export class VariableProduct extends Product {
  // Core collections (public, readonly views)
  public readonly attributes: ReadonlyMap<string, Attribute>;
  public readonly terms: ReadonlyMap<string, Term>;
  public readonly variations: ReadonlyMap<string, Variation>;

  private readonly attributeHasTerms: ReadonlyMap<string, ReadonlySet<string>>;
  private readonly attributeHasVariations: ReadonlyMap<
    string,
    ReadonlySet<string>
  >;
  private readonly termHasAttributes: ReadonlyMap<string, ReadonlySet<string>>;
  private readonly termHasVariations: ReadonlyMap<string, ReadonlySet<string>>;
  private readonly variationHasTerms: ReadonlyMap<string, ReadonlySet<string>>;
  private readonly variationHasAttributes: ReadonlyMap<
    string,
    ReadonlySet<string>
  >;

  private constructor(data: ProductData) {
    const base = Product.mapBase(data, "variable");
    super(base);

    const { attributes, terms, variations } = VariableProduct.parse(data);

    this.attributes = attributes;
    this.terms = terms;
    this.variations = variations;

    const rel = VariableProduct.buildRelationships(
      attributes,
      terms,
      variations
    );
    this.attributeHasTerms = rel.attributeHasTerms;
    this.attributeHasVariations = rel.attributeHasVariations;
    this.termHasAttributes = rel.termHasAttributes;
    this.termHasVariations = rel.termHasVariations;
    this.variationHasTerms = rel.variationHasTerms;
    this.variationHasAttributes = rel.variationHasAttributes;
  }

  static create(data: ProductData): VariableProduct {
    if (data.type !== "variable") {
      throw new Error("fromData(variable) received non-variable");
    }
    return new VariableProduct(data);
  }

  // ---------- PURE STATICS ----------

  static parse(data: ProductData): {
    attributes: ReadonlyMap<string, Attribute>;
    terms: ReadonlyMap<string, Term>;
    variations: ReadonlyMap<string, Variation>;
  } {
    const attributes = new Map<string, Attribute>();
    const terms = new Map<string, Term>();
    const variations = new Map<string, Variation>();

    // Attributes + Terms
    for (const a of data.attributes ?? []) {
      const attr = Attribute.create(a as AttributeData);
      if (!attr.has_variations) continue;

      for (const t of a.terms ?? []) {
        const term = Term.create(attr, t as TermData); // composite key
        terms.set(term.key, term);
      }
      attributes.set(attr.key, attr);
    }
    // Variations (skip those referencing unknown/sanitized-out terms)
    for (const v of data.variations ?? []) {
      const variation = Variation.create(v as VariationData);
      if (variation.termKeys.every((k) => terms.has(k))) {
        variations.set(variation.key, variation);
      }
    }
    return { attributes, terms, variations };
  }

  static buildRelationships(
    attributes: ReadonlyMap<string, Attribute>,
    terms: ReadonlyMap<string, Term>,
    variations: ReadonlyMap<string, Variation>
  ): RelationshipMaps {
    // key-based sets
    const attributeHasTerms = new Map<string, Set<string>>();
    const attributeHasVariations = new Map<string, Set<string>>();
    const termHasAttributes = new Map<string, Set<string>>();
    const termHasVariations = new Map<string, Set<string>>();
    const variationHasTerms = new Map<string, Set<string>>();
    const variationHasAttributes = new Map<string, Set<string>>();

    // Pre-seed keys
    for (const aKey of attributes.keys()) {
      attributeHasTerms.set(aKey, new Set());
      attributeHasVariations.set(aKey, new Set());
    }
    for (const tKey of terms.keys()) {
      termHasAttributes.set(tKey, new Set());
      termHasVariations.set(tKey, new Set());
    }
    for (const vKey of variations.keys()) {
      variationHasTerms.set(vKey, new Set());
      variationHasAttributes.set(vKey, new Set());
    }

    // attributes ↔ terms
    for (const t of terms.values()) {
      termHasAttributes.get(t.key)!.add(t.attrKey);
      attributeHasTerms.get(t.attrKey)!.add(t.key);
    }

    // variations ↔ terms / attributes
    for (const v of variations.values()) {
      // terms
      for (const tKey of v.termKeys) {
        variationHasTerms.get(v.key)!.add(tKey);
        termHasVariations.get(tKey)!.add(v.key);
      }
      // attributes
      for (const aKey of v.attrKeys) {
        variationHasAttributes.get(v.key)!.add(aKey);
        attributeHasVariations.get(aKey)!.add(v.key);
      }
    }

    // Return as readonly views
    return {
      attributeHasTerms,
      attributeHasVariations,
      termHasAttributes,
      termHasVariations,
      variationHasTerms,
      variationHasAttributes,
    };
  }

  // ---------- SAFE GETTERS (throw on unknown; else always present) ----------

  // Terms for an attribute
  getTermsByAttribute(attrKey: string): ReadonlySet<Term> {
    assertKnown(this.attributes, attrKey, "attribute");
    return new Set(
      Array.from(
        this.attributeHasTerms.get(attrKey)!,
        (k) => this.terms.get(k)!
      )
    );
  }

  // Variations for an attribute
  getVariationsByAttribute(attrKey: string): ReadonlySet<Variation> {
    assertKnown(this.attributes, attrKey, "attribute");
    return new Set(
      Array.from(
        this.attributeHasVariations.get(attrKey)!,
        (k) => this.variations.get(k)!
      )
    );
  }

  // Attributes for a term
  getAttributesByTerm(termKey: string): ReadonlySet<Attribute> {
    assertKnown(this.terms, termKey, "term");
    return new Set(
      Array.from(
        this.termHasAttributes.get(termKey)!,
        (k) => this.attributes.get(k)!
      )
    );
  }

  // Variations for a term
  getVariationsByTerm(termKey: string): ReadonlySet<Variation> {
    assertKnown(this.terms, termKey, "term");
    return new Set(
      Array.from(
        this.termHasVariations.get(termKey)!,
        (k) => this.variations.get(k)!
      )
    );
  }

  // Terms for a variation
  getTermsByVariation(variationKey: string): ReadonlySet<Term> {
    assertKnown(this.variations, variationKey, "variation");
    return new Set(
      Array.from(
        this.variationHasTerms.get(variationKey)!,
        (k) => this.terms.get(k)!
      )
    );
  }

  // Attributes for a variation
  getAttributesByVariation(variationKey: string): ReadonlySet<Attribute> {
    assertKnown(this.variations, variationKey, "variation");
    return new Set(
      Array.from(
        this.variationHasAttributes.get(variationKey)!,
        (k) => this.attributes.get(k)!
      )
    );
  }

  // Returns all matching variations for the *currently selected* term keys.
  // Unselected attributes (undefined) are ignored.
  /*
  findVariations(
    attributeSelection: AttributeSelection
  ): ReadonlySet<Variation> {
    let candidates = [...this.variations.values()];
    for (const termKey of Object.values(attributeSelection)) {
      if (!termKey) continue;
      candidates = candidates.filter((v) => v.termKeys.includes(termKey));
      if (candidates.length === 0) break;
    }
    return new Set(candidates);
  }

  findTerms(attributeSelection: AttributeSelection): ReadonlySet<Term> {
    const terms: Term[] = [];
    for (const termKey of Object.values(attributeSelection)) {
      if (!termKey) continue; // ignore not-yet-selected
      const term = this.terms.get(termKey);
      if (term) terms.push(term);
    }
    return new Set(terms);
  } */
}

function assertKnown<T>(
  m: ReadonlyMap<string, T>,
  key: string,
  kind: "attribute" | "term" | "variation"
): void {
  if (!m.has(key)) throw new Error(`Unknown ${kind} key: "${key}"`);
}
