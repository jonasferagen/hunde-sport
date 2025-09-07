import { slugKey } from "@/lib/formatters";

import type { TermData } from "./Term";
export type AttrKey = string;

export type AttributeData = {
  id: number;
  taxonomy: string;
  name: string;
  has_variations: boolean;
  terms: TermData[];
};

export class Attribute {
  readonly key: AttrKey; // slug of attribute name, e.g. "storrelse"
  readonly label: string;
  readonly taxonomy: string;
  readonly has_variations: boolean;

  private constructor(data: AttributeData) {
    this.key = slugKey(data.name);
    this.label = data.name;
    this.taxonomy = data.taxonomy;
    this.has_variations = data.has_variations;
  }
  static create(data: AttributeData): Attribute {
    return new Attribute(data);
  }
}
