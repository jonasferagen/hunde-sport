// domain/product/VariableProduct.ts
import { freezeMap } from "@/lib/util";

import type { Attribute, Term, Variation } from "./helpers/types";
import {
  buildSetsByAttr,
  makeComboKey,
  normalizeAndDedupeVariations,
  normalizeAttributesAndTerms,
  normalizeRawVariations,
} from "./helpers/variableProduct.normalizers";
import { Product, type ProductData } from "./Product";

export class VariableProduct extends Product {
  // public API your tests use:
  readonly attributeOrder: readonly string[];
  readonly attributes: ReadonlyMap<string, Attribute>;
  readonly terms: ReadonlyMap<string, Term>;
  readonly rawVariations: readonly Variation[];
  readonly variations: readonly Variation[]; // after normalize+dedupe
  readonly variationIds: readonly number[];
  readonly variationIdSet: ReadonlySet<number>;

  // helpers
  private readonly comboToId: ReadonlyMap<string, number>;
  private readonly setsByAttr: ReadonlyMap<string, ReadonlySet<string>>;

  private constructor(
    base: ReturnType<typeof Product.mapBase>,
    extras: {
      attributeOrder: readonly string[];
      attributes: ReadonlyMap<string, Attribute>;
      terms: ReadonlyMap<string, Term>;
      rawVariations: readonly Variation[];
      variations: readonly Variation[];
      comboToId: ReadonlyMap<string, number>;
      setsByAttr: ReadonlyMap<string, ReadonlySet<string>>;
    }
  ) {
    if (base.type !== "variable")
      throw new Error("Invalid type for VariableProduct");
    super(base);
    this.attributeOrder = extras.attributeOrder;
    this.attributes = extras.attributes;
    this.terms = extras.terms;
    this.rawVariations = extras.rawVariations;
    this.variations = extras.variations;
    this.variationIds = Object.freeze(extras.variations.map((v) => v.key));
    this.variationIdSet = new Set(this.variationIds);
    this.comboToId = extras.comboToId;
    this.setsByAttr = extras.setsByAttr;
  }

  static create(data: ProductData): VariableProduct {
    if (data.type !== "variable")
      throw new Error("fromData(variable) received non-variable");

    const base = Product.mapBase(data, "variable");

    const { attributeOrder, attributes, terms } =
      normalizeAttributesAndTerms(data);
    const rawVariations = Object.freeze(normalizeRawVariations(data));

    const { variations, comboToId } = normalizeAndDedupeVariations(
      attributeOrder,
      attributes,
      terms,
      rawVariations
    );
    const setsByAttr = buildSetsByAttr(attributeOrder, variations);
    return new VariableProduct(base, {
      attributeOrder,
      attributes: freezeMap(attributes),
      terms: freezeMap(terms),
      rawVariations,
      variations,
      comboToId,
      setsByAttr,
    });
  }

  // === Public API used by tests ===

  getVariationSetForAttribute(attrKey: string): ReadonlySet<string> {
    return this.setsByAttr.get(attrKey) ?? new Set();
  }

  getAttribute(attrKey: string): Attribute | undefined {
    return this.attributes.get(attrKey);
  }

  getTerm(termKey: string): Term | undefined {
    return this.terms.get(termKey);
  }

  /** Strict resolver: returns id if combo matches exactly (all attributes), otherwise undefined */
  getVariationId(combo: readonly string[]): number | undefined {
    if (combo.length !== this.attributeOrder.length) return undefined;
    return this.comboToId.get(makeComboKey(this.attributeOrder, combo));
  }
}
