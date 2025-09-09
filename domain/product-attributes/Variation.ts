import type { AttrKey } from "@/domain/product-attributes/Attribute";
import type { TermKey } from "@/domain/product-attributes/Term";
import { slugKey } from "@/lib/formatters";

export type VariationKey = string;

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
    for (const a of data.attributes ?? []) {
      const attrKey = slugKey(a.name);
      const termSlug = slugKey(a.value);
      const termKey = `${attrKey}:${termSlug}`;
      this.attrKeys.push(attrKey);
      this.termKeys.push(termKey);
      this.options.push({ attribute: attrKey, value: termSlug });
    }
    this.selectionKey = this.termKeys.map((termKey) => termKey).join("|");
  }

  static create(data: VariationData): Variation {
    return new Variation(data);
  }
}
