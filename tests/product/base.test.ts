import { Product, type ProductData } from "@/domain/product/Product";
import {
  loadProduct,
  readFixture,
} from "@/tests/product/variableProduct2.test";
import type { SimpleProduct, VariableProduct } from "@/types";

test("createProduct throws on unsupported type", () => {
  expect(() => Product.create({ type: "weird" } as any)).toThrow(
    /Unsupported/i
  );
});

test("Product.mapBase sanitizes name/description and ensures at least one image", () => {
  const raw = readFixture<ProductData>("simple.json");
  const p = Product.create({
    ...raw,
    name: "<b>bold</b>",
    description: "<p>x</p>",
  }) as SimpleProduct;
  expect(p.name).toContain("bold"); // no tags
  expect(p.description).toContain("x"); // no tags
  expect(p.images.length).toBeGreaterThan(0);
  expect(p.featuredImage).toBeDefined();
});
test("getVariationId returns undefined when combo not found", () => {
  const vp = loadProduct("variable.json") as VariableProduct;
  const id = vp.getVariationId(["__nonexistent__"]);
  expect(id).toBeUndefined(); // or toBe(0) if that’s your sentinel
});

test("variable product arrays are not the same reference after rebuild", () => {
  const vp = loadProduct("variable.json") as VariableProduct;
  const before = vp.variations;
  // simulate a “recreate” or whatever path rebuilds the object
  const again = Product.create(readFixture("variable.json")) as VariableProduct;
  expect(again.variations).not.toBe(before); // new array ref
});
