// tests/variable/variations.test.ts

import fs from "fs";
import path from "path";

import { VariableProduct } from "@/domain/Product/VariableProduct";
import { mapToProduct } from "@/mappers/mapToProduct";

const fixture = path.join(__dirname, "data", "variable.json");

describe("VariableProduct variants", () => {
  it("builds variants using normalized attribute keys and term slugs", () => {
    const raw = JSON.parse(fs.readFileSync(fixture, "utf8"));
    const product = mapToProduct(raw);
    expect(product).toBeInstanceOf(VariableProduct);
    if (!(product instanceof VariableProduct)) return;

    const { attributes, terms, variations: variants } = product;
    expect(variants.length).toBeGreaterThan(0);

    for (const v of variants) {
      expect(typeof v.key).toBe("number");
      expect(v.options.length).toBeGreaterThan(0);

      for (const opt of v.options) {
        // attribute must exist
        expect(attributes.has(opt.attribute)).toBe(true);
        // term must exist
        expect(terms.has(opt.term)).toBe(true);
        // and the term must belong to that attribute
        const term = terms.get(opt.term)!;
        expect(term.attribute).toBe(opt.attribute);
      }
    }
  });
});
