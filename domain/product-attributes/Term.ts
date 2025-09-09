import { capitalize, slugKey } from "@/lib/formatters";

import type { Attribute, AttrKey } from "./Attribute";

export type TermKey = string;
export type TermData = { id: number; name: string; slug: string };

export class Term {
  /** INTERNAL composite key: `${attr.internalKey}:${termSlug}` */
  readonly key: TermKey;
  readonly attrKey: AttrKey;
  readonly slug: string; // normalized slug (value to send)
  readonly label: string; // UI label

  private constructor(attr: Attribute, data: TermData) {
    const termSlug = slugKey(data.slug);
    this.attrKey = attr.key;
    this.slug = termSlug;
    this.key = `${attr.key}:${termSlug}`;
    this.label = capitalize(data.name);
  }
  static create(attr: Attribute, data: TermData): Term {
    return new Term(attr, data);
  }
}
