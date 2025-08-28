// tests/variation/mapper.test.ts
import fs from "fs";
import path from "path";

import { ProductVariation } from "@/domain/Product/ProductVariation";
import { mapToProduct } from "@/mappers/mapToProduct";

const singlePath = path.join(__dirname, "data", "variation.json");
const listPath = path.join(__dirname, "data", "variations.json");

// shared assertion helper
function expectValidVariation(product: unknown, idx?: number) {
  expect(product).toBeInstanceOf(ProductVariation);
  if (!(product instanceof ProductVariation)) return;

  try {
    expect(product.type).toBe("variation");
    expect(typeof product.id).toBe("number");
    expect(product.id).toBeGreaterThan(0);

    expect(typeof product.parent).toBe("number");
    expect(product.parent).toBeGreaterThan(0);

    expect(product.prices).toBeDefined();
    expect(product.prices.price).toBeDefined();

    expect(Array.isArray(product.images)).toBe(true);

    expect(typeof product.availability.isPurchasable).toBe("boolean");
    expect(typeof product.availability.isInStock).toBe("boolean");
    expect(typeof product.availability.isOnBackOrder).toBe("boolean");
    expect(typeof product.availability.isOnSale).toBe("boolean");

    // variation summary is optional, but if present must be string
    if (product.variation !== undefined) {
      expect(typeof product.variation).toBe("string");
    }
  } catch (e) {
    const ctx = idx !== undefined ? ` (item ${idx})` : "";
    throw new Error(`Variation test failed${ctx}: ${(e as Error).message}`);
  }
}

describe("ProductVariation mapper", () => {
  it("maps Store API variation.json → ProductVariation", () => {
    const raw = JSON.parse(fs.readFileSync(singlePath, "utf8"));
    const product = mapToProduct(raw);
    expectValidVariation(product);
  });

  it("maps each item in variations.json array → ProductVariation", () => {
    const rawList = JSON.parse(fs.readFileSync(listPath, "utf8"));
    expect(Array.isArray(rawList)).toBe(true);
    expect(rawList.length).toBeGreaterThan(0);

    rawList.forEach((raw: any, idx: number) => {
      const product = mapToProduct(raw);
      expectValidVariation(product, idx);
    });
  });
});
