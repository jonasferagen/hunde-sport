import {
  Variation,
  type VariationData,
} from "@/domain/product-attributes/Variation";

describe("Variation", () => {
  test("maps raw attributes to attrKeys/termKeys/options (ordering preserved)", () => {
    const vdata: VariationData = {
      id: 123,
      attributes: [
        { name: "Farge", value: "blaa" },
        { name: "Størrelse", value: "xl" },
      ],
    };

    const v = Variation.create(vdata);

    expect(v.key).toBe("123");
    expect(v.attrKeys).toEqual(["farge", "storrelse"]);
    expect(v.termKeys).toEqual(["blaa", "xl"]);
    expect(v.options).toEqual([
      { attribute: "farge", value: "blaa" },
      { attribute: "storrelse", value: "xl" },
    ]);
  });

  test("handles empty attributes array", () => {
    const v = Variation.create({ id: 9, attributes: [] });
    expect(v.attrKeys).toHaveLength(0);
    expect(v.termKeys).toHaveLength(0);
    expect(v.options).toHaveLength(0);
  });

  test("is resilient to undefined attributes", () => {
    const v = Variation.create({ id: 9, attributes: undefined as any });
    expect(v.attrKeys).toHaveLength(0);
  });
});
