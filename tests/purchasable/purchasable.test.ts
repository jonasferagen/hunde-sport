// purchasable.test.ts (updated for Purchasable class)

import type { ProductVariation } from "@/domain/Product/ProductVariation";
import type { VariableProduct } from "@/domain/Product/VariableProduct";
import { VariationSelection } from "@/domain/Product/VariationSelection";
import { Purchasable } from "@/domain/Purchasable";

// --- helpers

function makeVP(attrKeysToLabels: Record<string, string>): VariableProduct {
  // The factory only needs attributes (Map<key, {label}>). Stub the rest.
  const attributes = new Map(
    Object.entries(attrKeysToLabels).map(([key, label]) => [
      key,
      { key, label, taxonomy: `pa_${key}`, has_variations: true } as any,
    ])
  );

  // Provide attributeOrder so VariationSelection can format in a stable order
  const attributeOrder = Object.keys(attrKeysToLabels);

  return {
    type: "variable",
    id: 123,
    name: "VP",
    attributes,
    attributeOrder,
  } as unknown as VariableProduct;
}

function makeSelection(vp: VariableProduct, pairs: [string, string | null][]) {
  const init = new Map<string, string | null>(pairs);
  return new VariationSelection(vp, init);
}

function fakeVariation(id = 999): ProductVariation {
  return { id } as unknown as ProductVariation;
}

// --- tests

describe("Purchasable (class) from selection", () => {
  const vp = makeVP({ farge: "Farge", størrelse: "Størrelse" });

  it("empty selection → missing both attributes, with friendly message", () => {
    const selection = makeSelection(vp, [
      ["farge", null],
      ["størrelse", null],
    ]);

    const p = new Purchasable(vp, selection, undefined);

    expect(p.product).toBe(vp);
    expect(p.selectedVariation).toBeUndefined();
    // missing keys (order follows VariationSelection order)
    expect(p.missing).toEqual(["farge", "størrelse"]);
    // friendly message uses labels
    expect(p.message.toLowerCase()).toContain("velg");
    expect(p.message).toContain("Farge");
    expect(p.message).toContain("Størrelse");
  });

  it("one attribute selected → other is missing", () => {
    const selection = makeSelection(vp, [
      ["farge", "grønn"],
      ["størrelse", null],
    ]);

    const p = new Purchasable(vp, selection, undefined);

    expect(p.selectedVariation).toBeUndefined();
    expect(p.missing).toEqual(["størrelse"]);
    expect(p.message).toBe("Velg Størrelse");
  });

  it("all attributes selected but no unique variation → complete, no message", () => {
    const selection = makeSelection(vp, [
      ["farge", "karamell"],
      ["størrelse", "l"],
    ]);

    const p = new Purchasable(vp, selection, undefined);

    // selection is complete but unresolved
    expect(p.selectedVariation).toBeUndefined();
    expect(p.missing).toEqual([]); // nothing missing
    expect(p.message).toBe(""); // message only reflects missing-ness now
  });

  it("variation resolved → selectedVariation set, no message", () => {
    const selection = makeSelection(vp, [
      ["farge", "karamell"],
      ["størrelse", "l"],
    ]);
    const variation = fakeVariation(42);

    const p = new Purchasable(vp, selection, variation);

    expect(p.selectedVariation).toBe(variation);
    expect(p.missing).toEqual([]);
    expect(p.message).toBe("");
  });
});
