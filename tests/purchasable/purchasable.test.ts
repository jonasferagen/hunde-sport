import type { ProductVariation } from "@/domain/Product/ProductVariation";
import type { VariableProduct } from "@/domain/Product/VariableProduct";
import { createPurchasableFromSelection } from "@/domain/Purchasable";

// --- helpers

function makeVP(attrKeysToLabels: Record<string, string>): VariableProduct {
  // The factory only reads `attributes` (Map<key, {label}>). Stub the rest.
  const attributes = new Map(
    Object.entries(attrKeysToLabels).map(([key, label]) => [
      key,
      { key, label, taxonomy: `pa_${key}`, has_variations: true } as any,
    ])
  );
  return {
    type: "variable",
    id: 123,
    name: "VP",
    attributes,
  } as unknown as VariableProduct;
}

function makeSelection(pairs: [string, string | null][]) {
  return new Map<string, string | null>(pairs);
}

function fakeVariation(id = 999): ProductVariation {
  return { id } as unknown as ProductVariation;
}

// --- tests

describe("createPurchasableFromSelection", () => {
  const vp = makeVP({ farge: "Farge", størrelse: "Størrelse" });

  it("empty selection → invalid with both attributes missing", () => {
    const selection = makeSelection([
      ["farge", null],
      ["størrelse", null],
    ]);

    const p = createPurchasableFromSelection(vp, selection, undefined);

    expect(p.variableProduct).toBe(vp);
    expect(p.variation).toBeUndefined();
    expect(p.isValid).toBe(false);
    // missing keys (order should follow product.attributes order)
    expect(p.missingAttributes).toEqual(["farge", "størrelse"]);
    // friendly message uses labels
    expect(p.message.toLowerCase()).toContain("velg");
    expect(p.message).toContain("Farge");
    expect(p.message).toContain("Størrelse");
  });

  it("one attribute selected → invalid with the other missing", () => {
    const selection = makeSelection([
      ["farge", "grønn"],
      ["størrelse", null],
    ]);

    const p = createPurchasableFromSelection(vp, selection, undefined);

    expect(p.isValid).toBe(false);
    expect(p.missingAttributes).toEqual(["størrelse"]);
    expect(p.message).toBe("Velg Størrelse");
  });

  it("all attributes selected but no unique variation → still invalid with generic hint", () => {
    const selection = makeSelection([
      ["farge", "karamell"],
      ["størrelse", "l"],
    ]);

    const p = createPurchasableFromSelection(vp, selection, undefined);

    expect(p.isValid).toBe(false);
    expect(p.missingAttributes).toEqual([]); // nothing missing
    expect(p.message).toBe("Velg alle alternativer for å fortsette");
  });

  it("variation resolved → valid with 'Legg til' message", () => {
    const selection = makeSelection([
      ["farge", "karamell"],
      ["størrelse", "l"],
    ]);
    const variation = fakeVariation(42);

    const p = createPurchasableFromSelection(vp, selection, variation);

    expect(p.variation).toBe(variation);
    expect(p.isValid).toBe(true);
    expect(p.message).toBe("Legg til");
    expect(p.missingAttributes).toEqual([]);
  });
});
