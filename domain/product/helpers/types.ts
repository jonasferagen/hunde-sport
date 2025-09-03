import { slugKey } from "@/lib/formatters";

export type AttributeData = {
  id: number;
  taxonomy: string;
  name: string;
  has_variations: boolean;
  terms: TermData[];
};

export type TermData = {
  id: number;
  name: string;
  slug: string;
};

export type VariationData = {
  id: number;
  attributes: { name: string; value: string }[];
};

export class Attribute {
  readonly key: string; // slug of attribute name, e.g. "storrelse"
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

export class Term {
  readonly key: string; // composite: `${attrKey}:${termSlug}`
  readonly label: string;
  readonly slug: string; // raw term slug, e.g. "xss"
  readonly attrKey: string; // owning attribute key, e.g. "storrelse"

  private constructor(attr: Attribute, data: TermData) {
    const attrKey = attr.key;
    const termSlug = slugKey(data.slug);
    this.key = `${attrKey}:${termSlug}`;
    this.label = data.name;
    this.slug = termSlug;
    this.attrKey = attrKey;
  }
  static create(attr: Attribute, data: TermData): Term {
    return new Term(attr, data);
  }
}

export class Variation {
  readonly key: string; // `${id}`
  readonly attrKeys: string[] = []; // ["farge","storrelse"]
  readonly termKeys: string[] = []; // composite term keys matching Term.key

  private constructor(data: VariationData) {
    this.key = String(data.id);
    for (const a of data.attributes ?? []) {
      const attrKey = slugKey(a.name);
      const termSlug = slugKey(a.value);
      this.attrKeys.push(attrKey);
      this.termKeys.push(`${attrKey}:${termSlug}`); // <-- composite to match Term.key
    }
  }
  static create(data: VariationData): Variation {
    return new Variation(data);
  }
}
