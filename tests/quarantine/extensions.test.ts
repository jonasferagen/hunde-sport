// tests/purchasable/extensions.test.ts
import { CustomField } from "@/domain/CustomField";
import { Product } from "@/domain/product/Product";
import { Purchasable } from "@/domain/Purchasable";

// helper to make a simple product that has one custom field
function simpleWithCustomFields(): Product {
  return Product.create({
    id: 123,
    name: "Test",
    slug: "test",
    permalink: "#",
    description: "",
    prices: {
      price: "10000",
      regular_price: "10000",
      sale_price: "10000",
      currency_code: "NOK",
      currency_symbol: "kr",
      currency_minor_unit: 2,
      currency_decimal_separator: ",",
      currency_thousand_separator: ".",
      currency_prefix: "kr ",
      currency_suffix: "",
    },
    categories: [],
    parent: 0,
    type: "simple",
    is_in_stock: true,
    is_purchasable: true,
    images: [],
    // Important: product advertises custom fields
    extensions: { app_fpf: { fields: [{ key: "line_1", label: "Linje 1" }] } },
  } as any);
}

describe("Purchasable.toCartItem() with extensions", () => {
  const product = simpleWithCustomFields();

  test("without values → status is 'customize'; toCartItem requires hint or values", () => {
    const purch = new Purchasable(product, undefined, undefined, []); // no values
    expect(purch.status.key).toBe("customize");
  });

  test("omits extensions when no custom values (using modal hint to allow checkout)", () => {
    // in the customization modal we set the hint=true so the CTA is ready even if fields are optional/empty
    const purchInModal = new Purchasable(
      product,
      undefined,
      undefined,
      [],
      true
    );
    expect(purchInModal.status.key).toBe("ready");

    const item = purchInModal.toCartItem(1);
    expect(item).toMatchObject({ id: 123, quantity: 1 });
    expect((item as any).extensions).toBeUndefined();
  });

  test("includes extensions when custom values provided", () => {
    const fields = [
      CustomField.create({ key: "line_1", label: "Linje 1" }).setValue("BELLA"),
    ];

    const purch = new Purchasable(product, undefined, undefined, fields);

    // now we have a non-empty value → ready
    expect(purch.status.key).toBe("ready");

    const item = purch.toCartItem(1);
    expect(item.extensions?.app_fpf?.values).toEqual({ line_1: "BELLA" });
  });

  test("Customization hint allows add-to-cart but omits extensions", () => {
    const fields: any[] = []; // no values
    const purch = new Purchasable(product, undefined, undefined, fields, true);
    expect(purch.status.key).toBe("ready");
    expect(purch.toCartItem(1)).toEqual({ id: 123, quantity: 1 });
  });

  test("Numeric custom field values count as “has value”", () => {
    const fields = [
      CustomField.create({ key: "num", label: "Num" }).setValue("7"),
    ];
    const purch = new Purchasable(product, undefined, undefined, fields);
    expect(purch.status.key).toBe("ready");
  });

  test("Sold out/unavailable short-circuits", () => {
    const soldOut = Product.create({
      id: 123,
      name: "Test",
      slug: "test",
      permalink: "#",
      description: "",
      prices: {
        price: "10000",
        regular_price: "10000",
        sale_price: "10000",
        currency_code: "NOK",
        currency_symbol: "kr",
        currency_minor_unit: 2,
        currency_decimal_separator: ",",
        currency_thousand_separator: ".",
        currency_prefix: "kr ",
        currency_suffix: "",
      },
      categories: [],
      parent: 0,
      type: "simple",
      is_in_stock: false, // ← set here, not by mutating availability
      is_purchasable: true,
      images: [],
      extensions: {
        app_fpf: { fields: [{ key: "line_1", label: "Linje 1" }] },
      },
    } as any);

    const p = new Purchasable(soldOut);
    expect(p.status.key).toBe("sold_out");
    expect(() => p.toCartItem(1)).toThrow("sold_out");
  });
});
