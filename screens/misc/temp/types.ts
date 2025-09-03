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
  attrKey?: string; // not in original data
};

export type VariationData = {
  id: number;
  attributes: { name: string; value: string }[];
};

export class Attribute {
  key: string;
  label: string;
  taxonomy: string;
  has_variations: boolean;

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
  key: string;
  label: string;
  slug: string;
  attrKey: string;

  private constructor(data: TermData) {
    this.key = slugKey(data.slug);
    this.label = data.name;
    this.slug = data.slug;
    this.attrKey = data.attrKey!;
  }
  static create(data: TermData): Term {
    return new Term(data);
  }
}

export class Variation {
  key: string;
  attrKeys: string[] = [];
  termKeys: string[] = [];

  private constructor(data: VariationData) {
    this.key = String(data.id);
    for (const attr of data.attributes ?? []) {
      this.attrKeys.push(slugKey(attr.name));
      this.termKeys.push(slugKey(attr.value));
    }
  }
  static create(data: VariationData): Variation {
    return new Variation(data);
  }
}
