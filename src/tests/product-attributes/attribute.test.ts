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

    const a = Attribute.create(data);
    expect(a.label).toBe("Farge");
    expect(a.key).toBe("farge"); // slugKey("Farge") => "farge"
    expect(a.hasVariations).toBe(true);
  });
});
