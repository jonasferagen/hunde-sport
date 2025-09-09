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
  readonly index: number;
  /** stable internal key you own (lowercased slug of label) */
  readonly key: AttrKey; // e.g. "farge"
  /** the label form you’ll send for locals */
  //readonly cartKey: string; // e.g. "farge"
  readonly label: string;
  readonly hasVariations: boolean;

  private constructor(data: AttributeData, index: number) {
    this.index = index;
    this.label = data.name;
    this.key = slugKey(data.name);
    //this.cartKey = data.name; // using label form consistently
    this.hasVariations = data.has_variations;
  }
  static create(data: AttributeData, index: number): Attribute {
    return new Attribute(data, index);
  }
}
