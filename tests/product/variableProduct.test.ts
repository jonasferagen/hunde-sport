// tests/product/variableProduct.test.ts
import { Product, type ProductData } from "@/domain/product/Product";
import { VariableProduct } from "@/domain/product/VariableProduct";

import {
  expectValidSimple,
  expectValidVariable,
  expectValidVariation,
  loadProduct,
  readFixture,
} from "./helpers";

describe("Product.fromRaw (simple/variation)", () => {
  test("simple.json → SimpleProduct", () => {
    expectValidSimple(loadProduct("simple.json"));
  });

  test("variation.json → ProductVariation", () => {
    expectValidVariation(loadProduct("variation.json"));
  });

  test("variations.json list → ProductVariation[]", () => {
    const list = readFixture<ProductData[]>("variations.json");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);

    list.forEach((raw, idx) => {
      try {
        expectValidVariation(Product.create(raw));
      } catch (e) {
        throw new Error(
          `Variation item ${idx} failed: ${(e as Error).message}`
        );
      }
    });
  });
});

describe("VariableProduct (attributes/terms/variations)", () => {
  test("variable.json → VariableProduct invariants", () => {
    const vp = loadProduct("variable.json") as VariableProduct;
    expectValidVariable(vp);

    // Each attribute should have at least one variation set
    for (const ak of vp.attributeOrder) {
      const s = vp.getVariationSetForAttribute(ak);
      expect(s.size).toBeGreaterThan(0);
    }
  });

  test("missingterm.json → skips invalid variations", () => {
    const raw = readFixture<ProductData>("missingterm.json");
    const vp = Product.create(raw) as VariableProduct;
    expectValidVariable(vp);
    // Some raw variations may be dropped due to unknown term/attr
    expect(vp.rawVariations.length).toBeGreaterThanOrEqual(
      vp.variations.length
    );
  });

  test("variable-attr-double.json → duplicate combos deduped; strict match returns id", () => {
    const vp = loadProduct("variable-attr-double.json") as VariableProduct;
    expectValidVariable(vp);

    // Pick the first surviving variation and build selection in attribute order
    const first = vp.variations[0];
    const combo = vp.attributeOrder.map((attrKey) => {
      const opt = first.options.find((o) => o.attribute === attrKey);
      expect(opt).toBeDefined();
      return opt!.term;
    });

    // After build-time dedupe, the strict resolver must now return the id
    const id = vp.getVariationId(combo);
    expect(id).toBe(first.key);
  });

  test("variable-attr-single.json → strict match works for single-attribute products", () => {
    const vp = loadProduct("variable-attr-single.json") as VariableProduct;
    expectValidVariable(vp);

    const attrKey = vp.attributeOrder[0];
    const v = vp.variations[0];
    const opt = v.options.find((o) => o.attribute === attrKey);
    expect(opt).toBeDefined();

    const id = vp.getVariationId([opt!.term]);
    expect(id).toBe(v.key);
  });
});
