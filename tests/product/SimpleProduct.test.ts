// @/tests/product/SimpleProduct.test.ts
import type { ProductData } from "@/domain/product/Product";
import { Product } from "@/domain/product/Product";
import { SimpleProduct } from "@/domain/product/SimpleProduct";
import { StoreImage } from "@/domain/StoreImage";
import { loadFixture } from "@/tests/product/helpers";

describe("SimpleProduct", () => {
  let data: ProductData;

  beforeEach(() => {
    data = loadFixture("simple.json");
  });

  it("constructs from valid simple product data", () => {
    const p = SimpleProduct.create(data);

    // core identity
    expect(p.id).toBe(43675);
    expect(p.name).toContain("10pk Griseører");
    expect(p.slug).toBe("10pk-griseorer");
    expect(p.permalink).toMatch(/hunde-sport\.no\/produkt\/10pk-griseorer\/$/);

    // normalized flags
    expect(p.type).toBe("simple");
    expect(p.isSimple).toBe(true);
    expect(p.isVariable).toBe(false);
    expect(p.isVariation).toBe(false);

    // prices forwarded
    expect(p.prices.currency_code).toBe("NOK");
    expect(p.prices.price).toBe("22900");

    // categories forwarded
    expect(p.categories.length).toBeGreaterThan(0);
    expect(p.categories[0]).toHaveProperty("id");
    expect(p.categories[0]).toHaveProperty("name");

    // images mapped to StoreImage
    expect(p.images.length).toBe(1);
    expect(p.images[0]).toBeInstanceOf(StoreImage);
    expect(p.featuredImage).toBe(p.images[0]);

    // availability derived getter
    expect(p.availability).toEqual({
      isInStock: true,
      isPurchasable: true,
      isOnSale: false,
      isOnBackOrder: false,
    });

    // custom fields absent in fixture -> empty
    expect(p.customFields).toEqual([]);
    expect(p.hasCustomFields).toBe(false);

    // parent & featured
    expect(p.parent).toBe(0);
    expect(p.featured).toBe(false);
  });

  it("cleans HTML from description fields", () => {
    const p = SimpleProduct.create(data);

    // Should remove tags; we just assert no raw '<' remains
    expect(p.description).toContain("Opprinnelsesland");
    expect(p.description).not.toMatch(/</);
    expect(p.short_description).toContain("griseører");
    expect(p.short_description).not.toMatch(/</);
  });

  it("throws if given non-simple type", () => {
    const wrong: ProductData = { ...data, type: "variable" as const };
    expect(() => SimpleProduct.create(wrong)).toThrow(/non-simple|Invalid data type/i);
  });

  it("uses StoreImage.DEFAULT when images are missing", () => {
    const noImg: ProductData = { ...data, images: [] };
    const p = SimpleProduct.create(noImg);

    // mapBase falls back to [StoreImage.DEFAULT] when images is empty/undefined
    expect(p.images.length).toBe(1);
    expect(p.images[0]).toBeInstanceOf(StoreImage);
    expect(p.featuredImage).toBe(p.images[0]);
  });

  it("respects boolean flags with safe defaults", () => {
    const minimal: ProductData = {
      ...data,
      on_sale: undefined as unknown as boolean,
      is_in_stock: undefined as unknown as boolean,
      is_purchasable: undefined as unknown as boolean,
      is_on_backorder: undefined as unknown as boolean,
    };
    const p = SimpleProduct.create(minimal);

    // mapBase defaults these to false when undefined
    expect(p.on_sale).toBe(false);
    expect(p.is_in_stock).toBe(false);
    expect(p.is_purchasable).toBe(false);
    expect(p.is_on_backorder).toBe(false);
  });

  it("round-trips via Product.create factory", () => {
    const p = Product.create(data);
    expect(p).toBeInstanceOf(SimpleProduct);
    expect(p.type).toBe("simple");
  });
});
