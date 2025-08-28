// tests/product-category/mapper.test.ts

import fs from "fs";
import path from "path";

import { ProductCategory } from "@/domain/ProductCategory";
import { StoreImage } from "@/domain/StoreImage";
import { mapToProductCategory } from "@/mappers/mapToProductCategory";

const singlePath = path.join(__dirname, "data", "product-category.json");
const listPath = path.join(__dirname, "data", "product-categories.json");

// Shared assertion helper
function expectValidCategory(cat: unknown, idx?: number) {
  expect(cat).toBeInstanceOf(ProductCategory);
  if (!(cat instanceof ProductCategory)) return;

  try {
    expect(typeof cat.id).toBe("number");
    expect(typeof cat.name).toBe("string");
    expect(typeof cat.slug).toBe("string");
    expect(typeof cat.parent).toBe("number");

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

describe("ProductCategory mapper", () => {
  it("maps single product-category.json → ProductCategory", () => {
    const raw = JSON.parse(fs.readFileSync(singlePath, "utf8"));
    const cat = mapToProductCategory(raw);
    expectValidCategory(cat);
  });

  it("maps each item in product-categories.json → ProductCategory", () => {
    const rawList = JSON.parse(fs.readFileSync(listPath, "utf8"));
    expect(Array.isArray(rawList)).toBe(true);
    expect(rawList.length).toBeGreaterThan(0);

    rawList.forEach((raw: any, idx: number) => {
      const cat = mapToProductCategory(raw);
      expectValidCategory(cat, idx);
    });
  });

  it("uses StoreImage.DEFAULT when image is null", () => {
    const sampleWithNull = {
      id: 123,
      name: "No Image Cat",
      slug: "no-image",
      description: "",
      parent: 0,
      image: null,
    };
    const cat = mapToProductCategory(sampleWithNull);
    expect(cat.image).toBeInstanceOf(StoreImage);
    // Safe way (don’t rely on reference equality): default has id 0 and empty strings
    expect(cat.image.id).toBe(0);
    expect(cat.image.src).toBe("");
    expect(cat.image.thumbnail).toBe("");
  });

  it("Black Friday item from list has shouldDisplay() === false", () => {
    const rawList = JSON.parse(fs.readFileSync(listPath, "utf8"));
    const blackFriday = rawList.find((c: any) => c.slug === "black-friday");
    expect(blackFriday).toBeTruthy();
    const cat = mapToProductCategory(blackFriday);
    expect(cat.description).toBe("#");
    expect(cat.shouldDisplay()).toBe(false);
  });
});
