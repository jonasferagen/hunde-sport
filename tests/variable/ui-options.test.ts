// tests/variable/ui-options.test.ts
import fs from "fs";
import path from "path";

import { getAllAttributeOptions } from "@/domain/Product/helpers/VariableProductUI";
import { mapToProduct } from "@/domain/Product/mapToProduct";
import { VariableProduct } from "@/domain/Product/VariableProduct";

const fixture = path.join(__dirname, "data", "variable.json");

function intersectIds(a: number[], b: number[]) {
  const setB = new Set(b);
  return a.filter((x) => setB.has(x));
}

describe("getAllAttributeOptions (UI helper)", () => {
  it("builds option groups and filters correctly based on selection", () => {
    const raw = JSON.parse(fs.readFileSync(fixture, "utf8"));
    const product = mapToProduct(raw);

    expect(product).toBeInstanceOf(VariableProduct);
    if (!(product instanceof VariableProduct)) return;

    // Start with an empty selection for all attributes
    const selection = new Map<string, string | null>();
    for (const key of product.attributes.keys()) selection.set(key, null);

    // Baseline groups with no selection
    const groups = getAllAttributeOptions(product, selection);
    expect(groups.length).toBeGreaterThan(0);

    for (const g of groups) {
      expect(typeof g.attribute.key).toBe("string");
      expect(typeof g.attribute.label).toBe("string");
      expect(Array.isArray(g.options)).toBe(true);
      expect(g.options.length).toBeGreaterThan(0);

      for (const opt of g.options) {
        expect(typeof opt.term.key).toBe("string");
        expect(typeof opt.term.label).toBe("string");
        expect(typeof opt.term.attribute).toBe("string");
        expect(Array.isArray(opt.variationIds)).toBe(true);
        // enabled options must have at least one matching variant id
        if (opt.enabled) expect(opt.variationIds.length).toBeGreaterThan(0);
      }
    }

    // If there are 2+ attributes, verify filtering using intersections
    if (groups.length >= 2) {
      const [A, B] = groups;

      // pick an enabled option in attribute A
      const optA = A.options.find((o) => o.enabled);
      if (optA) {
        // apply selection on A only
        selection.set(A.attribute.key, optA.term.key);

        const filtered = getAllAttributeOptions(product, selection);
        const groupB = filtered.find(
          (g) => g.attribute.key === B.attribute.key
        )!;
        const groupA = filtered.find(
          (g) => g.attribute.key === A.attribute.key
        )!;

        // sanity: A and B still present
        expect(groupA).toBeTruthy();
        expect(groupB).toBeTruthy();

        // find baseline B group to compare against
        const baseB = groups.find((g) => g.attribute.key === B.attribute.key)!;

        // Each B option should now represent the intersection with the chosen A option
        for (const optB of baseB.options) {
          const expectedIds = intersectIds(
            optB.variationIds,
            optA.variationIds
          );
          const after = groupB.options.find(
            (o) => o.term.key === optB.term.key
          )!;

          // enabled iff intersection is non-empty
          expect(after.enabled).toBe(expectedIds.length > 0);
          // variationIds should equal the intersection (order doesn’t matter)
          expect(after.variationIds.sort((x, y) => x - y)).toEqual(
            expectedIds.sort((x, y) => x - y)
          );
        }

        // Clear selection for A for cleanliness (not strictly required)
        selection.set(A.attribute.key, null);
      }
    }
  });
});
