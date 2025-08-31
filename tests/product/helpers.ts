import fs from "fs";
import path from "path";

import { Product, type RawProduct } from "@/domain/product/Product";
import { ProductVariation } from "@/domain/product/ProductVariation";
import { SimpleProduct } from "@/domain/product/SimpleProduct";
import { VariableProduct } from "@/domain/product/VariableProduct";

const FIXTURES = path.join(__dirname, "__fixtures__");

export function readFixture<T = unknown>(name: string): T {
  const p = path.join(FIXTURES, name);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function loadProduct(name: string) {
  const raw = readFixture<RawProduct>(name);
  return Product.create(raw);
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
  expect(vp.rawAttributes.length).toBeGreaterThan(0);
  expect(vp.rawVariations.length).toBeGreaterThan(0);
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

/** Small set matcher */
export function expectSetEqual<T>(a: ReadonlySet<T>, b: ReadonlySet<T>) {
  expect(a.size).toBe(b.size);
  for (const x of a) expect(b.has(x)).toBe(true);
}
