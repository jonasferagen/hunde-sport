import {
  Attribute,
  type AttributeData,
} from "@/domain/product-attributes/Attribute";
import { Term, type TermData } from "@/domain/product-attributes/Term";
import {
  Variation,
  type VariationData,
} from "@/domain/product-attributes/Variation";

describe("Attribute/Term/Variation integration", () => {
  test("variation termKeys match created Terms keys", () => {
    // 1) Build attributes
    const aFarge = Attribute.create({
      name: "Farge",
      has_variations: true,
      terms: [],
    } satisfies AttributeData);
    const aSize = Attribute.create({
      name: "Størrelse",
      has_variations: true,
      terms: [],
    } satisfies AttributeData);

    // 2) Build term maps
    const tBlaa = Term.create(aFarge, {
      id: 8,
      name: "Blå",
      slug: "blaa",
    } satisfies TermData);
    const tXL = Term.create(aSize, {
      id: 1,
      name: "XL",
      slug: "xl",
    } satisfies TermData);

    const termMap = new Map<string, Term>([
      [tBlaa.key, tBlaa],
      [tXL.key, tXL],
    ]);

    // 3) Build a variation that references them
    const vdata: VariationData = {
      id: 777,
      attributes: [
        { name: "Farge", value: "blaa" },
        { name: "Størrelse", value: "xl" },
      ],
    };

    const v = Variation.create(vdata);

    // 4) All variation termKeys must exist in termMap (your filtering rule)
    for (const k of v.termKeys) {
      expect(termMap.has(k)).toBe(true);
    }
  });

  test("unknown term results in missing lookup key", () => {
    const aFarge = Attribute.create({
      name: "Farge",
      has_variations: true,
      terms: [],
    } as AttributeData);

    const tBlaa = Term.create(aFarge, {
      id: 8,
      name: "Blå",
      slug: "blaa",
    } as TermData);
    const termMap = new Map<string, Term>([[tBlaa.key, tBlaa]]);

    const v = Variation.create({
      id: 42,
      attributes: [{ name: "Farge", value: "rod" }], // "rod" not in termMap
    });

    // Variation still computes the key, but your parse step would filter it out.
    expect(v.termKeys).toContain("rod");
    expect(termMap.has("rod")).toBe(false);
  });
});
