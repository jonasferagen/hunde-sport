// tests/product-category/fromRaw.test.ts

import fs from "fs";
import path from "path";
 
import {
  ProductCategory,
  type ProductCategoryData,
} from "@/domain/ProductCategory";
import { StoreImage } from "@/domain/StoreImage";

const singlePath = path.join(__dirname, "data", "product-category.json");
const listPath = path.join(__dirname, "data", "product-categories.json");

// Shared assertion helper
function expectValidCategory(cat: unknown, idx?: number) {
  expect(cat).toBeInstanceOf(ProductCategory);
  if (!(cat instanceof ProductCategory)) return;

  try {
    // Basic shape checks (these are runtime guards; the class already enforces structure)
    expect(typeof cat.id).toBe("number");
    expect(typeof cat.name).toBe("string");
    expect(typeof cat.slug).toBe("string");
    expect(typeof cat.parent).toBe("number");
    expect(typeof cat.count).toBe("number");

    // image is always a StoreImage (wrapped or default)
    expect(cat.image).toBeInstanceOf(StoreImage);
    expect(typeof cat.image.id).toBe("number");
    expect(typeof cat.image.src).toBe("string");
    expect(typeof cat.image.thumbnail).toBe("string");

    // shouldDisplay() hides only when description is '#'
    if (cat.description === "#") {
      expect(cat.shouldDisplay()).toBe(false);
    } else {
      expect(cat.shouldDisplay()).toBe(true);
    }
  } catch (e) {
    const ctx = idx !== undefined ? ` (item ${idx})` : "";
    throw new Error(
      `ProductCategory test failed${ctx}: ${(e as Error).message}`
    );
  }
}

describe("ProductCategory.fromRaw", () => {
  it("maps single product-category.json → ProductCategory", () => {
    const raw = JSON.parse(
      fs.readFileSync(singlePath, "utf8")
    ) as ProductCategoryData;
    const cat = ProductCategory.create(raw);
    expectValidCategory(cat);
  });

  it("maps each item in product-categories.json → ProductCategory", () => {
    const rawList = JSON.parse(
      fs.readFileSync(listPath, "utf8")
    ) as ProductCategoryData[];
    expect(Array.isArray(rawList)).toBe(true);
    expect(rawList.length).toBeGreaterThan(0);

    rawList.forEach((raw, idx) => {
      const cat = ProductCategory.create(raw);
      expectValidCategory(cat, idx);
    });
  });

  it("uses StoreImage.DEFAULT when image is null", () => {
    const sampleWithNull: ProductCategoryData = {
      id: 123,
      name: "No Image Cat",
      slug: "no-image",
      description: "",
      parent: 0,
      image: null,
      count: 0,
    };
    const cat = ProductCategory.create(sampleWithNull);
    expect(cat.image).toBeInstanceOf(StoreImage);
    // We don’t rely on referential equality with DEFAULT;
    // instead assert the known defaults:
    expect(cat.image.id).toBe(0);
    expect(cat.image.src).toBe("");
    expect(cat.image.thumbnail).toBe("");
  });

  it("Black Friday item from list has shouldDisplay() === false", () => {
    const rawList = JSON.parse(
      fs.readFileSync(listPath, "utf8")
    ) as ProductCategoryData[];
    const blackFriday = rawList.find((c) => c.slug === "black-friday");
    expect(blackFriday).toBeTruthy();
    const cat = ProductCategory.create(blackFriday!);
    expect(cat.description).toBe("#");
    expect(cat.shouldDisplay()).toBe(false);
  });
});
