import { VariableProduct } from "@/domain/product/VariableProduct";

import data from "./data/variable.json";
describe("VariableProduct simple lookups", () => {
  const vp = VariableProduct.fromRaw(data as any);

  test("getAttribute/getTerm return normalized entries", () => {
    const colorAttr = vp.getAttribute("farge");
    expect(colorAttr?.label).toBe("farge"); // lowercased; view will capitalize

    const sizeAttr = vp.getAttribute("størrelse");
    expect(sizeAttr?.label).toBe("størrelse");

    const term = vp.getTerm("xs");
    expect(term?.attribute).toBe("størrelse"); // attribute key is the lowercased, diacritic-preserved name
    expect(term?.key).toBe("xs");
  });

  test("term orders map back to terms", () => {
    for (const attrKey of vp.attributeOrder) {
      const slugs = vp.getTermOrder(attrKey);
      for (const slug of slugs) {
        const term = vp.getTerm(slug);
        expect(term?.attribute).toBe(attrKey);
      }
    }
  });
});
