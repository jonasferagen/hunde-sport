// tests/variable/helper.test.ts

import fs from "fs";
import path from "path";

import { VariableProductHelper } from "@/domain/Product/helpers/VariableProductHelper";
import { mapToProduct } from "@/domain/Product/mapToProduct";
import { VariableProduct } from "@/domain/Product/VariableProduct";

const fixture = path.join(__dirname, "data", "variable.json");

describe("VariableProductHelper", () => {
  it("indexes variants by attribute, term, and (attribute, term) and handles missing cases", () => {
    const raw = JSON.parse(fs.readFileSync(fixture, "utf8"));
    const product = mapToProduct(raw);
    expect(product).toBeInstanceOf(VariableProduct);
    if (!(product instanceof VariableProduct)) return;

    const helper = new VariableProductHelper(product);

    // --- Positive coverage (used keys must yield > 0) ---
    const usedAttrs = helper.getAllUsedAttributeKeys();
    const usedTerms = helper.getAllUsedTermKeys();
    const usedPairs = helper.getAllUsedAttributeTermPairs();

    expect(usedAttrs.length).toBeGreaterThan(0);
    expect(usedTerms.length).toBeGreaterThan(0);
    expect(usedPairs.length).toBeGreaterThan(0);

    expect(
      helper.getVariantIdsForAttribute(usedAttrs[0]).length
    ).toBeGreaterThan(0);
    expect(helper.getVariantIdsForTerm(usedTerms[0]).length).toBeGreaterThan(0);
    {
      const { attribute, term } = usedPairs[0];
      expect(
        helper.getVariantIdsForAttributeTerm(attribute, term).length
      ).toBeGreaterThan(0);
    }

    // --- Negative coverage (valid but unused keys should yield 0) ---

    // choose a real term that exists in product.terms but is NOT used in any variants
    const arbitraryUnusedTerm = [...product.terms.keys()].find(
      (t) => !helper.hasVariantForTerm(t)
    );
    if (arbitraryUnusedTerm) {
      expect(helper.getVariantIdsForTerm(arbitraryUnusedTerm)).toHaveLength(0);
      expect(helper.hasVariantForTerm(arbitraryUnusedTerm)).toBe(false);
    }

    // choose two different attributes and cross them with a term from the "other" attribute;
    // that (attribute, term) pair should not exist
    const attrKeys = [...product.attributes.keys()];
    if (attrKeys.length >= 2) {
      const a0 = attrKeys[0];
      const a1 = attrKeys[1];

      // pick any term that belongs to a1
      const tFromA1 = [...product.terms.entries()].find(
        ([, t]) => t.attribute === a1
      )?.[0];
      if (tFromA1) {
        expect(helper.hasVariantForAttributeTerm(a0, tFromA1)).toBe(false);
        expect(helper.getVariantIdsForAttributeTerm(a0, tFromA1)).toHaveLength(
          0
        );
      }
    }

    // attribute that exists but has no variants (rare, but possible if variants omit it)
    // find an attribute with 0 used variants, if any
    const maybeUnusedAttr = [...product.attributes.keys()].find(
      (a) => !helper.hasVariantForAttribute(a)
    );
    if (maybeUnusedAttr) {
      expect(helper.getVariantIdsForAttribute(maybeUnusedAttr)).toHaveLength(0);
    }
  });
});
