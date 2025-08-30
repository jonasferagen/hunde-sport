/** Compact selection wrapper used across the purchase flow. */
import { VariableProduct } from "./VariableProduct";

export class VariationSelection implements Iterable<[string, string | null]> {
  readonly variableProduct: VariableProduct;
  private readonly order: readonly string[];
  private readonly map: Map<string, string | null>;

  constructor(
    variableProduct: VariableProduct,
    init?: Map<string, string | null> | Record<string, string | null>
  ) {
    this.variableProduct = variableProduct;
    this.order = variableProduct.attributeOrder.slice(); // stable copy
    this.map = new Map<string, string | null>();

    // initialize all keys to null
    for (const key of this.order) this.map.set(key, null);

    // overlay initial values if provided
    if (init) {
      if (init instanceof Map) {
        for (const [k, v] of init) if (this.map.has(k)) this.map.set(k, v);
      } else {
        for (const k of Object.keys(init))
          if (this.map.has(k)) this.map.set(k, init[k]!);
      }
    }
  }

  /** Read current term slug (or null) for an attribute key. */
  get(attr: string): string | null {
    return this.map.get(attr) ?? null;
  }

  /** Immutable update producing a new VariationSelection. */
  with(attr: string, term: string | null): VariationSelection {
    if (!this.map.has(attr)) return this; // ignore unknown keys
    const next = new VariationSelection(this.variableProduct, this.map);
    next.map.set(attr, term);
    return next;
  }

  /** Return whether all attributes in the order are selected (non-null). */
  isComplete(): boolean {
    for (const k of this.order) if (!this.map.get(k)) return false;
    return true;
  }

  /** List of attribute KEYS that are not yet selected (in order). */
  missing(): string[] {
    const out: string[] = [];
    for (const k of this.order) if (!this.map.get(k)) out.push(k);
    return out;
  }

  /** Human message for UI, using product's display labels. Empty string if complete. */
  message(): string {
    const missing = this.missing();
    if (missing.length === 0) return "";
    const labels = missing.map(
      (k) => this.variableProduct.attributes.get(k)?.label ?? k
    );
    return `Velg ${formatListNo(labels)}`;
  }

  /** Canonical signature (attr=term|...) or null if incomplete. */
  toSignature(): string | null {
    if (!this.isComplete()) return null;
    return this.order.map((a) => `${a}=${this.map.get(a)}`).join("|");
  }

  /** Iterate like a Map<[attr, term|null]>. */
  [Symbol.iterator](): Iterator<[string, string | null]> {
    return this.map[Symbol.iterator]();
  }

  /** Convenience: forEach */
  forEach(cb: (term: string | null, attr: string) => void): void {
    this.map.forEach(cb);
  }

  /** Expose as a readonly Map if needed at edges. */
  toMap(): ReadonlyMap<string, string | null> {
    return this.map;
  }
}

/** Norwegian list-formatter (unchanged). */
function formatListNo(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} og ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} og ${items[items.length - 1]}`;
}
