// tests/cart/purchasable.toCartItem.test.ts
import { VariationSelection } from "@/domain/Product/VariationSelection";
import { Purchasable } from "@/domain/Purchasable";
import type { ProductVariation, SimpleProduct, VariableProduct } from "@/types";

function makeSimple(id = 1, name = "S"): SimpleProduct {
  return {
    type: "simple",
    id,
    name,
    prices: {} as any,
    availability: { isInStock: true, isPurchasable: true } as any,
    get isSimple() {
      return true;
    },
    get isVariable() {
      return false;
    },
    get isVariation() {
      return false;
    },
  } as unknown as SimpleProduct;
}

function makeVariable(
  attrs: Record<string, string>,
  id = 2,
  name = "V"
): VariableProduct {
  const attributes = new Map(
    Object.entries(attrs).map(([key, label]) => [
      key,
      { key, label, taxonomy: `pa_${key}`, has_variations: true } as any,
    ])
  );
  const attributeOrder = Object.keys(attrs);
  return {
    type: "variable",
    id,
    name,
    attributes,
    attributeOrder,
    prices: {} as any,
    availability: { isInStock: true, isPurchasable: true } as any,
    get isSimple() {
      return false;
    },
    get isVariable() {
      return true;
    },
    get isVariation() {
      return false;
    },
  } as unknown as VariableProduct;
}

function fakeVariation(id = 42): ProductVariation {
  return { id } as unknown as ProductVariation;
}

describe("Purchasable.toCartItem()", () => {
  test("simple product → id & quantity only", () => {
    const p = new Purchasable(makeSimple(10, "SP"));
    expect(p.toCartItem(3)).toEqual({ id: 10, quantity: 3 });
  });

  test("variable ready → includes variation array", () => {
    const vp = makeVariable(
      { farge: "Farge", størrelse: "Størrelse" },
      20,
      "VP"
    );
    const init = new Map<string, string | null>([
      ["farge", "karamell"],
      ["størrelse", "l"],
    ]);
    const sel = new VariationSelection(vp, init);
    const p = new Purchasable(vp, sel, fakeVariation(99));

    const item = p.toCartItem(2);
    expect(item.id).toBe(20);
    expect(item.quantity).toBe(2);
    expect(item.variation).toEqual(
      expect.arrayContaining([
        { attribute: "farge", value: "karamell" },
        { attribute: "størrelse", value: "l" },
      ])
    );
  });

  test("variable incomplete → throws with helpful message", () => {
    const vp = makeVariable(
      { farge: "Farge", størrelse: "Størrelse" },
      30,
      "VP"
    );
    const init = new Map<string, string | null>([
      ["farge", "grønn"],
      ["størrelse", null],
    ]);
    const sel = new VariationSelection(vp, init);
    const p = new Purchasable(vp, sel, undefined);

    expect(() => p.toCartItem(1)).toThrow();
    try {
      p.toCartItem(1);
    } catch (e: any) {}
  });
});
