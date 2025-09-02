import type { AttributeData, TermData, VariationData } from "./types";
import { Attribute, Term, Variation } from "./types";

export function parse(data: any) {
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
