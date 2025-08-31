// tests/purchasable/extensions.test.ts
import { Product } from "@/domain/product/Product";
import { Purchasable } from "@/domain/purchasable/Purchasable";

// helper to make a simple product with customFields present
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
    extensions: { app_fpf: { fields: [{ key: "line_1", label: "Linje 1" }] } },
  } as any);
}

describe("Purchasable.toCartItem() with extensions", () => {
  const product = simpleWithCustomFields();
  test("omits extensions when no custom values", () => {
    const purchasable = new Purchasable(product, undefined, undefined, {});
    expect(purchasable.status.key).toBe("ready");
    const item = purchasable.toCartItem(1);
    expect(item.extensions).toBeUndefined();
  });

  test("toCartItem includes extensions when custom values provided", () => {
    const withVals = new Purchasable(product, undefined, undefined, {
      line_1: "BELLA",
    });
    expect(withVals.status.key).toBe("ready");
    const item = withVals.toCartItem(1);

    expect(item.extensions?.app_fpf?.values).toEqual({ line_1: "BELLA" });
  });
});
