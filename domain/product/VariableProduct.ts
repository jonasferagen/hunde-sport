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

  // Relationship maps (public, readonly views)
  public readonly attributeHasTerms: ReadonlyMap<string, ReadonlySet<string>>;
  public readonly attributeHasVariations: ReadonlyMap<
    string,
    ReadonlySet<string>
  >;
  public readonly termHasAttributes: ReadonlyMap<string, ReadonlySet<string>>;
  public readonly termHasVariations: ReadonlyMap<string, ReadonlySet<string>>;
  public readonly variationHasTerms: ReadonlyMap<string, ReadonlySet<string>>;
  public readonly variationHasAttributes: ReadonlyMap<
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
    // writable locals during build
    const attributeHasTerms = new Map<string, Set<string>>();
    const attributeHasVariations = new Map<string, Set<string>>();
    const termHasAttributes = new Map<string, Set<string>>();
    const termHasVariations = new Map<string, Set<string>>();
    const variationHasTerms = new Map<string, Set<string>>();
    const variationHasAttributes = new Map<string, Set<string>>();

    // pre-seed all valid keys
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

    // populate relations
    for (const t of terms.values()) {
      termHasAttributes.get(t.key)!.add(t.attrKey);
      attributeHasTerms.get(t.attrKey)!.add(t.key);
    }
    for (const v of variations.values()) {
      for (const tKey of v.termKeys) {
        try {
          variationHasTerms.get(v.key)!.add(tKey);
          termHasVariations.get(tKey)!.add(v.key);
        } catch (e) {
          console.log(e);
          console.log(tKey);
        }
      }
      for (const aKey of v.attrKeys) {
        variationHasAttributes.get(v.key)!.add(aKey);
        attributeHasVariations.get(aKey)!.add(v.key);
      }
    }

    // readonly views via typing
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

  getTermsByAttribute(attrKey: string): ReadonlySet<string> {
    assertKnown(this.attributes, attrKey, "attribute");
    return this.attributeHasTerms.get(attrKey)!;
  }
  getVariationsByAttribute(attrKey: string): ReadonlySet<string> {
    assertKnown(this.attributes, attrKey, "attribute");
    return this.attributeHasVariations.get(attrKey)!;
  }
  getAttributesByTerm(termKey: string): ReadonlySet<string> {
    assertKnown(this.terms, termKey, "term");
    return this.termHasAttributes.get(termKey)!;
  }
  getVariationsByTerm(termKey: string): ReadonlySet<string> {
    assertKnown(this.terms, termKey, "term");
    return this.termHasVariations.get(termKey)!;
  }
  getTermsByVariation(variationKey: string): ReadonlySet<string> {
    assertKnown(this.variations, variationKey, "variation");
    return this.variationHasTerms.get(variationKey)!;
  }
  getAttributesByVariation(variationKey: string): ReadonlySet<string> {
    assertKnown(this.variations, variationKey, "variation");
    return this.variationHasAttributes.get(variationKey)!;
  }
}

function assertKnown<T>(
  m: ReadonlyMap<string, T>,
  key: string,
  kind: "attribute" | "term" | "variation"
): void {
  if (!m.has(key)) throw new Error(`Unknown ${kind} key: "${key}"`);
}
