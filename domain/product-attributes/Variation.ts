import type { AttrKey } from "@/domain/product-attributes/Attribute";
import type { TermKey } from "@/domain/product-attributes/Term";
import { slugKey } from "@/lib/formatters";

type VariationKey = string;

export type VariationData = {
  id: number;
  attributes: { name: string; value: string }[];
};

export class Variation {
  readonly key: VariationKey; // `${id}`
  readonly attrKeys: AttrKey[] = []; // ["farge","storrelse"]
  readonly termKeys: TermKey[] = []; // composite term keys matching Term.key
  readonly selectionKey: string; // "farge:blaa|storrelse:xl" (ORDER-INSENSITIVE)
  readonly options: Record<string, string>[] = [];
  private constructor(data: VariationData) {
    this.key = String(data.id);
    let skey = [];
    for (const a of data.attributes ?? []) {
      const attrKey = slugKey(a.name);
      const termKey = slugKey(a.value);
      this.attrKeys.push(attrKey);
      this.termKeys.push(termKey);
      this.options.push({ attribute: attrKey, value: termKey });
      skey.push(`${attrKey}:${termKey}`);
    }
    this.selectionKey = skey.join("|");
  }

  static create(data: VariationData): Variation {
    return new Variation(data);
  }
}
