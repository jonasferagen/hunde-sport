import fs from "fs";
import path from "path";

import { mapToProduct } from "@/domain/Product/mapToProduct";
import { VariableProduct } from "@/domain/Product/VariableProduct";

const fixture = path.join(__dirname, "data", "variable.json");

describe("VariableProduct.terms", () => {
  it("maps term slugs → terms and links to attribute key", () => {
    const raw = JSON.parse(fs.readFileSync(fixture, "utf8"));
    const product = mapToProduct(raw);

    expect(product).toBeInstanceOf(VariableProduct);
    if (!(product instanceof VariableProduct)) return;

    const attrs = product.attributes;
    const terms = product.terms;

    expect(terms.size).toBeGreaterThan(0);

    for (const [slug, t] of terms) {
      expect(t.key).toBe(slug);
      expect(typeof t.label).toBe("string");
      expect(typeof t.attribute).toBe("string");
      // the term's attribute must exist among attributes
      expect(attrs.has(t.attribute)).toBe(true);
    }
  });
});
