// domain/Product/helpers/VariableProductHelper.ts
import { VariableProduct } from "@/domain/Product/VariableProduct";

export class VariableProductHelper {
  private byAttribute: Map<string, Set<number>> = new Map();
  private byTerm: Map<string, Set<number>> = new Map();
  private byAttrTerm: Map<string, Map<string, Set<number>>> = new Map();

  constructor(private readonly product: VariableProduct) {
    for (const v of product.variants) {
      for (const opt of v.options) {
        // attribute -> set(variantId)
        const aSet = this.byAttribute.get(opt.attribute) ?? new Set<number>();
        aSet.add(v.key);
        this.byAttribute.set(opt.attribute, aSet);

        // term -> set(variantId)
        const tSet = this.byTerm.get(opt.term) ?? new Set<number>();
        tSet.add(v.key);
        this.byTerm.set(opt.term, tSet);

        // attribute -> (term -> set(variantId))
        const inner =
          this.byAttrTerm.get(opt.attribute) ?? new Map<string, Set<number>>();
        const atSet = inner.get(opt.term) ?? new Set<number>();
        atSet.add(v.key);
        inner.set(opt.term, atSet);
        this.byAttrTerm.set(opt.attribute, inner);
      }
    }
  }

  // Positive queries (return variant IDs)
  getVariantIdsForAttribute(attributeKey: string): number[] {
    return [...(this.byAttribute.get(attributeKey) ?? new Set<number>())];
  }
  getVariantIdsForTerm(termKey: string): number[] {
    return [...(this.byTerm.get(termKey) ?? new Set<number>())];
  }
  getVariantIdsForAttributeTerm(
    attributeKey: string,
    termKey: string
  ): number[] {
    const inner = this.byAttrTerm.get(attributeKey);
    if (!inner) return [];
    return [...(inner.get(termKey) ?? new Set<number>())];
  }

  // Discovery helpers (what actually appears in variants)
  getAllUsedAttributeKeys(): string[] {
    return [...this.byAttribute.keys()];
  }
  getAllUsedTermKeys(): string[] {
    return [...this.byTerm.keys()];
  }
  getAllUsedAttributeTermPairs(): { attribute: string; term: string }[] {
    const out: { attribute: string; term: string }[] = [];
    for (const [attr, inner] of this.byAttrTerm) {
      for (const term of inner.keys()) out.push({ attribute: attr, term });
    }
    return out;
  }

  // Boolean checks (handy in UI logic & tests)
  hasVariantForAttribute(attributeKey: string): boolean {
    return (this.byAttribute.get(attributeKey)?.size ?? 0) > 0;
  }
  hasVariantForTerm(termKey: string): boolean {
    return (this.byTerm.get(termKey)?.size ?? 0) > 0;
  }
  hasVariantForAttributeTerm(attributeKey: string, termKey: string): boolean {
    const inner = this.byAttrTerm.get(attributeKey);
    return (inner?.get(termKey)?.size ?? 0) > 0;
  }
}
