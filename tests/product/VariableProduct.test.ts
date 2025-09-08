// @/tests/product/VariableProduct.test.ts
import type { ProductData } from "@/domain/product/Product";
import { Product } from "@/domain/product/Product";
import { VariableProduct } from "@/domain/product/VariableProduct";
import { loadFixture } from "@/tests/product/helpers";

describe("VariableProduct", () => {
  let data: ProductData;

  beforeEach(() => {
    data = loadFixture("variable-attr-double.json");
  });

  it("constructs via factory and exposes readonly maps", () => {
    const p = Product.create(data);
    expect(p).toBeInstanceOf(VariableProduct);

    const vp = p as VariableProduct;

    // basics forwarded from Product base
    expect(vp.id).toBe(27445);
    expect(vp.type).toBe("variable");
    expect(vp.isVariable).toBe(true);

    // core collections exist and look sane
    expect(vp.attributes.size).toBe(2); // farge, Størrelse
    expect(vp.terms.size).toBe(26); // 17 colors + 9 sizes (from fixture)
    expect(vp.variations.size).toBe(13); // number of variation rows in fixture
  });

  it("getTermsByAttribute returns the correct Term set for each attribute", () => {
    const vp = VariableProduct.create(data);

    // discover attribute keys by name to avoid relying on key format
    const entries = Array.from(vp.attributes.entries());
    const colorEntry = entries.find(
      ([, a]) => a.label.toLowerCase() === "farge"
    );
    const sizeEntry = entries.find(([, a]) =>
      a.label.toLowerCase().includes("størrelse")
    );

    expect(colorEntry).toBeTruthy();
    expect(sizeEntry).toBeTruthy();

    const [colorKey] = colorEntry!;
    const [sizeKey] = sizeEntry!;

    const colorTerms = vp.getTermsByAttribute(colorKey);
    const sizeTerms = vp.getTermsByAttribute(sizeKey);

    expect(colorTerms.size).toBe(17);
    expect(sizeTerms.size).toBe(9);

    // every term returned should point back to the attribute
    for (const t of colorTerms) expect(t.attrKey).toBe(colorKey);
    for (const t of sizeTerms) expect(t.attrKey).toBe(sizeKey);
  });

  it("getVariationsByTerm returns variations that include that term", () => {
    const vp = VariableProduct.create(data);

    // pick any term and assert round-trip through the index
    const [someTermKey, someTerm] = Array.from(vp.terms.entries())[0]!;
    const byTerm = vp.getVariationsByTerm(someTermKey);

    // sanity: the set exists (may be empty for rarely-used terms)
    expect(byTerm).toBeInstanceOf(Set);

    // if any variations reference this term, they must include it in their termKeys
    for (const v of byTerm) {
      expect(v.termKeys).toContain(someTermKey);
      // and its attribute keys should include the owning attribute of the term
      expect(v.attrKeys).toContain(someTerm.attrKey);
    }
  });

  it("handles duplicate variations for the same term pair (does not dedupe IDs)", () => {
    const vp = VariableProduct.create(data);

    // find the term with slug 'rosa-gra' (appears twice with size XSS in fixture)
    const rosaGra = Array.from(vp.terms.values()).find(
      (t) => t.slug === "rosa-gra"
    );
    expect(rosaGra).toBeTruthy();

    const varsForRosaGra = vp.getVariationsByTerm(rosaGra!.key);

    // we expect at least 2 variations to reference this color term
    expect(varsForRosaGra.size).toBeGreaterThanOrEqual(2);

    // ensure all reported variations truly include the term
    for (const v of varsForRosaGra) {
      expect(v.termKeys).toContain(rosaGra!.key);
    }
  });

  it("throws on unknown attribute/term keys in safe getters", () => {
    const vp = VariableProduct.create(data);

    expect(() => vp.getTermsByAttribute("__nope__")).toThrow(
      /Unknown attribute key/i
    );
    expect(() => vp.getVariationsByTerm("__nope__")).toThrow(
      /Unknown term key/i
    );
  });

  it("parse() skips attributes without has_variations and filters invalid variations", () => {
    // craft a copy with one attribute that has_variations=false and one variation referencing a non-existent term key
    const modified: ProductData = JSON.parse(JSON.stringify(data));
    modified.attributes.push({
      id: 999,
      name: "irrelevant",
      taxonomy: "pa_irrelevant",
      has_variations: false,
      terms: [{ id: 1, name: "X", slug: "x" }],
    });

    // bogus variation referencing a term that won't exist (because attr not variant)
    modified.variations.push({
      id: 123456,
      attributes: [{ name: "irrelevant", value: "x" }],
    });

    const parsed = VariableProduct.parse(modified);
    // attribute without variations should still be created but not contribute terms
    // (depending on your Attribute.create, but terms from non-variant attrs shouldn't be kept)
    // We assert that total term count remains the same as original fixture (26)
    expect(parsed.terms.size).toBe(26);

    // and that the bogus variation is filtered out (original had 13)
    expect(parsed.variations.size).toBe(13);
  });
});
