import type { Attribute } from "./Attribute";

export class AttributeIndex {
  private byNameLower = new Map<string, Attribute>();

  constructor(attrs: Attribute[]) {
    for (const a of attrs) this.byNameLower.set(a.label.toLowerCase(), a);
  }
  /** resolve by product label (Store API variation attributes use names) */
  getByName(name: string): Attribute | undefined {
    return this.byNameLower.get(name.trim().toLowerCase());
  }
}
