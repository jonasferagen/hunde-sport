import { capitalize, slugKey } from "@/lib/formatters";

import type { Attribute, AttrKey } from "./Attribute";

export type TermKey = string;
export type TermData = { id: number; name: string; slug: string };
type CompositeKey = string;

export class Term {
  readonly key: TermKey;
  readonly attrKey: AttrKey;
  readonly compositeKey: CompositeKey;
  readonly label: string; // UI label

  private constructor(attr: Attribute, data: TermData) {
    this.attrKey = attr.key;
    this.key = slugKey(data.slug);
    this.compositeKey = `${attr.key}:${this.key}`;
    this.label = capitalize(data.name);
  }
  static create(attr: Attribute, data: TermData): Term {
    return new Term(attr, data);
  }
}
