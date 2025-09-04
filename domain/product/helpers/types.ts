import { capitalize, slugKey } from "@/lib/formatters";

type AttrKey = string;
type VariationKey = string;
type TermKey = string;

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

export class Variation {
  readonly key: VariationKey; // `${id}`
  readonly attrKeys: AttrKey[] = []; // ["farge","storrelse"]
  readonly termKeys: TermKey[] = []; // composite term keys matching Term.key
  readonly selectionKey: string;

  private constructor(data: VariationData) {
    this.key = String(data.id);

    for (const a of data.attributes ?? []) {
      const attrKey = slugKey(a.name);
      const termSlug = slugKey(a.value);
      const termKey = `${attrKey}:${termSlug}`;
      this.attrKeys.push(attrKey);
      this.termKeys.push(termKey);
    }
    this.selectionKey = this.termKeys.join("|");
  }
  static create(data: VariationData): Variation {
    return new Variation(data);
  }
}

type AttributeRecord = Record<AttrKey, Term | undefined>;

type SelectionInfo = {
  selectedTerm: Term | undefined;
  otherAttrKey: AttrKey | undefined;
  otherSelectedTerm: Term | undefined;
};

export class AttributeSelection {
  public readonly selected: AttributeRecord;

  private constructor(selected: AttributeRecord) {
    this.selected = selected;
  }

  static create(
    attributes: ReadonlyMap<AttrKey, Attribute>
  ): AttributeSelection {
    const selected: AttributeRecord = {};
    for (const key of attributes.keys()) selected[key] = undefined;
    return new AttributeSelection(selected);
  }

  public current(attrKey: AttrKey): SelectionInfo {
    const selectedTerm = this.selected[attrKey];
    const attrKeys = Object.keys(this.selected).flat();
    const otherAttrKey: AttrKey | undefined = attrKeys.findLast(
      (k) => k !== attrKey
    );
    const otherSelectedTerm = otherAttrKey
      ? this.selected[otherAttrKey]
      : undefined;
    return { selectedTerm, otherAttrKey, otherSelectedTerm };
  }

  with(attrKey: AttrKey, term: Term | undefined) {
    const record = { ...this.selected, [attrKey]: term };

    return new AttributeSelection(record);
  }

  isComplete(): boolean {
    const keys = Object.keys(this.selected);
    const terms = this.getTerms().filter((t) => t !== undefined);
    return keys.length === terms.length;
  }

  getTerms(): (Term | undefined)[] {
    return Object.values(this.selected);
  }
}
