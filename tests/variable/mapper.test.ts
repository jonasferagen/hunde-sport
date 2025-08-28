// tests/variable/mapper.test.ts
import fs from "fs";
import path from "path";

// eslint-disable-next-line import/no-unresolved
import { mapToProduct } from "@/domain/Product/mapToProduct";
import { VariableProduct } from "@/domain/Product/VariableProduct";

it("maps Store API variable → VariableProduct", () => {
  const raw = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "variable.json"), "utf8")
  );
  const product = mapToProduct(raw);
  expect(product).toBeInstanceOf(VariableProduct);

  if (product instanceof VariableProduct) {
    expect(product.type).toBe("variable");
    expect(product.rawAttributes.length).toBeGreaterThan(0);
    expect(product.rawVariations.length).toBeGreaterThan(0);
    expect(product.availability.isPurchasable).toBe(true);
    expect(product.prices.price).toBeDefined();
  }
});
