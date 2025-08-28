import fs from "fs";
import path from "path";

import { mapToProduct } from "@/domain/Product/mapToProduct";
import { VariableProduct } from "@/domain/Product/VariableProduct";

const fixture = path.join(__dirname, "data", "variable.json");

describe("VariableProduct.attributes", () => {
  it("normalizes attribute keys and exposes taxonomy + label", () => {
    const raw = JSON.parse(fs.readFileSync(fixture, "utf8"));
    const product = mapToProduct(raw);

    expect(product).toBeInstanceOf(VariableProduct);
    if (!(product instanceof VariableProduct)) return;

    const attrs = product.attributes;
    expect(attrs.size).toBeGreaterThan(0);

    for (const [key, a] of attrs) {
      expect(a.key).toBe(key);
      expect(typeof a.label).toBe("string"); // e.g. "Farge"
      expect(typeof a.taxonomy).toBe("string"); // e.g. "pa_farge"
      expect(typeof a.has_variations).toBe("boolean");
    }

    // spot-check: common normalized keys should exist
    expect(
      ["farge", "størrelse", "storrelse", "størrelse"].some((k) => attrs.has(k))
    ).toBe(true);
  });
});
