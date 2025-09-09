import { intersectSets } from "@/lib/util";
import type { VariableProduct } from "@/types";

import { Attribute, type AttrKey } from "./Attribute";
import { Term } from "./Term";
import type { Variation } from "./Variation";

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

  findVariation(variableProduct: VariableProduct): Variation | undefined {
    if (!this.isComplete()) {
      return undefined;
    }
    const sets = [];
    for (const term of this.getTerms()) {
      const v = variableProduct.getVariationsByTerm(term!.key);
      sets.push(v);
    }
    const I = intersectSets(...sets);

    if (I.size !== 1) {
      throw new Error(
        `Expected single variation, got ${I.size}: variableProduct ${variableProduct.id}`
      );
    }
    return Array.from(I)[0]; // Always set to first
  }
}
