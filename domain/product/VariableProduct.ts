import type { AttributeData, TermData, VariationData } from "./helpers/types";
import { Attribute, Term, Variation } from "./helpers/types";
import { Product, type ProductData } from "./Product";

type RelationshipMaps = {
  attributeHasTerms: ReadonlyMap<string, ReadonlySet<Term>>;
  attributeHasVariations: ReadonlyMap<string, ReadonlySet<Variation>>;
  termHasAttributes: ReadonlyMap<string, ReadonlySet<Attribute>>;
  termHasVariations: ReadonlyMap<string, ReadonlySet<Variation>>;
  variationHasTerms: ReadonlyMap<string, ReadonlySet<Term>>;
  variationHasAttributes: ReadonlyMap<string, ReadonlySet<Attribute>>;
};

export class VariableProduct extends Product {
  // Core collections (public, readonly views)
  public readonly attributes: ReadonlyMap<string, Attribute>;
  public readonly terms: ReadonlyMap<string, Term>;
  public readonly variations: ReadonlyMap<string, Variation>;

  private readonly attributeHasTerms: ReadonlyMap<string, ReadonlySet<Term>>;
  private readonly attributeHasVariations: ReadonlyMap<
    string,
    ReadonlySet<Variation>
  >;
  private readonly termHasAttributes: ReadonlyMap<
    string,
    ReadonlySet<Attribute>
  >;
  private readonly termHasVariations: ReadonlyMap<
    string,
    ReadonlySet<Variation>
  >;
  private readonly variationHasTerms: ReadonlyMap<string, ReadonlySet<Term>>;
  private readonly variationHasAttributes: ReadonlyMap<
    string,
    ReadonlySet<Attribute>
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

    for (const a of data.attributes ?? []) {
      const attr = Attribute.create(a as AttributeData);
      if (!attr.has_variations) continue;

      // terms under this attribute
      for (const t of a.terms ?? []) {
        const term = Term.create(attr, t as TermData); // composite key here
        terms.set(term.key, term);
      }
      attributes.set(attr.key, attr);
    }

    for (const v of data.variations ?? []) {
      const variation = Variation.create(v as VariationData); // composite term keys inside
      /** We skip variations that do not map to a sanitized Term */
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
    // object-based sets
    const attributeHasTerms = new Map<string, Set<Term>>();
    const attributeHasVariations = new Map<string, Set<Variation>>();
    const termHasAttributes = new Map<string, Set<Attribute>>();
    const termHasVariations = new Map<string, Set<Variation>>();
    const variationHasTerms = new Map<string, Set<Term>>();
    const variationHasAttributes = new Map<string, Set<Attribute>>();

    // pre-seed keys
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
      termHasAttributes.get(t.key)!.add(attributes.get(t.attrKey)!);
      attributeHasTerms.get(t.attrKey)!.add(t);
    }

    // variations ↔ terms / attributes
    for (const v of variations.values()) {
      for (const tKey of v.termKeys) {
        const term = terms.get(tKey)!;
        variationHasTerms.get(v.key)!.add(term);
        termHasVariations.get(tKey)!.add(v);
      }
      for (const aKey of v.attrKeys) {
        const attr = attributes.get(aKey)!;
        variationHasAttributes.get(v.key)!.add(attr);
        attributeHasVariations.get(aKey)!.add(v);
      }
    }

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

  // Attribute → Terms
  getTermsByAttribute(attrKey: string): readonly Term[] {
    assertKnown(this.attributes, attrKey, "attribute");
    const terms = this.attributeHasTerms.get(attrKey)!; // Set<Term>
    return Array.from(terms.values());
  }

  // Attribute → Variations
  getVariationsByAttribute(attrKey: string): readonly Variation[] {
    assertKnown(this.attributes, attrKey, "attribute");
    const vars = this.attributeHasVariations.get(attrKey)!; // Set<Variation>
    return Array.from(vars.values());
  }

  // Term → Attributes
  getAttributesByTerm(termKey: string): readonly Attribute[] {
    assertKnown(this.terms, termKey, "term");
    const attrs = this.termHasAttributes.get(termKey)!; // Set<Attribute>
    return Array.from(attrs.values());
  }

  // Term → Variations
  getVariationsByTerm(termKey: string): readonly Variation[] {
    assertKnown(this.terms, termKey, "term");
    const vars = this.termHasVariations.get(termKey)!; // Set<Variation>
    return Array.from(vars.values());
  }

  // Variation → Terms
  getTermsByVariation(variationKey: string): readonly Term[] {
    assertKnown(this.variations, variationKey, "variation");
    const terms = this.variationHasTerms.get(variationKey)!; // Set<Term>
    return Array.from(terms.values());
  }

  // Variation → Attributes
  getAttributesByVariation(variationKey: string): readonly Attribute[] {
    assertKnown(this.variations, variationKey, "variation");
    const attrs = this.variationHasAttributes.get(variationKey)!; // Set<Attribute>
    return Array.from(attrs.values());
  }
}

function assertKnown<T>(
  m: ReadonlyMap<string, T>,
  key: string,
  kind: "attribute" | "term" | "variation"
): void {
  if (!m.has(key)) throw new Error(`Unknown ${kind} key: "${key}"`);
}
