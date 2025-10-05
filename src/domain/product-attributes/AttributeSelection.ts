import { Attribute, type AttrKey } from "./Attribute";
import { Term } from "./Term";

type SelectionInfo = {
  selectedTerm: Term | undefined;
  otherAttrKey: AttrKey | undefined;
  otherSelectedTerm: Term | undefined;
};

type AttributeSelectionKey = string;

export class AttributeSelection {
  public readonly selected: ReadonlyMap<AttrKey, Term | undefined>;

  private constructor(selected: Map<AttrKey, Term | undefined>) {
    this.selected = selected;
  }

  static create(
    attributes: ReadonlyMap<AttrKey, Attribute>,
  ): AttributeSelection {
    const selected = new Map<AttrKey, Term | undefined>();
    for (const key of attributes.keys()) {
      selected.set(key, undefined);
    }
    return new AttributeSelection(selected);
  }

  get key(): AttributeSelectionKey | undefined {
    if (!this.isComplete()) {
      return undefined;
    }

    return this.getTerms()
      .map((t) => t?.compositeKey)
      .join("|");
  }

  public current(attrKey: AttrKey): SelectionInfo {
    const selectedTerm = this.selected.get(attrKey);
    const attrKeys = Array.from(this.selected.keys());
    const otherAttrKey: AttrKey | undefined = attrKeys.findLast(
      (k) => k !== attrKey,
    );
    const otherSelectedTerm = otherAttrKey
      ? this.selected.get(otherAttrKey)
      : undefined;
    return { selectedTerm, otherAttrKey, otherSelectedTerm };
  }

  with(attrKey: AttrKey, term: Term | undefined) {
    const record = new Map(this.selected);
    record.set(attrKey, term);
    return new AttributeSelection(record);
  }

  isComplete(): boolean {
    const keys = this.selected.size;
    const terms = this.getTerms().filter((t) => t !== undefined);
    return keys === terms.length;
  }

  getTerms(): (Term | undefined)[] {
    return Array.from(this.selected.values());
  }
}
