import { Product } from "@/domain/Product/Product";

import data from "./data/variable.json";
describe("VariableProduct getters (set-based)", () => {
  const vp = Product.fromRaw(data as any);

  test("attributeOrder is normalized (lowercased, diacritics preserved) and preserves store order", () => {
    expect(vp.attributeOrder).toEqual(["farge", "størrelse"]);
  });

  test("keeps all terms (no pruning): term order per attribute matches store JSON", () => {
    const colors = vp.getTermOrder("farge");
    expect(colors.length).toBeGreaterThan(0);

    const sizes = vp.getTermOrder("størrelse");
    expect(sizes).toEqual([
      "xxs-xs",
      "l",
      "lxl",
      "m",
      "ml",
      "s",
      "sm",
      "xs",
      "xss",
    ]);
  });

  test("getVariationSetForTerm(termSlug) contains exactly the variations that reference the term", () => {
    // adjust these to values present in your fixture
    expect(vp.getVariationSetForTerm("mint")).toEqual(new Set([34621]));
    expect(vp.getVariationSetForTerm("rosa-gra")).toEqual(
      new Set([34739, 31189])
    );

    const lxlSet = vp.getVariationSetForTerm("lxl");
    expect(lxlSet).toEqual(new Set([31180, 31183, 31179, 27481]));
  });

  test("getVariationSetForAttribute unions all term sets for that attribute", () => {
    const colorUnion = vp.getVariationSetForAttribute("farge");
    expect(colorUnion.size).toBe(vp.variationIds.length);
    // spot-check some ids you know exist
    expect(colorUnion.has(34621)).toBe(true);
  });

  test("variationIds and variationIdSet match source variations", () => {
    const sourceIds = new Set((data as any).variations.map((v: any) => v.id));
    expect(new Set(vp.variationIds)).toEqual(sourceIds);
    expect(vp.variationIdSet).toEqual(sourceIds);
    expect(vp.variationIds.length).toBe(sourceIds.size);
  });
});
