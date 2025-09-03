import { VariableProduct } from "@product/VariableProduct";

import { loadFixture } from "@/tests/product/helpers";

describe("VariableProduct – parsing & relationships", () => {
  test("skips variations that reference unknown term slugs (single-attribute fixture)", () => {
    const data = loadFixture("variable-attr-single.json");
    // Sanity: fixture has one invalid variation using a term not present under the attribute terms.
    const vp = VariableProduct.create(data);

    // Expect #variations after parse to be original minus the invalid ones.
    // In this fixture, only "1000t-2" is invalid → one skipped.
    expect(vp.variations.size).toBe(data.variations.length - 1);

    // Optionally assert the specific skipped id is absent:
    // (242743 in the fixture uses "1000t-2")
    expect(vp.variations.has(String(242743))).toBe(false);

    // Invariant: relationships are consistent for remaining variations
    for (const [termKey, vset] of vp.termHasVariations.entries()) {
      for (const vKey of vset) {
        expect(vp.variationHasTerms.get(vKey)!.has(termKey)).toBe(true);
      }
    }
  });

  test("double-attribute fixture builds consistent, pre-seeded maps", () => {
    const data = loadFixture("variable-attr-double.json");
    const vp = VariableProduct.create(data);

    // Pre-seeded invariants (always present, possibly empty)
    for (const k of vp.attributes.keys()) {
      expect(vp.attributeHasTerms.has(k)).toBe(true);
      expect(vp.attributeHasVariations.has(k)).toBe(true);
    }
    for (const k of vp.terms.keys()) {
      expect(vp.termHasAttributes.has(k)).toBe(true);
      expect(vp.termHasVariations.has(k)).toBe(true);
    }
    for (const k of vp.variations.keys()) {
      expect(vp.variationHasTerms.has(k)).toBe(true);
      expect(vp.variationHasAttributes.has(k)).toBe(true);
    }
  });

  test("safe getters: throw on unknown keys; return Set for known keys", () => {
    const data = loadFixture("variable-attr-double.json");
    const vp = VariableProduct.create(data);

    expect(() => vp.getTermsByAttribute("nope")).toThrow();
    expect(() => vp.getAttributesByTerm("nope")).toThrow();
    expect(() => vp.getTermsByVariation("nope")).toThrow();

    for (const aKey of vp.attributes.keys()) {
      expect(vp.getTermsByAttribute(aKey)).toBeInstanceOf(Set);
    }
    for (const tKey of vp.terms.keys()) {
      expect(vp.getVariationsByTerm(tKey)).toBeInstanceOf(Set);
    }
    for (const vKey of vp.variations.keys()) {
      expect(vp.getAttributesByVariation(vKey)).toBeInstanceOf(Set);
    }
  });
});
