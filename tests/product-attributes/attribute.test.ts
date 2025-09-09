import {
  Attribute,
  type AttributeData,
} from "@/domain/product-attributes/Attribute";

describe("Attribute", () => {
  test("creates stable internal key from label and preserves label/flags", () => {
    const data: AttributeData = {
      name: "Farge",
      has_variations: true,
      terms: [],
    };

    const a = Attribute.create(data, 0);

    expect(a.index).toBe(0);
    expect(a.label).toBe("Farge");
    expect(a.key).toBe("farge"); // slugKey("Farge") => "farge"
    expect(a.hasVariations).toBe(true);
  });

  test("index increments and key is lowercased slug", () => {
    const a1 = Attribute.create(
      { name: "Størrelse", has_variations: true, terms: [] },
      3
    );
    expect(a1.index).toBe(3);
    expect(a1.key).toBe("storrelse"); // depends on your slugKey; expected here
  });
});
