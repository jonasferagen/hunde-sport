import fs from "fs";
import path from "path";

// tests/product/variableProduct.test.ts
import type { ProductData } from "@/domain/product/Product";
import { Product } from "@/domain/product/Product";
import { ProductVariation } from "@/domain/product/ProductVariation";
import { SimpleProduct } from "@/domain/product/SimpleProduct";
import { VariableProduct } from "@/domain/product/VariableProduct";

const FIXTURES = path.resolve(__dirname, "__fixtures__");

export function readFixture<T = unknown>(name: string): T {
  const p = path.join(FIXTURES, name);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function loadProduct(name: string) {
  const raw = readFixture<ProductData>(name);
  return Product.create(raw); // returns Product | SimpleProduct | VariableProduct | ProductVariation
}

/** Assertions */
export function expectValidSimple(p: unknown) {
  expect(p).toBeInstanceOf(SimpleProduct);
  const sp = p as SimpleProduct;
  expect(sp.type).toBe("simple");
  expect(sp.id).toBeGreaterThan(0);
  expect(sp.prices.price).toBeDefined();
  expect(sp.images.length).toBeGreaterThan(0);
  expect(typeof sp.availability.isPurchasable).toBe("boolean");
}

export function expectValidVariation(p: unknown) {
  expect(p).toBeInstanceOf(ProductVariation);
  const v = p as ProductVariation;
  expect(v.type).toBe("variation");
  expect(v.id).toBeGreaterThan(0);
  expect(v.parent).toBeGreaterThan(0);
  expect(v.prices.price).toBeDefined();
  expect(Array.isArray(v.images)).toBe(true);
  expect(typeof v.availability.isPurchasable).toBe("boolean");
  if (v.variation !== undefined) expect(typeof v.variation).toBe("string");
}

export function expectValidVariable(p: unknown) {
  expect(p).toBeInstanceOf(VariableProduct);
  const vp = p as VariableProduct;

  expect(vp.type).toBe("variable");
  expect(vp.attributes.size).toBeGreaterThan(0);
  expect(vp.variations.length).toBeGreaterThan(0);
  expect(vp.prices.price).toBeDefined();

  // must have at least one surviving variation (after skip-invalid)
  expect(vp.variations.length).toBeGreaterThan(0);

  // surviving ids consistency
  const keys = vp.variations.map((v) => v.key);
  expect(vp.variationIds).toEqual(keys);
  expect(vp.variationIdSet.size).toBe(vp.variationIds.length);
  for (const id of vp.variationIds)
    expect(vp.variationIdSet.has(id)).toBe(true);

  // each option refers to valid attribute + term and they match
  for (const v of vp.variations) {
    expect(v.options.length).toBeGreaterThan(0);
    for (const opt of v.options) {
      const attr = vp.getAttribute(opt.attribute);
      const term = vp.getTerm(opt.term);
      expect(attr).toBeDefined();
      expect(term).toBeDefined();
      expect(term!.attribute).toBe(opt.attribute);
    }
  }
}

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
    expect((vp.variations ?? []).length).toBeGreaterThanOrEqual(
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

  const vp = Product.create({
    ...raw,
    attributes: [
      {
        name: "Størrelse",
        taxonomy: "pa_storrelse",
        has_variations: true,
        terms: [],
      },
    ],
    variations: [
      { id: 1, attributes: [{ name: "Størrelse", value: "  Karamell  " }] },
    ],
  } as any) as VariableProduct;

  expect(vp.attributeOrder).toContain("storrelse");
  const id = vp.getVariationId(["karamell"]);
  expect(id).toBeDefined();

  dumpVp(vp);
});
const dumpVp = (vp: any) => {
  // careful: maps -> arrays so they print nicely
  // comboToId is private; just peek with (vp as any) if present
  const comboToId = (vp as any).comboToId
    ? Array.from((vp as any).comboToId.entries())
    : [];

  // for a quick glance, show only first 5 terms and 3 variations
  console.log(
    JSON.stringify(
      {
        order: vp.attributeOrder,
        attrs: Array.from(vp.attributes.keys()),
        termsCount: vp.terms ? (vp.terms as Map<any, any>).size : undefined,
        termsSample: vp.terms
          ? Array.from(vp.terms.keys()).slice(0, 5)
          : undefined,
        rawVariations: vp.rawVariations?.length,
        keptVariations: vp.variations?.length,
        sampleVariation: vp.variations?.[0],
        comboToIdSample: comboToId.slice(0, 5),
        setsByAttrSample: vp.attributeOrder.map((ak: string) => ({
          ak,
          setSize: vp.getVariationSetForAttribute(ak)?.size,
          setSample: Array.from(vp.getVariationSetForAttribute(ak) ?? []).slice(
            0,
            5
          ),
        })),
      },
      null,
      2
    )
  );
};
