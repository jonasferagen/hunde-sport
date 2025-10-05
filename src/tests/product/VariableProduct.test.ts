// @/tests/product/VariableProduct.test.ts
import type { ProductData } from "@/domain/product/Product";
import { Product } from "@/domain/product/Product";
import { VariableProduct } from "@/domain/product/VariableProduct";
import { loadFixture } from "@/tests/product/helpers";

// Fixture facts (kept in one place)
const FIXTURE = {
  id: 27445,
  type: "variable" as const,
  attrsExpected: 2, // farge + Størrelse
  colors: 17,
  sizes: 9,
  duplicatePairs: 1, // the “rosa-gra + xss” pair appears twice with different IDs
  variationRows: 13, // total rows in the fixture (including the duplicate)
};
const TOTAL_TERMS = FIXTURE.colors + FIXTURE.sizes;
const TOTAL_VARIATIONS_DEDUPED = FIXTURE.variationRows - FIXTURE.duplicatePairs;

describe("VariableProduct", () => {
  let data: ProductData;

  beforeEach(() => {
    data = loadFixture("variable-attr-double.json");
  });

  const makeVP = () => Product.create(data) as VariableProduct;

  const getAttrKey = (vp: VariableProduct, name: string) => {
    const entry = [...vp.attributes.entries()].find(
      ([, a]) => a.label.toLowerCase() === name.toLowerCase()
    );
    if (!entry) throw new Error(`Attribute not found: ${name}`);
    return entry[0];
  };

  it("constructs via factory and exposes readonly maps", () => {
    const vp = makeVP();

    // basics forwarded from Product base
    expect(vp.id).toBe(FIXTURE.id);
    expect(vp.type).toBe(FIXTURE.type);
    expect(vp.isVariable).toBe(true);

    // core collections exist and look sane
    expect(vp.attributes.size).toBe(FIXTURE.attrsExpected);
    expect(vp.terms.size).toBe(TOTAL_TERMS);
    expect(vp.variations.size).toBe(TOTAL_VARIATIONS_DEDUPED);
  });

  it("getTermsByAttribute returns the correct Term set for each attribute", () => {
    const vp = makeVP();

    const colorKey = getAttrKey(vp, "farge");
    const sizeKey = getAttrKey(vp, "størrelse");

    const colorTerms = vp.getTermsByAttribute(colorKey);
    const sizeTerms = vp.getTermsByAttribute(sizeKey);

    expect(colorTerms.size).toBe(FIXTURE.colors);
    expect(sizeTerms.size).toBe(FIXTURE.sizes);

    // every term returned should point back to the owning attribute
    for (const t of colorTerms) expect(t.attrKey).toBe(colorKey);
    for (const t of sizeTerms) expect(t.attrKey).toBe(sizeKey);
  });

  it("getVariationsByTerm returns variations that include that term", () => {
    const vp = makeVP();

    const [someTermKey, someTerm] = [...vp.terms.entries()][0]!;
    const byTerm = vp.getVariationsByTerm(someTermKey);

    expect(byTerm).toBeInstanceOf(Set);

    for (const v of byTerm) {
      expect(v.termKeys).toContain(someTermKey);
      expect(v.attrKeys).toContain(someTerm.attrKey);
    }
  });

  it("dedupes duplicate variations for the same term pair (keeps one ID)", () => {
    const vp = makeVP();

    // find the color term with slug 'rosa-gra' (appears twice with size XSS in the raw fixture)
    const rosaGra = [...vp.terms.values()].find(
      (t) => (t as any).key === "rosa-gra"
    );
    expect(rosaGra).toBeTruthy();

    const varsForRosaGra = vp.getVariationsByTerm(rosaGra!.key);

    // after de-dupe we expect a single variation for that pair
    expect(varsForRosaGra.size).toBe(1);

    for (const v of varsForRosaGra) {
      expect(v.termKeys).toContain(rosaGra!.key);
    }
  });

  it("throws on unknown attribute/term keys in safe getters", () => {
    const vp = makeVP();

    expect(() => vp.getTermsByAttribute("__nope__")).toThrow(
      /Unknown attribute key/i
    );
    expect(() => vp.getVariationsByTerm("__nope__")).toThrow(
      /Unknown term key/i
    );
  });

  it("parse() skips attributes without has_variations and filters invalid variations", () => {
    // copy + add a non-variant attribute and a bogus variation referencing it
    const modified: ProductData = JSON.parse(JSON.stringify(data));

    modified.attributes.push({
      id: 999,
      name: "irrelevant",
      taxonomy: "pa_irrelevant",
      has_variations: false,
      terms: [{ id: 1, name: "X", slug: "x" }],
    } as any);

    modified.variations.push({
      id: 123456,
      attributes: [{ name: "irrelevant", value: "x" }],
    } as any);

    const parsed = VariableProduct.parse(modified);

    // terms count should remain unaffected by the non-variant attribute
    expect(parsed.terms.size).toBe(TOTAL_TERMS);

    // bogus variation filtered; still equals our deduped baseline
    expect(parsed.variations.size).toBe(TOTAL_VARIATIONS_DEDUPED);
  });
});
