import type { TermData } from "@/domain/product-attributes/Term";
import { slugKey } from "@/lib/formatters";

export type AttrKey = string;

export type AttributeData = {
  name: string;
  has_variations: boolean;
  terms: TermData[];
  taxonomy?: string | null; // present in payload, ignored operationally
};

export class Attribute {
  readonly key: AttrKey; // e.g. "farge"
  readonly label: string;
  readonly hasVariations: boolean;

  private constructor(data: AttributeData) {
    this.key = slugKey(data.name);

    this.label = data.name;
    this.hasVariations = data.has_variations;
  }
  static create(data: AttributeData): Attribute {
    return new Attribute(data);
  }
}
