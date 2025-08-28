// tests/simple/mapper.test.ts
import fs from "fs";
import path from "path";

import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { mapToProduct } from "@/mappers/mapToProduct";

it("maps Store API simple → SimpleProduct", () => {
  const raw = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "simple.json"), "utf8")
  );
  const product = mapToProduct(raw);
  expect(product).toBeInstanceOf(SimpleProduct);

  if (product instanceof SimpleProduct) {
    expect(product.type).toBe("simple");
    expect(product.id).toBeGreaterThan(0);
    expect(product.prices.price).toBeDefined();
    expect(product.images.length).toBeGreaterThan(0);
  }
});
