// domain/product/VariableProduct.ts

import type { AttributeData, TermData, VariationData } from "./helpers/types";
import { Attribute, Term, Variation } from "./helpers/types";
import { Product, type ProductData } from "./Product";

type Mapped = {
  attributeHasTerms: Map<string, Set<string>>;
  attributeHasVariations: Map<string, Set<string>>;
  termHasAttributes: Map<string, Set<string>>;
  termHasVariations: Map<string, Set<string>>;
  variationHasTerms: Map<string, Set<string>>;
  variationHasAttributes: Map<string, Set<string>>;
};

export class VariableProduct extends Product {
  attributes: Map<string, Attribute>;
  types: Map<string, Term>;
  variations: Map<string, Variation>;

  mapped: Mapped;

  private constructor(data: ProductData) {
    const base = Product.mapBase(data, "variable");
    const maps = parse(data);
    super(base);

    this.attributes = maps.amap;
    this.types = maps.tmap;
    this.variations = maps.vmap;
    this.mapped = this.createMaps();
  }

  static create(data: ProductData): VariableProduct {
    if (data.type !== "variable") {
      throw new Error("fromData(variable) received non-variable");
    }

    return new VariableProduct(data);
  }

  private createMaps(): Mapped {
    const maps: Mapped = {
      attributeHasTerms: new Map<string, Set<string>>(),
      attributeHasVariations: new Map<string, Set<string>>(),
      termHasAttributes: new Map<string, Set<string>>(),
      termHasVariations: new Map<string, Set<string>>(),
      variationHasAttributes: new Map<string, Set<string>>(),
      variationHasTerms: new Map<string, Set<string>>(),
    };

    // Build term ↔ attribute mappings
    for (const t of [...this.types.values()]) {
      const { key: tKey, attrKey: aKey } = t;
      addToSetMap(maps.termHasAttributes, tKey, aKey);
      addToSetMap(maps.attributeHasTerms, aKey, tKey);
    }
    // Build variation ↔ term and variation ↔ attribute mappings
    for (const v of [...this.variations.values()]) {
      const { key: vKey, termKeys, attrKeys } = v;

      for (const tKey of termKeys) {
        addToSetMap(maps.variationHasTerms, vKey, tKey);
        addToSetMap(maps.termHasVariations, tKey, vKey);
      }

      for (const aKey of attrKeys) {
        addToSetMap(maps.variationHasAttributes, vKey, aKey);
        addToSetMap(maps.attributeHasVariations, aKey, vKey);
      }
    }
    return maps;
  }
}

function parse(data: any) {
  const amap = new Map<string, Attribute>();
  const tmap = new Map<string, Term>();
  const vmap = new Map<string, Variation>();

  for (const a of data.attributes ?? []) {
    const attribute = Attribute.create(a as AttributeData);
    if (!attribute.has_variations) {
      continue;
    }

    for (let t of a.terms ?? []) {
      t.attrKey = attribute.key;
      const term = Term.create(t as TermData);
      tmap.set(term.key, term);
    }
    amap.set(attribute.key, attribute);
  }
  for (const v of data.variations ?? []) {
    const variation = Variation.create(v as VariationData);
    vmap.set(variation.key, variation);
  }
  return { amap, tmap, vmap };
}

function addToSetMap(
  map: Map<string, Set<string>>,
  key: string,
  value: string
) {
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key)!.add(value);
}
