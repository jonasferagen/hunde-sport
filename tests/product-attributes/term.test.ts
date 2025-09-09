import {
  Attribute,
  type AttributeData,
} from "@/domain/product-attributes/Attribute";
import { Term, type TermData } from "@/domain/product-attributes/Term";

function mkAttr(name: string) {
  return Attribute.create(
    { name, has_variations: true, terms: [] } satisfies AttributeData,
    0
  );
}

describe("Term", () => {
  test("composite key uses attribute.key + normalized term slug", () => {
    const attr = mkAttr("Farge");
    const t: TermData = { id: 8, name: "Blå", slug: "blaa" };

    const term = Term.create(attr, t);

    expect(term.attrKey).toBe("farge");
    expect(term.key).toBe("farge:blaa");
    expect(term.label).toBe("Blå"); // capitalize just normalizes casing; adjust if needed
  });

  test("works with already-normalized term slug", () => {
    const attr = mkAttr("Størrelse");
    const term = Term.create(attr, { id: 1, name: "XL", slug: "xl" });
    expect(term.key).toBe("storrelse:xl");
  });
});
