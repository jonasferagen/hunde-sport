import type { AttributeSelection } from "@/domain/product-attributes/AttributeSelection";
import { Term, type TermData } from "@/domain/product-attributes/Term";

import { Attribute, type AttributeData } from "../product-attributes/Attribute";
import { Variation, type VariationData } from "../product-attributes/Variation";
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

  private readonly selectionHasVariation: ReadonlyMap<string, string>;
  private readonly attributeHasTerms: ReadonlyMap<string, ReadonlySet<string>>;
  private readonly termHasVariations: ReadonlyMap<string, ReadonlySet<string>>;

  private constructor(data: ProductData) {
    const base = Product.mapBase(data, "variable");
    super(base);

    const { attributes, terms, variations, selectionHasVariation } =
      VariableProduct.parse(data);

    this.attributes = attributes;
    this.terms = terms;
    this.variations = variations;
    this.selectionHasVariation = selectionHasVariation;

    const rel = VariableProduct.buildRelationships(
      attributes,
      terms,
      variations
    );
    this.attributeHasTerms = rel.attributeHasTerms;
    this.termHasVariations = rel.termHasVariations;
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
    selectionHasVariation: ReadonlyMap<string, string>;
  } {
    const attributes = new Map<string, Attribute>();
    const terms = new Map<string, Term>();
    const variations = new Map<string, Variation>();

    for (const a of data.attributes ?? []) {
      const attr = Attribute.create(a as AttributeData);
      if (!attr.hasVariations) continue;

      for (const t of a.terms ?? []) {
        const term = Term.create(attr, t as TermData); // composite key
        terms.set(term.key, term);
      }
      attributes.set(attr.key, attr);
    }

    // Variations (skip those referencing unknown/sanitized-out terms)
    const selectionHasVariation = new Map<string, string>();

    for (const v of data.variations ?? []) {
      const variation = Variation.create(v as VariationData);
      if (variation.termKeys.every((k) => terms.has(k))) {
        if (selectionHasVariation.has(variation.selectionKey)) {
          continue;
        }
        variations.set(variation.key, variation);
        selectionHasVariation.set(variation.selectionKey, variation.key);
      }
    }

    return {
      attributes,
      terms,
      variations,
      selectionHasVariation,
    };
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

  findVariation(selection: AttributeSelection): Variation | undefined {
    if (!selection.isComplete()) {
      return undefined;
    }
    const sKey = selection.key!;
    const vKey = this.selectionHasVariation.get(sKey)!;
    return this.variations.get(vKey)!;
  }
}

function assertKnown<T>(
  m: ReadonlyMap<string, T>,
  key: string,
  kind: "attribute" | "term" | "variation"
): void {
  if (!m.has(key)) throw new Error(`Unknown ${kind} key: "${key}"`);
}
