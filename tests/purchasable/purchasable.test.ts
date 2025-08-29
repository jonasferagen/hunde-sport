// tests/purchasable/purchasable.test.ts
import type { ProductVariation } from "@/domain/Product/ProductVariation";
import type { VariableProduct } from "@/domain/Product/VariableProduct";
import { VariationSelection } from "@/domain/Product/VariationSelection";
import { Purchasable } from "@/domain/Purchasable";

// helpers
function makeVP(attrKeysToLabels: Record<string, string>): VariableProduct {
  const attributes = new Map(
    Object.entries(attrKeysToLabels).map(([key, label]) => [
      key,
      { key, label, taxonomy: `pa_${key}`, has_variations: true } as any,
    ])
  );

  const attributeOrder = Object.keys(attrKeysToLabels);

  // Stub MUST provide runtime getters used by Purchasable
  return {
    type: "variable",
    id: 123,
    name: "VP",
    attributes,
    attributeOrder,
    availability: { isInStock: true, isPurchasable: true } as any,
    prices: {} as any,

    // ← add runtime getters so Purchasable.status can detect variable
    get isVariable() {
      return true;
    },
    get isSimple() {
      return false;
    },
    get isVariation() {
      return false;
    },
  } as unknown as VariableProduct;
}

function makeSelection(vp: VariableProduct, pairs: [string, string | null][]) {
  const init = new Map<string, string | null>(pairs);
  return new VariationSelection(vp, init);
}
function fakeVariation(id = 999): ProductVariation {
  return { id } as unknown as ProductVariation;
}

describe("Purchasable (class) from selection", () => {
  const vp = makeVP({ farge: "Farge", størrelse: "Størrelse" });

  it("empty selection → status select_incomplete with helpful label; toAddItemOptions throws", () => {
    const selection = makeSelection(vp, [
      ["farge", null],
      ["størrelse", null],
    ]);
    const p = new Purchasable(vp, selection, undefined);

    expect(p.status.key).toBe("select_incomplete");
    expect(p.status.label.toLowerCase()).toContain("velg"); // guidance text
    expect(() => p.toAddItemOptions(1)).toThrow();
  });

  it("one attribute selected → still select_incomplete", () => {
    const selection = makeSelection(vp, [
      ["farge", "grønn"],
      ["størrelse", null],
    ]);
    const p = new Purchasable(vp, selection, undefined);

    expect(p.status.key).toBe("select_incomplete");
    expect(p.status.label.toLowerCase()).toContain("størrelse");
    expect(() => p.toAddItemOptions(1)).toThrow();
  });

  it("all attributes selected but no unique variation → select_incomplete (no resolution)", () => {
    const selection = makeSelection(vp, [
      ["farge", "karamell"],
      ["størrelse", "l"],
    ]);
    const p = new Purchasable(vp, selection, undefined);

    expect(p.status.key).toBe("select_incomplete");
    expect(() => p.toAddItemOptions(1)).toThrow();
  });

  it("variation resolved → ready; toAddItemOptions returns payload", () => {
    const selection = makeSelection(vp, [
      ["farge", "karamell"],
      ["størrelse", "l"],
    ]);
    const variation = fakeVariation(42);
    const p = new Purchasable(vp, selection, variation);

    expect(p.status.key).toBe("ready");
    const opts = p.toAddItemOptions(2);
    expect(opts.id).toBe(vp.id);
    expect(opts.quantity).toBe(2);
    expect(Array.isArray(opts.variation)).toBe(true);
  });
});
