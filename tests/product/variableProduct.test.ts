// tests/product/variableProduct.test.ts
import type { ProductData } from "@/domain/product/Product";
import { Product } from "@/domain/product/Product";
import type { VariableProduct } from "@/types";

import {
  expectValidSimple,
  expectValidVariable,
  expectValidVariation,
  loadProduct,
  readFixture,
} from "./variableProduct2.test";

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
    expect(vp.variations.length).toBeGreaterThan(0);

    // Pick the first surviving variation and build selection in attribute order
    const first = vp.variations[0]!;
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
    expect(vp.attributeOrder.length).toBeGreaterThan(0);
    expect(vp.variations.length).toBeGreaterThan(0);

    const attrKey = vp.attributeOrder[0]!;
    const v = vp.variations[0]!;
    const opt = v.options.find((o) => o.attribute === attrKey);
    expect(opt).toBeDefined();

    const id = vp.getVariationId([opt!.term]);
    expect(id).toBe(v.key);
  });
});

test("drops variations with unknown attribute or mismatched term", () => {
  const vp = loadProduct("missingterm.json") as VariableProduct;
  // all surviving options must reference known attr/term pairs
  for (const v of vp.variations) {
    for (const o of v.options) {
      const attr = vp.getAttribute(o.attribute);
      const term = vp.getTerm(o.term);
      expect(attr).toBeTruthy();
      expect(term).toBeTruthy();
      expect(term!.attribute).toBe(o.attribute);
    }
  }
});

test("getVariationId returns undefined for incomplete or wrong-length combo", () => {
  const vp = loadProduct("variable.json") as VariableProduct;
  const first = vp.variations[0]!;
  const full = first.options.map((o) => o.term);
  expect(vp.getVariationId(full.slice(0, full.length - 1))).toBeUndefined();
  expect(vp.getVariationId(["__bad__"])).toBeUndefined();
});

test("attributes/terms/sets are readonly views", () => {
  const vp = loadProduct("variable.json") as VariableProduct;
  expect(() => (vp.attributes as Map<any, any>).set("x", "y")).toThrow?.(); // in TS, compile will block; at runtime no-op pattern
  expect(vp.getVariationSetForAttribute(vp.attributeOrder[0]!)).toBeDefined();
});

test("case/whitespace normalization", () => {
  const vp = Product.create({
    ...(readFixture("variable.json") as any),
    attributes: [{ name: "Farge", slug: "Farge" }],
    variations: [
      { id: 1, attributes: [{ name: "Farge", value: "  Karamell  " }] },
    ],
  }) as VariableProduct;

  expect(vp.attributeOrder[0]).toBe("farge");
  const id = vp.getVariationId(["karamell"]);
  expect(id).toBeDefined();
});

test("attribute name with diacritics matches taxonomy key", () => {
  const raw = readFixture<ProductData>("variable.json");
  const vp = Product.create(raw) as VariableProduct;
  expect(vp.attributeOrder).toContain("storrelse"); // not "størrelse"
  const a = vp.getAttribute("storrelse");
  expect(a?.label.toLowerCase()).toContain("st");
});
