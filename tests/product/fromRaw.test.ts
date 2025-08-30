// tests/product/fromRaw.test.ts
import fs from "fs";
import path from "path";

import { Product, type RawBaseProduct } from "@/domain/product/Product";
import { ProductVariation } from "@/domain/product/ProductVariation";
import { SimpleProduct } from "@/domain/product/SimpleProduct";
import { VariableProduct } from "@/domain/product/VariableProduct";

const fixturesDir = path.join(__dirname, "data");

function readFixture(name: string) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

// ----- helpers to validate each subtype -----

function expectValidSimple(p: unknown) {
  expect(p).toBeInstanceOf(SimpleProduct);
  const sp = p as SimpleProduct;
  expect(sp.type).toBe("simple");
  expect(sp.id).toBeGreaterThan(0);
  expect(sp.prices.price).toBeDefined();
  expect(sp.images.length).toBeGreaterThan(0);
  expect(typeof sp.availability.isPurchasable).toBe("boolean");
}

function expectValidVariation(p: unknown) {
  expect(p).toBeInstanceOf(ProductVariation);
  const v = p as ProductVariation;
  expect(v.type).toBe("variation");
  expect(v.id).toBeGreaterThan(0);
  expect(v.parent).toBeGreaterThan(0);
  expect(v.prices.price).toBeDefined();
  expect(Array.isArray(v.images)).toBe(true);
  expect(typeof v.availability.isPurchasable).toBe("boolean");
  if (v.variation !== undefined) {
    expect(typeof v.variation).toBe("string");
  }
}

/**
 * Stronger VariableProduct checks:
 * - raw attrs/vars exist
 * - variations are non-empty
 * - variationIds === variations.map(key)
 * - variationIdSet matches variationIds
 * - every variation option points to known attribute + term
 * - term.attribute matches the attribute key
 */
function expectValidVariable(p: unknown) {
  expect(p).toBeInstanceOf(VariableProduct);
  const vp = p as VariableProduct;

  expect(vp.type).toBe("variable");
  expect(vp.rawAttributes.length).toBeGreaterThan(0);
  expect(vp.rawVariations.length).toBeGreaterThan(0);
  expect(vp.prices.price).toBeDefined();

  // There should be at least one surviving variation after filtering
  expect(vp.variations.length).toBeGreaterThan(0);

  // variationIds must reflect surviving variations only
  const keys = vp.variations.map((v) => v.key);
  expect(vp.variationIds).toEqual(keys);

  // Set consistency
  expect(vp.variationIdSet.size).toBe(vp.variationIds.length);
  for (const id of vp.variationIds) {
    expect(vp.variationIdSet.has(id)).toBe(true);
  }

  // Options must reference valid attribute + term, and match each other
  for (const v of vp.variations) {
    expect(v.options.length).toBeGreaterThan(0);
    for (const opt of v.options) {
      const attr = vp.getAttribute(opt.attribute);
      const term = vp.getTerm(opt.term);
      expect(attr).toBeDefined();
      expect(term).toBeDefined();
      // term must belong to the same attribute key
      expect(term!.attribute).toBe(opt.attribute);
    }
  }
}

describe("Product.fromRaw", () => {
  const fixturesDir = path.join(__dirname, "data");

  test("simple.json → SimpleProduct", () => {
    const raw = JSON.parse(
      fs.readFileSync(path.join(fixturesDir, "simple.json"), "utf8")
    ) as RawBaseProduct;
    const product = Product.fromRaw(raw);
    expectValidSimple(product);
  });

  test("customtext.json → SimpleProduct", () => {
    const raw = JSON.parse(
      fs.readFileSync(path.join(fixturesDir, "customtext.json"), "utf8")
    ) as RawBaseProduct;
    const product = Product.fromRaw(raw);
    expectValidVariable(product);
  });

  test("missingterm.json → SimpleProduct", () => {
    const raw = JSON.parse(
      fs.readFileSync(path.join(fixturesDir, "missingterm.json"), "utf8")
    ) as RawBaseProduct;
    const product = Product.fromRaw(raw);
    expectValidVariable(product);
  });

  test("variable.json → VariableProduct", () => {
    const raw = JSON.parse(
      fs.readFileSync(path.join(fixturesDir, "variable.json"), "utf8")
    ) as RawBaseProduct;
    const product = Product.fromRaw(raw);
    expectValidVariable(product);
  });

  test("variation.json → ProductVariation", () => {
    const raw = JSON.parse(
      fs.readFileSync(path.join(fixturesDir, "variation.json"), "utf8")
    ) as RawBaseProduct;
    const product = Product.fromRaw(raw);
    expectValidVariation(product);
  });

  test("variations.json list → ProductVariation[]", () => {
    const list = JSON.parse(
      fs.readFileSync(path.join(fixturesDir, "variations.json"), "utf8")
    ) as RawBaseProduct[];
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);

    list.forEach((raw, idx) => {
      const product = Product.fromRaw(raw);
      try {
        expectValidVariation(product);
      } catch (e) {
        throw new Error(
          `Variation item ${idx} failed: ${(e as Error).message}`
        );
      }
    });
  });
});
