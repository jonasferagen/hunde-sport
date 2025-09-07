import { capitalize, slugKey } from "@/lib/formatters";

import { Attribute, type AttrKey } from "./Attribute";
export type TermKey = string;
export type TermData = {
  id: number;
  name: string;
  slug: string;
};

export class Term {
  readonly key: TermKey; // composite: `${attrKey}:${termSlug}`
  readonly attrKey: AttrKey; // owning attribute key, e.g. "storrelse"
  readonly slug: string; // raw term slug, e.g. "xss"
  readonly label: string;

  private constructor(attr: Attribute, data: TermData) {
    const attrKey = attr.key;
    const termSlug = slugKey(data.slug);
    this.key = `${attrKey}:${termSlug}`;
    this.attrKey = attrKey;
    this.slug = termSlug;
    this.label = capitalize(data.name);
  }
  static create(attr: Attribute, data: TermData): Term {
    return new Term(attr, data);
  }
}
